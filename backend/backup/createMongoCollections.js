conn = new Mongo();
db = conn.getDB("Labyrinth");
db.dropDatabase();

db.createCollection("articles");
db.createCollection("mazes");
db.createCollection("users");
