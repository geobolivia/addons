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
    
    //para rel marcador
    tamanio: 0,				// Tamanio del icono.
    icono:null,					// El icono del marcador.
    offset: 0,
    //para rel marcador
    
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
        
        _insertLayer = new OpenLayers.Layer.Markers("addon_Insert_csv", {
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
        
        //alert(this.map.projection);
        //alert("y de la capa"+this.layer.projection);
                
        // return menu item:
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

        //<-------------- Creamos el Formulario
        var myForm = new Ext.form.FormPanel({
                //title: 'Hello',
                width: 370,
                html: "<input id='inputFile' type='file' name='uploaded'/>",
                buttons: [{   
                          //<----------------------------------------------     Aqui esta la magia   -------------------------->
                          text: 'Add',
                          handler: function(){
                              poneMarkador();
                                                           
                          }
                          //<-------------------------------------------------------------------------------------------------->
                      }],
                //renderTo: Ext.getBody(),
                listeners: {
                    afterrender: function() {
                        var itemFile = document.getElementById("inputFile");            
                        itemFile.addEventListener('change', readSingleFile, false);
                    }
                }
            });
        //                                       -------------->
        
        //-------------------------------------------------------------------------
        function nroLin(miCadena){
            var nroLineas = 0;
            for(var k = 0; k<= miCadena.length; k++){
                if(miCadena.charAt(k) === "\n"){
                    nroLineas++;
                }
            }
            //alert("El numero de lineas es: "+nroLineas);
            return nroLineas;
        };
        
        function buscaDato(lin){
            var dato = "";
            var indice = 0;
            var caracter = lin.charAt(indice);
            while (caracter !== ";"){
                dato = dato + (lin.charAt(indice));
                caracter = lin.charAt(indice);
                indice = indice + 1;
            }
            return parseFloat(dato);
        }
        
        function poneMarkador(){
            var myNumero=nroLin(myFile);
            //alert("El numero de lineas es: "+nroLin(myFile));
            
            tamanio = new OpenLayers.Size(21, 25);
            offset = new OpenLayers.Pixel(-(tamanio.w / 2), -tamanio.h);
            icono = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', tamanio, offset);
            
            var indice = 0;
            var lat=0;
            var lon = 0;
            for(var i = 0; i< myNumero; i++){
                
                var linea = "";
                var caracter = myFile.charAt(indice);
                
                while (caracter !== "\n"){
                    
                    linea = linea + (myFile.charAt(indice));
                    caracter = myFile.charAt(indice);
                    indice = indice +1;
                }
                
                //alert("Linea"+ i +": "+linea);
                //<---------- Manejar la linea
                lat = buscaDato(linea);
                lon = buscaDato( linea.substring((linea.indexOf(';') + 1) , (linea.length)) );
                //alert ("Latitud: "+lat+" Longitud: "+lon);
                if (i !== 0) {
                    if (i === 1) {
                        _insertLayer.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(lat, lon).transform(
                                new OpenLayers.Projection("EPSG:4326"), 					// Transformar from WGS 1984
                                new OpenLayers.Projection("EPSG:900913") 						// a Spherical Mercator Projection.
                        ), icono));
                    }else{
                        _insertLayer.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(lat, lon).transform(
                            new OpenLayers.Projection("EPSG:4326"), 					// Transformar from WGS 1984
                            new OpenLayers.Projection("EPSG:900913") 						// a Spherical Mercator Projection.
                         ), icono.clone()));
                    }
                }
                
                
            }
            
            this.layer = _insertLayer;
            alert("Correct Insersion");
        }
        //-------------------------------------------------------------------------
        
        if (!this.win) {
            this.win = new Ext.Window({
                closable: true,
                closeAction: 'hide',
                width: 390,
                height:110,
                title: OpenLayers.i18n("addon_insertcsv_popup_title"),
                border: false,
                buttonAlign: 'left',
                layout: 'fit',
                //
                items : [{
                            xtype: 'label',
                            forId: 'idlabel',
                            text: "Choose The File: "
                          },
                            myForm
                         ],
                //
                listeners: {
                    "hide": function() {
                        /*/alert("Se Cerrara :--)");
                        //this.map.removeLayer(this.layer);*/
                    },
                    scope: this
                }
            });
        }
        //this.map.addLayer(this.layer);
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
            /*alert( "Datos Del Archivo \n " 
                    +" name: " + f.name + "\n"
                    +" type: " + f.type + "\n"
                    +" size: " + f.size + " bytes"+ "\n"           
                    + " starts with: " + contents.substr(0, contents.indexOf("n")));*/
        }
        r.readAsText(f);
    } else { 
        alert("Failed to load file");
    }
}

var myFile="";