/* 
 * Copyright (c) 2013 by GeoBolivia 
 * Author: Ruddy Condori Topoco <rucocool@hotmail.com, rucocool@gmail.com, rucondori@geo.gob.bo> 
 */
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
    
    cbboxLat: null,
    cbboxlon: null,
    cbboxName:null,
    cbboxDelim:null,
    
    panelData: null,
    panelDesc: null,
    head: "",
    listGroup: null,
    
    information: null, 
    dList:null,
    myForm: null,
    delim: "",
    itemVerif: null,
    
    selectCtrl:null,
    _insertLayer: null,
    
    mmap: null,

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
	
	        
        _insertLayer = new OpenLayers.Layer.Vector(OpenLayers.i18n('title'), {
            displayInLayerSwitcher: true,
             styleMap: new OpenLayers.StyleMap({
                 "default": {
                     graphicName: "cross",
                     pointRadius: 16,
                     
                    strokeColor: "fuchsia",
                    strokeWidth: 2,
                    fillOpacity: 0,
		     bbox: "", 
                  }
             }),
	     
	     bbox: "", 
	     
	     eventListeners:{
		featureselected:function(evt){
		    GEOR.Addons.InsertCSV.prototype.createPopup(evt.feature);
		}
	    }
        });
	
	mmap = this.map;
        this.layer= _insertLayer;
        this.map.addLayer(this.layer);
        this.item = new Ext.menu.Item({
            text: record.get("title")[lang],
            iconCls: 'insertcsv-icon',
            qtip: record.get("description")[lang],
            handler: this.showWindow,
            scope: this
        });
	
	dList = [[0,""]];
	information = new Ext.data.ArrayStore({
	    fields: ['number','dato'],
	    data : [[0,""]]
	});
	
        cbboxLat = this.createComboBox('cbboxLat',OpenLayers.i18n('Latitude'), information , false);
        cbboxLon = this.createComboBox('cbboxLong',OpenLayers.i18n('Longitude'),information, false);
	cbboxName = this.createComboBox('cbboxName',OpenLayers.i18n('csv_title'),information, true);
	
	panelData = this.createPanelData();
	cbboxDelim = this.createComboDelim('cbboxDelim',OpenLayers.i18n('Delimiter'),new Ext.data.ArrayStore({
												fields: ['number','dato'],
												data : [[0,';'],[1,','],[2,'|']]
											    }, true)
					);
    	
	listGroup = this.createListGroup();
	panelDesc = this.createPanelDesc();
	
	panelDelim = this.createPanelDelim();
	
        myForm = this.createForm();
        
	selectCtrl = new OpenLayers.Control.SelectFeature(this.layer);
	mmap.addControl(selectCtrl);
	selectCtrl.activate();
	
        return this.item;
    },
    
    createPopup:function (feature) {
        popup = new GeoExt.Popup({
            closable: true,
            closeAction: 'hide',
            layout:'auto',
            maximizable: false,
            location: feature,
            width:200,
            html: "<div style='font-size:9'>"+feature.attributes.foo+" </div>",
            popupCls: "gx-popup-point",
	    resizable: false,
	    hideBorders : true,
	    unpinnable:false,
	    draggable: false,
        });
        
	popup.on({
            close: function() {
                if(OpenLayers.Util.indexOf(_insertLayer.selectedFeatures,
                                           this.feature) > -1) {
                    selectCtrl.unselect(this.feature);
                }
            }
        });
        popup.show();
    },

    showWindow: function() {
        
	function putMarker(){
            var dats= myForm.getForm().getValues(true).replace(/&/g,', ');
            var da= dats.split(",");
            var d1 = da[1].split("=");
            var d2 = da[2].split("=");
            var reg = myFile.split("\n");
	    var columns= reg.length;
            var lat=0;
            var lon = 0;
	    
            for(var i = 0; i< columns; i++){
           
                lat = GEOR.Addons.InsertCSV.prototype.returnData(i, d1[1]);	
                lon = GEOR.Addons.InsertCSV.prototype.returnData(i, d2[1]);	
		if (i !== 0) {
                    var feature = new OpenLayers.Feature.Vector(
						    new OpenLayers.Geometry.Point(lat, lon).transform(new OpenLayers.Projection("EPSG:4326"), 
                                                                                                      new OpenLayers.Projection("EPSG:900913")
                                                                                                     ),
						    {foo : GEOR.Addons.InsertCSV.prototype.putInfPopup(i)},
						    
						    {	externalGraphic: 'http://www.openlayers.org/dev/img/marker.png',
                                                        graphicHeight: 21,
                                                        graphicWidth: 16
						    });                                                                
                     _insertLayer.addFeatures(feature);
                }
            }
	    
	    var selector = new OpenLayers.Control.SelectFeature(_insertLayer,{
		hover:false,
		autoActivate:true
	    });
	    mmap.addControl(selector);
            this.layer = _insertLayer;
        }
	
	if (!this.win) {
            this.win = new Ext.Window({
                closable: true,
                closeAction: 'hide',
		collapsible: true,
                layout:'column',
		resizable: false,
                width:344,
                height: 383,
                title: OpenLayers.i18n("popup_title"),
                border: false,
                buttonAlign: 'right',
                items :  [                         
                           myForm
                         ],
                buttons: [{  
                          text: OpenLayers.i18n('Import'),
                          handler: function(){
				var dats= myForm.getForm().getValues(true).replace(/&/g,', ');
				var da= dats.split(",");
				var lt = da[1].split("=");
				var lg = da[2].split("=");
                            
				if (lt[1] != 'Select%20a%20field' && lg[1] != 'Select%20a%20field') {
				    var num = itemVerif.split(delim);
				    var indexLt = 0;
				    var indexLg = 0;
				    for(var i = 0; i < da.length; i++) {
				        if (lt[1] == head[i]) {
				            indexLt = i; 
				        }
				        if (lg[1] == head[i]) {
				            indexLg = i;
				        }
				    }
                                                                
				    if (!isNaN(num[indexLt]) && !isNaN(num[indexLg])) {
					    putMarker();	    
				            this.win.hide();
					    GEOR.Addons.InsertCSV.prototype.destroy();					
				    }	
				    else{
					var cont = OpenLayers.i18n('Insert Fields Latitude and Longitude')+'<br><pre><big><big><b><font color=#A00000>           "-63.121212"</font></b></big></big></pre>';
					Ext.Msg.alert( OpenLayers.i18n('The Data Not Numeric'), cont);
				    }                                
				}
				else{
				    Ext.Msg.alert(OpenLayers.i18n('Required Field'), OpenLayers.i18n('Select Fields'));
				}	    
			  },
			  scope: this
                }],
                listeners: {
			"hide": function() {
			    GEOR.Addons.InsertCSV.prototype.fAction(false);
			    GEOR.Addons.InsertCSV.prototype.fEnables(false);
			    GEOR.Addons.InsertCSV.prototype.destroy();
			},
			scope: this
                }
            });
	    this.fAction(false);
	    this.fEnables(false);
        }
        this.win.show();
    },
    
    createForm: function() {
                  
            return new Ext.FormPanel({
		labelWidth: 100,		
                labelAlign: 'right',
                width: '100%',
		height: '100%',
                frame: true,
                bodyStyle: 'padding:5px 5px 0',
                items: [{
			    xtype:'label',
			    text: OpenLayers.i18n('The CSV file must weigh 50 Kbytes'),
			    style: 'font-size: 10pt;',
                            anchor:'100%'
			},
                        {   html: "<br><div><input id='inputFile' type='file' accept='.csv'/></div> <br> "},
			    panelDelim,	
                        {
                            layout: 'column',
                            items: [
				    {
					columnWidth: 1.0,
                                        layout: 'form',
                                        items: [panelData]
				    },
				    {
					columnWidth: 1.0,
                                        layout: 'form',
                                        items: [panelDesc]
				    }
                                ], 
                                listeners: {
                                    beforerender: function() {
                                        var itemFile = document.getElementById("inputFile");
                                        itemFile.addEventListener('change', readSingleFile, false);
                                    }
                                }
                            }
                ]
	    });
    },
    
    createComboBox: function(id, field, stores){
        var combo = new Ext.form.ComboBox({
                                             id: id,
                                             store: stores,
                                             displayField: 'dato',
                                             editable: false,
                                             mode: 'local',
                                             triggerAction: 'all',
                                             fieldLabel: field,
                                             emptyText: 'Select a field',
                                             width: 160,
                                             onSelect: function(record) {                                           
                                                  this.setValue(record.data.dato);
                                                  this.collapse();
                                              }
                                          });
        return combo;
     },
     
    createComboDelim: function(id, field, stores){
        var combo = new Ext.form.ComboBox({
                                             id: id,
                                             store: stores,
                                             displayField: 'dato',
                                             editable: false,
                                             mode: 'local',
                                             triggerAction: 'all',
                                             fieldLabel: field,
                                             emptyText: 'Select a field',
                                             width: 130,
                                             
                                             onSelect: function(record) {
                                                  this.setValue(record.data.dato);
                                                  this.collapse();
                                              }
                                          });
        return combo;
     },
     
    createPanelDelim:function(){
	var panel = new Ext.Panel({
                            layout: 'column',
                            border: false,
                            items: [{                            
                                        columnWidth: .78,
                                        layout: 'form',
                                        items: [cbboxDelim]
                                    },
				    {
					columnWidth: .22,
                                        layout: 'form',
                                        items: [{
					    xtype: 'button',
					    text: ' OK ',
					    handler: function() {
					        var dats= myForm.getForm().getValues(true).replace(/&/g,', ');
					        var da= dats.split(",");
					        var d = da[0].split("=");
					        switch (d[1]){
						    case '%3B':
							delim = ';';
						        break;
						    case '%2C':
						        delim = ',';
						        break;
						    case '%7C':
						        delim = '|';
							break;
						    default:
						        Ext.Msg.alert(OpenLayers.i18n('Alert'), OpenLayers.i18n('Delimiter Default'));
						        delim = ';';
						        cbboxDelim.setValue(';');
						}
						var cab = myFile.split("\n");
						head = cab[0].split(delim);
						GEOR.Addons.InsertCSV.prototype.fAction(true);
						GEOR.Addons.InsertCSV.prototype.myUpdateValues();
					    }
					}]					
				    }
				   ]
	    });
	return panel;
    },
     
    myUpdateValues: function(){
	var newData = [];
	for(var i = 0; i < head.length; i++) {
	    newData.push([i, head[i]]);
	}
	information.loadData(newData,false);
	information.data.reload;
    }, 
    
    createPanelData:function(){
	var panel = new Ext.Panel({
		
		layout: 'form',
                border: false,
		items: [
                                    {                            
                                        columnWidth: .35,
                                        layout: 'form',
                                        items: [cbboxLon]
                                    }, 
                                    {  
                                        columnWidth: .35,
                                        layout: 'form',
                                        items: [cbboxLat]
                                    },
				    {  
                                        columnWidth: .30,
                                        layout: 'form',
                                        items: [cbboxName]
                                    }
		       ]
	    });
	return panel;
    },
        
    createListGroup: function(){
	
	var listGroup = {xtype: 'multiselect',
			fieldLabel: OpenLayers.i18n('Description'),
			name: 'multiselect',
			displayField: 'dato',
			valueField: 'number',
			width: 160,
			height: 100,
			triggerAction: 'all',
			allowBlank:false,
			store: information,
			ddReorder: true,
		    
	};   
	return listGroup;
    },
           
    createPanelDesc:function(){
	var panel = new Ext.Panel({
	    width: 350,
	    layout: 'column',
	    border: false,
	    items: [
		    {	columnWidth: 0.8,
                        layout: 'form',
                        items: [{
				    xtype:'label',
				    text: OpenLayers.i18n('To select multiple areas'),
				    style: 'font-size: 10pt;'
				}]
		    },
		    {                            
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [listGroup]
                    }
	    ]
	});
	return panel;
    },
         
    fEnables: function(value){
	if (value == true) {
	    panelDelim.enable();
	}else{
	    panelDelim.disable();   
	}
    },
     
    fAction:function (value){
	if (value == true) {
	    panelData.enable();
	    panelDesc.enable();
	}else{
	    panelDesc.disable();
	    panelData.disable();
	}
    },
          
    putInfPopup:function (index){
	
	var dats= myForm.getForm().getValues(true).replace(/&/g,', ');
	var da= dats.split(",");
	
	var lg = da[1].split("=");
	var lt = da[2].split("=");
	var tit = da[3].split("=");
	
	var tittle = this.returnData(index, tit[1]);
	var longit = this.returnData(index, lg[1]);
	var latit = this.returnData(index, lt[1]);
	
	var value = "<b><big>"+OpenLayers.i18n('Title2')+"</big></b>"+tittle+"<br>";
	value = value+"<b><big>"+OpenLayers.i18n('Longitude2')+"</big></b>"+longit+"<br>"+"<b><big>"+OpenLayers.i18n('Latitude2')+"</big></b>"+latit+"<br><b><big><u>"+OpenLayers.i18n('Description2')+"</u>: </big></b><br>";
	
	var cab = myFile.split("\n");
	var desc = da[4].split("=");
	if (desc[1] != '') {
	    var list = desc[1].split("%2C");
	    var ca = cab[index].split(delim);
	    for (var j=0; j<list.length; j++) {
		for (var i=0; i<ca.length; i++) {
		    if (list[j] == i) {
		        value = value+"<b>"+head[i]+": </b>"+ca[i]+"<br>";    
		    }
		}
	    }
	}
	return(value);
    },
        
    returnData:function(row,column){
	
	var valor="";
	var v="";
	var rows = myFile.split("\n");
	var col = rows[row].split(delim);
	
	for (var i=0; i < col.length; i++) {
	    if(head[i] == column){
		v = col[i];
		valor = v;
	    }    
	}
	return valor;
    },
    
    destroy: function() {
        this.layer = null;
        this.mmap = null;
	
	var newData = [];
	newData.push([[0,""]]);
	information.loadData(newData,false);
	information.data.reload;
	
	cbboxName.setValue('');
	cbboxLat.setValue('');
	cbboxLon.setValue('');
	cbboxDelim.setValue('');
    },
};

function readSingleFile(evt) {
            var f = evt.target.files[0];
            if (f) {               
                if ( (f.name.substr(f.name.indexOf("."), f.name.length) == ".csv") || (f.name.substr(f.name.indexOf("."), f.name.length) == ".CSV") ) {
		    var r = new FileReader();
                    r.onload = function(e) { 
                        var contents = e.target.result;
                                               
                        if (f.size <= 51200) {
			    myFile = contents;
			    var cab = myFile.split("\n");
			    itemVerif = cab[1];
			    if (itemVerif !=null) {
				GEOR.Addons.InsertCSV.prototype.fEnables(true);
			    }
			    else{
				Ext.Msg.alert(OpenLayers.i18n('Formed wrong'), OpenLayers.i18n('NO File data are well defined'));
			    }
                        }
                        else{
                            Ext.Msg.alert(OpenLayers.i18n('File Very Large'), OpenLayers.i18n('Your file weighs')+'<font color=#A00000>'+(f.size/1024)+' Kbytes</font><br>'+OpenLayers.i18n('The CSV file must weigh 50 Kbytes'));
                            GEOR.Addons.InsertCSV.prototype.fEnables(false);
                            GEOR.Addons.InsertCSV.prototype.fAction(false);
                        }
                    }
                    r.readAsText(f);
                }else{
                    Ext.Msg.alert(OpenLayers.i18n('Error'), OpenLayers.i18n('The file has no extension'));
                    GEOR.Addons.InsertCSV.prototype.fEnables(false);
                    GEOR.Addons.InsertCSV.prototype.fAction(false);
		}
            } else { 
                Ext.Msg.alert(OpenLayers.i18n('addon_Insert_t_error'), OpenLayers.i18n('Failed to load file'));
		GEOR.Addons.InsertCSV.prototype.fEnables(false);
                GEOR.Addons.InsertCSV.prototype.fAction(false);
            }
}
var myFile="";