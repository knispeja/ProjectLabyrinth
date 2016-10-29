@ECHO OFF

mongo createMongoCollections.js

FOR /F "tokens=* USEBACKQ" %%F IN (`mongo getMongoCollections.js`) DO (
    SET collections=%%F
)

FOR %%C in ("%collections:,=" "%") do (
    mongoimport --db Labyrinth --collection %%C --file %%C.json
)

PAUSE