import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
const Logo = () => {
    return (
        <div>
            <Link to="/">
                <img src={logo} alt="logo" className="w-14" />
            </Link>
        </div>
    );
};

export default Logo;
