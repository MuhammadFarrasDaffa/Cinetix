import { Navigate, Outlet } from "react-router";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F0EDEE" }}
    >
      <Navbar />

      <main className="flex-grow p-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
