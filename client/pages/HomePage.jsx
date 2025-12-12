/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import MovieCard from "../components/MoviesCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../store/movieSlice";

export default function HomePage() {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movie.items);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  useEffect(() => {
    dispatch(fetchMovies());
  }, []);

  const genres = useMemo(() => {
    const set = new Set();
    movies.forEach((m) => {
      if (Array.isArray(m.genres)) {
        m.genres.forEach((g) => set.add(g));
      }
    });
    return ["all", ...Array.from(set).sort()];
  }, [movies]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return movies.filter((m) => {
      const matchTitle = !q || m.title?.toLowerCase().includes(q);
      const matchGenre =
        genre === "all" ||
        (Array.isArray(m.genres) && m.genres.includes(genre));
      return matchTitle && matchGenre;
    });
  }, [movies, search, genre]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
    [filtered.length]
  );

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [search, genre]);

  return (
    <div className="min-h-screen" style={{ background: "#F0EDEE" }}>
      <div className="px-6 py-10">
        <h1 className="text-3xl font-bold text-center text-[#2C666E] drop-shadow mt-6 mb-10">
          Welcome to Cinetix!
        </h1>

        <div
          className="bg-white rounded-2xl shadow-xl border"
          style={{ borderColor: "rgba(44,102,110,0.1)" }}
        >
          <div className="px-6 py-6">
            <h1
              className="text-3xl text-center font-bold mb-6"
              style={{ color: "#2C666E" }}
            >
              Movies
            </h1>

            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movies by title"
                className="w-full md:w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C666E]/50"
              />

              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full md:w-1/3 px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2C666E]/50"
              >
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g === "all" ? "All Genres" : g}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {paginated.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-3 py-2 rounded-lg border ${
                  page === 1
                    ? "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed"
                    : "text-[#2C666E] border-[#2C666E]/30 bg-white hover:bg-[#2C666E]/10"
                }`}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`px-3 py-2 rounded-lg border min-w-[44px] ${
                    n === page
                      ? "bg-[#2C666E] text-white border-[#2C666E]"
                      : "text-[#2C666E] border-[#2C666E]/30 bg-white hover:bg-[#2C666E]/10"
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`px-3 py-2 rounded-lg border ${
                  page === totalPages
                    ? "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed"
                    : "text-[#2C666E] border-[#2C666E]/30 bg-white hover:bg-[#2C666E]/10"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
