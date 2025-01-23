import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import EmailTemplate from "../models/EmailTemplate.js";
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.get("/getSavedTemplates", async (req, res) => {
    try {
        const templates = await EmailTemplate.find();
        if (templates.length === 0) {
            return res.status(200).json({ message: "No saved templates found" });
        }
        res.status(200).json(templates);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch templates" });
    }
});

router.get("/getTemplateByName/:name", async (req, res) => {
    const { name } = req.params;
    try {
        const template = await EmailTemplate.findOne({ name });
        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }
        res.status(200).json(template);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch template" });
    }
});



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
    const { name, title, logo, content, footer } = req.body;
    // console.log(htmlContent);
    console.log(name);
    if (!name || !title || !logo || !content || !footer) {
        return res.status(400).json({ error: "Template name and content are required" });
    }

    try {
        const template = new EmailTemplate({ name, title, logo, content, footer });
        await template.save();
        res.status(201).json(template);
    } catch (err) {
        res.status(500).json({ error: "Failed to save email template" });
    }
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
