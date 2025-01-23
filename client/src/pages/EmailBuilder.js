import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Autoformat,
  AutoImage,
  Autosave,
  BlockQuote,
  Bold,
  CloudServices,
  Code,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  Strikethrough,
  Subscript,
  Superscript,
  TextTransformation,
  Underline
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import "./EmailBuilder.css";

const EmailBuilder = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [footer, setFooter] = useState("");
  // const [images, setImages] = useState([]);
  const [layout, setLayout] = useState("");
  const [logoBase64, setLogoBase64] = useState("");
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateName, setTemplateName] = useState("");
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [showFetchSavedTemplates, setShowFetchSavedTemplates] = useState(false);
  const [isLayoutReady, setIsLayoutReady] = useState(false);


  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const LICENSE_KEY = process.env.REACT_APP_CKeditor_licence_key;

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  const { editorConfig } = useMemo(() => {
    if (!isLayoutReady) {
      return {};
    }

    return {
      editorConfig: {
        toolbar: {
          items: [
            'heading',
            '|',
            'fontSize',
            'fontFamily',
            'fontColor',
            'fontBackgroundColor',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'subscript',
            'superscript',
            'code',
            'removeFormat',
            '|',
            'link',
            'mediaEmbed',
            'highlight',
            'blockQuote',
            '|',
            'outdent',
            'indent'
          ],
          shouldNotGroupWhenFull: false
        },
        plugins: [
          Autoformat,
          AutoImage,
          Autosave,
          BlockQuote,
          Bold,
          CloudServices,
          Code,
          Essentials,
          FontBackgroundColor,
          FontColor,
          FontFamily,
          FontSize,
          Heading,
          Highlight,
          ImageBlock,
          ImageCaption,
          ImageInline,
          ImageInsertViaUrl,
          ImageResize,
          ImageStyle,
          ImageTextAlternative,
          ImageToolbar,
          ImageUpload,
          Indent,
          IndentBlock,
          Italic,
          Link,
          LinkImage,
          MediaEmbed,
          Paragraph,
          PasteFromOffice,
          RemoveFormat,
          Strikethrough,
          Subscript,
          Superscript,
          TextTransformation,
          Underline
        ],
        fontFamily: {
          supportAllValues: true
        },
        fontSize: {
          options: [10, 12, 14, 'default', 18, 20, 22],
          supportAllValues: true
        },
        heading: {
          options: [
            {
              model: 'paragraph',
              title: 'Paragraph',
              class: 'ck-heading_paragraph'
            },
            {
              model: 'heading1',
              view: 'h1',
              title: 'Heading 1',
              class: 'ck-heading_heading1'
            },
            {
              model: 'heading2',
              view: 'h2',
              title: 'Heading 2',
              class: 'ck-heading_heading2'
            },
            {
              model: 'heading3',
              view: 'h3',
              title: 'Heading 3',
              class: 'ck-heading_heading3'
            },
            {
              model: 'heading4',
              view: 'h4',
              title: 'Heading 4',
              class: 'ck-heading_heading4'
            },
            {
              model: 'heading5',
              view: 'h5',
              title: 'Heading 5',
              class: 'ck-heading_heading5'
            },
            {
              model: 'heading6',
              view: 'h6',
              title: 'Heading 6',
              class: 'ck-heading_heading6'
            }
          ]
        },
        image: {
          toolbar: [
            'toggleImageCaption',
            'imageTextAlternative',
            '|',
            'imageStyle:inline',
            'imageStyle:wrapText',
            'imageStyle:breakText',
            '|',
            'resizeImage'
          ]
        },
        initialData:
          'Initial content',
        licenseKey: LICENSE_KEY,
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: 'https://',
          decorators: {
            toggleDownloadable: {
              mode: 'manual',
              label: 'Downloadable',
              attributes: {
                download: 'file'
              }
            }
          }
        },
        placeholder: 'Type or paste your content here!'
      }
    };
  }, [isLayoutReady, LICENSE_KEY]);


  // Fetch the email layout from the backend
  const fetchLayout = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/email/getEmailLayout");
      setLayout(response.data);
      setShowFetchSavedTemplates(true);
    } catch (error) {
      console.error("Error fetching layout:", error);
    }
  };

  // Fetch saved email Templates
  const fetchSavedTemplates = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/email/getSavedTemplates");
      if (response.data.message) {
        console.log(response.data.message);
      } else {
        setSavedTemplates(response.data);
      }
    } catch (error) {
      console.error("Error fetching saved templates:", error);
    }
  };


  // Load selected template
  const loadTemplate = async (template) => {
    // try {
    //   const response = await axios.get(`http://localhost:8000/api/email/getTemplateByName/${name}`);
    //   if (response.data.htmlContent) {
    //     setContent(response.data.htmlContent);
    //   }
    // } catch (error) {
    //   console.error("Error loading template:", error);
    // }
    const updatedLayout = layout
      .replace("{{logo}}", template.logo || "")
      .replace("{{title}}", template.title || "")
      .replace("{{content}}", template.content || "")
      .replace("{{footer}}", template.footer || "");
    setSelectedTemplate(template); // Set the selected template
    setLayout(updatedLayout);
  };

  // Update the layout dynamically
  const updateLayout = () => {
    let updatedLayout = layout;
    updatedLayout = updatedLayout.replace("{{title}}", title || "Default Title");
    updatedLayout = updatedLayout.replace("{{content}}", content || "Default Content");
    updatedLayout = updatedLayout.replace("{{footer}}", footer || "Default Footer");

    // Replace images dynamically
    // if (images.length > 0) {
    //   const imageTags = images
    //     .map((img) => `<img src="${img}" alt="Uploaded Image" style="width: 100%; max-width: 500px;"/>`)
    //     .join("");
    //   updatedLayout = updatedLayout.replace("{{images}}", imageTags);
    // } else {
    //   updatedLayout = updatedLayout.replace("{{images}}", "");
    // }



    if (logoBase64) {
      // console.log(logoBase64);
      updatedLayout = updatedLayout.replace(
        "{{logo}}",
        `${logoBase64}`
      );
    } else {
      updatedLayout = updatedLayout.replace(
        "{{logo}}",
        '<img src="placeholder-logo.png" alt="Logo" style="width: 150px; height: auto;" />'
      );
    }


    return updatedLayout;
  };

  // Handle file upload
  // const handleImageUpload = async (files) => {
  //   const formData = new FormData();
  //   formData.append("image", files[0]);

  //   try {
  //     const response = await axios.post("http://localhost:8000/api/email/uploadImage", formData);
  //     setImages([...images, response.data.imageUrl]);
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //   }
  // };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setLogoBase64(reader.result); // Store Base64 string for the logo
        // console.log(logoBase64);
      };

      reader.onerror = () => {
        console.error("Error reading file.");
      };

      reader.readAsDataURL(file); // Convert file to Base64 string
    }
  };

  // Save template to database 
  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      alert("Please provide a name for the template.");
      return;
    }
    // const htmlContent = updateLayout();
    let template = {
      name: templateName,
      title: title,
      logo: logoBase64,
      content: content,
      footer: footer
    }
    try {
      // console.log(htmlContent);
      const response = await axios.post("http://localhost:8000/api/email/uploadEmailConfig", {
        name: templateName,
        title: title,
        logo: logoBase64,
        content: content,
        footer: footer
      });
      console.log("Template saved:", response.data);
      setTemplateName("");
      setShowSavePrompt(false);
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };
  const handleOpenSavePrompt = () => {
    setShowSavePrompt(true); // Show the save prompt
  };
  const handleCloseSavePrompt = () => {
    setShowSavePrompt(false); // Hide the save prompt
  };
  // Download the modified HTML
  const downloadModifiedHTML = () => {
    const element = document.createElement("a");
    const file = new Blob([updateLayout()], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = "email-template.html";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Email Builder</h1>
      <button onClick={fetchLayout}>Load Layout</button>
      {showFetchSavedTemplates && (<button onClick={fetchSavedTemplates}>Fetch Saved Templates</button>)}
      {savedTemplates.length > 0 && (
        <div>
          <h3>Saved Templates</h3>
          <ul>
            {savedTemplates.map((template, index) => (
              <li key={index}>
                <button onClick={() => loadTemplate(template)}>{template.name}</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div dangerouslySetInnerHTML={{ __html: updateLayout() }}></div>
      <div>
        <h3>Title</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter email title"
        />
      </div>
      <div>
        <h3>Content</h3>
        <div className="main-container">
          <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
            <div className="editor-container__editor">
              <div ref={editorRef}>{editorConfig && <CKEditor editor={ClassicEditor} config={editorConfig} data={content} onChange={(event, editor) => {
                const data = editor.getData();
                setContent(data);
              }} />}</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3>Footer</h3>
        <input
          type="text"
          value={footer}
          onChange={(e) => setFooter(e.target.value)}
          placeholder="Enter footer text"
        />
      </div>
      <div>
        <h3>Upload Logo</h3>
        <input type="file" onChange={handleLogoUpload} accept="image/*" />
        {/* <ul>
          {images.map((img, index) => (
            <li key={index}>
              <img src={img} alt={`Uploaded ${index}`} width="100" />
            </li>
          ))}
        </ul> */}
      </div>
      <div>
        <button onClick={downloadModifiedHTML}>Download Template</button>
        <button onClick={handleOpenSavePrompt}>Save Template</button>
        {/* Save Template Prompt */}
        {showSavePrompt && (
          <div className="save-prompt">
            <h3>Save Template</h3>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
            />
            <div>
              <button onClick={handleSaveTemplate}>Save</button>
              <button onClick={handleCloseSavePrompt}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailBuilder;
