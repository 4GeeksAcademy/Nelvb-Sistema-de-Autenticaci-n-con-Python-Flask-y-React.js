import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Private = () => {
    const navigate = useNavigate();


    useEffect(() => {
        const token = sessionStorage.getItem('token');

        //Aquí se hace una validación adicional

        const validateToken = async () => {
            const response = await fetch("http://localhost:3001/api/validate-token", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                navigate('/login');
            }
        }

        // Si no hay token redirige a login
        if (!token) {
            navigate('/login');
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