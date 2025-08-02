import React, { useState } from "react";
import Logo from "./shared/Logo";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const changeHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };
     const API_BASE_URL = "https://expense-tracker-70bh.onrender.com/api/v1/user";

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                `${API_BASE_URL}/register`,
                input,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            console.log(res.data);
            if (res.data.success) {
                alert(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                    <div className="w-full flex justify-center mb-6">
                        <Logo />
                    </div>
                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullname"
                                value={input.fullname}
                                onChange={changeHandler}
                                className="input"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                onChange={changeHandler}
                                value={input.email}
                                className="input"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={input.password}
                                onChange={changeHandler}
                                className="input"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                        >
                            Signup
                        </button>
                        <p className="text-sm text-center text-gray-600">
                            Already have an account?{" "}
                            <Link className="text-blue-600 hover:text-blue-800" to="/login">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
