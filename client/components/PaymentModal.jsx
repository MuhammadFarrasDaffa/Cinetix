import { useState } from "react";
import { http } from "../helpers/http-client";

export default function PaymentModal({ movie, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    setLoading(true);
    try {
      // Request snap token dari backend
      const { data } = await http.post(
        "/payments/create",
        {
          movieId: movie.dbID,
          title: movie.title,
          price: movie.price,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const snapToken = data.snapToken;

      // Open Midtrans Snap payment modal
      window.snap.pay(snapToken, {
        onSuccess: function (result) {
          window.Swal.fire({
            icon: "success",
            title: "Pembayaran Berhasil!",
            text: `Order ID: ${result.order_id}`,
            confirmButtonText: "OK",
          }).then(() => {
            if (onSuccess) onSuccess(result);
            onClose();
          });
        },
        onPending: function () {
          window.Swal.fire({
            icon: "info",
            title: "Pembayaran Tertunda",
            text: "Silakan selesaikan pembayaran Anda",
          });
        },
        onError: function () {
          window.Swal.fire({
            icon: "error",
            title: "Pembayaran Gagal",
            text: "Terjadi kesalahan saat memproses pembayaran",
          });
        },
        onClose: function () {
          console.log("Popup closed");
        },
      });
    } catch (error) {
      window.Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Gagal membuat transaksi",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-[#2C666E] mb-4">
          Konfirmasi Pembayaran
        </h2>

        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            <strong>Film:</strong> {movie.title}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Harga:</strong> Rp{" "}
            {(movie.price || 49999).toLocaleString("id-ID")}
          </p>
          <hr className="my-4" />
          <p className="text-lg font-bold text-[#2C666E]">
            Total: Rp {(movie.price || 49999).toLocaleString("id-ID")}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg bg-[#2C666E] text-white font-medium hover:bg-[#1a4047] disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Lanjutkan Pembayaran"}
          </button>
        </div>
      </div>
    </div>
  );
}
