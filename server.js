const express = require('express');
const fs = require('fs');
const movies = require("./MOVIE_DATA.json");


const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({extended: false}));


app.get("/movies", (req, res) =>{
    const html = `
    <ul>
        ${movies.map((movie) => `<li>${movie.title} </li>`).join("")}
    </ul>`;
    res.send(html);
});

app.get("/api/movies", (req, res) =>{
    return res.json(movies);
});

app
.route("/api/movies/:id")
.get((req, res) =>{
    const id = Number(req.params.id);
    const movie = movies.find((movie) => movie.id === id);
    if (movie) {
        return res.json(movie);
      } else {
        return res.status(404).json({ error: "Movie not found" });
      }
    })

    .patch((req, res) => {
        const id = Number(req.params.id);
        const movieIndex = movies.findIndex((movie) => movie.id === id);
        if (movieIndex === -1) {
          return res.status(404).json({ error: "Movie not found" });
        }
    
        const updatedMovie = { ...movies[movieIndex], ...req.body };
        movies[movieIndex] = updatedMovie;
    
        fs.writeFile('./MOVIE_DATA.json', JSON.stringify(movies), (err, data) => {
          return res.json({ status: "Successfully updated", movie: updatedMovie });
        });
      })

      .delete((req, res) => {
        const id = Number(req.params.id);
        const movieIndex = movies.findIndex((movie) => movie.id === id);
        if (movieIndex === -1) {
          return res.status(404).json({ error: "Movie not found" });
        }
    
        const deletedMovie = movies.splice(movieIndex, 1)[0];
    
        fs.writeFile('./MOVIE_DATA.json', JSON.stringify(movies), (err, data) => {
          return res.json({ status: "Successfully deleted", deletedMovie });
        });
      });

app.post("/api/movies", (req, res) =>{
    const body = req.body;
    movies.push({ ...body, id: movies.length + 1 });
    fs.writeFile('./MOVIE_DATA.json', JSON.stringify(movies), (err, data) => {
        return res.json({status: "Success", id: movies.length });
    });    
});

app. listen(PORT, ()=> console.log(`Server started at Port ${PORT}`));

