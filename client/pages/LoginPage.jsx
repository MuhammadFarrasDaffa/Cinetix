/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { http } from "../helpers/http-client";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!email) return "Email cannot be empty.";

    // simple email regex
    const re = /^\S+@\S+\.\S+$/;
    if (!re.test(email)) return "Please enter a valid email address.";
    if (!password) return "Password cannot be empty.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) return setError(v);

    setLoading(true);
    try {
      const { data } = await http.post("/login", { email, password });
      const token = data?.access_token;
      if (token) {
        localStorage.setItem("access_token", token);
      }

      navigate("/");
    } catch (err) {
      console.log("🚀 ~ handleSubmit ~ err:", err);
      setError(err?.response?.data?.message || "Gagal login. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);

    try {
      const { data } = await http.post("/google-login", {
        google_token: response.credential,
      });

      const token = data?.access_token;
      if (token) {
        localStorage.setItem("access_token", token);
      }

      navigate("/");
    } catch (err) {
      console.log("🚀 ~ handleSubmit ~ err:", err);
      setError(err?.response?.data?.message || "Gagal login. Coba lagi.");
    }
  }

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(document.getElementById("buttonDiv"), {
      theme: "outline",
      size: "large",
    });
    google.accounts.id.prompt();
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #2C666E 0%, #F0EDEE 100%)",
      }}
    >
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-[#2C666E]">
            Login to your account
          </h1>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          aria-label="login form"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2C666E] focus:border-[#2C666E]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder-gray-400 pr-10 focus:outline-none focus:ring-2 focus:ring-[#2C666E] focus:border-[#2C666E]"
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-md bg-gray/60 hover:bg-gray"
                aria-label={showPassword ? "Hide Password" : "Show assword"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex justify-center mt-2">
            <div
              id="buttonDiv"
              className="inline-block shadow-sm rounded-lg overflow-hidden"
            ></div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex justify-center items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white bg-[#2C666E] disabled:opacity-60 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C666E]"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </div>
        </form>

        <footer className="mt-6 text-center text-sm text-gray-600">
          <p>
            Dont have an account yet?{" "}
            <Link
              to={"/register"}
              className="text-[#2C666E] font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
