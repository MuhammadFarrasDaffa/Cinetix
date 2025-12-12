import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { http } from "../helpers/http-client";
import { Link } from "react-router";
import Swal from "sweetalert2";

export default function CollectionCard({ collection, onRefresh }) {
  const movie = collection?.Movie || {};
  const maxTitleLength = 22;
  const maxDescLength = 90;
  const displayTitle =
    movie?.title?.length > maxTitleLength
      ? movie.title.substring(0, maxTitleLength) + "..."
      : movie?.title || "Untitled Movie";

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Delete your collection?",
      text: `Are you sure you want to delete "${movie.title}" from your collection?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2C666E",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      setIsDeleting(true);
      try {
        await http({
          method: "DELETE",
          url: `/collections/${collection.id}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        Swal.fire("Berhasil!", "Film dihapus dari koleksi.", "success");
        onRefresh();
      } catch (err) {
        console.error("Error deleting collection:", err);
        Swal.fire("Error!", "Gagal menghapus film dari koleksi.", "error");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Link to={`/movies/${movie.id}`}>
      <div
        className="
          group relative
          bg-white rounded-xl shadow-md border border-[#2C666E]/20 
          overflow-hidden cursor-pointer w-full h-80 flex flex-col
          transform transition-all duration-300 
          hover:scale-[1.04] hover:shadow-2xl
        "
      >
        {/* === Delete Button (shows only on hover) === */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleDelete();
          }}
          disabled={isDeleting}
          className="
            absolute top-2 right-2 z-20 p-2 rounded-full shadow 
            opacity-0 group-hover:opacity-100 transition-all duration-300
            bg-red-500/80 hover:bg-red-600 backdrop-blur-sm
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          title="Hapus dari koleksi"
        >
          <FaTrash className="text-white text-lg drop-shadow" />
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
          <p className="text-sm text-gray-700 mt-1 flex-grow">
            {movie?.description
              ? movie.description.length > maxDescLength
                ? movie.description.substring(0, maxDescLength) + "..."
                : movie.description
              : "No description available."}
          </p>

          {/* Genres */}
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
            <span className="text-[#2C666E] font-bold text-sm">
              Rp {movie?.price?.toLocaleString("id-ID") || "0"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
