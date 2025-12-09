const fs = require("fs");

const schedules = [];

const movieCount = 40;
const studioCount = 5;
const showsPerDayPerStudio = 5; // jumlah jam tayang dalam sehari untuk satu studio
const baseDate = new Date(2025, 11, 12);

const times = [
    "11:00:00",
    "13:30:00",
    "16:00:00",
    "19:00:00",
    "21:30:00"
];

function randomPrice() {
    const raw = Math.floor(Math.random() * (75000 - 45000 + 1)) + 45000;
    return Math.round(raw / 1000) * 1000;
}

// movie index
let movieIndex = 1;

let day = 0;

// loop hari sampai film habis
while (movieIndex <= movieCount) {
    const currentDate = new Date(baseDate);
    currentDate.setDate(baseDate.getDate() + day);

    // Untuk setiap studio di hari itu
    for (let studio = 1; studio <= studioCount; studio++) {

        if (movieIndex > movieCount) break; // kalau filmnya habis

        // untuk setiap jam tayang hari ini
        for (let t = 0; t < showsPerDayPerStudio; t++) {
            schedules.push({
                MovieId: movieIndex,
                StudioId: studio,
                showDate: currentDate.toISOString().split("T")[0],
                showTime: times[t], // urut
                price: randomPrice()
            });
        }

        movieIndex++; // pindah ke film berikutnya
    }

    day++;
}

fs.writeFileSync("schedule.json", JSON.stringify(schedules, null, 2));

console.log("Total schedules generated:", schedules.length);
