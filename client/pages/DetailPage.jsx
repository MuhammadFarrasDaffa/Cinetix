/* eslint-disable react-hooks/exhaustive-deps */

import { useParams } from "react-router";
import { http } from "../helpers/http-client";
import { useEffect, useState } from "react";
import { FaClock, FaCalendarAlt, FaStar } from "react-icons/fa";
import { MdMovieFilter } from "react-icons/md";
import PaymentModal from "../components/PaymentModal";

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState("");
  const [showPayment, setShowPayment] = useState(false);

  async function fetchMovieById() {
    try {
      const { data } = await http({
        method: "GET",
        url: `/movies/${id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setMovie(data);
    } catch (error) {
      console.log("🚀 ~ fetchMovieById ~ error:", error);
    }
  }

  useEffect(() => {
    fetchMovieById();
  }, []);

  if (!movie) return <p className="text-center text-gray-600">Loading...</p>;

  const durationToText = (min) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h}h ${m}m`;
  };

  const formattedIDR = (number) => {
    return number.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  };

  return (
    <div
      className="min-h-screen w-full py-12 px-6 flex justify-center rounded-2xl"
      style={{ background: "#cdd6d8ff" }}
    >
      <div className="max-w-5xl w-full bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden border border-[#2C666E]/20">
        {/* Header Image */}
        <div className="w-full h-80 overflow-hidden relative">
          <img
            src={`https://image.tmdb.org/t/p/w500/` + movie.backdrop_path}
            alt={movie.title}
            className="w-full h-full object-cover scale-105 hover:scale-110 transition-all duration-700"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              {movie.title}
            </h1>
            <p className="text-gray-200 mt-1 text-sm">{movie.tagline || ""}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Content */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-semibold text-[#2C666E]">Overview</h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              {movie.overview}
            </p>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mt-4">
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-[#2C666E]/15 text-[#2C666E] shadow-sm"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* INFO GRID — 1 LINE */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {/* Rating */}
              <div className="p-4 bg-[#2C666E]/10 rounded-xl text-center shadow">
                <p className="text-xs text-[#2C666E]/80 flex justify-center items-center gap-1">
                  <FaStar /> Rating
                </p>
                <p className="text-xl font-bold text-[#2C666E]">
                  {movie.vote_average.toFixed(1) || "-"}
                </p>
              </div>

              {/* Duration */}
              <div className="p-4 bg-[#2C666E]/10 rounded-xl text-center shadow">
                <p className="text-xs text-[#2C666E]/80 flex justify-center items-center gap-1">
                  <FaClock /> Duration
                </p>
                <p className="text-lg font-semibold text-[#2C666E]">
                  {durationToText(movie.runtime || 0)}
                </p>
              </div>

              {/* Release Date */}
              <div className="p-4 bg-[#2C666E]/10 rounded-xl text-center shadow">
                <p className="text-xs text-[#2C666E]/80 flex justify-center items-center gap-1">
                  <FaCalendarAlt /> Release
                </p>
                <p className="text-sm font-medium text-[#2C666E]">
                  {movie.release_date || "-"}
                </p>
              </div>

              {/* Status */}
              <div className="p-4 bg-[#2C666E]/10 rounded-xl text-center shadow">
                <p className="text-xs text-[#2C666E]/80 flex justify-center items-center gap-1">
                  <MdMovieFilter /> Status
                </p>
                <p
                  className={`text-sm font-bold ${
                    movie.status === "Released"
                      ? "text-green-700"
                      : "text-orange-700"
                  }`}
                >
                  {movie.status === "Released" ? "Available" : "Upcoming Soon"}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="p-6 bg-[#2C666E]/10 rounded-2xl shadow-md h-fit">
            <h3 className="text-lg font-semibold text-[#2C666E] mb-3">
              Movie Details
            </h3>

            <ul className="text-sm text-gray-800 space-y-2">
              <li>
                <strong>Popularity:</strong> {movie.popularity}
              </li>
              <li>
                <strong>Studios:</strong>{" "}
                {movie.production_companies?.map((c) => c.name).join(", ")}
              </li>
              <li>
                <strong>Countries:</strong>{" "}
                {movie.production_countries?.map((c) => c.name).join(", ")}
              </li>
              <li>
                <strong>Language:</strong>{" "}
                {movie.original_language?.toUpperCase()}
              </li>
              <li>
                <strong>Price:</strong> {formattedIDR(movie.price)}
              </li>
            </ul>

            {/* BUY BUTTON */}
            <button
              onClick={() => setShowPayment(true)}
              className="w-full mt-4 py-3 rounded-xl bg-[#2C666E] text-white font-semibold text-sm shadow-lg hover:bg-[#244f55] active:scale-95 transition"
            >
              Buy Movie
            </button>

            {showPayment && (
              <PaymentModal
                movie={movie}
                onClose={() => setShowPayment(false)}
                onSuccess={() => console.log("Success!")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
