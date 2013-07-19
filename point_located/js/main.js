Ext.namespace("GEOR.Addons");

var mapi,wini;
     
GEOR.Addons.Point_Located = function(map, options) {
    this.options = options;
    mapi=map;
};

GEOR.Addons.Point_Located.prototype = {
    item: null,
    stores: {},
    layer: null,
    win: null,
    jsonFormat: null,
    geojsonFormat: null,
    fields: null,
    cbx: null,
    fieldNames: [],

    /**
     * Method: init
     *
     * Parameters:
     * record - {Ext.data.record} a record with the addon parameters
     */
    
    init: function(record) {
        var lang = OpenLayers.Lang.getCode();
        Ext.iterate(this.options.tab1, function(k, v) {
            this.fieldNames.push(k);
        }, this);
        // to garantee that fields will always be in the same order:
        this.fieldNames.sort();
        this.jsonFormat = new OpenLayers.Format.JSON();
        this.geojsonFormat = new OpenLayers.Format.GeoJSON();
        this.layer = new OpenLayers.Layer.Vector("addon_point_located_vectors", {
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
        var o = this.options.tab1,
        fields;
        Ext.each(this.fieldNames, function(field) {
            var c = o[field];
            fields = [{
                name: 'id'
            }, {
                name: c.valuefield,
                mapping: 'properties.' + c.valuefield
            }, {
                name: c.displayfield,
                mapping: 'properties.' + c.displayfield
            }, {
                name: 'bbox',
                mapping: 'properties.bbox'
            }];
            // compute which additional properties should be fetched & stored
            // if a custom template is provided:
            if (c.template) {
                var re = /{(.+?)}/g, r;
                while ((r = re.exec(c.template)) !== null) {
                    fields.push({
                        name: r[1],
                        mapping: 'properties.' + r[1]
                    });
                }
            }
            // TODO: use geoext's protocolproxy for tab1 stores
            this.stores[field] = new Ext.data.JsonStore({
                fields: fields
            });
        }, this);
        // return menu item:
        this.item = new Ext.menu.Item({
            text: record.get("title")[lang],
            iconCls: 'point_located-icon',
            qtip: record.get("description")[lang],
            handler:this.showWindow,
            scope: this
        });
        return this.item;
    },

    showWindow: function() {
        wini=this.win;
        if (!wini) {
            wini = new Ext.Window({
                title : OpenLayers.i18n("addon_point_located_popup_title"),
                width : 322,
                height : 313,
                constrain: true,
                resizable : false,
                x:970,
                y:33,
                collapsible: true,
                //modal : true,
                items : [formBasic],
                iconCls: 'point_located-icon',
                closable: true,
                closeAction: 'hide',
                buttonAlign: 'left',
                fbar: [{
                    text: OpenLayers.i18n("cance"),
                    handler: function() {
                        wini.hide();
                    },
                    scope: this
                }]
            })
        }
        wini.show();
    },
    
 
    destroy: function() {
        wini.hide();
        this.layer = null;
        this.map = null;
    }
};


var values= {
    "max_form1_1":-9.67064,
    "min_form1_1":-22.91460,
    "max_form1_2":-57.40197,
    "min_form1_2":-69.59113,
             
    "max_form2_1":22,
    "min_form2_1":9,
    "max_form2_2":69,
    "min_form2_2":57,
    "max_form2_3":59.99,
    "min_form2_3":0,
             
    "max_form3":10000000000,
    "min_form3":0
};

function here_I_am(x, y) {
    mapi.setCenter(new OpenLayers.LonLat(x, y).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection(mapi.getProjection())), mapi.getZoom);
    var layer_marcador = new OpenLayers.Layer.Markers(OpenLayers.i18n("nomlayer"));

    var tamanio = new OpenLayers.Size(41, 47);
    var offset = new OpenLayers.Pixel(-(tamanio.w / 2), -tamanio.h);

    var icono = new OpenLayers.Icon(vecimage[pointer], tamanio, offset);
    layer_marcador.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(x,y)
        .transform(new OpenLayers.Projection("EPSG:4326"),
            new OpenLayers.Projection(mapi.getProjection())), icono));
    /*alert(mapi.projection);
    layer_marcador.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(x,y).
        transform(mapi.projection), icono));*/
    mapi.addLayer(layer_marcador);
//wini.hide();   
}
		
function valid_limits(value_x,value_y){
    /*var bbox=mapi.getExtent();
    //var bbox=mapi.maxExtent;
    var izq=bbox.left;
    var der=bbox.rigth;
    var arr=bbox.top;
    var aba=bbox.bottom
    alert(izq+" "+der+" "+arr+" "+aba);
    if ((ejex >= izq) && (ejex <= der) && (ejey >= bottom) && (ejey <= top )) {
        aqui_estoy(ejex,ejey);
    } 
    else {
        fuera_rango();
    }
    */
    
    if ((value_x >= values.min_form1_2) && (value_x <= values.max_form1_2) && (value_y >= values.min_form1_1) && (value_y <= values.max_form1_1 )) {
        here_I_am(value_x,value_y);
    } 
    else {
        outside_rank();
    }
}


function outside_rank(){
    Ext.MessageBox.show({
        title: OpenLayers.i18n("errrangotit"),
        width: 230,
        y: 50,
        msg: OpenLayers.i18n("errrangomen"),
        buttons: Ext.MessageBox.OK,
        icon: Ext.MessageBox.ERROR
    })
}

function white_spaces(){
    Ext.MessageBox.show({
        title: OpenLayers.i18n("errblancotit"),
        width: 230,
        y: 50,
        msg: OpenLayers.i18n("errblancomen"),
        buttons: Ext.MessageBox.OK,
        icon: Ext.MessageBox.ERROR
    })
}

function incorrect_data_form2(){
    Ext.MessageBox.show({
        title: OpenLayers.i18n("errtitform2"),
        width: 380,
        y: 50,
        msg: OpenLayers.i18n("errmenform2"),
        buttons: Ext.MessageBox.OK,
        icon: Ext.MessageBox.ERROR
    })
}

var formBasic, form1, form2, form3;

form1 = new Ext.FormPanel({
    title: OpenLayers.i18n("titform1"),
    frame: true,
    hidden:false,
    bodyStyle:'padding:10px 20px 0',
    border : true,
    width : 298,
   
    items : [
    {
        xtype : 'numberfield',
        decimalPrecision : 10,
        fieldLabel : OpenLayers.i18n("txtlat")+' (Y) ',
        name : 'fieldy',
        id: 'fieldy',
        maxValue: values.max_form1_1,
        minValue: values.min_form1_1,
        anchor : '95%',
        allowBlank : false
    },
    new Ext.form.NumberField({
        decimalPrecision : 10,
        fieldLabel : OpenLayers.i18n("txtlong")+' (X) ',
        name : 'fieldx',
        id : 'fieldx',
        maxValue: values.max_form1_2,
        minValue: values.min_form1_2,
        anchor : '95%',
        allowBlank : false
    })],
    buttons : [{
        text : OpenLayers.i18n("txtbuttomsearch"),
        handler : function() { 
            var value_y = Ext.getCmp('fieldy').getValue();
            var value_x = Ext.getCmp('fieldx').getValue(); 
            if(validates_field(value_x)||validates_field(value_y)){
                white_spaces();
            }
            else{
                valid_limits(value_x,value_y);
            }
        }
    }]
});
				
	
function degrees_minutes_seconds(g,m,s){
    var res=0;
    res=g+(m/60) +(s/3600);
    return res;
}
	
form2= new Ext.FormPanel({
    title:OpenLayers.i18n("titform2"),
    frame: true,
    hidden:false,
    border : true,
    width : 298,
    bodyStyle:'padding:18px 5px 0',
    layout: {
        type: 'table',
        columns: 7
    },
	
    items : [
    {
        xtype: 'label',	
        text: OpenLayers.i18n("txtlat")+" : "
    },
    {
        xtype : 'numberfield',
        decimalPrecision : 5,
        name : 'field1',
        id : 'field1',	
        width : 65,
        maxValue: values.max_form2_1,
        minValue: values.min_form2_1,
        allowBlank : true
    },
    {
        xtype: 'label',	
        text: ' º '
    },
    {
        xtype : 'numberfield',
        decimalPrecision : 5,
        name : 'field2',
        id : 'field2',	
        width : 65,
        maxValue: values.max_form2_3,
        minValue: values.min_form2_3,
        allowBlank : true
    },
    {
        xtype: 'label',	
        text: " ' "
    },
    {
        xtype : 'numberfield',
        decimalPrecision : 5,
        name : 'field3',
        id : 'field3',
        width :65,
        maxValue: values.max_form2_3,
        minValue: values.min_form2_3,
        allowBlank : true
    },
    {
        xtype: 'label',	
        text: "'' S"
    },						
    {
        xtype: 'label',	
        text: OpenLayers.i18n("txtlong")+" : "
    },
    {
        xtype : 'numberfield',
        decimalPrecision : 5,
        name : 'field4',
        id : 'field4',	
        width : 65,
        maxValue: values.max_form2_2,
        minValue: values.min_form2_2,
        allowBlank : true
    },
    {
        xtype: 'label',	
        text: ' º '
    },
    {
        xtype : 'numberfield',
        decimalPrecision : 5,
        name : 'field5',
        id : 'field5',
        width : 65,
        maxValue: values.max_form2_3,
        minValue: values.min_form2_3,
        allowBlank : true
    },
    {
        xtype: 'label',	
        text: " ' "
    },
    {
        xtype : 'numberfield',
        decimalPrecision : 5,
        name : 'field6',
        id : 'field6',
        width : 65,
        maxValue: values.max_form2_3,
        minValue: values.min_form2_3,
        allowBlank : true
    },
    {
        xtype: 'label',	
        text: " ''  W"
    }
    ],
    buttons : [{
        text : OpenLayers.i18n("txtbuttomsearch"),
        handler : function() {
            var latg = Ext.getCmp('field1').getValue();
            var latm = Ext.getCmp('field2').getValue();
            var lats = Ext.getCmp('field3').getValue();
            var longig = Ext.getCmp('field4').getValue();
            var longim= Ext.getCmp('field5').getValue();
            var longis= Ext.getCmp('field6').getValue();

            var lat=degrees_minutes_seconds(latg,latm,lats);
            var longi=degrees_minutes_seconds(longig,longim,longis);

            if((latg>=values.min_form2_1 && latg<=values.max_form2_1)&&validates_form2(latm)&&validates_form2(lats)
                &&(longig>=values.min_form2_2 && longig<=values.max_form2_2)&&validates_form2(longim)&&validates_form2(longis))
                valid_limits(longi*(-1),lat*(-1));
            else{
                if(validates_field(latg)||validates_field(latm)||validates_field(lats)
                    ||validates_field(longig)||validates_field(longim)||validates_field(longis))
                    white_spaces();
                else
                    incorrect_data_form2();
            }
        }
    }]
});
	
function validates_form2(l){
    if(l>=0 && l<=59 && l!=null)
        return true;
    else
        return false; 
}	
	
function validates_field(l){
    if(l=="")
        return true;
    else
        return false; 
}
	
function utm(x,y,z){
    // ***************************************************************************
    // Note: This is a JavaScript-powered form. 
    //
    // Programmers: The JavaScript source code in this document may be copied and 
    // reused without restriction.
    //
    // If you have a Java 1.1-compliant browser, and especially if you need to
    // use an ellipsoid model other than WGS84, you may want to try the Coordinate 
    // and Datum Transformations tool.
    // 
    // Download from http://home.hiwaay.net/~taylorc/toolbox/
    // *
    // ****************************************************************************/
    //
    //   This program is free software; you can redistribute it and/or modify
    //   it under the terms of the GNU General Public License as published by
    //   the Free Software Foundation; either version 2 of the License, or
    //   (at your option) any later version.
    // 
    //   This program is distributed in the hope that it will be useful,
    //   but WITHOUT ANY WARRANTY; without even the implied warranty of
    //   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    //   GNU General Public License for more details.
    // 
    //
    //*****************************************************************************
		
    var southhemi=true;
    var latlon=new Array(2);
		
    var pi = 3.14159265358979;
		
    /* Ellipsoid model constants (actual values here are for WGS84) */
    var sm_a = 6378137.0;
    var sm_b = 6356752.314;
    var sm_EccSquared = 6.69437999013e-03;
		
    var UTMScaleFactor = 0.9996;
    UTMXYToLatLon(x, y, z, southhemi, latlon);
			
    /*
		    * DegToRad
		    *
		    * Converts degrees to radians.
		    *
		    */
    function DegToRad (deg)
    {
        return (deg / 180.0 * pi)
    }
	
    /*
		    * RadToDeg
		    *
		    * Converts radians to degrees.
		    *
		    */
    function RadToDeg (rad)
    {
        return (rad / pi * 180.0)
    }
	
    /*
		    * ArcLengthOfMeridian
		    *
		    * Computes the ellipsoidal distance from the equator to a point at a
		    * given latitude.
		    *
		    * Reference: Hoffmann-Wellenhof, B., Lichtenegger, H., and Collins, J.,
		    * GPS: Theory and Practice, 3rd ed.  New York: Springer-Verlag Wien, 1994.
		    *
		    * Inputs:
		    *     phi - Latitude of the point, in radians.
		    *
		    * Globals:
		    *     sm_a - Ellipsoid model major axis.
		    *     sm_b - Ellipsoid model minor axis.
		    *
		    * Returns:
		    *     The ellipsoidal distance of the point from the equator, in meters.
		    *
		    */
    function ArcLengthOfMeridian (phi)
    {
        var alpha, beta, gamma, delta, epsilon, n;
        var result;
		
        /* Precalculate n */
        n = (sm_a - sm_b) / (sm_a + sm_b);
		
        /* Precalculate alpha */
        alpha = ((sm_a + sm_b) / 2.0)
        * (1.0 + (Math.pow (n, 2.0) / 4.0) + (Math.pow (n, 4.0) / 64.0));
		
        /* Precalculate beta */
        beta = (-3.0 * n / 2.0) + (9.0 * Math.pow (n, 3.0) / 16.0)
        + (-3.0 * Math.pow (n, 5.0) / 32.0);
		
        /* Precalculate gamma */
        gamma = (15.0 * Math.pow (n, 2.0) / 16.0)
        + (-15.0 * Math.pow (n, 4.0) / 32.0);
		    
        /* Precalculate delta */
        delta = (-35.0 * Math.pow (n, 3.0) / 48.0)
        + (105.0 * Math.pow (n, 5.0) / 256.0);
		    
        /* Precalculate epsilon */
        epsilon = (315.0 * Math.pow (n, 4.0) / 512.0);
		    
        /* Now calculate the sum of the series and return */
        result = alpha
        * (phi + (beta * Math.sin (2.0 * phi))
            + (gamma * Math.sin (4.0 * phi))
            + (delta * Math.sin (6.0 * phi))
            + (epsilon * Math.sin (8.0 * phi)));
		
        return result;
    }

    /*
		    * UTMCentralMeridian
		    *
		    * Determines the central meridian for the given UTM zone.
		    *
		    * Inputs:
		    *     zone - An integer value designating the UTM zone, range [1,60].
		    *
		    * Returns:
		    *   The central meridian for the given UTM zone, in radians, or zero
		    *   if the UTM zone parameter is outside the range [1,60].
		    *   Range of the central meridian is the radian equivalent of [-177,+177].
		    *
		    */
    function UTMCentralMeridian (zone)
    {
        var cmeridian;
		
        cmeridian = DegToRad (-183.0 + (zone * 6.0));
		    
        return cmeridian;
    }
		
		
		
    /*
		    * FootpointLatitude
		    *
		    * Computes the footpoint latitude for use in converting transverse
		    * Mercator coordinates to ellipsoidal coordinates.
		    *
		    * Reference: Hoffmann-Wellenhof, B., Lichtenegger, H., and Collins, J.,
		    *   GPS: Theory and Practice, 3rd ed.  New York: Springer-Verlag Wien, 1994.
		    *
		    * Inputs:
		    *   y - The UTM northing coordinate, in meters.
		    *
		    * Returns:
		    *   The footpoint latitude, in radians.
		    *
		    */
    function FootpointLatitude (y)
    {
        var y_, alpha_, beta_, gamma_, delta_, epsilon_, n;
        var result;
		        
        /* Precalculate n (Eq. 10.18) */
        n = (sm_a - sm_b) / (sm_a + sm_b);
		        	
        /* Precalculate alpha_ (Eq. 10.22) */
        /* (Same as alpha in Eq. 10.17) */
        alpha_ = ((sm_a + sm_b) / 2.0)
        * (1 + (Math.pow (n, 2.0) / 4) + (Math.pow (n, 4.0) / 64));
		        
        /* Precalculate y_ (Eq. 10.23) */
        y_ = y / alpha_;
		        
        /* Precalculate beta_ (Eq. 10.22) */
        beta_ = (3.0 * n / 2.0) + (-27.0 * Math.pow (n, 3.0) / 32.0)
        + (269.0 * Math.pow (n, 5.0) / 512.0);
		        
        /* Precalculate gamma_ (Eq. 10.22) */
        gamma_ = (21.0 * Math.pow (n, 2.0) / 16.0)
        + (-55.0 * Math.pow (n, 4.0) / 32.0);
		        	
        /* Precalculate delta_ (Eq. 10.22) */
        delta_ = (151.0 * Math.pow (n, 3.0) / 96.0)
        + (-417.0 * Math.pow (n, 5.0) / 128.0);
		        	
        /* Precalculate epsilon_ (Eq. 10.22) */
        epsilon_ = (1097.0 * Math.pow (n, 4.0) / 512.0);
		        	
        /* Now calculate the sum of the series (Eq. 10.21) */
        result = y_ + (beta_ * Math.sin (2.0 * y_))
        + (gamma_ * Math.sin (4.0 * y_))
        + (delta_ * Math.sin (6.0 * y_))
        + (epsilon_ * Math.sin (8.0 * y_));
		        
        return result;
    }
	
    /*
		    * MapLatLonToXY
		    *
		    * Converts a latitude/longitude pair to x and y coordinates in the
		    * Transverse Mercator projection.  Note that Transverse Mercator is not
		    * the same as UTM; a scale factor is required to convert between them.
		    *
		    * Reference: Hoffmann-Wellenhof, B., Lichtenegger, H., and Collins, J.,
		    * GPS: Theory and Practice, 3rd ed.  New York: Springer-Verlag Wien, 1994.
		    *
		    * Inputs:
		    *    phi - Latitude of the point, in radians.
		    *    lambda - Longitude of the point, in radians.
		    *    lambda0 - Longitude of the central meridian to be used, in radians.
		    *
		    * Outputs:
		    *    xy - A 2-element array containing the x and y coordinates
		    *         of the computed point.
		    *
		    * Returns:
		    *    The function does not return a value.
		    *
		    */
    function MapLatLonToXY (phi, lambda, lambda0, xy)
    {
        var N, nu2, ep2, t, t2, l;
        var l3coef, l4coef, l5coef, l6coef, l7coef, l8coef;
        var tmp;
		
        /* Precalculate ep2 */
        ep2 = (Math.pow (sm_a, 2.0) - Math.pow (sm_b, 2.0)) / Math.pow (sm_b, 2.0);
		    
        /* Precalculate nu2 */
        nu2 = ep2 * Math.pow (Math.cos (phi), 2.0);
		    
        /* Precalculate N */
        N = Math.pow (sm_a, 2.0) / (sm_b * Math.sqrt (1 + nu2));
		    
        /* Precalculate t */
        t = Math.tan (phi);
        t2 = t * t;
        tmp = (t2 * t2 * t2) - Math.pow (t, 6.0);
		
        /* Precalculate l */
        l = lambda - lambda0;
		    
        /* Precalculate coefficients for l**n in the equations below
		           so a normal human being can read the expressions for easting
		           and northing
		           -- l**1 and l**2 have coefficients of 1.0 */
        l3coef = 1.0 - t2 + nu2;
		    
        l4coef = 5.0 - t2 + 9 * nu2 + 4.0 * (nu2 * nu2);
		    
        l5coef = 5.0 - 18.0 * t2 + (t2 * t2) + 14.0 * nu2
        - 58.0 * t2 * nu2;
		    
        l6coef = 61.0 - 58.0 * t2 + (t2 * t2) + 270.0 * nu2
        - 330.0 * t2 * nu2;
		    
        l7coef = 61.0 - 479.0 * t2 + 179.0 * (t2 * t2) - (t2 * t2 * t2);
		    
        l8coef = 1385.0 - 3111.0 * t2 + 543.0 * (t2 * t2) - (t2 * t2 * t2);
		    
        /* Calculate easting (x) */
        xy[0] = N * Math.cos (phi) * l
        + (N / 6.0 * Math.pow (Math.cos (phi), 3.0) * l3coef * Math.pow (l, 3.0))
        + (N / 120.0 * Math.pow (Math.cos (phi), 5.0) * l5coef * Math.pow (l, 5.0))
        + (N / 5040.0 * Math.pow (Math.cos (phi), 7.0) * l7coef * Math.pow (l, 7.0));
		    
        /* Calculate northing (y) */
        xy[1] = ArcLengthOfMeridian (phi)
        + (t / 2.0 * N * Math.pow (Math.cos (phi), 2.0) * Math.pow (l, 2.0))
        + (t / 24.0 * N * Math.pow (Math.cos (phi), 4.0) * l4coef * Math.pow (l, 4.0))
        + (t / 720.0 * N * Math.pow (Math.cos (phi), 6.0) * l6coef * Math.pow (l, 6.0))
        + (t / 40320.0 * N * Math.pow (Math.cos (phi), 8.0) * l8coef * Math.pow (l, 8.0));
		    
        return;
    }
		    
		    
		    
    /*
		    * MapXYToLatLon
		    *
		    * Converts x and y coordinates in the Transverse Mercator projection to
		    * a latitude/longitude pair.  Note that Transverse Mercator is not
		    * the same as UTM; a scale factor is required to convert between them.
		    *
		    * Reference: Hoffmann-Wellenhof, B., Lichtenegger, H., and Collins, J.,
		    *   GPS: Theory and Practice, 3rd ed.  New York: Springer-Verlag Wien, 1994.
		    *
		    * Inputs:
		    *   x - The easting of the point, in meters.
		    *   y - The northing of the point, in meters.
		    *   lambda0 - Longitude of the central meridian to be used, in radians.
		    *
		    * Outputs:
		    *   philambda - A 2-element containing the latitude and longitude
		    *               in radians.
		    *
		    * Returns:
		    *   The function does not return a value.
		    *
		    * Remarks:
		    *   The local variables Nf, nuf2, tf, and tf2 serve the same purpose as
		    *   N, nu2, t, and t2 in MapLatLonToXY, but they are computed with respect
		    *   to the footpoint latitude phif.
		    *
		    *   x1frac, x2frac, x2poly, x3poly, etc. are to enhance readability and
		    *   to optimize computations.
		    *
		    */
    function MapXYToLatLon (x, y, lambda0, philambda)
    {
        var phif, Nf, Nfpow, nuf2, ep2, tf, tf2, tf4, cf;
        var x1frac, x2frac, x3frac, x4frac, x5frac, x6frac, x7frac, x8frac;
        var x2poly, x3poly, x4poly, x5poly, x6poly, x7poly, x8poly;
		    	
        /* Get the value of phif, the footpoint latitude. */
        phif = FootpointLatitude (y);
		        	
        /* Precalculate ep2 */
        ep2 = (Math.pow (sm_a, 2.0) - Math.pow (sm_b, 2.0))
        / Math.pow (sm_b, 2.0);
		        	
        /* Precalculate cos (phif) */
        cf = Math.cos (phif);
		        	
        /* Precalculate nuf2 */
        nuf2 = ep2 * Math.pow (cf, 2.0);
		        	
        /* Precalculate Nf and initialize Nfpow */
        Nf = Math.pow (sm_a, 2.0) / (sm_b * Math.sqrt (1 + nuf2));
        Nfpow = Nf;
		        	
        /* Precalculate tf */
        tf = Math.tan (phif);
        tf2 = tf * tf;
        tf4 = tf2 * tf2;
		        
        /* Precalculate fractional coefficients for x**n in the equations
		           below to simplify the expressions for latitude and longitude. */
        x1frac = 1.0 / (Nfpow * cf);
		        
        Nfpow *= Nf;   /* now equals Nf**2) */
        x2frac = tf / (2.0 * Nfpow);
		        
        Nfpow *= Nf;   /* now equals Nf**3) */
        x3frac = 1.0 / (6.0 * Nfpow * cf);
		        
        Nfpow *= Nf;   /* now equals Nf**4) */
        x4frac = tf / (24.0 * Nfpow);
		        
        Nfpow *= Nf;   /* now equals Nf**5) */
        x5frac = 1.0 / (120.0 * Nfpow * cf);
		        
        Nfpow *= Nf;   /* now equals Nf**6) */
        x6frac = tf / (720.0 * Nfpow);
		        
        Nfpow *= Nf;   /* now equals Nf**7) */
        x7frac = 1.0 / (5040.0 * Nfpow * cf);
		        
        Nfpow *= Nf;   /* now equals Nf**8) */
        x8frac = tf / (40320.0 * Nfpow);
		        
        /* Precalculate polynomial coefficients for x**n.
		           -- x**1 does not have a polynomial coefficient. */
        x2poly = -1.0 - nuf2;
		        
        x3poly = -1.0 - 2 * tf2 - nuf2;
		        
        x4poly = 5.0 + 3.0 * tf2 + 6.0 * nuf2 - 6.0 * tf2 * nuf2
        - 3.0 * (nuf2 *nuf2) - 9.0 * tf2 * (nuf2 * nuf2);
		        
        x5poly = 5.0 + 28.0 * tf2 + 24.0 * tf4 + 6.0 * nuf2 + 8.0 * tf2 * nuf2;
		        
        x6poly = -61.0 - 90.0 * tf2 - 45.0 * tf4 - 107.0 * nuf2
        + 162.0 * tf2 * nuf2;
		        
        x7poly = -61.0 - 662.0 * tf2 - 1320.0 * tf4 - 720.0 * (tf4 * tf2);
		        
        x8poly = 1385.0 + 3633.0 * tf2 + 4095.0 * tf4 + 1575 * (tf4 * tf2);
		        	
        /* Calculate latitude */
        philambda[0] = phif + x2frac * x2poly * (x * x)
        + x4frac * x4poly * Math.pow (x, 4.0)
        + x6frac * x6poly * Math.pow (x, 6.0)
        + x8frac * x8poly * Math.pow (x, 8.0);
		        	
        /* Calculate longitude */
        philambda[1] = lambda0 + x1frac * x
        + x3frac * x3poly * Math.pow (x, 3.0)
        + x5frac * x5poly * Math.pow (x, 5.0)
        + x7frac * x7poly * Math.pow (x, 7.0);
		        	
        var lat = (180*philambda[0])/pi;
        var lon = (180*philambda[1])/pi;
		       	
        var lat = parseFloat(lat);
        var lat = Math.round(lat * 100000) / 100000;
				
        var lon = parseFloat(lon);
        var lon = Math.round(lon * 100000) / 100000;
        valid_limits(lon,lat);
        return;
    }
		
		
		
		
    /*
		    * LatLonToUTMXY
		    *
		    * Converts a latitude/longitude pair to x and y coordinates in the
		    * Universal Transverse Mercator projection.
		    *
		    * Inputs:
		    *   lat - Latitude of the point, in radians.
		    *   lon - Longitude of the point, in radians.
		    *   zone - UTM zone to be used for calculating values for x and y.
		    *          If zone is less than 1 or greater than 60, the routine
		    *          will determine the appropriate zone from the value of lon.
		    *
		    * Outputs:
		    *   xy - A 2-element array where the UTM x and y values will be stored.
		    *
		    * Returns:
		    *   The UTM zone used for calculating the values of x and y.
		    *
		    */
    function LatLonToUTMXY (lat, lon, zone, xy)
    {
        MapLatLonToXY (lat, lon, UTMCentralMeridian (zone), xy);
		
        /* Adjust easting and northing for UTM system. */
        xy[0] = xy[0] * UTMScaleFactor + 500000.0;
        xy[1] = xy[1] * UTMScaleFactor;
        if (xy[1] < 0.0)
            xy[1] = xy[1] + 10000000.0;
		
        return zone;
    }
		    
		    
		    
    /*
		    * UTMXYToLatLon
		    *
		    * Converts x and y coordinates in the Universal Transverse Mercator
		    * projection to a latitude/longitude pair.
		    *
		    * Inputs:
		    *	x - The easting of the point, in meters.
		    *	y - The northing of the point, in meters.
		    *	zone - The UTM zone in which the point lies.
		    *	southhemi - True if the point is in the southern hemisphere;
		    *               false otherwise.
		    *
		    * Outputs:
		    *	latlon - A 2-element array containing the latitude and
		    *            longitude of the point, in radians.
		    *
		    * Returns:
		    *	The function does not return a value.
		    *
		    */
    function UTMXYToLatLon (x, y, z, southhemi, latlon)
    {
        var cmeridian;
		        	
        x -= 500000.0;
        x /= UTMScaleFactor;
		        	
        /* If in southern hemisphere, adjust y accordingly. */
        if (southhemi)
            y -= 10000000.0;
		        		
        y /= UTMScaleFactor;
		        
        cmeridian = UTMCentralMeridian (z);
        MapXYToLatLon (x, y, cmeridian, latlon);
		        	
        return;
    }
    return;
}
	
//var combozona = new Ext.data.ArrayStore({
//    fields : ['id3', 'opcion3'],
//    data : [[0, '19'], [1, '20'], [2, '21']]
//});

var area=19;

var combo3 = new Ext.form.ComboBox({
    rowspan: 2,
    width : 60,
    editable: false,
    queryMode : 'local',
    emptyText : '',
    typeAhead: true,
    triggerAction: 'all',
    lazyRender:true,
    mode: 'local',
    valueField: 'id3',
    displayField: 'option3',
    store: new Ext.data.ArrayStore({
        id: 0,
        fields : ['id3', 'option3'],
        data : [[0, '19'], [1, '20'], [2, '21']]
    }),
    listeners : {
        scope : this,
        select : function(cb,record) {
            change_area(cb.getValue());
        }
    }
    
});

combo3.setValue(19); 

var change_area = function(nropcion) {
    switch(nropcion) {
        case 0:
            area=19;
            break;
        case 1:
            area=20;
            break;
        case 2:
            area=21;
            break;
    }
}

                                
form3= new Ext.FormPanel({
    title:OpenLayers.i18n("titform3"),
    frame: true,
    hidden:false,
    border : true,
    width : 298,
    bodyStyle:'padding:5px 25px 0',
    layout: {
        type: 'table',
        columns: 4
    },
	
    items : [
    {
        xtype: 'label',	
        text: "X : "
    },
    {
        xtype : 'numberfield',
        decimalPrecision : 5,
        //useThousandSeparator : false
        //spinDownEnabled : false,
        //spinUpEnabled : false,
        //autoScroll : false,
        name : 'field13',
        id: 'field13',
        maxValue: values.max_form3,
        minValue: values.min_form3,	
        width : 130
    },
    {
        xtype: 'label',	
        text: OpenLayers.i18n("txtzon"),
        rowspan: 2
    },
    combo3,
    {
        xtype: 'label',	
        text: "Y : "
    },
    {
        xtype : 'numberfield',
        decimalPrecision : 5,
        name : 'field23',
        id: 'field23',
        maxValue: values.max_form3,
        minValue: values.min_form3,
        width :130
    },
    {
        xtype: 'label',	
        text: OpenLayers.i18n("txthem"),
        colspan : 4
    }					
   				
    ],
    buttons : [{
        text : OpenLayers.i18n("txtbuttomsearch"),
        handler : function() {
            var value_x= Ext.getCmp('field13').getValue();
            var value_y = Ext.getCmp('field23').getValue();
            if(validates_field(value_x) || validates_field(value_y) || area==0 ){
                white_spaces();
            }
            else{
                utm(value_x,value_y,area);
            }			
        }
    }]
});
				
var win;
		
			
/*var combo_coordenadas = new Ext.data.ArrayStore({
    fields : ['idf', 'opcionf'],
    data : [[0, 'Grados Decimales'], [1, 'Grados Minutos Segundos'], [2, 'Utm']]
});*/

var combof = new Ext.form.ComboBox({
    x:20,
    editable: false,
    queryMode : 'local',
    emptyText : OpenLayers.i18n("txtcombo3agua"),
    width : 250,
    heigth : 50,
    autoSelect: true,
    typeAhead: true,
    triggerAction: 'all',
    lazyRender:true,
    mode: 'local',
    valueField: 'idf',
    displayField: 'optionf',
    store: new Ext.data.ArrayStore({
        id: 0,
        fields : ['idf', 'optionf'],
        data : [[0, OpenLayers.i18n("txtcombo1")], [1, OpenLayers.i18n("txtcombo2")], [2, OpenLayers.i18n("txtcombo3")]]
    }),
    listeners : {
        scope : this,
        select : function(cb, record) {
            change_form(cb.getValue());
        }
    }
    
});


var vecimage=[  "app/addons/point_located/img/marker1.png",
                "app/addons/point_located/img/marker2.png",
                "app/addons/point_located/img/marker3.png",
                "app/addons/point_located/img/marker4.png",
                "app/addons/point_located/img/marker5.png",
                "app/addons/point_located/img/marker6.png"
             ];

var pointer=0;

var image=new Ext.BoxComponent({
    autoEl: {
        tag: 'img', 
        src: vecimage[0], 
        id: 'idautoel'
    },
    region: 'right',
    id:'idimage',
    hidden:false,
    width: 50,
    height : 50
})

formSplitImage = new Ext.form.FormPanel({
    autoWidth : true,
    bodyStyle:'padding:10px 80px 0',
    layout: {
        type: 'table',
        columns: 8
    },
    items : 
    [
    new Ext.SplitButton({
        text: 'Marker 1',
        id:'idsplit',
        menu: new Ext.menu.Menu({
            hideBorders:false,
            showSeparator :false,
            zIndex :90000,
            items: [
            {
                text: 'Marker 1',
                id:'iditem1',
                handler:function(){
                    Ext.getCmp('idsplit').setText("Marker 1");
                    Ext.getCmp('idimage').el.dom.src = vecimage [0]; 
                    pointer=0;
                }
            },
            {
                text: 'Marker 2',
                id:'iditem2',
                handler:function(){
                    Ext.getCmp('idsplit').setText("Marker 2");
                    Ext.getCmp('idimage').el.dom.src = vecimage [1]; 
                    pointer=1;
                }
            },
            {
                text: 'Marker 3',
                id:'iditem3',
                handler:function(){
                    Ext.getCmp('idsplit').setText("Marker 3");
                    Ext.getCmp('idimage').el.dom.src = vecimage [2];
                    pointer=2; 
                }
            },
            {
                text: 'Marker 4',
                id:'iditem4',
                handler:function(){
                    Ext.getCmp('idsplit').setText("Marker 4");
                    Ext.getCmp('idimage').el.dom.src = vecimage [3];
                    pointer=3;
                }
            },
            {
                text: 'Marker 5',
                id:'iditem5',
                handler:function(){
                    Ext.getCmp('idsplit').setText("Marker 5");
                    Ext.getCmp('idimage').el.dom.src = vecimage [4];
                    pointer=4;                          
                }
            },
            {
                text: 'Marker 6',
                id:'iditem6',
                handler:function(){
                    Ext.getCmp('idsplit').setText("Marker 6");
                    Ext.getCmp('idimage').el.dom.src = vecimage [5];
                    pointer=5;
                }
            }
            ]
        })
    }),
    image  
    ]
});

formBasic = new Ext.FormPanel({
    heigth : 400,
    width : 310,
    frame : true,
    border: true,
    layout: 'fit',
    items : 
    [
        {
            xtype: 'label',
            forId: 'idlabel',
            text: OpenLayers.i18n("textwin")
        }, 
        combof,formSplitImage,form1,form2,form3,
    ]
});
				
				
form1.setVisible(false);
form2.setVisible(false);
form3.setVisible(false);
				
var change_form = function(nropcion) {
    switch(nropcion) {
        case 0:
            form1.setVisible(true);
            form2.setVisible(false);
            form3.setVisible(false);
							
            break;
        case 1:
            form2.setVisible(true);
            form1.setVisible(false);
            form3.setVisible(false);
							
            break;
        case 2:
            form3.setVisible(true);
            form1.setVisible(false);
            form2.setVisible(false);
            break;
    }
};
