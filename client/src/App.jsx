import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Layout from "../components/Layout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import WatchlistPage from "../pages/WatchlistPage";
import MovieDetailPage from "../pages/DetailPage";
import ProfilePage from "../pages/ProfilePage";
import CollectionPage from "../pages/CollectionPage";
import PaymentsPage from "../pages/PaymentsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/my-watchlist" element={<WatchlistPage />} />
          <Route path="/my-collection" element={<CollectionPage />} />
          <Route path="/my-payments" element={<PaymentsPage />} />
          <Route path="/my-profile" element={<ProfilePage />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
