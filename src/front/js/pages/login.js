import React, { useState} from "react";
import {useNavigate } from 'react-router-dom';
import '../../styles/index.css';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

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

        if (response.ok){
            const data = await response.json();
            sessionStorage.setItem('token', data.token);
            navigate('/private');
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
                    placeholder="Email"
                    required
                />
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                />
                <button type='submit' className='login-button'>Iniciar Sesión</button>
            </form>
        </div>
    );
};