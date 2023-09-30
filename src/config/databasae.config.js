import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
const app = express();
dotenv.config();
const db = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
});

app.get("/", (req, res) => {
  const sql = "SELECT * FROM ddf_cosmetic.admin";
  db.query(sql, (err, data) => {
    if (err) return res.json("error");
    return res.json(data);
  });
});

app.listen(8081, () => {
  console.log("listening on port ");
});
