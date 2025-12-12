import { useEffect, useState } from "react";
import PaymentsTable from "../components/PaymentsTable";
import { http } from "../helpers/http-client";
import { FaMoneyBillWave } from "react-icons/fa";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchPayments() {
    try {
      const { data } = await http({
        method: "GET",
        url: "/payments",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPayments();
    const interval = setInterval(fetchPayments, 5000);
    const onFocus = () => fetchPayments();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return (
    <div className="min-h-screen px-8 py-12 bg-[#F0EDEE]">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#2C666E] drop-shadow-sm flex items-center gap-3">
          <FaMoneyBillWave className="text-[#2C666E]" />
          My Transactions
        </h1>
        <p className="text-gray-600 mt-2">
          List of your movie purchase transactions.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C666E]"></div>
            <p className="text-[#2C666E] font-medium">
              Loading transactions...
            </p>
          </div>
        </div>
      ) : payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-64 bg-white rounded-2xl shadow-md border border-[#2C666E]/10">
          <FaMoneyBillWave className="text-6xl text-[#2C666E]/30 mb-4" />
          <h2 className="text-2xl text-[#2C666E] font-bold mb-2">
            No transactions yet
          </h2>
          <p className="text-gray-600 text-center max-w-md">
            You have not made any movie purchases yet.
          </p>
        </div>
      ) : (
        <PaymentsTable payments={payments} />
      )}
    </div>
  );
}
