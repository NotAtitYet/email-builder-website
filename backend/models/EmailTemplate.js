import mongoose from "mongoose";

const emailTemplateSchema = new mongoose.Schema({
  title: String,
  content: String,
  footer: String,
  imageUrls: [String],
});

module.exports = mongoose.model("EmailTemplate", emailTemplateSchema);
