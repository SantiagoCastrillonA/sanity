const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
let dbInstance;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const setDb = (databaseInstance) => {
    dbInstance = databaseInstance;
};

const googleSignUp = async ({ idToken, accountType }) => {
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
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleId = payload['sub'];
    const email = payload['email'];
    const givenName = payload['given_name'] || payload['name'];
    const familyName = payload['family_name'] || '';
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
    const user = await dbInstance.User.create({
        googleId,
        email,
        names: givenName,
        lastnames: familyName,
        profile_pick: pictureUrl,
        accountType,
        verify_email: true,
        password: null,
    });
    const token = jwt.sign(
        { id: user.id, email: user.email, accountType: user.accountType },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1h" }
    );
    return {
        token,
        user: {
            id: user.id,
            googleId: user.googleId,
            email: user.email,
            names: user.names,
            lastnames: user.lastnames,
            profile_pick: user.profile_pick,
            accountType: user.accountType,
            verify_email: user.verify_email,
        }
    };
};

module.exports = { googleSignUp, setDb }; 