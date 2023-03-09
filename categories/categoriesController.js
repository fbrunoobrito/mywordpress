const express = require("express");
const router = express.Router();

router.get("/categories", function (req, res) {
  res.send("Aqui categorias");
});

router.get("/admin/categories/new", function (req, res) {
  res.send("Aqui categorias");
});

module.exports = router;
