import { Link, useNavigate } from "react-router";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav
      className="
        w-full 
        py-3 px-6 
        flex justify-between items-center 
        sticky top-0 z-50 
        backdrop-blur-md 
        shadow-[0_4px_12px_rgba(0,0,0,0.15)]
      "
      style={{
        backgroundColor: "rgba(44, 102, 110, 0.85)", // #2C666E with 95% opacity
      }}
    >
      {/* Brand */}
      <Link to="/" className="text-white font-semibold text-lg">
        C i n e t i x
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6 text-white text-sm font-medium">
        <Link to="/" className="hover:opacity-80 transition">
          Home
        </Link>
        <Link to="/my-profile" className="hover:opacity-80 transition">
          Profile
        </Link>
        <Link to="/my-watchlist" className="hover:opacity-80 transition">
          Watchlist
        </Link>
        <Link to="/my-collection" className="hover:opacity-80 transition">
          Collection
        </Link>
        <Link to="/my-payments" className="hover:opacity-80 transition">
          Transactions
        </Link>

        {/* Logout */}
        <button
          className="bg-white text-[#2C666E] px-3 py-1 rounded-lg shadow hover:bg-[#F0EDEE] transition"
          onClick={() => {
            localStorage.removeItem("access_token");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
