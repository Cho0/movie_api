# movie_api

This movie api is really a practice for Reading, Updating, Deleting and Creating information from a database. With integration of a hashed password from account creation and 
getting a token to then get access to the rest of the website, It has a lot of the tools needed to get started in working on actual websites.

My poor poor decisions and my unlucky outcomes:
This project was an absolute pain to get working. A combo of me not knowing what is right and wrong and the lesson material being a little hard to understand.
While I cant explain everything that happened in detail, one of the biggest issues I had was with the specific port of 8080 not working...
When downloading PostgreSQL, it had me put in a port so I put in the specific port 8080. Now this would create problems for some reason with postman.
Apparently, the SQL program was occupying the port 8080, and this would have been an easy fix IF the terminal said the error: port busy/port occupied.
The issue was that it didn't give me that error. So I would go on a months journey to figure out why the heck the port wouldn't work, not knowing that I could just use another 
port. But to be fair, if it told me the right error (port busy), I would have used a different port. But I was stuck thinking it was a code or postman issue that no one on the 
internet has come across yet. 

The second issue I had was installing mongodb. There was no indication that I had to install a specific version of mongo. So I thought it would be the most reasonable thing to
download the latest version. Boy would I wished I didn't. I later find out in my terminal that Heroku doesn't have a version 5 for mongo. It would only go up to 4.4. So what? Easy
fix. Just uninstall your mongo and get the 4.4 version. Well according to my mongo compass, It had lost the database I had put into it. And after a gruelling 30 minutes, I had 
restored the information AND had backed it up this time. Live and learn I guess.
