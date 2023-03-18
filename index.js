const express = require("express");
const app = express();
const port = 8080;
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");

const bodyParser = require("body-parser");
const connection = require("./database/database");

//View engine
app.set("view engine", "ejs");

//Static assets
app.use(express.static("public"));

//Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Database
connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com sucesso!");
  })
  .catch((error) => {
    console.log(error);
  });

app.get("/", (req, res) => {
  Article.findAll().then((articles) => {
    res.render("index", { articles });
  });
});

app.get("/:slug", (req, res) => {
  const slug = req.params.slug;

  Article.findOne({
    where: { slug },
  })
    .then((article) => {
      if (slug == article.slug) {
        res.render("article", { article });
      } else {
        res.redirect("/");
      }
    })
    .catch((error) => {
      res.redirect("/");
    });
});

app.use("/", categoriesController);
app.use("/", articlesController);

app.listen(port, () => {
  console.log(`Servidor Rodando no: http://localhost:${port}`);
});
