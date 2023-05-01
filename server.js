const express = require('express');
const server = express();
const PORT = 3000;
const data = require('./Movie-data/data.json')
let filterdData = {}


/*filterdData["title"]=(data.title)
filterdData["poster_path"]=(data.poster_path)
filterdData["overview"]=(data.overview)*/
function Movie(newData) {
    this.title = newData.title;
    this.poster_path = newData.poster_path;
    this.overview = newData.overview;

}
let firstMovie = new Movie(data)
server.get('/', (req, res) => {
    res.send(firstMovie)
})
server.get('/favorite', (req, res) => {
    res.send("Welcome to Favorite Page")
})



server.get('/error', (req, res) => {

    let Error500 = {
        "status": 500,
        "responseText": "Sorry, something went wrong"
    }
    res.status(500).send(Error500)
})
server.get('*', (req, res) => {
    let error = {
        "status": 404,
        "responseText": "page not found error"
    }
    res.status(404).send(error)

})

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}: I'm ready`)
})