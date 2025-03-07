import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import UpdateExpense from "./UpdateExpense";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

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
                toast.success(res.data.message);
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
                toast.success(res.data.message);
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
        <Table>
            <TableCaption>A list of your recent expenses..</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[150px]">Mark As Done</TableHead>
                    <TableHead
                        className={`${expenses.done ? "line-through" : ""}`}
                    >
                        Description
                    </TableHead>
                    <TableHead
                        className={`${expenses.done ? "line-through" : ""}`}
                    >
                        Amount
                    </TableHead>
                    <TableHead
                        className={`${expenses.done ? "line-through" : ""}`}
                    >
                        Category
                    </TableHead>
                    <TableHead
                        className={`${expenses.done ? "line-through" : ""}`}
                    >
                        Date
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {localExpense.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                            <span>Add your first Expense</span>
                        </TableCell>
                    </TableRow>
                ) : (
                    localExpense?.map((expense) => (
                        <TableRow key={expense._id}>
                            <TableCell className="font-medium">
                                <Checkbox
                                    checked={expense.done}
                                    onCheckedChange={() =>
                                        handleCheckBoxChange(expense._id)
                                    }
                                />
                            </TableCell>
                            <TableCell>{expense.description}</TableCell>
                            <TableCell>{expense.amount}</TableCell>
                            <TableCell>{expense.category}</TableCell>
                            <TableCell>
                                {expense.createdAt?.split("T")[0]}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        onClick={() =>
                                            removeExpenseHandler(expense._id)
                                        }
                                        className="rounded-full border text-red-600  border-red-600 hover:border-transparent hover:text-black    "
                                        variant="outline"
                                    >
                                        <Trash
                                            size="icon"
                                            className="h-4 w-4"
                                        />
                                    </Button>
                                    {/* <Button
                                    className="rounded-full border text-red-600  border-red-600 hover:border-transparent hover:text-black    "
                                    variant="outline"
                                >
                                    <Edit2 size="icon" className="h-4 w-4" />
                                </Button> */}
                                    <UpdateExpense expense={expense} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={5} className=" font-bold text-xl">
                        Total
                    </TableCell>
                    <TableCell className="text-right">
                        {totalAmount} <span>&#8377;</span>{" "}
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
};
export default ExpenseTable;
