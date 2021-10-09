const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const fs = require('fs');
const topMovies = require('./movie_list');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/movies', { useNewUrlParser: true, useUnifiedTopology: true});

const app = express();


app.use(morgan('common', {
  stream: fs.createWriteStream('./log.txt', {flags: 'a'})
}));

app.use(morgan('common'));

app.use(express.static('public'));

app.use(express.json());
app.use(methodOverride());

app.get('/movies', (req, res) => {
  Movies.Title.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + error)
  });
});

app.get('/movieinfo', (req,res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + error)
  });  
});

app.get('/movies/genres', (req, res) => {
  Movies.Genre.find()
    .then((genre) => {
      res.status(201).json(genre);
    })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + error)
  });  
});  

app.get('/movieinfo/director', (req, res) => {
  Movies.Director.find()
  .then((director) => {
    res.status(201).json(director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + error)
  });  
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
    res.status(500).send('Error: ' + err);
  });
});

app.put('users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set: 
    {
    Username: req.body.Username,
    Password: req.body.password,
    Email: req.body.Email,
    Birthday: req.body.Birthday
    }
  },
  { new :true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

app.get('users/:Username/favorites', (req, res) => {
  Users.FavoriteMovies.find()
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  })
});

app.post('/users/:Username/movies/MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }  
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

app.delete('/users/:Username/favorites/remove', (req, res) => {
  Users.FavoriteMovies.findOneAndRemove({ Title: req.params.Title })
    .then((movie) => {
      if (!movie) {
        res.status(400).send(req.params.Title + ' was not found');
      } else {
        res.status(200).send(req.params.Title + ' was removed from favorites list');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + 'was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


app.get('/documentation', (req, res) =>{
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