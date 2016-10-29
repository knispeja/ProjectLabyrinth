@ECHO OFF
FOR /F "tokens=* USEBACKQ" %%F IN (`mongo getMongoCollections.js`) DO (
    SET collections=%%F
)

FOR %%C in ("%collections:,=" "%") do (
    mongoexport --db Labyrinth --collection %%C --out %%C.json
)

PAUSE