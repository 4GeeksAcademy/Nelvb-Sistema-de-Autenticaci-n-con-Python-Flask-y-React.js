import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Private = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        const validateToken = async () => {
            const response = await fetch("https://glorious-space-disco-4jqxg79xpp65f7grx-3001.app.github.dev/api/validate-token", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                navigate('/login');  // Redirige al login si el token no es válido
            }
        }

        if (!token) {
            navigate('/login');  // Redirige si no hay token
        } else {
            validateToken();
        }
    }, [navigate]);

    return (
        <div>
            <h1>Página privada</h1>
            <p>¡Bienvenido, has accedido a una página privada!</p>
        </div>
    );
};
