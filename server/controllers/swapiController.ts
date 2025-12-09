import { Request, Response, NextFunction } from "express";
// note: 2 DIFFERENT response objs here: 1 response from SWAPI to server, 1 res from server to client

const API_KEY = "364d55f1f0msh935e709f926d171p114655jsnd8aa628e1124";
// make sure to add to fetch request -> { headers: { "X-RapidApi-Key": API_KEY }}

export default {
  // ADD MIDDLEWARE TO GET MORE CHARACTERS HERE

  getAllAnime: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Use fetch to get all char data
      // example: https://anime-db.p.rapidapi.com/anime to get char data
      //NOTE: response is from rapidAPI to server (NOT same as res)

      // hard-coded queries
      // will get 8 entries (size) from page 1
      const page = 1;
      const size = 8;

      const baseUrl = `https://anime-db.p.rapidapi.com/anime`;

      // Construct the URL for fetch, including query parameters
      const url = `${baseUrl}?page=${page}&size=${size}`;

      //  https://anime-db.p.rapidapi.com/anime?page=2&size=25

      const response = await fetch(
        url,
        { headers: { "X-RapidApi-Key": API_KEY } }
        // Check if API resp success
      );
      if (!response.ok) {
        throw new Error(`RapidAPI responded with status: ${response.status}`);
      }

      // Parse API resp (FROM JSON input -> convert to usable JavaScript)
      const allAnime = await response.json();

      // limit chars to manageable num
      //   const limitAnime = allAnime.slice(0, 3);

      // Store char data in res.locals obj (res -> Express res to client)
      //   res.locals.getAnime = limitAnime;

      res.locals.getAnime = allAnime;

      // Move to next middleware
      return next();
    } catch (err) {
      // Invoke global error handler
      return next({
        log: `getAllAnime error: ${err}`,
        message: { err: "getAllAnimeData error" },
      });
    }
  },


  // ADD MORE MIDDLEWARE HERE
 getByGenre: async (req: Request, res: Response, next: NextFunction) => {
    try {
  
   /* genre options are:
    "Award Winning",
    "Action",
    "Suspense",
    "Horror",
    "Ecchi",
    "Avant Garde",
    "Sports",
    "Supernatural",
    "Fantasy",
    "Gourmet",
    "Boys Love",
    "Drama",
    "Comedy",
    "Mystery",
    "Girls Love",
    "Slice of Life",
    "Adventure",
    "Romance",
    "Sci-Fi",
    */

    // get genre and sort from user input
    // const { genre, sort } = req.body;

      // hard-coded queries
      // will get 8 entries (size) from page 1
      const page = 1;
      const size = 8;
      const genre = "Fantasy"; // user input ->
      const sort = "asc"; // user input -> should be either 'asc' or 'desc'

      const baseUrl = `https://anime-db.p.rapidapi.com/anime`;

      // Construct the URL for fetch, including query parameters
      const url = `${baseUrl}?page=${page}&size=${size}&genres=${genre}&sortBy=ranking&sortOrder=${sort}`;

      //  https://anime-db.p.rapidapi.com/anime?page=2&size=25

      const response = await fetch(
        url,
        { headers: { "X-RapidApi-Key": API_KEY } }
        // Check if API resp success
      );
      if (!response.ok) {
        throw new Error(`RapidAPI responded with status: ${response.status}`);
      }

      // Parse API resp (FROM JSON input -> convert to usable JavaScript)
      const genreAnime = await response.json();

      // limit chars to manageable num
      //   const limitAnime = genreAnime.slice(0, 3);

      // Store char data in res.locals obj (res -> Express res to client)
      //   res.locals.getAnime = limitAnime;

      res.locals.animeGenre = genreAnime;

      // Move to next middleware
      return next();
    } catch (err) {
      // Invoke global error handler
      return next({
        log: `getByGenre error: ${err}`,
        message: { err: "getByGenre error" },
      });
    }
  },




};
