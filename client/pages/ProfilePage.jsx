import { useState, useEffect } from "react";
import { http } from "../helpers/http-client";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendations as fetchRecommendationsThunk } from "../store/recommendationsSlice";

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: recs, loading: loadingRecs } = useSelector(
    (state) => state.recommendations
  );
  const [user, setUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    age: "",
    imageUrl: "",
    preferences: [],
  });

  const GENRES = [
    "Action",
    "Adventure",
    "Fantasy",
    "Drama",
    "Comedy",
    "Horror",
    "Romance",
    "Thriller",
    "Sci-Fi",
  ];

  // Fetch Profile
  async function fetchProfile() {
    try {
      const { data } = await http({
        method: "GET",
        url: "/profiles",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setUser(data);

      setForm({
        username: data.username,
        age: data.age,
        imageUrl: data.imageUrl,
        preferences: Array.isArray(data.preferences)
          ? data.preferences
          : JSON.parse(data.preferences || "[]"),
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUploadImage(e) {
    setUploadLoading(true);
    try {
      const file = e.target.files[0];

      // Validasi file exist
      if (!file) {
        throw new Error("No file selected");
      }

      // Validasi file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file");
      }

      const formData = new FormData();
      formData.append("newImage", file);

      // Update profile image
      // PENTING: jangan set Content-Type header - axios akan handle otomatis untuk FormData
      const { data } = await http.patch(`/profiles/update-image`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      // Success notification
      window.Swal.fire({
        icon: "success",
        title: "Success",
        text: data.message || "Image uploaded successfully",
      });

      fetchProfile();
    } catch (err) {
      console.error("Upload error:", err);
      window.Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message || "Failed to upload image",
      });
    } finally {
      setUploadLoading(false);
    }
  }

  async function fetchRecommendations() {
    try {
      if (
        !user?.age ||
        (Array.isArray(user?.preferences)
          ? user.preferences.length === 0
          : false)
      ) {
        throw { message: "Input age and preferences genres first!" };
      }
      dispatch(fetchRecommendationsThunk());
    } catch (err) {
      console.log(err);
      window.Swal.fire({ icon: "error", title: "Oops...", text: err.message });
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update Profile
  const handleUpdateProfile = async () => {
    try {
      await http({
        method: "PUT",
        url: `/profiles/${user.id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        data: {
          username: form.username,
          age: form.age,
          imageUrl: form.imageUrl,
          preferences: [...form.preferences], // 👈 DIKIRIM SEBAGAI ARRAY BETUL
        },
      });

      fetchProfile();
      setEditOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  if (!user)
    return <p className="text-center text-gray-600 mt-10">Loading...</p>;

  return (
    <div
      className="min-h-screen px-6 py-10 flex justify-center rounded-3xl"
      style={{ background: "linear-gradient(135deg, #8ab9bfff, #2c666eff)" }}
    >
      <div className="max-w-3xl w-full bg-white/25 backdrop-blur-xl rounded-3xl shadow-xl p-10 border border-white/40">
        {/* Top Section */}
        <div className="flex items-center gap-6">
          <div className="relative group w-32 h-32">
            {/* Profile Image */}
            <img
              src={user.imageUrl}
              alt="profile"
              className="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-white/50"
            />

            {/* Hover Overlay */}
            <div
              className="
      absolute inset-0 rounded-full bg-black/50 opacity-0 
      group-hover:opacity-100 transition flex items-center justify-center
      cursor-pointer
    "
              onClick={() => document.getElementById("uploadProfile").click()}
            >
              <span className="text-white text-sm font-medium">
                {uploadLoading ? "Uploading..." : "Change Photo"}
              </span>
            </div>

            {/* Hidden File Input */}
            <input
              id="uploadProfile"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadImage}
            />
          </div>
          {/* Information */}
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
              {user.username}
            </h1>
            <p className="text-white/90 mt-1 text-sm">{user.age} years old</p>

            <button
              onClick={() => setEditOpen(true)}
              className="
                mt-4 px-5 py-2 bg-white/30 backdrop-blur-md
                text-[#2C666E] font-semibold rounded-xl
                hover:bg-white/50 transition shadow
              "
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Genre List */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-white mb-3">
            Favorite Genres
          </h2>

          <div className="flex flex-wrap gap-2">
            {user.preferences?.map((p) => (
              <span
                key={p}
                className="px-3 py-1 bg-[#2C666E]/20 text-white rounded-full text-xs shadow"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Recommended For You
            </h2>

            <button
              onClick={fetchRecommendations}
              className="
        px-4 py-2 bg-white/30 backdrop-blur-md
        text-white text-sm rounded-xl
        hover:bg-white/50 shadow transition
      "
            >
              Get Recommendations
            </button>
          </div>

          {/* Loading animation */}
          {loadingRecs && (
            <div className="mt-6 space-y-4">
              <p className="text-center text-xl font-semibold text-white">
                Loading...
              </p>
              ;
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="
          w-full h-40 rounded-2xl relative overflow-hidden
          bg-white/20 border border-white/30 shadow
        "
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                </div>
              ))}
            </div>
          )}

          {/* Recommendation Results */}
          {!loadingRecs && recs.length > 0 && (
            <div className="mt-6 space-y-6 animate-fadeIn">
              {recs.map((m, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/movies/${m.id}`)}
                  className="
                flex gap-4 bg-white/20 backdrop-blur-xl p-4
                rounded-2xl shadow-lg border border-white/30
                hover:shadow-xl hover:-translate-y-1 transition
                 "
                >
                  {/* Image */}
                  <img
                    src={m.imageUrl}
                    alt={m.title}
                    className="w-28 h-40 object-cover rounded-xl shadow-md"
                  />

                  {/* Text Content */}
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">
                        {m.title}
                      </h3>
                      <span className="text-yellow-300 text-sm font-semibold">
                        ⭐ {m.rating}
                      </span>
                    </div>

                    <p className="text-white/80 text-xs mt-1">{m.year}</p>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {m.genres.map((g) => (
                        <span
                          key={g}
                          className="
                  px-2 py-1 bg-[#2C666E]/30 text-white text-xs
                  rounded-lg border border-white/20 shadow
                "
                        >
                          {g}
                        </span>
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-white/80 text-sm mt-2 line-clamp-2">
                      {m.description}
                    </p>

                    {/* Reason */}
                    <p className="text-white/70 text-xs mt-3 italic">
                      {m.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white w-[420px] p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-semibold text-[#2C666E]">
              Edit Profile
            </h3>

            {/* Username */}
            <label className="block mt-4 text-sm text-gray-600">Username</label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full mt-1 p-2 rounded-xl border"
            />

            {/* Age */}
            <label className="block mt-4 text-sm text-gray-600">Age</label>
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="w-full mt-1 p-2 rounded-xl border"
            />

            {/* Image */}
            <label className="block mt-4 text-sm text-gray-600">
              Image URL
            </label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full mt-1 p-2 rounded-xl border"
            />

            {/* Genre Selector */}
            <label className="block mt-4 text-sm text-gray-600">
              Favorite Genres
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {GENRES.map((g) => (
                <label
                  key={g}
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer border ${
                    form.preferences.includes(g)
                      ? "bg-[#2C666E] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => {
                    let newPrefs = [...form.preferences];
                    if (newPrefs.includes(g)) {
                      newPrefs = newPrefs.filter((x) => x !== g);
                    } else {
                      newPrefs.push(g);
                    }
                    setForm({ ...form, preferences: newPrefs });
                  }}
                >
                  {g}
                </label>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateProfile}
                className="
                  px-5 py-2 bg-[#2C666E] text-white rounded-xl shadow
                  hover:bg-[#244f55] transition
                "
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
