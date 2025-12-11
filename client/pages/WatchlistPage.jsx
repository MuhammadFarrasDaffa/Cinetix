import { useEffect, useState } from "react";
import WatchlistCard from "../components/WatchlistCard";
import { http } from "../helpers/http-client"; // optional: sesuaikan dengan project kamu

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
    <div className="min-h-screen px-8 py-12 bg-[#F0EDEE]">
      {/* Title */}
      <h1 className="text-3xl font-bold text-[#2C666E] mb-6 drop-shadow-sm">
        🎬 My Watchlist
      </h1>

      {/* Empty State */}
      {!loading && watchlist.length === 0 && (
        <div className="text-center mt-20">
          <h2 className="text-xl text-[#2C666E] font-semibold">
            Kamu belum menambahkan film apapun
          </h2>
          <p className="text-gray-600 mt-2">
            Tambahkan film favoritmu dan lihat di halaman ini.
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <p className="text-[#2C666E] text-lg font-medium">Loading...</p>
      )}

      {/* Watchlist Items */}
      <div className="flex flex-col gap-5 mt-4">
        {watchlist?.map((movie) => (
          <WatchlistCard key={movie.id} movie={movie} onRemove={handleRemove} />
        ))}
      </div>
    </div>
  );
}
