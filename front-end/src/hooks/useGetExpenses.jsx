import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setExpenses } from "../redux/expenseSlice";

const useGetExpenses = () => {
    const dispatch = useDispatch();
    const { category, markAsDone } = useSelector((store) => store.expense);
    const API_BASE_URL =
        "https://expense-tracker-70bh.onrender.com/api/v1/expense";

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.get(
                    `${API_BASE_URL}/getall?category=${category || ""}&done=${
                        markAsDone || ""
                    }`
                );
                if (res.data.success) {
                    dispatch(setExpenses(res.data.expense));
                }
            } catch (error) {
                console.log(error);
                console.error(
                    error.response?.data?.message || "An error occurred"
                );
            }
        };
        fetchExpenses();
    }, [dispatch, category, markAsDone]);
};

export default useGetExpenses;
