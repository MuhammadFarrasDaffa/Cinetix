import { Link } from "react-router";

export default function WatchlistMovieCard({ movie, onRemove }) {
  // Format duration (ex: 139 → 2 Hours 19 Minutes)
  function formatDuration(mins) {
    if (!mins || mins <= 0) return "N/A";
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;

    let result = "";
    if (hours > 0) result += `${hours} Hour${hours > 1 ? "s" : ""} `;
    if (minutes > 0) result += `${minutes} Minute${minutes > 1 ? "s" : ""}`;
    return result.trim();
  }

  // Format Release Date → DD MMM YYYY
  function formatDate(date) {
    if (!date) return "Unknown";
    const d = new Date(date);
    if (isNaN(d)) return date;

    return d.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const film = movie.Movie;

  return (
    <div
      className="
        w-full h-70 flex 
        rounded-3xl overflow-hidden
        bg-white/20 backdrop-blur-xl
        border border-white/20
        shadow-lg hover:shadow-2xl
        hover:-translate-y-1 transition-all duration-300
        cursor-pointer
      "
    >
      {/* Left Image */}
      <div className="h-full w-48 min-w-48 overflow-hidden">
        <img
          src={film.imageUrl}
          alt={film.title}
          className="
            w-full h-full object-cover
            transition-transform duration-500 hover:scale-105
          "
        />
      </div>

      {/* Right Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* TITLE */}
          <h2 className="text-2xl font-bold text-[#2C666E] drop-shadow-sm">
            {film.title}
          </h2>

          {/* METADATA */}
          <div className="text-sm text-gray-700 mt-2 flex items-center gap-4 flex-wrap">
            {/* YEAR */}
            <span>{film.year}</span>

            {/* Divider */}
            <span className="opacity-60">•</span>

            {/* Duration */}
            <div className="flex items-center gap-1">
              <span className="text-[#2C666E] text-lg">⏱️</span>
              <span>{formatDuration(film.duration)}</span>
            </div>

            {/* Divider */}
            <span className="opacity-60">•</span>

            {/* Release Date */}
            <div className="flex items-center gap-1">
              <span className="text-[#2C666E] text-sm">📅</span>
              <span>{formatDate(film.releaseDate)}</span>
            </div>

            {/* Divider */}
            <span className="opacity-60">•</span>

            {/* STATUS */}
            {/* STATUS */}
            <div
              className={`
                px-2 py-1 rounded-lg text-xs font-semibold
                ${
                  film.status === "Released"
                    ? "bg-green-500/20 text-green-700"
                    : "bg-orange-500/20 text-orange-700"
                }
            `}
            >
              {film.status || "Unknown"}
            </div>
          </div>

          {/* GENRE BADGES */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {film.genres?.map((g, idx) => (
              <span
                key={idx}
                className="
                  bg-[#2C666E]/15 
                  text-[#2C666E] 
                  text-xs font-medium 
                  px-2 py-1 rounded-full 
                  border border-[#2C666E]/20
                  shadow-sm
                "
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-700 mt-3 line-clamp-2">
          {film.description}
        </p>

        {/* FOOTER */}
        <div className="flex items-center justify-between mt-4">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-lg drop-shadow-sm">⭐</span>
            <span className="text-sm font-semibold">{film.rating}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              to={`/movies/${film.id}`}
              className="
                text-sm px-4 py-2 rounded-lg border border-[#2C666E]/30 text-[#2C666E]
                bg-white hover:bg-[#2C666E] hover:text-white transition-all duration-200
              "
            >
              Detail
            </Link>
            <button
              onClick={() => onRemove?.(film.id)}
              className="
                text-sm px-4 py-2 rounded-lg bg-red-500/20 text-red-600 
                hover:bg-red-600 hover:text-white transition-all duration-200
              "
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
