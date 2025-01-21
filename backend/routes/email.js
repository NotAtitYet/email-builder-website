import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import EmailTemplate from "../models/EmailTemplate.js";
import {dirname} from 'path';


const __filename=fileURLToPath(import.meta.url);
const __dirname=dirname(__filename);

const router = express.Router();


router.get("/getEmailLayout", (req, res) => {
    const filePath = path.join(__dirname, "../views/layout.html");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) return res.status(500).send("Error reading layout file");
        res.send(data);
    });
    // res.status(200).json({ message: 'Ping received! getEmailLayout is working!' });

});

// const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/uploadImage", upload.single("image"), (req, res) => {
// router.post("/uploadImage", (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded");
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
    // res.status(200).json({ message: 'Ping received! upload image is working!' });
});


router.post("/uploadEmailConfig", async (req, res) => {
    try {
        const template = new EmailTemplate(req.body);
        await template.save();
        res.status(201).json(template);
    } catch (err) {
        res.status(500).json({ error: "Failed to save email template" });
    }
    // res.status(200).json({ message: 'Ping received! upload email config is working!' });
});
router.post("/renderAndDownloadTemplate", (req, res) => {
    const { title, content, footer, imageUrls } = req.body;

    res.render("layout", { title, content, footer, imageUrls }, (err, html) => {
        if (err) return res.status(500).send("Error rendering template");
        res.setHeader("Content-Disposition", "attachment; filename=email-template.html");
        res.send(html);
    });
    // res.status(200).json({ message: 'Ping received!Render and download is working!' });
});

export default router;
