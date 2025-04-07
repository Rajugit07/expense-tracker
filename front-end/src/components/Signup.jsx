import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import Logo from "./shared/Logo";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

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

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "http://localhost:8000/api/v1/user/register",
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
                toast.success(res.data.message);
                navigate("/login", {
                    state: { message: res.data.success.message },
                });
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <form onSubmit={submitHandler} className="w-96 p-8 shadow-lg ">
                <div className="w-full flex justify-center mb-5">
                    <Logo />
                </div>
                <div>
                    <Label className="mb-2">Full Name</Label>
                    <Input
                        type="text"
                        name="fullname"
                        value={input.fullname}
                        onChange={changeHandler}
                    />
                </div>
                <div>
                    <Label className="mb-2 mt-1">Email</Label>
                    <Input
                        type="email"
                        name="email"
                        onChange={changeHandler}
                        value={input.email}
                    />
                </div>
                <div>
                    <Label className="mb-2 mt-1">Password</Label>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeHandler}
                    />
                </div>
                <Button className="w-full my-5 bg-black text-white">
                    Signup
                </Button>
                <p className="text-sm text-center">
                    Already have an account?{" "}
                    <Link className="text-blue-600" to="/login">
                        Login
                    </Link>{" "}
                </p>
            </form>
        </div>
    );
};

export default Signup;
