const registerGoogleService = require('../services/registerGoogleService');

const setDb = (databaseInstance) => {
    registerGoogleService.setDb(databaseInstance);
};

const googleSignUp = async (req, res) => {
    try {
        const result = await registerGoogleService.googleSignUp(req.body);
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
        res.status(error.status || 500).json({ success: false, message: error.message || 'Error interno del servidor al registrar con Google.' });
    }
};

module.exports = {
    googleSignUp, setDb
}; 