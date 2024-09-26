import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import '../../styles/index.css';  // Asegúrate de que los estilos se apliquen

export const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState(""); // Campo para Nombre
    const [lastName, setLastName] = useState("");   // Campo para Apellidos
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

    const handleSubmit = async () => {
        try {
            const response = await fetch("https://glorious-space-disco-4jqxg79xpp65f7grx-3001.app.github.dev/api/signup", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    first_name: firstName,  // Enviar el nombre
                    last_name: lastName,    // Enviar los apellidos
                    is_active: true,
                }),
            });

            if (response.ok) {
                // Guardar el email y la contraseña en sessionStorage
                sessionStorage.setItem('signup_email', email);
                sessionStorage.setItem('signup_password', password);

                Swal.fire({
                    title: 'Registro exitoso',
                    text: 'Serás redirigido al login.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    navigate('/login'); // Redirigir al login
                });
            } else if (response.status === 409) {
                Swal.fire({
                    title: 'Usuario ya registrado',
                    text: 'Serás redirigido a la página de inicio de sesión.',
                    icon: 'warning',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    navigate('/login');
                });
            } else {
                const errorData = await response.json();
                Swal.fire({
                    title: 'Error',
                    text: errorData.msg || 'Error al registrarse',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error de conexión',
                text: 'Intenta de nuevo más tarde.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }

        // Limpiar campos
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
    };

    return (
        <div className="signup-container">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <input
                    type='text'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder='Nombre'
                    required
                />
                <input
                    type='text'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder='Apellidos'
                    required
                />
                <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Email'
                    required
                />
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Contraseña'
                    required
                />
                <button type="submit" className="signup-button">Registrarse</button>
            </form>
        </div>
    );
};
