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

  let query = `SELECT DISTINCT * FROM ${req.body.dataset}`;

  if (req.body.dataset === "main") {
    if (req.body.conditions.length > 1) {
      query = `SELECT DISTINCT musicbrain_song.song, musicbrain_artist.artist FROM musicbrain_song, musicbrain_artist WHERE musicbrain_song.id = musicbrain_artist.num_id`;
    } else if (req.body.conditions.length === 1) {
      if (req.body.conditions[0].attribute === "song") {
        query = `SELECT DISTINCT musicbrain_song.song FROM musicbrain_song`;
      } else if (req.body.conditions[0].attribute === "artist") {
        query = `SELECT DISTINCT musicbrain_artist.artist FROM musicbrain_artist`;
      }
    }
    for (let i = 0; i < req.body.conditions.length; i++) {
      const condition = req.body.conditions[i];
      query += ` ${
        i === 0 && req.body.conditions.length === 1 ? "WHERE" : "AND"
      } `;
      if (condition.is === "exact") {
        if (condition.attribute === "song") {
          query += `UPPER(musicbrain_song.song) = UPPER("${condition.value}")`;
        } else if (condition.attribute === "artist") {
          query += `UPPER(musicbrain_artist.artist) = UPPER("${condition.value}")`;
        }
      } else if (condition.is === "contains") {
        if (condition.attribute === "song") {
          query += `UPPER(musicbrain_song.song) LIKE UPPER("%${condition.value}%")`;
        } else if (condition.attribute === "artist") {
          query += `UPPER(musicbrain_artist.artist) LIKE UPPER("%${condition.value}%")`;
        }
      }
    }
  } else {
    for (let i = 0; i < req.body.conditions.length; i++) {
      const condition = req.body.conditions[i];
      query += ` ${i === 0 ? "WHERE " : "AND "}`;
      if (condition.is === "exact") {
        query += `UPPER(${condition.attribute}) = UPPER("${condition.value}")`;
      } else if (condition.is === "contains") {
        query += `UPPER(${condition.attribute}) LIKE UPPER("%${condition.value}%")`;
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
  }

  console.log(query);

  connection.query(query, function(error, results, fields) {
    if (error) throw error;
    console.log(results);
    res.send({ results: results.slice(0, 25), totalResults: results.length });
  });

  connection.end();
});

app.listen(8080);

console.log("API Started.");
