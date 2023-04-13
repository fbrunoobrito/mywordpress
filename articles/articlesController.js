const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");

router.get("/admin/articles", function (req, res) {
  Article.findAll({
    include: [{ model: Category }],
  }).then((articles) => {
    res.render("admin/articles/index", {
      articles: articles,
    });
  });
});

router.get("/admin/articles/new", function (req, res) {
  Category.findAll().then((categories) => {
    res.render("admin/articles/new", { categories: categories });
  });
});

router.post("/articles/save", (req, res) => {
  var title = req.body.title;
  var body = req.body.body;
  var category = req.body.category;

  Article.create({
    title,
    slug: slugify(title).toLowerCase(),
    body,
    categoryId: category,
  }).then(() => {
    res.redirect("/admin/articles");
  });
});

router.post("/articles/delete", (req, res) => {
  var id = req.body.id;

  if (id != undefined) {
    if (!isNaN(id)) {
      Article.destroy({
        where: {
          id,
        },
      }).then(() => {
        res.redirect("/admin/articles");
      });
    } else {
      // Se NÃO for um Numero
      res.redirect("/admin/articles");
    }
  } else {
    //Se o ID for Null
    res.redirect("/admin/articles");
  }
});

router.get("/admin/articles/edit/:id", (req, res) => {
  var id = req.params.id;

  if (isNaN(id)) {
    res.redirect("/admin/articles");
  }

  Article.findByPk(id)
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categories) => {
          res.render("admin/articles/edit", {
            article,
            categories,
          });
        });
      } else {
        res.redirect("/admin/articles");
      }
    })
    .catch((erro) => {
      res.redirect("/admin/articles");
    });
});

router.post("/articles/update", (req, res) => {
  var id = req.body.id;
  var title = req.body.title;
  var body = req.body.body;
  var category = req.body.category;

  Article.update(
    { title, slug: slugify(title).toLowerCase(), body, categoryId: category },
    {
      where: {
        id: id,
      },
    }
  ).then(() => {
    res.redirect("/admin/articles");
  });
});

router.get("/articles/page/:num", (req, res) => {
  const page = req.params.num;
  var offset = 0;
  var limit = 4;

  if (isNaN(page) || page <= 1) {
    offset = 0;
  } else {
    offset = (parseInt(page) - 1) * 4;
  }

  Article.findAndCountAll({
    limit,
    offset,
    order: [["id", "DESC"]],
  }).then((articles) => {
    var next;

    if (offset + limit >= articles.count) {
      next = false;
    } else {
      next = true;
    }

    var result = {
      page: parseInt(page),
      next: next,
      articles: articles,
    };

    Category.findAll().then((categories) => {
      res.render("admin/articles/page", {
        result: result,
        categories: categories,
      });
    });
  });
});

module.exports = router;
