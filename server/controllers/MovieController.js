const { Movie } = require("../models");

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

            console.log(id);


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

            console.log(response, "<<<< response");

            let data_details = await response.json()

            console.log(data_details, "<<<< data_details");


            res.status(200).json(data_details);

        } catch (error) {
            console.log("🚀 ~ getMovieById ~ error:", error);
            next(error);
        }
    }
}