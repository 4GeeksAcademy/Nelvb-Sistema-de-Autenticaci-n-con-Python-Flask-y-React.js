import React, { useState} from "react";
import { useNavigate } from "react-router-dom";



export const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.peventDefault();

        const response = await fetch("http://localhost:3001/api/signup",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        if (response.ok) {
            navigate('/login');
        } else {

            alert('Error al registrarse');
        }
    };

    return(
        <form onSubmit={handleSubmit}>
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
            <button type= 'submit'>Registrarse</button>
        </form>
    );
};