const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
let dbInstance;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const setDb = (databaseInstance) => {
    dbInstance = databaseInstance;
};

const googleSignUp = async ({ idToken, accountType, full_name, servicios_especialistas, NC_profesional, certificados, experiencia_laboral }) => {
    if (!dbInstance || !dbInstance.User) {
        const error = new Error('El servidor no está completamente inicializado.');
        error.status = 500;
        throw error;
    }
    if (!idToken) {
        const error = new Error('No se proporcionó token de Google.');
        error.status = 400;
        throw error;
    }
    if (!accountType || !['Usuario', 'Profesional'].includes(accountType)) {
        const error = new Error('Tipo de cuenta no válido. Debe ser "Usuario" o "Profesional".');
        error.status = 400;
        throw error;
    }
    if (!full_name) {
        const error = new Error('No se proporcionó el nombre completo.');
        error.status = 400;
        throw error;
    }
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleId = payload['sub'];
    const email = payload['email'];
    let pictureUrl = payload['picture'];
    const emailVerified = payload['email_verified'];
    if (pictureUrl && pictureUrl.includes('googleusercontent.com')) {
        pictureUrl = pictureUrl.split('=')[0];
    }
    if (!emailVerified) {
        const error = new Error('El correo electrónico de Google no está verificado.');
        error.status = 400;
        throw error;
    }
    const existingUser = await dbInstance.User.findOne({ where: { email } });
    if (existingUser) {
        const error = new Error('El correo ya está registrado. Por favor, inicie sesión.');
        error.status = 400;
        throw error;
    }

    console.log("Creando usuario con Google - Datos recibidos:", {
        googleId,
        email,
        full_name,
        accountType,
        pictureUrl
    });

    const user = await dbInstance.User.create({
        googleId,
        email,
        full_name: full_name,
        profile_pick: pictureUrl,
        accountType,
        verify_email: true,
        password: null,
    });

    console.log("Usuario creado exitosamente:", {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        accountType: user.accountType
    });

    // Si es profesional, crear perfil profesional
    let professionalProfile = null;
    if (accountType === 'Profesional') {
        try {
            professionalProfile = await dbInstance.Professional.create({
                user_id: user.id,
                servicios_especialistas: servicios_especialistas || null,
                NC_profesional: NC_profesional || null,
                certificados: certificados || null,
                experiencia_laboral: experiencia_laboral || null,
            });
            console.log("Perfil profesional creado (Google):", professionalProfile.id);
        } catch (error) {
            console.error("Error creando perfil profesional (Google):", error);
            // Si falla la creación del perfil profesional, eliminar el usuario creado
            await user.destroy();
            throw new Error("Error al crear perfil profesional. Por favor, intente nuevamente.");
        }
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, accountType: user.accountType },
        process.env.JWT_SECRET || "sanity_app_2024_jwt_secret_key_fallback",
        { expiresIn: "1h" }
    );
    return {
        token,
        user: {
            id: user.id,
            googleId: user.googleId,
            email: user.email,
            full_name: user.full_name,
            profile_pick: user.profile_pick,
            accountType: user.accountType,
            verify_email: user.verify_email,
            professional: professionalProfile ? {
                id: professionalProfile.id,
                servicios_especialistas: professionalProfile.servicios_especialistas,
                NC_profesional: professionalProfile.NC_profesional,
                certificados: professionalProfile.certificados,
                experiencia_laboral: professionalProfile.experiencia_laboral,
            } : null,
        }
    };
};

module.exports = { googleSignUp, setDb }; 