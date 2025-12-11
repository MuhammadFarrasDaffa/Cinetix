import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { http } from "../helpers/http-client";

// Register page using same color palette: #2C666E (primary), #F0EDEE (soft background)
// Tailwind CSS + simple validation + toggle password visibility

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const re = /^\S+@\S+\.\S+$/;
    if (!email) return "Email is required.";
    if (!re.test(email)) return "Please enter a valid email address.";

    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirm) return "Password confirmation does not match.";

    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) return setError(v);

    try {
      setLoading(true);

      await http.post("/register", { email, password });

      navigate("/login");
    } catch (err) {
      console.log(err);
      setError(
        err?.response?.data?.message || "Failed to register. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #F0EDEE 0%, #2C666E 100%)",
      }}
    >
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-[#2C666E]">
            Create a New Account
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C666E]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#2C666E]"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirm"
              className="text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirm"
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C666E]"
              required
            />
          </div>

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-xs text-[#2C666E] hover:underline"
          >
            {showPassword ? "Hide password" : "Show password"}
          </button>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#2C666E] text-white py-2 text-sm font-medium shadow-md disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <footer className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="text-[#2C666E] hover:underline font-medium"
          >
            Login
          </Link>
        </footer>
      </div>
    </div>
  );
}
