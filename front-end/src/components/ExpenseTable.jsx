import { useSelector } from "react-redux";
import UpdateExpense from "./UpdateExpense";
import { useEffect, useState } from "react";
import axios from "axios";

const ExpenseTable = () => {
    const { expenses } = useSelector((store) => store.expense);
    const [localExpense, setLocalExpense] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});

    useEffect(() => {
        setLocalExpense(expenses);
    }, [expenses]);

    const totalAmount = localExpense.reduce((acc, expense) => {
        if (!checkedItems[expense._id]) {
            return acc + expense.amount;
        }
        return acc;
    }, 0);

    const handleCheckBoxChange = async (expenseId) => {
        const newStatus = !checkedItems[expenseId];
        try {
            const res = await axios.put(
                `http://localhost:8000/api/v1/expense/${expenseId}/done`,
                { done: newStatus },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            if (res.data.success) {
                alert(res.data.message);
                setCheckedItems((prevData) => ({
                    ...prevData,
                    [expenseId]: newStatus,
                }));
                //optionally update the local state for expense id the entire object needs update
                setLocalExpense(
                    localExpense.map((exp) =>
                        exp._id === expenseId
                            ? { ...exp, done: newStatus }
                            : exp
                    )
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    const removeExpenseHandler = async (expenseId) => {
        try {
            const res = await axios.delete(
                `http://localhost:8000/api/v1/expense/remove/${expenseId}`
            );
            if (res.data.message) {
                alert(res.data.message);
                //update the local state
                const filterExpenses = localExpense.filter(
                    (expense) => expense._id !== expenseId
                );
                setLocalExpense(filterExpenses);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
                <caption className="text-sm text-gray-600 mb-2">
                    A list of your recent expenses..
                </caption>
                <thead>
                    <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-2 py-2 text-left font-medium text-xs sm:text-sm">
                            Done
                        </th>
                        <th className="border border-gray-300 px-2 py-2 text-left font-medium text-xs sm:text-sm">
                            Description
                        </th>
                        <th className="border border-gray-300 px-2 py-2 text-left font-medium text-xs sm:text-sm">
                            Amount
                        </th>
                        <th className="border border-gray-300 px-2 py-2 text-left font-medium text-xs sm:text-sm hidden sm:table-cell">
                            Category
                        </th>
                        <th className="border border-gray-300 px-2 py-2 text-left font-medium text-xs sm:text-sm hidden md:table-cell">
                            Date
                        </th>
                        <th className="border border-gray-300 px-2 py-2 text-right font-medium text-xs sm:text-sm">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {localExpense.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                                Add your first Expense
                            </td>
                        </tr>
                    ) : (
                        localExpense?.map((expense) => (
                            <tr key={expense._id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-2 py-2">
                                    <input
                                        type="checkbox"
                                        checked={expense.done}
                                        onChange={() => handleCheckBoxChange(expense._id)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </td>
                                <td className={`border border-gray-300 px-2 py-2 ${expense.done ? "line-through text-gray-500" : ""}`}>
                                    <div className="truncate max-w-[120px] sm:max-w-none">
                                        {expense.description}
                                    </div>
                                </td>
                                <td className={`border border-gray-300 px-2 py-2 ${expense.done ? "line-through text-gray-500" : ""}`}>
                                    ₹{expense.amount}
                                </td>
                                <td className={`border border-gray-300 px-2 py-2 ${expense.done ? "line-through text-gray-500" : ""} hidden sm:table-cell`}>
                                    {expense.category}
                                </td>
                                <td className={`border border-gray-300 px-2 py-2 ${expense.done ? "line-through text-gray-500" : ""} hidden md:table-cell`}>
                                    {expense.createdAt?.split("T")[0]}
                                </td>
                                <td className="border border-gray-300 px-2 py-2">
                                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                                        <button
                                            onClick={() => removeExpenseHandler(expense._id)}
                                            className="p-1 sm:p-2 rounded-full border text-red-600 border-red-600 hover:border-transparent hover:text-white hover:bg-red-600 transition-colors"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                        <UpdateExpense expense={expense} />
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
                <tfoot>
                    <tr className="bg-gray-50 font-bold">
                        <td colSpan={4} className="border border-gray-300 px-2 py-2 text-lg sm:text-xl">
                            Total
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-right text-lg sm:text-xl">
                            ₹{totalAmount}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default ExpenseTable;
