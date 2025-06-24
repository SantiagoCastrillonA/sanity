import Logo from '../../assets/logoSanity.png'
import sobreIcon from '../../assets/Icons/sobre.png'
import candadoIcon from '../../assets/Icons/cerrar.png'
import seePassword from '../../assets/Icons/ojo.png'
import hidePassword from '../../assets/Icons/ojos-cruzados.png'
import React, { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";
import usuarioIcon from '../../assets/Icons/usuario.png'


export const RegistrationPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const register = async (event) => {
        event.preventDefault();

        try {
            const response = await axiosInstance.post("/api/users/login", {
                email,
                password,
            });

            const data = response.data;
            console.log("Respuesta completa del servidor:", data);


            alert(data.message || "Inicio de sesión exitoso");

            navigate("/", {
                state: { accountType: data.user.accountType },
            });
        } catch (error) {
            console.error("Error en el login:", error);
            if (error.response?.status === 400) {
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
            const res = await axiosInstance.post("/api/users/auth/googleSignUp", { idToken });
            const data = res.data;

            if (data.success) {
                console.log("Respuesta del backend Google", data);


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
        <div class="bg-gradient-to-b from-bg-secondary from-1% via-bg-primary via-50% to-bg-secondary to-100% h-lvh justify-center items-center flex text-center p-4">
            <div>
                <div class="flex flex-col gap-2 items-center mb-5">
                    <img src={Logo} alt="Logo" class="w-24" />
                    <h1 class="font-sanity font-semibold text-5xl text-primary">Sanity</h1>
                    <h2 class="font-sanity font-semibold text-4xl text-primary">Crea tu cuenta</h2>
                    <p class="text-primary text-xl font-body-sanity">Empieza tu camino hacia el bienestar</p>
                </div>
                <form class="flex flex-col justify-center gap-3">
                    <div class="flex relative items-center" >
                        <input
                            placeholder='Nombre Completo' class="bg-white/60 rounded-4xl w-full h-14 py-3 pl-14 pr-4 focus:outline-secondary" />
                        <img class="w-7 h-7 absolute left-5" src={usuarioIcon} alt="email" />
                    </div>
                    <div class="flex relative items-center" >
                        <input
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            type="email" placeholder='Email' class="bg-white/60 rounded-4xl w-full h-14 py-3 pl-14 pr-4 focus:outline-secondary" />
                        <img class="w-7 h-7 absolute left-5" src={sobreIcon} alt="email" />
                    </div>
                    <div class="flex relative items-center">
                        <input
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña" class="bg-white/60 rounded-4xl w-full h-14 py-3 pl-14 pr-4 focus:outline-secondary" />
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
                            id="terms"
                            class="w-4 h-4 appearance-none border border-primary checked:bg-primary/50 checked:border-primaryfocus:outline-none" />
                        <label class="font-body-sanity" htmlFor="terms">Aceptar terminos y condiciones</label>
                    </div>
                    <div>
                        <button class="bg-secondary rounded-4xl w-auto h-auto py-3 px-6 my-4 font-sanity
                        text-neutral-50 text-3xl" onClick={register}>Registrarme</button>
                        <p>O</p>
                        <div class="flex flex-col items-center justify-center my-4 gap-4">
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
                            <p class="font-body-sanity flex gap-2 items-center justify-center">¿Ya tienes cuenta? <a href="/login" class="text-primary hover:underline">Iniciar sesión</a></p>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    )
}