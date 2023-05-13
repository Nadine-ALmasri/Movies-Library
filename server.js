const express = require('express');
const server = express();
const PORT =process.env.PORT ||3005;
const data = require('./data.json')
let filterdData = {}
const cors = require('cors');
const axios = require('axios')
require('dotenv').config();
server.use(cors())
const APIKey = process.env.apikey|| "26913528334206209115fe1715eee547"
server.use(express.json())
//
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL)


server.get('/trending', trendingMovie)
server.get(`/search`, searchMovie)
server.get('/', homeHandler)
server.get('/upComing', comingMovie)
server.delete('/DELETE/:id', deleteHandler)
server.get('/discover', discoverMovie)
server.put('/newMovie/:id',updateNewMovie)

server.get('/addMovie', gitMovieHandler)
server.post('/addMovie',addMovieHandler)




function homeHandler(req, res) {
    res.status(200).send("Hello from the My Movie App")
}








function updateNewMovie(req,res){
    // De-structuring 
    // const id = req.params.id;
    const {id} = req.params;
    console.log(req.body);
    const sql = `UPDATE newMovie
    SET overview = $1
    WHERE id = ${id};`
    const {overview} = req.body;
    const values = [overview];
    client.query(sql,values).then((data)=>{
        res.send(data)
    })
    .catch((error)=>{
        errorHandler(error,req,res)
    })
}


function specificMovie(req, res) {
    const id = req.params.id;
    console.log(req.params);
    const sql = `SELECT * FROM newMovie WHERE id=${id} `;
    client.query(sql)
        .then(data => {
            res.send(data.rows);
        })

        .catch((error) => {
            errorHandler(error, req, res)
        })
}













function deleteHandler(req,res){
    const id = req.params.id;
    console.log(req.params);
    const sql = `DELETE FROM newMovie WHERE id=${id};`
    client.query(sql)
    .then((data)=>{
        res.status(202).send(data)
    })
    .catch((error)=>{
        errorHandler(error,req,res)
    })
}








function updateHandler(req,res){
    // De-structuring 
    // const id = req.params.id;
    const {id} = req.params;
    console.log(req.body);
    const sql = `UPDATE newMovie
    SET overview = $1
    WHERE id = ${id};`
    const {overview} = req.body;
    const values = [overview];
    client.query(sql,values).then((data)=>{
        res.send(data)
    })
    .catch((error)=>{
        errorHandler(error,req,res)
    })
}




























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
    const sql = `INSERT INTO newMovie (title,release_date,poster_path,overview)
    VALUES ($1,$2,$3,$4);`
    const values = [addedMovie.title, addedMovie.release_date , addedMovie.poster_path, addedMovie.overview]; 
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