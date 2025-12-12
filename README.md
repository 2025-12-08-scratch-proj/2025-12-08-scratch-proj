# 2025-12-08-scratch-proj
 This project is an anime recommendation app where users can search for anime by genre and get anime data back, sorted by ranking. 
 
 To access the data, we used a fetch call and api-key (see swapiController.ts) from rapidapi.com. Note: There is a rate limit of 100 calls a day, so keep track of how much you're testing!

const API_KEY = "364d55f1f0msh935e709f926d171p114655jsnd8aa628e1124";

For the backend, we setup authentication / authorization that lets users sign up, login, and save / get favorites. Users' username, hashed password, and favorites array (default: empty array of anime objects) are saved to mongo DB. 

You can set up a .env file with your MONGO_URI (see .env_template and comments in server.ts) or just put that MONGO_URI connection string in server.ts (if you don't want to use .env).

You can set up your own database, teammember access, and get your own MONGO_URI username and password. 





