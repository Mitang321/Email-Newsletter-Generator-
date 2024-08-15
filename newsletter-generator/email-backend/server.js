const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const { check, validationResult } = require("express-validator");

const app = express();
const port = 2525;

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "847ab92d20d2db",
    pass: "d2e590c4aeae1a",
  },
});

app.post(
  "/send-email",
  [
    check("email").isEmail().withMessage("Invalid email address"),
    check("template").notEmpty().withMessage("Template must be selected"),
    check("subject").notEmpty().withMessage("Email subject cannot be empty"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, subject, template } = req.body;
    let content;

    switch (template) {
      case "welcome":
        content = `<h1>Welcome to our service!</h1><p>Thank you for joining us.</p>`;
        break;
      case "promotion":
        content = `<h1>Special Promotion!</h1><p>Check out our latest offers.</p>`;
        break;
      default:
        content = `<h1>Default Template</h1><p>This is a default email template.</p>`;
    }

    const mailOptions = {
      from: "from@example.com",
      to: email,
      subject: subject || "Default Subject",
      html: content,
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
