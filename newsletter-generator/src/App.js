import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Form,
  Button,
  Alert,
  Modal,
  ListGroup,
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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginEmail === "admin@gmail.com" && loginPassword === "admin123") {
      setIsLoggedIn(true);
    } else {
      setError("Invalid email or password");
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginEmail("");
    setLoginPassword("");
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

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
    if (!newTemplateName || !editorContent || !newTemplateCategory) return;

    if (templates.find((t) => t.id === newTemplateName)) {
      alert("Template name already exists");
      return;
    }

    setTemplates([
      ...templates,
      {
        id: newTemplateName,
        content: editorContent,
        category: newTemplateCategory,
      },
    ]);
    setNewTemplateName("");
    setNewTemplateContent("");
    setNewTemplateCategory("");
    setEditorContent("");
    setShowTemplateModal(false);
  };

  const handleEditTemplate = () => {
    if (!newTemplateName || !editorContent || !newTemplateCategory) return;

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
      {!isLoggedIn ? (
        <div>
          <h1 className="my-4">{isSignUp ? "Sign Up" : "Login"}</h1>
          <Form onSubmit={isSignUp ? handleSignUp : handleLogin}>
            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={isSignUp ? signupEmail : loginEmail}
                onChange={(e) =>
                  isSignUp
                    ? setSignupEmail(e.target.value)
                    : setLoginEmail(e.target.value)
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="password" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={isSignUp ? signupPassword : loginPassword}
                onChange={(e) =>
                  isSignUp
                    ? setSignupPassword(e.target.value)
                    : setLoginPassword(e.target.value)
                }
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              {isSignUp ? "Sign Up" : "Login"}
            </Button>
            <Button
              variant="secondary"
              className="mt-3 ms-2"
              onClick={toggleSignUp}
            >
              {isSignUp ? "Switch to Login" : "Switch to Sign Up"}
            </Button>
          </Form>
          {error && (
            <Alert variant="danger" className="mt-4">
              {error}
            </Alert>
          )}
        </div>
      ) : (
        <div>
          <Button variant="danger" className="mt-4 mb-4" onClick={handleLogout}>
            Logout
          </Button>
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
              type="button"
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
        </div>
      )}

      <Modal show={showPreview} onHide={handleClosePreview}>
        <Modal.Header closeButton>
          <Modal.Title>Preview Email</Modal.Title>
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
          <ListGroup>
            {templates.map((template) => (
              <ListGroup.Item
                key={template.id}
                action
                onClick={() => handleTemplateClick(template)}
              >
                {template.id.charAt(0).toUpperCase() + template.id.slice(1)}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Button
            variant="primary"
            className="mt-3"
            onClick={() => setShowEditModal(true)}
          >
            Add/Edit Template
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
          <Modal.Title>
            {selectedTemplate ? "Edit Template" : "Add New Template"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="templateName">
            <Form.Label>Template Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter template name"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="templateCategory" className="mt-3">
            <Form.Label>Template Category</Form.Label>
            <Form.Control
              as="select"
              value={newTemplateCategory}
              onChange={(e) => setNewTemplateCategory(e.target.value)}
              required
            >
              {templateCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="templateContent" className="mt-3">
            <Form.Label>Template Content</Form.Label>
            <Editor
              apiKey="bn1csqrawrknlxp3a5fh7v9b7oufk8nhl69mh5iix0ibtjsx"
              value={editorContent}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help",
              }}
              onEditorChange={(content) => setEditorContent(content)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={selectedTemplate ? handleEditTemplate : handleAddTemplate}
          >
            {selectedTemplate ? "Save Changes" : "Add Template"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default App;
