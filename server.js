const express = require('express');
const server = express();
const PORT = 3000;
const data = require('./Movie-data/data.json')
let filterdData = {}
const cors = require('cors');
const axios = require('axios')
require('dotenv').config();
server.use(cors())
const APIKey = process.env.apikey
server.use(express.json())
//
const pg = require('pg');
const client = new pg.Client('postgresql://localhost:5432/movie'
)



server.get('/trending', trendingMovie)
server.get(`/search`, searchMovie)

server.get('/upComing', comingMovie)

server.get('/discover', discoverMovie)


server.get('/addMovie', addMovieHandler)
server.post('/addMovie',addMovieHandler)




function trendingMovie(req, res) {
    const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${APIKey}`



    axios.get(url)
        .then(resulting => {

            let mapTrending = resulting.data.results.map(item => {

                let trendingMovie = new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview);
                console.log(trendingMovie)

                return trendingMovie;
            })
            console.log(mapTrending)
            res.send(mapTrending)

        })

        .catch((error) => {
            console.log('sorry there is an error', error)
            res.status(500).send(error);
        })


}





function searchMovie(req, res) {

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&language=en-US&query=The&page=2`



    axios.get(url)
        .then(resulting => {

            let mapSearch = resulting.data.results.map(item => {

                let searchMovie = new Movie(item.id, item.title);
                console.log(searchMovie)
                return searchMovie;
            })
            console.log(mapSearch)
            res.send(mapSearch)

        })

        .catch((error) => {
            console.log('sorry there is an error', error)
            res.status(500).send(error);
        })


}


function discoverMovie(req, res) {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${APIKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`



    axios.get(url)
        .then(resulting => {

            let mapDiscover = resulting.data.results.map(item => {

                let discoverMovie = new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview);
                console.log(discoverMovie)

                return discoverMovie;
            })
            console.log(mapDiscover)
            res.send(mapDiscover)

        })

        .catch((error) => {
            console.log('sorry there is an error', error)
            res.status(500).send(error);
        })


}


function comingMovie(req, res) {
    const url = `
    https://api.themoviedb.org/3/movie/upcoming?api_key=${APIKey}&language=en-US&page=1`



    axios.get(url)
        .then(resulting => {

            let mapComing= resulting.data.results.map(item => {

                let comingMovie = new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview);
                console.log(comingMovie)

                return comingMovie;
            })
            console.log(mapComing)
            res.send(mapComing)

        })

        .catch((error) => {
            console.log('sorry there is an error', error)
            res.status(500).send(error);
        })}











server.get('*', (req, res) => {
    let error = {
        "status": 404,
        "responseText": "page not found error"
    }
    res.status(404).send(error)

})

///////

function gitMovieHandler(req,res){
    const sql = `SELECT * FROM newMovie`;
    client.query(sql)
    .then(data=>{
        res.send(data.rows);
    })

    .catch((error)=>{
        errorHandler(error,req,res)
    })
}


function addMovieHandler(req,res){
    const addedMovie = req.body;
    console.log(addedMovie);
    const sql = `INSERT INTO newMovie (title, opinion)
    VALUES ($1, $2 );`
    const values = [addedMovie.title , addedMovie.summary]; 
    client.query(sql,values)
    .then(data=>{
        res.send("The data has been added successfully");
    })
    .catch((error)=>{
        errorHandler(error,req,res)
    })}



    


/////
function Movie(id, title, release_date, poster_path, overview) {

    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;

}


/////
function errorHandler(error,req,res){
        const err = {
            status: 500,
            message: error
        }
        res.status(500).send(err);
    }









client.connect()
.then(()=>{
    server.listen(PORT, () => {
        console.log(`Listening on ${PORT}: I'm ready`)
    })
})      