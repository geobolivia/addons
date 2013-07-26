Ext.namespace("GEOR.Addons");

GEOR.Addons.InsertCSV = function(map, options) {
    this.map = map;
    this.options = options;
    this.layer = null;
};

GEOR.Addons.InsertCSV.prototype = {
    item: null,
    stores: {},
    layer: null,
    win: null,
    jsonFormat: null,
    geojsonFormat: null,
    _insertLayer: null,

    /**
    * Method: init
    *
    * Parameters:
    * record - {Ext.data.record} a record with the addon parameters
    */
    init: function(record) {
        var lang = OpenLayers.Lang.getCode();
        this.jsonFormat = new OpenLayers.Format.JSON();
        
        this.geojsonFormat = new OpenLayers.Format.GeoJSON();
        _insertLayer = new OpenLayers.Layer.Vector("addon_Insert_csv", {
            displayInLayerSwitcher: false,
            styleMap: new OpenLayers.StyleMap({
                "default": {
                    graphicName: "cross",
                    pointRadius: 16,
                    strokeColor: "fuchsia",
                    strokeWidth: 2,
                    fillOpacity: 0
                }
            })
        });
        
        this.layer= _insertLayer;
        this.map.addLayer(this.layer);
        this.item = new Ext.menu.Item({
            text: record.get("title")[lang],
            iconCls: 'insertcsv-icon',
            qtip: record.get("description")[lang],
            handler: this.showWindow,
            scope: this
        });
        return this.item;
    },
    
    showWindow: function() {
        
        /*               Create the Form               */
        var form = new Ext.form.FormPanel({
            width: 337,
            html: "<input id='inputFile' type='file' name='uploaded'/>",
            bodyStyle: 'background-color: #d0d0d0',
            buttons: [{
                        text: OpenLayers.i18n('insertcsv_add'),
                              handler: function(){
                                                  placeMarker();
                                                 }
            }],
        
            listeners: {
                afterrender: function() {
                    var itemFile = document.getElementById("inputFile");
                    itemFile.addEventListener('change', readSingleFile, false);
                }
            }
        });
        
        function numberRows(str){
            var rows = 0;
            for(var k = 0; k<= str.length; k++){
                if(str.charAt(k) === "\n"){
                    rows++;
                }
            }
            return rows;
        };
        function searchData(lin){
            
            var item = "";
            var index = 0;
            var character = lin.charAt(index);
            
            while (character !== ";"){
                item = item + (lin.charAt(index));
                character = lin.charAt(index);
                index = index + 1;
            }
            
            return parseFloat(item);
        }
        
        function placeMarker(){

            var rows=numberRows(myFile);
            var index = 0;
            var lat=0;
            var lon = 0;
            for(var i = 0; i< rows; i++){
                
                var row = "";
                var character = myFile.charAt(index);
                
                while (character !== "\n"){
                    row = row + (myFile.charAt(index));
                    character = myFile.charAt(index);
                    index = index +1;
                }
                
                lat = searchData(row);
                lon = searchData(row.substring((row.indexOf(';') + 1) , (row.length)) );
                
                if (i !== 0) {
                    var feature = new OpenLayers.Feature.Vector(
                                                                new OpenLayers.Geometry.Point(lat, lon).transform(
                                                                                                new OpenLayers.Projection("EPSG:4326"),
                                                                                                new OpenLayers.Projection("EPSG:900913")
                                                                ),
                                                                {some:'data'},
                                                                {externalGraphic: 'http://www.openlayers.org/dev/img/marker.png',
                                                                graphicHeight: 21, graphicWidth: 16});
                    _insertLayer.addFeatures(feature);
                }
            }
                        
            this.layer = _insertLayer;
        }
        
        if (!this.win) {
            this.win = new Ext.Window({
                closable: true,
                closeAction: 'hide',
                width: 353,
                height:110,
                title: OpenLayers.i18n("addon_insertcsv_popup_title"),
                border: false,
                buttonAlign: 'left',
                layout: 'fit',
                items : [  {
                              xtype: 'label',
                              forId: 'idlabel',
                              text: OpenLayers.i18n("addon_insertcsv_label_1")
                           },
                           form
                        ],
                listeners: {
                             "hide": function() {},
                             scope: this
                           }
            });
       }
       
       this.win.show();
   },
   
   destroy: function() {
       this.win.hide();
       this.layer = null;
       this.map = null;
   }
};

function readSingleFile(evt) {
   var f = evt.target.files[0];
   if (f) {
       var r = new FileReader();
       r.onload = function(e) {
           var contents = e.target.result;
           myFile = contents;
       }
       r.readAsText(f);
   } else {
       alert("Failed to load file");
   }
}
var myFile="";