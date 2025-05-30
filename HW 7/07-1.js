import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

// Open a database
const db = new DB("blog.db");

// Create table if not exists with time field
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, time TEXT)");

// Initialize with some posts if empty
const count = db.query("SELECT COUNT(*) FROM posts")[0][0];
if (count === 0) {
  const now = new Date();
  const posts = [
    { 
      title: "First Post", 
      content: "This is my first post content", 
      time: now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0]
    },
    { 
      title: "Second Post", 
      content: "This is my second post content", 
      time: now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0]
    },
    { 
      title: "Third Post", 
      content: "This is my third post content", 
      time: now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0]
    }
  ];

  for (const post of posts) {
    db.query(
      "INSERT INTO posts (title, content, time) VALUES (?, ?, ?)",
      [post.title, post.content, post.time]
    );
  }
}

// HTML layout function
function layout(title, content) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          color: #333;
        }
        .post {
          margin-bottom: 20px;
          padding: 15px;
          border-bottom: 1px solid #ddd;
        }
        .post-title {
          font-size: 1.5em;
          margin-bottom: 5px;
        }
        .post-time {
          color: #666;
          font-size: 0.8em;
          margin-bottom: 10px;
        }
        .post-content {
          line-height: 1.5;
        }
        form {
          margin-top: 20px;
        }
        input, textarea {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
        }
        button {
          padding: 8px 16px;
          background-color: #4CAF50;
          color: white;
          border: none;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      ${content}
    </body>
  </html>
  `;
}

// List all posts
function listPosts() {
  let content = '<div class="posts">';
  
  for (const [id, title, postContent, time] of db.query("SELECT id, title, content, time FROM posts ORDER BY id DESC")) {
    content += `
      <div class="post">
        <div class="post-title">${title}</div>
        <div class="post-time">Posted on: ${time}</div>
        <div class="post-content">${postContent}</div>
      </div>
    `;
  }
  
  content += '</div>';
  content += `
    <form action="/post" method="post">
      <h2>Add New Post</h2>
      <input name="title" placeholder="Title" required>
      <textarea name="content" placeholder="Content" rows="5" required></textarea>
      <button type="submit">Submit</button>
    </form>
  `;
  
  return layout("Blog with Time", content);
}

// Create a new post
function newPostForm() {
  const content = `
    <form action="/post" method="post">
      <h2>Add New Post</h2>
      <input name="title" placeholder="Title" required>
      <textarea name="content" placeholder="Content" rows="5" required></textarea>
      <button type="submit">Submit</button>
    </form>
  `;
  
  return layout("New Post", content);
}

// Add a new post
function addPost(title, content) {
  const now = new Date();
  const time = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0];
  
  db.query(
    "INSERT INTO posts (title, content, time) VALUES (?, ?, ?)",
    [title, content, time]
  );
}

// Set up Oak application
const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = listPosts();
});

router.get("/new", (ctx) => {
  ctx.response.body = newPostForm();
});

router.post("/post", async (ctx) => {
  const body = ctx.request.body();
  if (body.type === "form") {
    const params = await body.value;
    const title = params.get("title");
    const content = params.get("content");
    
    if (title && content) {
      addPost(title, content);
      ctx.response.redirect("/");
    } else {
      ctx.response.body = "Title and content are required";
    }
  }
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Blog server running at http://localhost:8000");
await app.listen({ port: 8000 });
