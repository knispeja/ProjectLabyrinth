conn = new Mongo();
db = conn.getDB("Labyrinth");
db.dropDatabase();

db.createCollection("Article");
db.createCollection("Maze");
db.createCollection("Rating");
db.createCollection("User");
