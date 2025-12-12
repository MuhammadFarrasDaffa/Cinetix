import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { http } from "../helpers/http-client";
import { Link } from "react-router";

export default function MovieCard({ movie }) {
  const maxTitleLength = 22;
  const displayTitle =
    movie?.title?.length > maxTitleLength
      ? movie.title.substring(0, maxTitleLength) + "..."
      : movie?.title || "Untitled Movie";

  const [isWatchlist, setIsWatchlist] = useState(false);

  useEffect(() => {
    async function checkWatchlistStatus() {
      try {
        const { data } = await http({
          method: "GET",
          url: `/watchlists/${movie.id}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        setIsWatchlist(data.isWatchlist);
      } catch (error) {
        console.log("🚀 ~ checkWatchlistStatus ~ error:", error);
      }
    }
    checkWatchlistStatus();
  }, [movie.id, movie.isWatchlist]);

  return (
    <div
      className="
        group relative
        bg-white rounded-xl shadow-md border border-[#2C666E]/20 
        overflow-hidden cursor-pointer w-full h-80 flex flex-col
        transform transition-all duration-300 
        hover:scale-[1.04] hover:shadow-2xl
      "
    >
      {/* === Watchlist Heart Button (shows only on hover) === */}
      <button
        onClick={async (e) => {
          e.preventDefault();
          try {
            if (!isWatchlist) {
              // Add to watchlist logic here
              console.log(`Added "${movie.title}" to watchlist.`);
              await http({
                method: "POST",
                url: `/watchlists/${movie.id}`,
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "access_token"
                  )}`,
                },
              });
            } else {
              // Remove from watchlist logic here
              console.log(`Removed "${movie.title}" from watchlist.`);
              await http({
                method: "DELETE",
                url: `/watchlists/${movie.id}`,
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "access_token"
                  )}`,
                },
              });
            }
          } catch (error) {
            console.log(error);
          }

          setIsWatchlist(!isWatchlist);
        }}
        className="
          absolute top-2 right-2 z-20 p-2 rounded-full shadow 
          opacity-0 group-hover:opacity-100 transition-all duration-300
          bg-black/50 hover:bg-black/60 backdrop-blur-sm
        "
      >
        {isWatchlist ? (
          <FaHeart className="text-red-500 text-lg drop-shadow" />
        ) : (
          <FaRegHeart className="text-red-500 text-lg drop-shadow" />
        )}
      </button>

      {/* Poster */}
      <div className="h-40 w-full overflow-hidden relative">
        <img
          src={
            movie?.imageUrl ||
            "https://via.placeholder.com/500x750?text=No+Image"
          }
          alt={movie?.title || "Movie Poster"}
          className="
            w-full h-full object-cover transition-transform duration-500
            group-hover:scale-110
          "
        />
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg font-semibold text-[#2C666E] leading-tight truncate">
          {displayTitle}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-700 line-clamp-2 mt-1 flex-grow">
          {movie?.description || "No description available."}
        </p>

        {/* Genres scrollable */}
        <div
          className="
            flex gap-1 mt-2 overflow-x-auto no-scrollbar 
            scroll-smooth snap-x
          "
        >
          {movie.genres?.map((g, idx) => (
            <span
              key={idx}
              className="
                text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap 
                bg-[#2C666E]/10 text-[#2C666E]
                snap-start
              "
            >
              {g}
            </span>
          ))}
        </div>

        {/* Hide scrollbars */}
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Footer */}
        <div className="mt-3 flex justify-between items-center">
          <span className="text-[#2C666E] font-medium text-sm">
            ⭐ {movie?.rating || "0.0"}
          </span>

          <Link
            to={`/movies/${movie.id}`}
            className="text-xs px-2 py-1 rounded-md bg-[#2C666E] text-white hover:bg-[#244f55] transition"
          >
            Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
