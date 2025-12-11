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
    <div>
      <h1 className="text-3xl font-bold text-center text-[#2C666E] mt-10 mb-10">
        Welcome to Cinetix!
      </h1>

      <div
        className="min-h-screen px-6 py-10 rounded-2xl"
        style={{ background: "#d7e3e4ff" }}
      >
        <h1
          className="text-3xl text-center font-bold mb-6"
          style={{ color: "#2c666e" }}
        >
          Movies
        </h1>

        <div className="grid grid-cols-5 gap-4">
          {movies.map((movie) => {
            return <MovieCard key={movie.id} movie={movie} />;
          })}
        </div>
      </div>
    </div>
  );
}
