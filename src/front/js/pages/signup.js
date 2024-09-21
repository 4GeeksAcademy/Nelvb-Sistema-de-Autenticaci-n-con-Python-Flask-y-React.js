import React, { useState} from "react";
import { useNavigate } from "react-router-dom";



export const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    const handleSubmit = async () => {

        const response = await fetch("https://glorious-space-disco-4jqxg79xpp65f7grx-3001.app.github.dev/api/signup",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                is_active: true,
            }),
        });

        if (response.ok) {
            navigate('/login');
        } else {

            alert('Error al registrarse');
        }
    };

    return(
        <div onSubmit={handleSubmit}>
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
            <button onClick={() => handleSubmit()}>Registrarse</button>
        </div>
    );
};