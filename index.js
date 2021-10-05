const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const fs = require('fs');
const topMovies = require('./movie_list');
const models = require('./models');



const app = express();


app.use(morgan('common', {
  stream: fs.createWriteStream('./log.txt', {flags: 'a'})
}));

app.use(morgan('common'));

app.use(express.static('public'));

app.use(express.json());
app.use(methodOverride());

app.get('/movies', (req, res) => {
  topMovies.find(title)
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + error)
  });
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

app.put('/update', (req, res) => {
  res.send('Successful PUT request in updating user info');
});

app.post('/register', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

app.get('/users', (req, res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error:' + err);
  });
});

app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error:' + err);
  });
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


//port

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

// cd d:\Portfolio\movie_api