import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../styles/index.css';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Leer el email del sessionStorage si existe
        const savedEmail = sessionStorage.getItem('signup_email');

        if (savedEmail) {
            setEmail(savedEmail);
        }

        // Limpiar el sessionStorage después de rellenar el campo de email
        sessionStorage.removeItem('signup_email');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("https://glorious-space-disco-4jqxg79xpp65f7grx-3001.app.github.dev/api/login", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        });

        if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem('token', data.token);
            navigate('/private');  // Redirige al área privada
        } else if (response.status === 401) {
            // Mostrar alerta cuando el usuario no está registrado
            Swal.fire({
                title: 'Usuario no registrado',
                text: '¿Deseas registrarte?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Guardar solo el email en sessionStorage
                    sessionStorage.setItem('signup_email', email);
                    navigate('/signup');  // Redirigir al signup
                } else {
                    // Si el usuario cancela, limpiar los campos
                    setEmail('');
                    setPassword('');
                }
            });
        } else {
            alert('Error al iniciar sesión');
        }
    };

    return (
        <div className='login-container'>
            <form onSubmit={handleSubmit}>
                <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Introduzca su email"
                    required
                    autoComplete="off"
                />
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Introduzca su contraseña"
                    required
                    autoComplete="off"
                />
                <button type='submit' className='login-button'>Iniciar Sesión</button>
            </form>
        </div>
    );
};
