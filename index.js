import express from "express";
import bodyParser from "body-parser";
import db from './database.js'

const app = express();
const port = 3000;

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  
];

app.get("/", async(req, res) => {
  try{
    const elements=await db.query("SELECT * FROM items ORDER BY id ASC")
    items=elements.rows

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  }catch(err){
    console.log(err)
  }
 
  
});

app.post("/add", async(req, res) => {  
  const item = req.body.newItem;

  try{
    await db.query("INSERT INTO items (items_list) VALUES ($1)",[
      item,
    ])
    items.push({ title: item });
  
    items.forEach(p=>{
      console.log(p.title)
    })
    res.redirect("/");

  }catch(err){
    console.log(err)
  }
  
});

app.post("/edit", async(req, res) => {
  const id=req.body["updatedItemId"]
  const editedtitle=req.body["updatedItemTitle"]
  await db.query("UPDATE items SET items_list=$1 WHERE id=$2",[editedtitle,id])
  

  try{
    const elements=await db.query("SELECT * FROM items ORDER BY id ASC")
    items=elements.rows

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  }catch(err){
    console.log(err)
  }
  
  
});

app.post("/delete",async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
