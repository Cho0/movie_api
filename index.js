const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const dotenv = require('dotenv');
const fs = require('fs');
const topMovies = require('./movie_list');
const mongoose = require('mongoose');
const Models = require('./models.js');
const { check, validationResult } = require('express-validator');
dotenv.config();

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();


app.use(morgan('common', {
  stream: fs.createWriteStream('./log.txt', { flags: 'a' })
}));

app.use(morgan('common'));

app.use(express.static('public'));

app.use(express.json());
app.use(methodOverride());


const passport = require('passport');

app.use(passport.initialize());

require('./passport');
const cors = require('cors');
app.use(cors());
let auth = require('./auth')(app);



app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
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

app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + error)
    });
});

app.get('/movies/by-genres/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ "Genre.Name": req.params.Genre })
    .then((genre) => {
      res.status(201).json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + error)
    });
});

app.get('/movies/by-director/:Director', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ "Director.Name": req.params.Director })
    .then((director) => {
      res.status(201).json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + error)
    });
});

app.post('/register', 
  // Validatiojn logic here for request
  //you can either use a chain of methdos like .not() .isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means 
  //minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email not valid').isEmail()
  ], (req, res) => {

    //check the validation object for errors
    let errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
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

app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
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


app.put('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
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

app.delete('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}, {
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



app.get('/documentation', (req, res) => {
  res.sendFile(__dirname + '/public/documentation.html');
});


/*error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Somthing went wrong');
});*/


//port

const port = process.env.PORT || 8000;
app.listen(port, '0.0.0.0',() => {
  console.log('Listening on Port ' + port);
});

// cd d:\Portfolio\movie_api

// mongoimport --uri mongodb+srv://JasonAdmin:TotallyLegitPassword@myflixdb.qrljb.mongodb.net/jasons-myFlix --collection movies --type json --file .\Portfolio\movie_api\movies.json

//mongo "mongodb+srv://myflixdb.qrljb.mongodb.net/MyflixDB" --username JasonAdmin

//mongodb+srv://JasonAdmin:TotallyLegitPassword@myflixdb.qrljb.mongodb.net/jasons-myFlix?retryWrites=true&w=majority