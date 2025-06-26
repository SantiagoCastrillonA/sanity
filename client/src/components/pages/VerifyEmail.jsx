import React, { useEffect, useState } from 'react';
import axiosInstance from '../../config/axiosInstance';

export const VerifyEmail = () => {
  const [status, setStatus] = useState('pending'); // 'pending', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Extraer el token del query param
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Token de verificación no proporcionado.');
      return;
    }

    const verify = async () => {
      try {
        const response = await axiosInstance.get(`/api/users/verify-email?token=${token}`, { withCredentials: false });
        setStatus('success');
        setMessage(response.data.message || 'Correo verificado con éxito.');
      } catch (error) {
        setStatus('error');
        if (error.response && error.response.data && error.response.data.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage('Ocurrió un error al verificar el correo.');
        }
      }
    };

    verify();
  }, []);

  return (
    <div className="bg-gradient-to-b from-bg-secondary from-1% via-bg-primary via-50% to-bg-secondary to-100% h-lvh justify-center items-center flex text-center p-4">
      <div className="bg-white/80 rounded-4xl shadow-lg p-8 max-w-md mx-auto">
        {status === 'pending' && (
          <>
            <h2 className="text-2xl font-sanity text-primary mb-4">Verificando correo...</h2>
            <p className="text-lg font-body-sanity text-gray-700">Por favor espera un momento.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <h2 className="text-2xl font-sanity text-green-700 mb-4">¡Éxito!</h2>
            <p className="text-lg font-body-sanity text-green-800">{message}</p>
            <a href="/login" className="mt-6 inline-block bg-secondary text-white rounded-4xl px-6 py-2 font-sanity text-lg hover:bg-primary transition">Iniciar sesión</a>
          </>
        )}
        {status === 'error' && (
          <>
            <h2 className="text-2xl font-sanity text-red-700 mb-4">Error</h2>
            <p className="text-lg font-body-sanity text-red-800">{message}</p>
            <a href="/registration" className="mt-6 inline-block bg-secondary text-white rounded-4xl px-6 py-2 font-sanity text-lg hover:bg-primary transition">Registrarse</a>
          </>
        )}
      </div>
    </div>
  );
}
