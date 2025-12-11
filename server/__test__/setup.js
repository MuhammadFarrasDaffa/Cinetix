if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// Set environment variables for testing
process.env.NODE_ENV = "test";
process.env.MIDTRANS_SERVER_KEY = "test_server_key";
process.env.GOOGLE_CLIENT_ID = "test_google_client_id";
process.env.TMDB_KEY = "test_tmdb_key";
process.env.TMDB_BASE_URL = "https://api.themoviedb.org/3";
process.env.CLOUD_NAME = "test_cloud";
process.env.CLOUD_API_KEY = "test_api_key";
process.env.CLOUD_API_SECRET = "test_api_secret";
