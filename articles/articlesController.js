const express = require("express");
const router = express.Router();

router.get("/articles", function (req, res) {
  res.send("Aqui Artigos");
});

router.get("/admin/articles/new", function (req, res) {
  res.send("Aqui Artigos");
});

module.exports = router;
