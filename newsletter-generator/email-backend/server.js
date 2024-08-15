const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const { check, validationResult } = require("express-validator");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const users = [
  { username: "admin@gmail.com", password: "admin123", isAdmin: true },
];

const templates = [
  {
    id: 1,
    name: "welcome",
    content: "<h1>Welcome to our service!</h1><p>Thank you for joining us.</p>",
  },
  {
    id: 2,
    name: "promotion",
    content: "<h1>Special Promotion!</h1><p>Check out our latest offers.</p>",
  },
];

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    res.json({ message: "Login successful", isAdmin: user.isAdmin });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.post(
  "/send-email",
  [
    check("email").isEmail().withMessage("Invalid email address"),
    check("subject").notEmpty().withMessage("Email subject cannot be empty"),
    check("templateId").notEmpty().withMessage("Template must be selected"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, subject, templateId } = req.body;
    const template = templates.find((t) => t.id === parseInt(templateId));

    if (!template) {
      return res.status(400).send("Template not found");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "847ab92d20d2db",
        pass: "d2e590c4aeae1a",
      },
    });

    const mailOptions = {
      from: "mitang@freelance.mailtrap.io",
      to: email,
      subject: subject,
      html: template.content,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).send("Error sending email");
      }
      res.send("Email sent: " + info.response);
    });
  }
);

app.get("/templates", (req, res) => {
  res.json(templates);
});

app.post("/templates", (req, res) => {
  const { name, content } = req.body;
  const newTemplate = { id: templates.length + 1, name, content };
  templates.push(newTemplate);
  res.json(newTemplate);
});

app.put("/templates/:id", (req, res) => {
  const { id } = req.params;
  const { name, content } = req.body;
  const template = templates.find((t) => t.id === parseInt(id));

  if (!template) {
    return res.status(404).send("Template not found");
  }

  template.name = name;
  template.content = content;
  res.json(template);
});

app.delete("/templates/:id", (req, res) => {
  const { id } = req.params;
  const templateIndex = templates.findIndex((t) => t.id === parseInt(id));

  if (templateIndex === -1) {
    return res.status(404).send("Template not found");
  }

  templates.splice(templateIndex, 1);
  res.send("Template deleted");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
