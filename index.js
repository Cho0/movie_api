const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const fs = require('fs');
const topMovies = require('./movie_list');

const app = express();

app.use(morgan('common', {
  stream: fs.createWriteStream('./log.txt', {flags: 'a'})
}));

app.use(morgan('common'));

app.use(express.static('public'));

app.use(express.json());
app.use(methodOverride());

app.get('/movies', (req, res) => {
  res.send(topMovies);
});

app.get('/documentation', (req, res) =>{
  res.sendFile(__dirname + '/public/documentation.html');
});


//error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Somthing went wrong');
});


app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

// cd d:\Portfolio\movie_api