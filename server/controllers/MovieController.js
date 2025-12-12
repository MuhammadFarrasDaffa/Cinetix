const { Movie, Profile } = require("../models");
const { GoogleGenAI } = require("@google/genai");


module.exports = class Controller {
    static async getMovies(req, res, next) {
        try {
            const movies = await Movie.findAll();
            res.status(200).json(movies);
        } catch (error) {
            console.log("🚀 ~ getMovies ~ error:", error);
            next(error);
        }
    }

    static async getMovieById(req, res, next) {
        try {
            const { id } = req.params;
            const movie = await Movie.findByPk(id);

            if (!movie) {
                throw { name: "Not Found", message: "Movie not found" };
            }

            const url_detail = `${process.env.TMDB_BASE_URL}/movie/${movie.tmdbId}`;
            const options_detail = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${process.env.TMDB_KEY}`
                }
            };


            const response = await fetch(url_detail, options_detail);

            let data_details = await response.json()
            data_details.price = movie.price
            data_details.dbID = movie.id

            res.status(200).json(data_details);

        } catch (error) {
            console.log("🚀 ~ getMovieById ~ error:", error);
            next(error);
        }
    }

    static async getRecommendations(req, res, next) {
        try {
            const id = req.user.id

            const genAI = new GoogleGenAI({});

            const user = await Profile.findOne({ where: { "UserId": id } })

            if (!user) {
                throw ({ name: "Not Found", message: "User Profile Not Found" });
            }

            const movies = await Movie.findAll();

            const response = await genAI.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `
                Task: Recommend EXACTLY 3 movies from the database below.
                Return ONLY valid JSON (array), without explanation or markdown.

                Database Movies:
                ${JSON.stringify(movies)}

                User Profile:
                Age: ${user.age}
                Liked Genres: ${user.preferences.join(', ')}

                Rules:
                - Recommendations MUST only come from the movies provided in the database.
                - Pick the 3 most suitable movies (based on matching genres and appropriate age).
                - If more than 3 matches exist, choose the best 3 based on genre match strength.
                - Output MUST be a JSON array of exactly 3 items.
                - Do not return anything except raw JSON.
                - Do NOT include markdown, backticks, or text outside JSON.

                Output JSON format example:
                [
                {
                    "id": "ID Movie ind database"
                    "imageUrl": "http://image.url/movie1.jpg",
                    "rating": 8.5,
                    "description": "Movie description here",
                    "title": "Movie Title",
                    "genres": ["Action", "Adventure"],
                    "year": 2020
                    "reason": "Your reason as a Anime Fans, why you recommend this anime?"
                }
                ]
                `
            });

            const data = JSON.parse(response.text.replace('```json', '').replace('```', '').trim())

            res.status(201).json(data);

        } catch (error) {
            console.log("🚀 ~ moviesRecommendation ~ error:", error);
            next(error);
        }
    }
}