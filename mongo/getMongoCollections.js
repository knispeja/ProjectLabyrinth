conn = new Mongo();
db = conn.getDB("Labyrinth");
allCollections = db.getCollectionNames();
print(allCollections);