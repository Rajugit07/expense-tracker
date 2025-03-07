import React, { useState } from "react";
import { Button } from "./ui/button";
import {
    DialogTrigger,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "./ui/dialog";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem,
} from "./ui/select";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setExpenses } from "../redux/expenseSlice";
const CreateExpense = () => {
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        category: "",
    });

    const dispatch = useDispatch();
    const { expenses } = useSelector((store) => store.expense);

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const changeCategoryHandler = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            category: value,
        }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const res = await axios.post(
                "http://localhost:8000/api/v1/expense/add",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            if (res.data.success) {
                dispatch(setExpenses([...expenses, res.data.expense]));
                toast.success(res.data.message);
                setIsOpen(false);
                setFormData({ description: "", amount: "", category: "" });
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setIsOpen(true)} variant="outline">
                    Add New Expense
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Expense</DialogTitle>
                    <DialogDescription>
                        Create Expense to here. Click add when you're done.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submitHandler}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                placeholder="description"
                                name="description"
                                className="col-span-3"
                                value={formData.description}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Amount
                            </Label>
                            <Input
                                id="amount"
                                name="amount"
                                placeholder="xxx in ₹ "
                                className="col-span-3"
                                value={formData.amount}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <Select onValueChange={changeCategoryHandler}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="rent">Rent</SelectItem>
                                    <SelectItem value="food">Food</SelectItem>
                                    <SelectItem value="salary">
                                        Salary
                                    </SelectItem>
                                    <SelectItem value="shopping">
                                        Shopping
                                    </SelectItem>
                                    <SelectItem value="others">
                                        Others
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        {loading ? (
                            <Button className="w-full my-4">
                                <Loader2 className="mr-2 h-4 animate-spin">
                                    Please wait
                                </Loader2>
                            </Button>
                        ) : (
                            <Button type="submit">Add</Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateExpense;
