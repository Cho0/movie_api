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
  res.send('Successful GET request returning data on all movies');
});

app.get('/movieinfo', (req,res) => {
  res.send('Successful Get request retuning data on movie information');
});

app.get('/movies/genres', (req, res) => {
  res.send('Successful GET request returning list of all genres');
});

app.get('/movieinfo/director', (req, res) => {
  res.send('Successful Get request returning movie director information');
});

app.post('/register', (req, res) => {
  res.send('Successful POST request in creation of new user');
});

app.put('/update', (req, res) => {
  res.send('Successful PUT request in updating user info');
});

app.get('/favorites', (req, res) => {
  res.send('Successful GET request in returning data on user favorite movies');
});

app.put('/favorites/add', (req, res) => {
  res.send('Successful PUT request in adding movie into user favorites list');
});

app.delete('/favorites/remove', (req, res) => {
  res.send('Successful DELETE request in removing movie from user favorites list');
});

app.delete('/deregister', (req, res) => {
  res.send('Successful DELETE request in removing account from external source')
})


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