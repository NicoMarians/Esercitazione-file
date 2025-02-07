const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const uploadDirectory = path.join(__dirname, "files");

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, uploadDirectory);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).single("file");

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/files", express.static(uploadDirectory));

app.get("/filelist", (req, res) => {
    fs.readdir(uploadDirectory, (err, files) => {
        if (err) console.log(err);
        res.json(files);
    });
});

app.post("/upload", (req, res) => {
    upload(req, res, (err) => {
        console.log('File caricato:', req.file.filename);
        res.json({ url: "./files/" + req.file.filename });
    });
});

const server = http.createServer(app);
server.listen(5600, () => {
    console.log("Server running");
});
