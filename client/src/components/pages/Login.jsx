import Logo from '../../assets/logoSanity.png'
import sobreIcon from '../../assets/Icons/sobre.png'
import candadoIcon from '../../assets/Icons/cerrar.png'
import seePassword from '../../assets/Icons/ojo.png'
import hidePassword from '../../assets/Icons/ojos-cruzados.png'
import React, { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import axiosInstance from "./../../config/axiosInstance";
import { saveUserSession } from "../../utils/auth";

export const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberSession, setRememberSession] = useState(false);
    const [isLoginClicked, setIsLoginClicked] = useState(false);
    const navigate = useNavigate();

    const login = async (event) => {
        try {
            const response = await axiosInstance.post("/api/users/login", {
                email,
                password,
            });

            const data = response.data;
            console.log("Respuesta completa del servidor:", data);

            // Guardar datos de sesión usando la utilidad
            saveUserSession(data.user, rememberSession);

            alert(data.message || "Inicio de sesión exitoso");

            navigate("/", {
                state: { accountType: data.user.accountType },
            });
        } catch (error) {
            console.error("Error en el login:", error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
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

                // Guardar datos de sesión usando la utilidad
                saveUserSession(data.user, false); // Google siempre usa sessionStorage

                alert(data.message || "Inicio de sesión exitoso");
                navigate("/", {
                    state: { accountType: data.user.accountType },
                });

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
        <div className="bg-gradient-to-b from-bg-primary from-1% via-bg-secondary via-20% to-bg-thrid to-100% h-lvh justify-center items-center flex text-center p-4">
            <div>
                <div className="flex flex-col gap-2 items-center mb-5">
                    <img src={Logo} alt="Logo" className="w-20" />
                    <h1 className="font-sanity font-semibold text-4xl text-primary">Sanity</h1>
                    <p className="text-primary text-xl font-body-sanity">Es momento de estar bien</p>
                </div>
                <form className="flex flex-col justify-center gap-3">
                    <div className="flex relative items-center" >
                        <input
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            type="email" placeholder='Email' className="bg-white/60
                             rounded-4xl w-full h-14 py-3 pl-14 pr-4 focus:outline-secondary" />
                        <img className="w-7 h-7 absolute left-5" src={sobreIcon} alt="email" />
                    </div>
                    <div className="flex relative items-center">
                        <input
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña" className="bg-white/60 rounded-4xl w-full h-14 py-3 pl-14 pr-4 focus:outline-secondary" />
                        <img className="w-7 h-7 absolute left-5" src={candadoIcon} alt="ojoCerrado" />

                        <img className="w-7 h-7 absolute right-5"
                            src={showPassword ? seePassword : hidePassword}
                            alt="Toggle Password"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
                    <div className="flex gap-2 items-center">
                        <input
                            type="checkbox"
                            id="rememberSession"
                            checked={rememberSession}
                            onChange={(event) => setRememberSession(event.target.checked)} className="w-4 h-4 appearance-none border border-primary checked:bg-primary/50 checked:border-primaryfocus:outline-none" />
                        <label className="font-body-sanity" htmlFor="rememberSession">Recordarme</label>
                        <a className="ml-14 font-body-sanity text-primary hover:underline" href="/forgotPassword">¿Olvidó su contrañesa?</a>
                    </div>
                    <div>
                        <button 
                            type="button"
                            className={`bg-secondary rounded-4xl w-60 h-12 font-sanity text-neutral-50 text-2xl transition-all duration-200 hover:bg-secondary/80 ${
                                isLoginClicked ? "shadow-lg scale-105" : ""
                            }`} 
                            onClick={(e) => {
                                e.preventDefault();
                                setIsLoginClicked(true);
                                login(e);
                            }}
                        >
                            Iniciar Sesión
                        </button>
                        <p className='my-2'>O</p>
                        <div className="flex items-center justify-center">
                            <div className="flex items-center justify-center h-13">
                                <div className="scale-125 opacity-80">
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
                        <p className="font-body-sanity flex gap-2 items-center justify-center my-4">¿Primera vez? <a href="/registration" className="text-primary hover:underline">Registrarse</a></p>
                    </div>
                </form>
            </div>

        </div>
    )
}