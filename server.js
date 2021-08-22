const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const PORT = 5000;
const methodOverride = require("method-override");

require("dotenv").config();

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo-app";

MongoClient.connect(dbConnectionStr, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    console.log(`connect to ${dbName} database`);
    db = client.db(dbName);
  })
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (request, response) => {
  try {
    const todoItems = await db.collection("todos").find().toArray();
    const itemsLeft = await db
      .collection("todos")
      .countDocuments({ completed: false });
    response.render("index.ejs", { items: todoItems, left: itemsLeft });
  } catch (err) {
    console.log(err);
  }
});

app.post("/addTodo", (request, response) => {
  db.collection("todos")
    .insertOne({ task: request.body.todoItem, completed: false })
    .then((result) => {
      console.log("Todo Added");
      response.redirect("/");
    })
    .catch((error) => console.error(error));
});

app.delete("/deleteItem", (request, response) => {
  db.collection("todos")
    .deleteOne({ task: request.body.task })
    .then((result) => {
      console.log(result);
      if (result.acknowledged && result.deletedCount > 0) {
        console.log("Todo Deleted");
        response.json("Todo Deleted");
      }
    })
    .catch((error) => console.error(error));
});

app.put("/markComplete", (request, response) => {
  db.collection("todos")
    .updateOne(
      { task: request.body.itemFromJS },
      {
        $set: {
          completed: true,
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch((error) => console.error(error));
});

app.put("/markIncomplete", (request, response) => {
  db.collection("todos")
    .updateOne(
      { task: request.body.itemFromJS },
      {
        $set: {
          completed: false,
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    .then((result) => {
      console.log("Marked Incomplete");
      response.json("Marked Incomplete");
    })
    .catch((error) => console.error(error));
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`listening on port ${PORT}`);
});
