const express = require("express");
const app = express();
const path = require("path");

app.set("port", process.env.PORT || 3000);

const viewsPath = path.join(__dirname, "views");
app.set("view engine", "ejs");
app.set("views", viewsPath);

app.get("/", function(req, res) {
  const userAgent = req.headers["user-agent"] || "none";
  if (req.accepts("html")) {
    res.render("index", { userAgent });
  } else {
    res.type("text");
    res.send(userAgent);
  }
});

app.listen(app.get("port"), function() {
  console.log("App started on Port " + app.get("port"));
});

module.exports = app;
