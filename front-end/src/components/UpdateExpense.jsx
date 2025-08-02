import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setExpenses, setSingleExpense } from "../redux/expenseSlice";

const UpdateExpense = ({ expense }) => {
    const { expenses, singleExpense } = useSelector((store) => store.expense);

    const [formData, setFormData] = useState({
        description: singleExpense?.description,
        amount: singleExpense?.amount,
        category: singleExpense?.category,
    });

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setFormData({
            description: singleExpense?.description,
            amount: singleExpense?.amount,
            category: singleExpense?.category,
        });
    }, [singleExpense]);

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const changeCategoryHandler = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            category: e.target.value,
        }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const res = await axios.put(
                `http://localhost:8000/api/v1/expense/update/${expense._id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            if (res.data.success) {
                const upDatedExpenses = expenses.map((exp) =>
                    exp._id === expense._id ? res.data.expense : exp
                );
                dispatch(setExpenses(upDatedExpenses));
                alert(res.data.message);
                setIsOpen(false);
                setFormData({ description: "", amount: "", category: "" });
            }
        } catch (error) {
            alert(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => {
                    dispatch(setSingleExpense(expense));
                    setIsOpen(true);
                }}
                className="p-2 rounded-full border text-green-600 border-green-600 hover:border-transparent hover:text-white hover:bg-green-600 transition-colors"
            >
                ✏️
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Update Expense</h2>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <p className="text-gray-600 mb-4">
                            Update Expense here. Click Update when you're done.
                        </p>

                        <form onSubmit={submitHandler}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        name="description"
                                        placeholder="description"
                                        className="input"
                                        value={formData.description}
                                        onChange={changeEventHandler}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        name="amount"
                                        placeholder="xxx in ₹"
                                        className="input"
                                        value={formData.amount}
                                        onChange={changeEventHandler}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        className="input"
                                        value={formData.category}
                                        onChange={changeCategoryHandler}
                                        required
                                    >
                                        <option value="">Select a Category</option>
                                        <option value="rent">Rent</option>
                                        <option value="food">Food</option>
                                        <option value="salary">Salary</option>
                                        <option value="shopping">Shopping</option>
                                        <option value="others">Others</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex flex-col sm:flex-row gap-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsOpen(false)}
                                    className="btn btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                {loading ? (
                                    <button 
                                        type="button" 
                                        className="btn btn-primary flex-1"
                                        disabled
                                    >
                                        <span className="inline-block animate-spin mr-2">⟳</span>
                                        Please wait
                                    </button>
                                ) : (
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary flex-1"
                                    >
                                        Update
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default UpdateExpense;
