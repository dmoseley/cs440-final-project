const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  express.json({
    type: ["application/json", "text/plain"]
  })
);

app.post("/", function(req, res) {
  const connection = mysql.createConnection({
    host: "classmysql.engr.oregonstate.edu",
    user: "cs440_group06",
    password: "VJVmCAmLMZDH",
    database: "cs440_group06"
  });

  connection.connect();

  let query = `SELECT * FROM ${req.body.dataset}`;

  if (req.body.dataset === "main") {
    query = `SELECT song, artist FROM musicbrain_song, musicbrain_artist WHERE musicbrain_song.id = musicbrain_artist.id`;
  }

  for (let i = 0; i < req.body.conditions.length; i++) {
    const condition = req.body.conditions[i];
    query += ` ${i === 0 && req.body.dataset !== "main" ? "WHERE " : "AND "}`;
    if (condition.is === "exact") {
      query += `${condition.attribute} = "${condition.value}"`;
    } else if (condition.is === "contains") {
      query += `${condition.attribute} LIKE %${condition.value}%`;
    } else if (condition.is === ">") {
      query += `${condition.attribute} > ${condition.value}`;
    } else if (condition.is === "<") {
      query += `${condition.attribute} < ${condition.value}`;
    } else if (condition.is === ">=") {
      query += `${condition.attribute} >= ${condition.value}`;
    } else if (condition.is === "<=") {
      query += `${condition.attribute} <= ${condition.value}`;
    }
  }

  connection.query(query, function(error, results, fields) {
    if (error) throw error;
    res.send({ results: results.slice(0, 25), totalResults: results.length });
  });

  connection.end();
});

app.listen(8080);

console.log("API Started.");
