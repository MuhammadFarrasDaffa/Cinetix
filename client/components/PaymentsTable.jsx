// No external date libs; use Intl DateTimeFormat

function StatusBadge({ status }) {
  const map = {
    pending: {
      color: "bg-yellow-100 text-yellow-700 border-yellow-300",
      label: "Pending",
    },
    settlement: {
      color: "bg-green-100 text-green-700 border-green-300",
      label: "Settled",
    },
    capture: {
      color: "bg-blue-100 text-blue-700 border-blue-300",
      label: "Captured",
    },
    cancel: {
      color: "bg-red-100 text-red-700 border-red-300",
      label: "Cancelled",
    },
    deny: { color: "bg-red-100 text-red-700 border-red-300", label: "Denied" },
    expire: {
      color: "bg-gray-100 text-gray-700 border-gray-300",
      label: "Expired",
    },
  };
  const { color, label } = map[status] || {
    color: "bg-gray-100 text-gray-700 border-gray-300",
    label: status,
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs border ${color}`}>
      {label}
    </span>
  );
}

export default function PaymentsTable({ payments }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-[#2C666E]/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#2C666E]/10">
            <tr>
              <th className="px-4 py-3 text-left text-[#2C666E] font-semibold">
                Order ID
              </th>
              <th className="px-4 py-3 text-left text-[#2C666E] font-semibold">
                Movie
              </th>
              <th className="px-4 py-3 text-left text-[#2C666E] font-semibold">
                Price
              </th>
              <th className="px-4 py-3 text-left text-[#2C666E] font-semibold">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[#2C666E] font-semibold">
                Date
              </th>
              <th className="px-4 py-3 text-left text-[#2C666E] font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr
                key={p.id}
                className="border-t hover:bg-[#2C666E]/5 transition"
              >
                <td className="px-4 py-3 font-mono text-sm text-[#2C666E]">
                  {p.OrderId}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        p.Movie?.imageUrl ||
                        "https://via.placeholder.com/80x120?text=No+Image"
                      }
                      alt={p.Movie?.title || "Movie"}
                      className="w-12 h-16 object-cover rounded-md shadow"
                    />
                    <div>
                      <div className="text-[#2C666E] font-semibold">
                        {p.Movie?.title || "Unknown"}
                      </div>
                      <div className="text-gray-600 text-xs">
                        ID: {p.Movie?.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-[#2C666E]">
                  Rp {Number(p.amount || 0).toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(p.createdAt).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={
                      JSON.parse(p.transactionDetails || "{}").redirect_url ||
                      "#"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-white bg-[#2C666E] px-3 py-1 rounded-lg shadow hover:bg-[#275b62]"
                  >
                    Detail
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
