import { useEffect, useState } from "react";
import WatchlistCard from "../components/WatchlistCard";
import { http } from "../helpers/http-client";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch watchlist
  async function fetchWatchlist() {
    try {
      const { data } = await http({
        method: "GET",
        url: `/watchlists`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setWatchlist(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Remove item
  async function handleRemove(movieId) {
    try {
      await http({
        method: "DELETE",
        url: `/watchlists/${movieId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      // Update UI
      setWatchlist((prev) => prev.filter((item) => item.id !== movieId));
      fetchWatchlist();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchWatchlist();
  }, []);

  return (
    <div className="min-h-screen px-8 py-12" style={{ background: "#F0EDEE" }}>
      {/* Title */}
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#2C666E] drop-shadow">
            🎬 My Watchlist
          </h1>
        </div>

        {/* Empty State */}
        {!loading && watchlist.length === 0 && (
          <div
            className="text-center mt-20 bg-white rounded-2xl shadow-xl border p-10"
            style={{ borderColor: "rgba(44,102,110,0.1)" }}
          >
            <h2 className="text-xl text-[#2C666E] font-semibold">
              You haven't added any movies yet
            </h2>
            <p className="text-gray-600 mt-2">
              Add your favorite movies and see them here.
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <p className="text-white text-lg font-medium drop-shadow">
            Loading...
          </p>
        )}

        {/* Watchlist Items */}
        <div
          className="flex flex-col gap-5 mt-4 bg-white rounded-2xl shadow-xl border p-6"
          style={{ borderColor: "rgba(44,102,110,0.1)" }}
        >
          {watchlist?.map((movie) => (
            <WatchlistCard
              key={movie.id}
              movie={movie}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
