const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const fs = require('fs');
const topMovies = require('./movie_list');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();


app.use(morgan('common', {
  stream: fs.createWriteStream('./log.txt', { flags: 'a' })
}));

app.use(morgan('common'));

app.use(express.static('public'));

app.use(express.json());
app.use(methodOverride());

app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + error)
    });
});

/*
app.post('/addmovie', (req, res) => {
  Movies.findOne({ Title: req.body.Title })
    .then((movie) => {
      if (movie) {
        return res.status(400).send(req.body.Title + 'already exists');
      } else {
        Movies
          .create({
            Title: req.body.Title,
            Description: req.body.Description,
            Genre: req.body.Genre,
            Director: req.body.Director
          })
          .then((movie) =>{res.status(201).json(movie) })
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
*/

app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + error)
    });
});

app.get('/movies/by-genres/:Genre', (req, res) => {
  Movies.find({ "Genre.Name": req.params.Genre })
    .then((genre) => {
      res.status(201).json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + error)
    });
});

app.get('/movies/by-director/:Director', (req, res) => {
  Movies.find({ "Director.Name": req.params.Director })
    .then((director) => {
      res.status(201).json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + error)
    });
});

app.post('/register', (req, res) => {
  Users.findOne({ Name: req.body.Name })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Name + 'already exists');
      } else {
        Users
          .create({
            Name: req.body.Name,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => { res.status(201).json(user) })
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

app.get('/users/:Name', (req, res) => {
  Users.findOne({ Name: req.params.Name })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.put('/users/:Name', (req, res) => {
  Users.findOneAndUpdate({ Name: req.params.Name },
    req.body,
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});


app.put('/users/:Name/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Name: req.params.Name }, {
    $push: { Favorites: req.params.MovieID }
  },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

app.delete('/users/:Name/favorites/:MovieID', (req, res) => {
  Users.findOneAndUpdate({Name: req.params.Name}, {
    $pull: {Favorites: req.params.MovieID}
  },
  {new: true},
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

app.delete('/users/:Name', (req, res) => {
  Users.findOneAndRemove({ Name: req.params.Name })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Name + 'was not found');
      } else {
        res.status(200).send(req.params.Name + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});



app.get('/documentation', (req, res) => {
  res.sendFile(__dirname + '/public/documentation.html');
});


/*error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Somthing went wrong');
});*/


//port

app.listen(8000, () => {
  console.log('Your app is listening on port 8000.');
});

// cd d:\Portfolio\movie_api