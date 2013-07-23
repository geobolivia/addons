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
        }
    }


Default options for this addon are specified in the manifest.json file:

    "default_options": {
        "mode": "static",
        "baseLayerConfig": {
            "layer": "addon_Insert_csv",
            "format": "image/jpeg",
            "buffer": 8
        }
    }

This means that the tool will display the points (latitude and longitude) within the csv file as a series of markers

