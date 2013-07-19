ImportCSV ADDON
===============

This addon allows users to 
authors: @rucondori

For the addon config should look like this:

    {
        "id": "insertcsv_0",
        "name": "InsertCSV",
        "title": {
            "en": "Insert CSV file",
            "es": "Insertar CSV",
            "fr": "insérer un fichier CSV"
        },
        "description": {
            "en": "Tool to insert a CSV file",
            "es": "Herramienta para insertar un archivo CSV.",
            "fr": "Outil pour insérer un fichier CSV"
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
    

For a :

    {
        "id": "insertcsv_0",
        "name": "InsertCSV",
        "title": {
            "en": "Insert CSV file",
            "es": "Insertar CSV",
            "fr": "insérer un fichier CSV"
        },
        "description": {
            "en": "Tool to insert a CSV file",
            "es": "Herramienta para insertar un archivo CSV.",
            "fr": "Outil pour insérer un fichier CSV"
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
