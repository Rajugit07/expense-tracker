import React from "react";
import Navbar from "./Navbar";
import CreateExpense from "./CreateExpense";
import { useDispatch } from "react-redux";
import { setCategory, setMarkAsDone } from "../redux/expenseSlice";
import ExpenseTable from "./ExpenseTable";
import useGetExpenses from "../hooks/useGetExpenses";

const Home = () => {
    useGetExpenses();
    const dispatch = useDispatch();
    
    const changeCategoryHandler = (e) => {
        dispatch(setCategory(e.target.value));
    };
    
    const changeDoneHandler = (e) => {
        dispatch(setMarkAsDone(e.target.value));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 space-y-4 sm:space-y-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Expenses</h1>
                    <CreateExpense />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 my-5">
                    <h1 className="font-medium text-lg">Filter By: </h1>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <select 
                            onChange={changeCategoryHandler}
                            className="input w-full sm:w-48"
                        >
                            <option value="">Category</option>
                            <option value="rent">Rent</option>
                            <option value="food">Food</option>
                            <option value="salary">Salary</option>
                            <option value="shopping">Shopping</option>
                            <option value="all">All</option>
                        </select>

                        <select 
                            onChange={changeDoneHandler}
                            className="input w-full sm:w-48"
                        >
                            <option value="">Mark As</option>
                            <option value="done">Done</option>
                            <option value="undone">Undone</option>
                            <option value="both">Both</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <ExpenseTable />
                </div>
            </div>
        </div>
    );
};

export default Home;
