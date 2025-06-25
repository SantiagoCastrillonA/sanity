import Logo from '../../assets/logoSanity.png'
import sobreIcon from '../../assets/Icons/sobre.png'
import candadoIcon from '../../assets/Icons/cerrar.png'
import seePassword from '../../assets/Icons/ojo.png'
import hidePassword from '../../assets/Icons/ojos-cruzados.png'
import React, { useState, useEffect } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";
import usuarioIcon from '../../assets/Icons/usuario.png'


export const RegistrationPage = (accountType) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        number: false,
        specialChar: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Limpia los campos cada vez que se seleccione un nuevo tipo de cuenta
    useEffect(() => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    }, [accountType]);

    // Actualiza los requisitos de la contraseña en tiempo real
    useEffect(() => {
        setPasswordRequirements({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            specialChar: /[@$!%*?&]/.test(password)
        });
    }, [password]);

    const registerUser = async (event) => {
        event.preventDefault();

        // Validar que todos los requisitos de la contraseña se cumplan
        if (
            !passwordRequirements.length ||
            !passwordRequirements.uppercase ||
            !passwordRequirements.number ||
            !passwordRequirements.specialChar
        ) {
            alert(
                "La contraseña debe cumplir con todos los requisitos: al menos 8 caracteres, una letra mayúscula, un número y un carácter especial."
            );
            return;
        }

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            setPassword("");
            setConfirmPassword("");
            return;
        }

        // Enviar datos al backend
        try {
            const response = await axiosInstance.post("/api/users/register", {
                full_name,
                email,
                password,
                accountType
            });

            const data = response.data;
            console.log("Respuesta completa del servidor:", data);


            alert(data.message || "Registro exitoso");

            navigate("/", {
                state: { accountType: data.user.accountType },
            });
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.message || "Ocurrió un error al registrar el usuario");
            } else {
                alert("Error al conectar con el servidor");
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


                alert(data.message || "Registro exitoso");
                navigate("/", {
                    state: { accountType: data.user.accountType },
                });

            } else if (data.message === "El correo ya está registrado") { // Verifica si el correo ya está registrado
                alert("El correo ya está registrado. Por favor, inicie sesión.");
            } else {
                console.error('Error en el registro con Google (backend):', data.message);
                alert(data.message || 'Error en el registro con Google');
            }
        } catch (error) {
            console.error('Error de red al enviar el token de Google:', error);
            alert('Error al conectar con el servidor');
        }
    };


    return (
        <div className="bg-gradient-to-b from-bg-secondary from-1% via-bg-primary via-50% to-bg-secondary to-100% h-lvh justify-center items-center flex text-center p-4">
            <div>
                <div className="flex flex-col gap-2 items-center mb-5">
                    <h2 className="font-sanity font-semibold text-4xl text-primary">Crear cuenta</h2>
                    <p className="text-primary text-xl font-body-sanity">Empieza tu camino hacia el bienestar</p>
                </div>
                <form className="flex flex-col justify-center gap-3">
                    <div className="flex relative items-center" >
                        <input
                            placeholder='Nombre Completo' className="bg-white/60 rounded-4xl w-full h-14 py-3 pl-14 pr-4 focus:outline-secondary" />
                        <img className="w-7 h-7 absolute left-5" src={usuarioIcon} alt="email" />
                    </div>
                    <div className="flex relative items-center" >
                        <input
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            type="email" placeholder='Email' className="bg-white/60 rounded-4xl w-full h-14 py-3 pl-14 pr-4 focus:outline-secondary" />
                        <img className="w-7 h-7 absolute left-5" src={sobreIcon} alt="email" />
                    </div>
                    <div className="flex relative items-center">
                        <input
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña" onFocus={() => setIsPasswordFocused(true)} // Activa el estado al enfocar
                            onBlur={() => setIsPasswordFocused(false)} // desactiva el estado 
                            className="bg-white/60 rounded-4xl w-full h-14 py-3 pl-14 pr-4 focus:outline-secondary" />
                        <img className="w-7 h-7 absolute left-5" src={candadoIcon} alt="ojoCerrado" />

                        <img className="w-7 h-7 absolute right-5"
                            src={showPassword ? seePassword : hidePassword}
                            alt="Toggle Password"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
                    <div className="flex relative items-center">
                        <input
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirmar contraseña" className="bg-white/60 rounded-4xl w-full h-14 py-3 pl-14 pr-4 focus:outline-secondary" />
                        <img className="w-7 h-7 absolute left-5" src={candadoIcon} alt="ojoCerrado" />

                        <img className="w-7 h-7 absolute right-5"
                            src={showConfirmPassword ? seePassword : hidePassword}
                            alt="Toggle Password"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                    </div>
                    <p>Seleccione el tipo de usuario</p>
                    <div className="flex flex-row justify-between bg-white/60 rounded-4xl w-full h-14 p-2 gap-2">
                        <button className="bg-primary rounded-4xl py-2 px-10 font-sanity text-neutral-50" onClick={registerUser}>Estandar</button>
                        <button className="bg-primary rounded-4xl py-2 px-12 font-sanity text-neutral-50" onClick={registerUser}>Profesional</button>
                    </div>
                    {/* Muestra los requisitos solo si el input está activo */}
                    {isPasswordFocused && (
                        <ul className="w-40 h-auto absolute bg-gray-300 rounded-sm p-1">
                            <li
                                className={`w-full text-sm ${passwordRequirements.length ? "text-green-800" : "text-red-800"}`}
                            >
                                Al menos 8 caracteres
                            </li>
                            <li
                                className={`w-full text-sm ${passwordRequirements.uppercase ? "text-green-800" : "text-red-800"}`}
                            >
                                Al menos una letra mayúscula
                            </li>
                            <li
                                className={`w-full text-sm ${passwordRequirements.number ? "text-green-800" : "text-red-800"}`}
                            >
                                Al menos un número
                            </li>
                            <li
                                className={`w-full text-sm ${passwordRequirements.specialChar ? "text-green-800" : "text-red-800"}`}
                            >
                                Al menos un carácter especial (@$!%*?&)
                            </li>
                        </ul>
                    )}
                    <div className="flex gap-2 mt-1 items-center">
                        <input
                            type="checkbox"
                            id="terms"
                            className="w-4 h-4 appearance-none border border-primary checked:bg-primary/50 checked:border-primaryfocus:outline-none" />
                        <p className="font-body-sanity flex gap-2 items-center justify-center"><a href="/terms" className="text-primary hover:underline">Aceptar terminos y condiciones</a></p>
                    </div>
                    <div>
                        <button className="bg-secondary rounded-4xl w-auto h-auto py-3 px-6 font-sanity
                        text-neutral-50 text-3xl" onClick={registerUser}>Registrarse</button>
                        <p className='my-2'>O</p>
                        <div className="flex flex-col items-center justify-center gap-4">
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
                            <p className="font-body-sanity flex gap-2 items-center justify-center">¿Ya tienes cuenta? <a href="/login" className="text-primary hover:underline">Iniciar sesión</a></p>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    )
}