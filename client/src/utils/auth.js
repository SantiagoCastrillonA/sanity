import axiosInstance from "../config/axiosInstance";

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
    const userSession = localStorage.getItem("userSession") || sessionStorage.getItem("userSession");
    return userSession !== null;
};

// Función para obtener los datos del usuario
export const getUserData = () => {
    const userSession = localStorage.getItem("userSession") || sessionStorage.getItem("userSession");
    return userSession ? JSON.parse(userSession) : null;
};

// Función para cerrar sesión
export const logout = async () => {
    try {
        // Llamar al endpoint de logout para limpiar la cookie
        await axiosInstance.post("/api/users/logout");
        
        // Limpiar almacenamiento local
        localStorage.removeItem("userSession");
        sessionStorage.removeItem("userSession");
        
        console.log("Sesión cerrada correctamente");
        return true;
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        // Aún así limpiar el almacenamiento local
        localStorage.removeItem("userSession");
        sessionStorage.removeItem("userSession");
        return false;
    }
};

// Función para guardar datos de sesión
export const saveUserSession = (userData, rememberSession = false) => {
    const sessionData = {
        accountType: userData.accountType,
        email: userData.email,
        id: userData.id,
        verify_email: userData.verify_email
    };

    if (rememberSession) {
        localStorage.setItem("userSession", JSON.stringify(sessionData));
    } else {
        sessionStorage.setItem("userSession", JSON.stringify(sessionData));
    }
}; 