import mongoose from "mongoose";

const emailTemplateSchema = new mongoose.Schema({
  name: String,  // Template name
  title: String,
  logo : String,
  content: String,
  footer: String,
 // htmlContent: String Complete HTML content of the template
});

export default mongoose.model("EmailTemplate", emailTemplateSchema);
