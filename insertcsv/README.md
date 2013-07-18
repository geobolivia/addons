ImportCSV ADDON
===============

This addon allows users to zoom in a specific area of the map, either using the current map layers ("dynamic" mode), or a static layer ("static" mode).
authors: @rucondori


For a static ImportsCSV, you may want to configure your addon with a custom baselayer.
In this case, the addon config should look like this:

    {
        "id": "insertcsv_0",
        "name": "InsertCSV",
        "title": {
            "en": "Insert CSV",
            "es": "Insertar CSV",
            "fr": "CSV"
        },
        "description": {
            "en": "Insert CSV",
            "es": "Herramienta para insertar un archivo CSV.",
            "fr": "CSV"
        },
        "options": {
            "baseLayerConfig": {
                "wmsurl": "http://myserver.com/gwc/service/wms"
                "layer": "mylayer",
                "format": "image/jpeg",
                "buffer": 8
            }
        }
    }
    

For a dynamic magnifier (which means that the magnifier will zoom into the current visible layers), the addon config should rather be:

    {
        "id": "insertcsv_0",
        "name": "InsertCSV",
        "title": {
            "en": "Insert CSV",
            "es": "Insertar CSV",
            "fr": "CSV"
        },
        "description": {
            "en": "Insert CSV",
            "es": "Herramienta para insertar un archivo CSV.",
            "fr": "CSV"
        },
        "options": {
            "mode": "dynamic",
            "delta": 1,
            "baseLayerConfig": {
                "buffer": 8
            }
        }
    }


Default options for this addon are specified in the manifest.json file:

    "default_options": {
        "mode": "static",
        "baseLayerConfig": {
            "wmsurl": "http://tile.geobretagne.fr/gwc02/service/wms",
            "layer": "satellite",
            "format": "image/jpeg",
            "buffer": 8
        }
    }

This means that the magnifier tool will display the layer "satellite" from the http://tile.geobretagne.fr/gwc02/service/wms WMS server.


Note: the original OpenLayers import_csv (verificar ) control comes from https://github.com/fredj/openlayers-magnifier
