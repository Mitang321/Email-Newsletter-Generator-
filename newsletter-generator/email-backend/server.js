const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;

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

app.post("/send-email", (req, res) => {
  const { email, content } = req.body;

  const mailOptions = {
    from: "mitang@freelance.mailtrap.io",
    to: email,
    subject: "Newsletter",
    html: content,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Error sending email");
    }
    res.send("Email sent: " + info.response);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
