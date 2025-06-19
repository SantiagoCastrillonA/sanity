import Logo from '../../assets/logoSanity.png'
import sobreIcon from '../../assets/Icons/sobre.png'
import candadoIcon from '../../assets/Icons/cerrar.png'
import seePassword from '../../assets/Icons/ojo.png'
import hidePassword from '../../assets/Icons/ojos-cruzados.png'
import React, { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberSession, setRememberSession] = useState(false);
    const navigate = useNavigate();

    const login = async (event) => {
        event.preventDefault();

        try {
            const response = await axiosInstance.post("/api/users/login", {
                email,
                password,
            });

            const data = response.data;
            console.log("Respuesta completa del servidor:", data);

            if (!data.token) {
                console.error("Datos recibidos sin token:", data);
                throw new Error("No se recibió el token de autenticación");
            }

            const sessionData = {
                accountType: data.accountType,
                email: data.email,
                id: data.id,
                token: data.token
            };

            console.log("Datos de sesión a guardar:", sessionData);

            if (rememberSession) {
                localStorage.setItem("userSession", JSON.stringify(sessionData));
                console.log("Sesión guardada en localStorage");
            } else {
                sessionStorage.setItem("userSession", JSON.stringify(sessionData));
                console.log("Sesión guardada en sessionStorage");
            }

            // Verificar que los datos se guardaron correctamente
            const storedSession = JSON.parse(
                rememberSession
                    ? localStorage.getItem("userSession")
                    : sessionStorage.getItem("userSession")
            );
            console.log("Datos de sesión guardados:", storedSession);

            alert(data.message || "Inicio de sesión exitoso");

            navigate("/", {
                state: { accountType: data.accountType },
            });
        } catch (error) {
            console.error("Error en el login:", error);
            if (error.message === "No se recibió el token de autenticación") {
                alert("Error en la autenticación: No se recibió el token");
            } else if (error.response?.status === 400) {
                alert("Usuario o contraseña incorrectos");
            } else if (error.response?.status === 403) {
                alert("Por favor verifica tu correo antes de iniciar sesión");
            } else {
                alert("Ocurrió un error al iniciar sesión");
            }
        }
    };


    const handleGoogleResponse = async (response) => {
        const idToken = response.credential;

        try {
            const res = await axiosInstance.post("/api/users/auth/googleSignIn", { idToken });
            const data = res.data;

            if (data.success) {
                console.log("Respuesta del backend Google", data);
                const accountType = data.user.accountType;

                sessionStorage.setItem("userSession", JSON.stringify({
                    googleId: data.user.googleId,
                    accountType: accountType,
                    email: data.user.email,
                }));

            } else {
                console.error('Error en el inicio de sesión con Google (backend):', data.message);
                alert(data.message || 'Error en el inicio de sesión con Google');
            }
        } catch (error) {
            if (error.response?.data?.message === "Correo no registrado") {
                alert("El correo no está registrado. Por favor, regístrese primero.");
            } else {
                console.error('Error de red al enviar el token de Google:', error.response?.data?.message || error.message);
                alert(error.response?.data?.message || 'Error de red al intentar iniciar sesión.');
            }
        }
    };

    return (
        <div class="bg-gradient-to-b from-bg-primary from-1% via-bg-secondary via-20% to-bg-thrid to-100% h-lvh justify-center items-center flex text-center p-4">
            <div>
                <div class="flex flex-col gap-2 items-center mb-8">
                    <img src={Logo} alt="Logo" class="w-30" />
                    <h1 class="font-sanity font-semibold text-6xl text-primary">Sanity</h1>
                    <p class="text-primary text-xl font-body-sanity">Es momento de estar bien</p>
                </div>
                <form class="flex flex-col justify-center gap-3">
                    <div class="flex relative items-center" >
                        <input
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            type="email" placeholder='Email' class="bg-amber-50 rounded-4xl w-80 h-16 py-3 pl-14 pr-4 focus:outline-secondary" />
                        <img class="w-7 h-7 absolute left-5" src={sobreIcon} alt="email" />
                    </div>
                    <div class="flex relative items-center">
                        <input
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña" class="bg-amber-50 rounded-4xl w-80 h-16 py-3 pl-14 pr-4 focus:outline-secondary" />
                        <img class="w-7 h-7 absolute left-5" src={candadoIcon} alt="ojoCerrado" />

                        <img class="w-7 h-7 absolute right-5"
                            src={showPassword ? seePassword : hidePassword}
                            alt="Toggle Password"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
                    <div class="flex gap-2 mt-1 items-center">
                        <input
                            type="checkbox"
                            id="rememberSession"
                            checked={rememberSession}
                            onChange={(event) => setRememberSession(event.target.checked)} class="w-4 h-4 appearance-none border border-primary checked:bg-primary/50 checked:border-primaryfocus:outline-none" />
                        <label class="font-body-sanity" htmlFor="rememberSession">Recordarme</label>
                        <a class="ml-9 font-body-sanity text-primary hover:underline" href="/forgotPassword">¿Olvidó su contrañesa?</a>
                    </div>
                    <div>
                        <button class="bg-secondary rounded-4xl w-auto h-auto py-3 px-6 my-4 font-sanity
                        text-neutral-50 text-3xl" OnClick={login}>Iniciar Sesión</button>
                        <p class="font-body-sanity flex gap-2 items-center justify-center">¿Primera vez? <a href="/register" class="text-primary hover:underline">Registrarse</a></p>
                        <p>o</p>
                        <div class="flex items-center justify-center mt-4">
                            <div class="flex items-center justify-center h-16">
                                <div style={{ transform: 'scale(1.3)' }}>
                                    <GoogleLogin
                                        onSuccess={handleGoogleResponse}
                                        onError={() => alert('Error al iniciar sesión con Google')}
                                        theme="filled_white"
                                        size="large"
                                        text="continue_with"
                                        shape="pill"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    )
}