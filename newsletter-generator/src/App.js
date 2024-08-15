import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Form,
  Button,
  Alert,
  Modal,
  ListGroup,
  InputGroup,
  FormControl,
  Tabs,
  Tab,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Editor } from "@tinymce/tinymce-react";

function App() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [template, setTemplate] = useState("welcome");
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [templates, setTemplates] = useState([
    {
      id: "welcome",
      category: "Default",
      content: `<h1>Welcome to our service!</h1><p>Thank you for joining us.</p>`,
    },
    {
      id: "promotion",
      category: "Promotion",
      content: `<h1>Special Promotion!</h1><p>Check out our latest offers.</p>`,
    },
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateContent, setNewTemplateContent] = useState("");
  const [newTemplateCategory, setNewTemplateCategory] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [templateCategories, setTemplateCategories] = useState([
    "Default",
    "Promotion",
    "News",
    "Updates",
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/send-email", {
        email,
        subject,
        template,
      });
      setMessage(response.data);
      setShowPreview(false);
    } catch (err) {
      setError(
        err.response ? err.response.data.errors[0].msg : "Error sending email"
      );
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleShowTemplateModal = () => {
    setShowTemplateModal(true);
  };

  const handleCloseTemplateModal = () => {
    setShowTemplateModal(false);
  };

  const handleShowEditModal = (templateId) => {
    const templateToEdit = templates.find((t) => t.id === templateId);
    setSelectedTemplate(templateToEdit);
    setNewTemplateName(templateToEdit.id);
    setNewTemplateContent(templateToEdit.content);
    setNewTemplateCategory(templateToEdit.category);
    setEditorContent(templateToEdit.content);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleAddTemplate = () => {
    if (!newTemplateName || !newTemplateContent || !newTemplateCategory) return;

    if (templates.find((t) => t.id === newTemplateName)) {
      alert("Template name already exists");
      return;
    }

    setTemplates([
      ...templates,
      {
        id: newTemplateName,
        content: newTemplateContent,
        category: newTemplateCategory,
      },
    ]);
    setNewTemplateName("");
    setNewTemplateContent("");
    setNewTemplateCategory("");
    setShowTemplateModal(false);
  };

  const handleEditTemplate = () => {
    if (!newTemplateName || !newTemplateContent || !newTemplateCategory) return;

    setTemplates(
      templates.map((t) =>
        t.id === selectedTemplate.id
          ? {
              ...t,
              id: newTemplateName,
              content: editorContent,
              category: newTemplateCategory,
            }
          : t
      )
    );
    setSelectedTemplate(null);
    setNewTemplateName("");
    setNewTemplateContent("");
    setNewTemplateCategory("");
    setEditorContent("");
    setShowEditModal(false);
  };

  const handleTemplateClick = (selectedTemplate) => {
    setTemplate(selectedTemplate.id);
    setShowTemplateModal(false);
  };

  const previewContent =
    templates.find((t) => t.id === template)?.content || "";

  return (
    <Container>
      <h1 className="my-4">Email Newsletter Generator</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter recipient email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="subject" className="mt-3">
          <Form.Label>Subject</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="template" className="mt-3">
          <Form.Label>Template</Form.Label>
          <Form.Control
            as="select"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            required
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.id.charAt(0).toUpperCase() + t.id.slice(1)}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className="mt-3"
          onClick={handlePreview}
        >
          Preview and Send
        </Button>
        <Button
          variant="secondary"
          className="mt-3 ms-2"
          onClick={handleShowTemplateModal}
        >
          Manage Templates
        </Button>
      </Form>

      {message && (
        <Alert variant="success" className="mt-4">
          {message}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" className="mt-4">
          {error}
        </Alert>
      )}

      <Modal show={showPreview} onHide={handleClosePreview}>
        <Modal.Header closeButton>
          <Modal.Title>Email Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{ __html: previewContent }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePreview}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Send Email
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showTemplateModal} onHide={handleCloseTemplateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Manage Templates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="all" id="template-tabs" className="mb-3">
            <Tab eventKey="all" title="All Templates">
              <ListGroup>
                {templates.map((t) => (
                  <ListGroup.Item
                    key={t.id}
                    action
                    onClick={() => handleShowEditModal(t.id)}
                  >
                    {t.id.charAt(0).toUpperCase() + t.id.slice(1)}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Tab>
            <Tab eventKey="categories" title="Categories">
              <ListGroup>
                {templateCategories.map((category) => (
                  <ListGroup.Item key={category}>
                    <strong>{category}</strong>
                    <ListGroup>
                      {templates
                        .filter((t) => t.category === category)
                        .map((t) => (
                          <ListGroup.Item
                            key={t.id}
                            action
                            onClick={() => handleShowEditModal(t.id)}
                          >
                            {t.id.charAt(0).toUpperCase() + t.id.slice(1)}
                          </ListGroup.Item>
                        ))}
                    </ListGroup>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Tab>
          </Tabs>
          <Form.Group className="mt-3">
            <Form.Label>New Template Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter template name"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>New Template Category</Form.Label>
            <Form.Control
              as="select"
              value={newTemplateCategory}
              onChange={(e) => setNewTemplateCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {templateCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>New Template Content</Form.Label>
            <Editor
              apiKey="bn1csqrawrknlxp3a5fh7v9b7oufk8nhl69mh5iix0ibtjsx"
              value={editorContent}
              init={{
                height: 300,
                menubar: false,
                plugins: "link image code",
                toolbar:
                  "undo redo | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | removeformat | help",
              }}
              onEditorChange={(content) => setEditorContent(content)}
            />
          </Form.Group>
          <Button
            variant="primary"
            className="mt-3"
            onClick={handleAddTemplate}
          >
            Add Template
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTemplateModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Template Name</Form.Label>
            <Form.Control
              type="text"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Template Category</Form.Label>
            <Form.Control
              as="select"
              value={newTemplateCategory}
              onChange={(e) => setNewTemplateCategory(e.target.value)}
            >
              {templateCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Template Content</Form.Label>
            <Editor
              apiKey="bn1csqrawrknlxp3a5fh7v9b7oufk8nhl69mh5iix0ibtjsx"
              value={editorContent}
              init={{
                height: 300,
                menubar: false,
                plugins: "link image code",
                toolbar:
                  "undo redo | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | removeformat | help",
              }}
              onEditorChange={(content) => setEditorContent(content)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditTemplate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default App;
