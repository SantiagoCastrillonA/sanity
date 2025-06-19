const loginGoogleService = require('../services/loginGoogleService');

const setDb = (databaseInstance) => {
    loginGoogleService.setDb(databaseInstance);
};
/**
 * Maneja el inicio de sesión/registro con Google.
 * Recibe el ID Token del frontend, lo verifica y procesa el usuario.
 */
const googleSignIn = async (req, res) => {
    try {
        const result = await loginGoogleService.googleSignIn(req.body);
        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000,
        });
        res.status(200).json({
            success: true,
            message: 'Operación exitosa.',
            user: result.user
        });
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message || 'Error interno del servidor al autenticar con Google.' });
    }
};

module.exports = {
    googleSignIn, setDb,
};