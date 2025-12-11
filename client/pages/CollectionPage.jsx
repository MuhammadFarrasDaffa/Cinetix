import { useEffect, useState } from "react";
import CollectionCard from "../components/CollectionCard";
import { http } from "../helpers/http-client";
import { FaFilm } from "react-icons/fa";

export default function CollectionPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch collections
  async function fetchCollections() {
    try {
      const { data } = await http({
        method: "GET",
        url: `/collections`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setCollections(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching collections:", err);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div className="min-h-screen px-8 py-12 bg-[#F0EDEE]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#2C666E] drop-shadow-sm flex items-center gap-3">
          <FaFilm className="text-[#2C666E]" />
          My Collection
        </h1>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center min-h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C666E]"></div>
            <p className="text-[#2C666E] font-medium">Loading koleksi...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && collections.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-64 bg-white rounded-2xl shadow-md border border-[#2C666E]/10">
          <FaFilm className="text-6xl text-[#2C666E]/30 mb-4" />
          <h2 className="text-2xl text-[#2C666E] font-bold mb-2">
            Koleksi Masih Kosong
          </h2>
          <p className="text-gray-600 text-center max-w-md">
            Belum ada film di koleksi kamu. Beli film favorit kamu sekarang dan
            lihat di sini!
          </p>
        </div>
      )}

      {/* Collections Grid */}
      {!loading && collections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onRefresh={fetchCollections}
            />
          ))}
        </div>
      )}
    </div>
  );
}
