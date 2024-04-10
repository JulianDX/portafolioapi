import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());
dotenv.config();

const port = process.env.PORT;

app.listen(port || 4000, () => {
  console.log("Server running on port 4000");
});

const dominiosPermitidos = [process.env.URL_FRONTEND];

const corsOptions = {
  origin: (origin, callback) => {
    if (dominiosPermitidos.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.post("/contact", async (req, res) => {
  const { nombre, email, mensaje, asunto } = req.body;

  if ([nombre, email, mensaje, asunto].includes("")) {
    return res.status(400).json({ error: "Hay campos vacíos" });
  }

  if(mensaje.length <=6 ){
    return res.status(400).json({ error: "El mensaje debe tener más de 6 caracteres" });
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
});

export default app;