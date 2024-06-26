const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
dotenv.config();

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Configuración de CORS para permitir solo solicitudes desde tu frontend
const corsOptions = {
  origin: "https://julianroapalacio.vercel.app",
};

app.use(cors(corsOptions));

app.post("/contact", async (req, res) => {
  const { nombre, email, mensaje, asunto } = req.body;

  if ([nombre, email, mensaje, asunto].some(field => field.trim() === "")) {
    return res.status(401).json({
      msg: "Hay campos vacíos",
    });
  }

  if (mensaje.length <= 30) {
    return res.status(401).json({
      msg: "El mensaje debe incluir más de 30 caracteres",
    });
  }

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // Enviar el email
    await transport.sendMail({
      from: `"Portafolio" <${email}>`,
      to: process.env.EMAIL_MYEMAIL,
      subject: asunto,
      text: `Hola Julián, mi nombre es: ${nombre} si quieres contactarme mi correo es: ${email}. Motivo del mensaje: ${mensaje}`,
      html: `<p>Hola Julián</p> 
      <p>Mi nombre es: ${nombre}</p>
      <p>Si gustas contactarme, mi correo es: ${email}</p>
      <p>El motivo de mi mensaje es: ${mensaje}</p>
      `,
    });

    res.json("Correo enviado exitosamente");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({ error: "Ocurrió un error al enviar el correo" });
  }
});

module.exports = app;
