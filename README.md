# movie_api

This movie api is a practice for Reading, Updating, Deleting and Creating information to and from a database. With integration of a hashed password from account creation and 
getting a token to then get access to the rest of the website, it has a lot of the tools needed to get started in working on actual websites.

While it may seem simple, this is a step forward in order to create a website/application. In the process of creation, I had learned how to use modules and how I can create files 
everywhere with its own little bit of code and then connect it all using an module.export. 

In this project, I used the framework "Express". While I was using express testing my API becomes very simple with combination with "Postman".
After much more experimentation, I had multiple Get requests and other Post, Put, and Delete requests.
I had created a way for my future app to have users and profiles with hashed passwords and updatable information. As well as a way for my API to only be able to work if an user is
signed in through a Bearer Token Authorization request and a way to create said token on login.
The next thing that I had to do was to create a way for my API to exist on the web so I wouldn't have to create an internal server to access the API. For this I used Heroku as my
hosting service, so that no matter where I might be, as long as I have the link and the Bearer Token, I could access my API.

In the next my next project, I hope to put everything here to use.
