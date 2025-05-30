import { DB } from "https://deno.land/x/sqlite/mod.ts";

// Open a database
const db = new DB("test.db");

// Create table if not exists
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, time TEXT, body TEXT)");

// Data to be inserted
const data = [
  { title: "First Post", time: "2025-05-19", body: "This is my first post content" },
  { title: "Second Post", time: "2025-05-18", body: "This is my second post content" },
  { title: "Third Post", time: "2025-05-17", body: "This is my third post content" }
];

// Insert data into the database
for (const post of data) {
  db.query(
    "INSERT INTO posts (title, time, body) VALUES (?, ?, ?)",
    [post.title, post.time, post.body]
  );
}

// Query and display all posts
for (const [id, title, time, body] of db.query("SELECT id, title, time, body FROM posts")) {
  console.log(`ID: ${id}, Title: ${title}, Time: ${time}, Body: ${body}`);
}

// Close connection
db.close();
