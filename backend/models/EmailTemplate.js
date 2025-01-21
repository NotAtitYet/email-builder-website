import mongoose from "mongoose";

const emailTemplateSchema = new mongoose.Schema({
  title: String,
  content: String,
  footer: String,
  imageUrls: [String],
});

export default mongoose.model("EmailTemplate", emailTemplateSchema);
