'use strict';
require("dotenv").config();

function randomPrice() {
  const raw = Math.floor(Math.random() * (75000 - 45000 + 1)) + 45000;
  return Math.round(raw / 1000) * 1000;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const url_movies = `${process.env.TMDB_BASE_URL}/movie/now_playing?page=1`;
    const options_movies = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_KEY}`
      }
    };

    const response_movies = await fetch(url_movies, options_movies);
    let data = await response_movies.json()

    data = await Promise.all(data.results.map(async (movie, i) => {

      async function getDetails() {
        try {
          const url_detail = `${process.env.TMDB_BASE_URL}/movie/${movie.id}`;
          const options_detail = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${process.env.TMDB_KEY}`
            }
          };

          const response_detail = await fetch(url_detail, options_detail);
          let detail = await response_detail.json();
          return detail;
        } catch (error) {
          console.log("🚀 ~ getDetails ~ error:", error)
          return {};
        }
      }


      const detail = await getDetails();

      const genresArray = detail.genres ? detail.genres.map(genre => genre.name) : [];
      return {
        tmdbId: movie.id,
        title: detail.title,
        description: movie.overview,
        rating: movie.vote_average,
        price: randomPrice(),
        genres: genresArray,
        duration: detail.runtime,
        imageUrl: `${process.env.TMDB_IMAGE_URL}${movie.poster_path}`,
        status: detail.status,
        releaseDate: movie.release_date,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }))

    await queryInterface.bulkInsert('Movies', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Movies', null, {});
  }
};
