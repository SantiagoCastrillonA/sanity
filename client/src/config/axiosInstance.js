import Axios from "axios";

const axiosInstance = Axios.create({
    baseURL: "http://localhost:3001",// Cambia esto según la URL de tu backend
    withCredentials: true, // Permitir el envío de cookies
    headers: {
        "Content-Type": "application/json", // Tipo de contenido predeterminado
    },
});

export default axiosInstance;