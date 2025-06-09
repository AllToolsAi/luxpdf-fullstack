// server.js
const express = require("express");
const app = express();
app.get("/api/data", (req, res) => res.json({ data: "From Express" }));
app.listen(3001, () => console.log("Express running on 3001"));