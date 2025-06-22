const nodemailer = require('nodemailer');

let dbInstance;

const setDb = (database) => {
  dbInstance = database;
};

// Configurar transporter de email
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || '', // gmail, outlook, etc.
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASSWORD || '',
    },
  });
};

const sendVerificationEmail = async (email, verificationToken, username = null) => {
  try {
    const transporter = createTransporter();
    
    // URL de verificación
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verifica tu cuenta - Sanity',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">¡Bienvenido a Sanity!</h2>
          <p>Hola ${username ? `<strong>${username}</strong>` : ''},</p>
          <p>Gracias por registrarte en nuestra plataforma. Para completar tu registro, necesitas verificar tu dirección de email.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verificar Email
            </a>
          </div>
          
          <p>O copia y pega este enlace en tu navegador:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          
          <p>Este enlace expirará en 24 horas por seguridad.</p>
          
          <p>Si no creaste esta cuenta, puedes ignorar este email.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            Este es un email automático, por favor no respondas a este mensaje.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email de verificación enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error enviando email de verificación:', error);
    throw new Error('Error al enviar email de verificación');
  }
};

const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Restablecer Contraseña - Sanity',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Restablecer Contraseña</h2>
          <p>Has solicitado restablecer tu contraseña.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Restablecer Contraseña
            </a>
          </div>
          
          <p>O copia y pega este enlace en tu navegador:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          
          <p>Este enlace expirará en 1 hora por seguridad.</p>
          
          <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este email.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            Este es un email automático, por favor no respondas a este mensaje.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email de restablecimiento enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error enviando email de restablecimiento:', error);
    throw new Error('Error al enviar email de restablecimiento');
  }
};

module.exports = { 
  sendVerificationEmail, 
  sendPasswordResetEmail, 
  setDb 
}; 