import express from "express";
import path from "path";
import favicon from "serve-favicon";

// Define Source
const app = express();
const port = 5000;
const __dirname = path.resolve();

// Declare Assets
app.use(express.static(__dirname + "/views"));
app.use("/data", express.static(__dirname + "/data"));
app.use(favicon(path.join(__dirname + "/favicon.ico")));

// Path Setup
app.get("/", (req, res) => {
  res.sendFile("./views/index.html", { root: __dirname });
});

app.get("/input", (req, res) => {
  res.sendFile("./views/inputs/test.html", { root: __dirname });
});

app.get("/input/pm", (req, res) => {
  res.sendFile("./views/inputs/pm/index.html", { root: __dirname });
});

app.get("/input/eng", (req, res) => {
  res.sendFile("./views/inputs/engineer/index.html", { root: __dirname });
});

// App Listen
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
