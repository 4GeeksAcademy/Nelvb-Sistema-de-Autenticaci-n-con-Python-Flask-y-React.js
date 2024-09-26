import React from "react";
import { Link, useLocation } from "react-router-dom";
import '../../styles/index.css';  

export const Navbar = () => {
    const location = useLocation();

    // Verificar si estamos en la página principal o en la página de login
    const isLoginPageOrHomePage = location.pathname === '/login' || location.pathname === '/';

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                {isLoginPageOrHomePage ? (
                    <span className="navbar-text">Bienvenido a nuestra página</span>
                ) : (
                    <Link to="/">
                        <button className="btn btn-primary btn-volver">Volver</button>
                    </Link>
                )}
            </div>
        </nav>
    );
};
