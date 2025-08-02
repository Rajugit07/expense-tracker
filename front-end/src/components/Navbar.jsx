import React, { useState } from "react";
import Logo from "./shared/Logo";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const Navbar = () => {
    const { user } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const logoutHandler = async () => {
        try {
            //network call
            const res = await axios.get(
                "http://localhost:8000/api/v1/user/logout"
            );
            if (res.data.success) {
                navigate("/login");
                alert(res.data.message);
            }
        } catch (error) {
            console.log(error);
            alert(error.response.data.message);
        }
    };

    return (
        <div className="border-b border-gray-300 bg-white sticky top-0 z-50">
            <div className="flex items-center justify-between max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8">
                <Logo />
                {user ? (
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                    {user.fullname?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </button>
                        
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                                <button
                                    onClick={logoutHandler}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <Link to="/login">
                            <button className="btn btn-secondary text-sm sm:text-base px-3 py-2 sm:px-4">
                                Login
                            </button>
                        </Link>
                        <Link to="/signup">
                            <button className="btn btn-primary text-sm sm:text-base px-3 py-2 sm:px-4">
                                Signup
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
