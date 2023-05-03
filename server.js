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

server.get('/trending', trendingMovie)
server.get(`/search`, searchMovie)

server.get('/upComing', comingMovie)




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
function Movie(id, title, release_date, poster_path, overview) {

    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;

}
server.listen(PORT, () => {
    console.log(`Listening on ${PORT}: I'm ready`)
})