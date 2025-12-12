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
    <div className="min-h-screen px-8 py-12" style={{ background: "#F0EDEE" }}>
      {/* Header */}
      <div className="mb-8">
        <div className="px-6 py-4 inline-flex items-center gap-3">
          <FaFilm className="text-[#2C666E]" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#2C666E]">
            My Collection
          </h1>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center min-h-64">
          <div
            className="flex flex-col items-center gap-3 bg-white rounded-2xl shadow-md border px-8 py-6"
            style={{ borderColor: "rgba(44,102,110,0.1)" }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C666E]"></div>
            <p className="text-[#2C666E] font-medium">Loading koleksi...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && collections.length === 0 && (
        <div
          className="flex flex-col items-center justify-center min-h-64 bg-white rounded-2xl shadow-md border px-8 py-10 text-center"
          style={{ borderColor: "rgba(44,102,110,0.1)" }}
        >
          <FaFilm className="text-6xl text-[#2C666E]/40 mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-[#2C666E]">
            Your Collection is Empty
          </h2>
          <p className="text-gray-600 max-w-md">
            Your collection is still empty. Buy your favorite movies now and see
            them here!
          </p>
        </div>
      )}

      {/* Collections Grid */}
      {!loading && collections.length > 0 && (
        <div
          className="bg-white rounded-2xl shadow-md border p-6"
          style={{ borderColor: "rgba(44,102,110,0.1)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onRefresh={fetchCollections}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
