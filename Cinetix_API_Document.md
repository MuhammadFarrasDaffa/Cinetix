# Cinetix API Documentation

Base URL: `http://localhost:3000` (development) or your deployed server URL

## Table of Contents

- [Authentication](#authentication)
- [User Endpoints](#user-endpoints)
- [Movie Endpoints](#movie-endpoints)
- [Profile Endpoints](#profile-endpoints)
- [Watchlist Endpoints](#watchlist-endpoints)
- [Collection Endpoints](#collection-endpoints)
- [Payment Endpoints](#payment-endpoints)
- [Error Responses](#error-responses)

---

## Authentication

Most endpoints require authentication via JWT token. Include the token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

---

## User Endpoints

### 1. Register

Create a new user account.

**Endpoint:** `POST /register`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (201 Created):**

```json
{
  "message": "Register Successfull"
}
```

**Errors:**

- `400 Bad Request` - Validation errors (missing email/password, invalid format, email already exists)

---

### 2. Login

Authenticate and receive JWT token.

**Endpoint:** `POST /login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login Successfull"
}
```

**Errors:**

- `400 Bad Request` - Missing email or password
- `401 Unauthorized` - Invalid email or password

---

### 3. Google Login

Authenticate using Google OAuth.

**Endpoint:** `POST /google-login`

**Request Body:**

```json
{
  "google_token": "google_oauth_token_here"
}
```

**Response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login Successfull"
}
```

**Errors:**

- `400 Bad Request` - Missing google_token

---

## Movie Endpoints

All movie endpoints require authentication.

### 1. Get All Movies

Retrieve list of all movies.

**Endpoint:** `GET /movies`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "tmdbId": 12345,
    "title": "Example Movie",
    "imageUrl": "https://image.tmdb.org/...",
    "price": 50000,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### 2. Get Movie by ID

Retrieve detailed information about a specific movie from TMDB.

**Endpoint:** `GET /movies/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "id": 12345,
  "title": "Example Movie",
  "overview": "Movie description...",
  "release_date": "2024-01-01",
  "vote_average": 8.5,
  "runtime": 120,
  "genres": [
    { "id": 28, "name": "Action" },
    { "id": 12, "name": "Adventure" }
  ],
  "poster_path": "/path_to_poster.jpg",
  "backdrop_path": "/path_to_backdrop.jpg",
  "price": 50000,
  "dbID": 1
}
```

**Errors:**

- `404 Not Found` - Movie not found

---

### 3. Get Movie Recommendations

Get AI-powered movie recommendations based on user profile.

**Endpoint:** `GET /movies/recommendations`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (201 Created):**

```json
[
  {
    "id": 1,
    "imageUrl": "https://image.url/movie1.jpg",
    "rating": 8.5,
    "description": "Movie description here",
    "title": "Movie Title",
    "genres": ["Action", "Adventure"],
    "year": 2020,
    "reason": "Recommended because it matches your preferred genres and age rating."
  }
]
```

**Errors:**

- `404 Not Found` - User profile not found

**Note:** This endpoint uses Google Generative AI to provide personalized recommendations based on user age and genre preferences.

---

## Profile Endpoints

All profile endpoints require authentication.

### 1. Get User Profile

Retrieve the authenticated user's profile.

**Endpoint:** `GET /profiles`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "id": 1,
  "UserId": 1,
  "username": "john_doe",
  "age": 25,
  "imageUrl": "https://cloudinary.com/.../profile.jpg",
  "preferences": ["Action", "Sci-Fi", "Thriller"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**

- `404 Not Found` - Profile not found

---

### 2. Update Profile

Update user profile information.

**Endpoint:** `PUT /profiles/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "username": "john_doe_updated",
  "age": 26,
  "preferences": ["Action", "Comedy", "Drama"],
  "imageUrl": "https://example.com/new-image.jpg"
}
```

**Response (200 OK):**

```json
{
  "message": "Profile updated successfully"
}
```

**Errors:**

- `404 Not Found` - Profile not found
- `403 Forbidden` - Not authorized to update this profile

---

### 3. Update Profile Picture

Upload and update profile picture via Cloudinary.

**Endpoint:** `PATCH /profiles/update-image`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

- `newImage`: Image file (JPEG, PNG, GIF, or WebP)

**Response (200 OK):**

```json
{
  "message": "Image updated"
}
```

**Errors:**

- `400 Bad Request` - File is required or invalid file type
- `404 Not Found` - Profile not found

---

## Watchlist Endpoints

All watchlist endpoints require authentication.

### 1. Get User Watchlist

Retrieve all movies in the user's watchlist.

**Endpoint:** `GET /watchlists`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "UserId": 1,
    "MovieId": 5,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "Movie": {
      "id": 5,
      "title": "Example Movie",
      "imageUrl": "https://image.tmdb.org/...",
      "price": 50000
    }
  }
]
```

**Errors:**

- `404 Not Found` - No watchlists found

---

### 2. Check if Movie is in Watchlist

Check if a specific movie is in the user's watchlist.

**Endpoint:** `GET /watchlists/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**URL Parameters:**

- `id`: Movie ID

**Response (200 OK):**

```json
{
  "isWatchlist": true
}
```

or

```json
{
  "isWatchlist": false
}
```

---

### 3. Add Movie to Watchlist

Add a movie to the user's watchlist.

**Endpoint:** `POST /watchlists/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**URL Parameters:**

- `id`: Movie ID

**Response (201 Created):**

```json
{
  "message": "Movie added to watchlist",
  "watchlist": {
    "id": 10,
    "UserId": 1,
    "MovieId": 5,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**

- `400 Bad Request` - Movie already in watchlist
- `404 Not Found` - Movie not found

---

### 4. Remove Movie from Watchlist

Remove a movie from the user's watchlist.

**Endpoint:** `DELETE /watchlists/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**URL Parameters:**

- `id`: Movie ID

**Response (200 OK):**

```json
{
  "message": "Movie removed from watchlist"
}
```

**Errors:**

- `404 Not Found` - Movie not found in watchlist

---

## Collection Endpoints

Collections represent movies purchased/owned by users.

### 1. Get User Collections

Retrieve all movies owned by the user.

**Endpoint:** `GET /collections`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "UserId": 1,
    "MovieId": 3,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "Movie": {
      "id": 3,
      "title": "Example Movie",
      "imageUrl": "https://image.tmdb.org/...",
      "price": 50000
    },
    "User": {
      "id": 1,
      "email": "user@example.com"
    }
  }
]
```

---

### 2. Delete Collection

Remove a movie from the user's collection.

**Endpoint:** `DELETE /collections/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**URL Parameters:**

- `id`: Collection ID

**Response (200 OK):**

```json
{
  "message": "Collection deleted successfully"
}
```

**Errors:**

- `404 Not Found` - Collection not found
- `403 Forbidden` - Not authorized to delete this collection

---

## Payment Endpoints

### 1. Create Transaction

Create a new payment transaction using Midtrans.

**Endpoint:** `POST /payments/create`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "movieId": 5,
  "title": "Example Movie",
  "price": 50000
}
```

**Response (201 Created):**

```json
{
  "snapToken": "66e4fa55-fdac-4ef9-91b5-733b97d1b862",
  "redirectUrl": "https://app.sandbox.midtrans.com/snap/v3/redirection/...",
  "orderId": "ORDER-1704067200000-1"
}
```

**Errors:**

- `400 Bad Request` - Missing required fields or movie already owned

**Note:**

- This endpoint automatically creates a Collection record for the user
- Payment status is initially set to "pending"
- Use the `snapToken` to initiate payment UI with Midtrans Snap
- Use the `redirectUrl` to redirect user to payment page

---

### 2. Payment Webhook (Midtrans Callback)

Receive payment status updates from Midtrans.

**Endpoint:** `POST /payments/webhook`

**Note:** This endpoint is called by Midtrans, not by the client application.

**Request Body (from Midtrans):**

```json
{
  "transaction_time": "2024-01-01 12:00:00",
  "transaction_status": "settlement",
  "transaction_id": "abc123...",
  "order_id": "ORDER-1704067200000-1",
  "gross_amount": "50000.00",
  "currency": "IDR",
  "payment_type": "credit_card",
  "signature_key": "..."
}
```

**Response (200 OK):**

```json
{
  "status": "OK",
  "orderId": "ORDER-1704067200000-1",
  "paymentStatus": "settlement"
}
```

**Possible Payment Statuses:**

- `pending`: Payment initiated but not completed
- `settlement`: Payment successful
- `deny`: Payment denied
- `cancel`: Payment cancelled by user
- `expire`: Payment expired

---

### 3. Get User Payments

Retrieve all payment transactions for the authenticated user.

**Endpoint:** `GET /payments`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "OrderId": "ORDER-1704067200000-1",
    "UserId": 1,
    "MovieId": 5,
    "amount": 50000,
    "status": "settlement",
    "transactionDetails": "{...}",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "Movie": {
      "id": 5,
      "title": "Example Movie",
      "imageUrl": "https://image.tmdb.org/...",
      "price": 50000
    }
  }
]
```

---

## Error Responses

All endpoints follow a consistent error response format:

### Validation Error (400 Bad Request)

```json
{
  "message": "Email is required"
}
```

### Unauthorized (401)

```json
{
  "message": "Invalid email or password"
}
```

or

```json
{
  "message": "Invalid Token"
}
```

### Forbidden (403)

```json
{
  "message": "You don't have permission to delete this collection"
}
```

### Not Found (404)

```json
{
  "message": "Movie not found"
}
```

### Server Error (500)

```json
{
  "message": "Internal server error"
}
```

---

## Notes

1. **Authentication**: Most endpoints require a valid JWT token obtained from `/login` or `/google-login`
2. **Midtrans Integration**: Payment processing uses Midtrans sandbox environment (change `isProduction: false` to `true` for production)
3. **Image Upload**: Profile pictures are stored in Cloudinary with folder `Cinetix_Profiles`
4. **AI Recommendations**: Movie recommendations use Google Generative AI (Gemini 2.5 Flash model)
5. **TMDB Integration**: Movie details are fetched from The Movie Database (TMDB) API

---

## Environment Variables Required

```env
# Database
DATABASE_URL=...

# JWT
JWT_SECRET=your_jwt_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# Midtrans
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key

# Cloudinary
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# TMDB
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_KEY=your_tmdb_bearer_token

# Google Generative AI
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

---

## API Flow Examples

### Complete Purchase Flow

1. User logs in: `POST /login`
2. User browses movies: `GET /movies`
3. User views movie details: `GET /movies/:id`
4. User initiates purchase: `POST /payments/create`
5. Frontend opens Midtrans Snap with received token
6. User completes payment on Midtrans
7. Midtrans sends webhook: `POST /payments/webhook`
8. Payment status updated, movie added to collection
9. User views purchased movies: `GET /collections`

### Recommendation Flow

1. User updates profile preferences: `PUT /profiles/:id`
2. User requests recommendations: `GET /movies/recommendations`
3. AI analyzes user preferences and returns 3 recommended movies
4. User can add recommendations to watchlist: `POST /watchlists/:id`

---

_API Version: 1.0.0_  
_Last Updated: December 12, 2025_
