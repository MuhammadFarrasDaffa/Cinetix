/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import MovieCard from "../components/MoviesCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../store/movieSlice";

export default function HomePage() {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movie.items);

  useEffect(() => {
    dispatch(fetchMovies());
  }, []);

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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
