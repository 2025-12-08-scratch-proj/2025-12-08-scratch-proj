import { Request, Response, NextFunction } from "express";
// note: 2 DIFFERENT response objs here: 1 response from SWAPI to server, 1 res from server to client




export default {
 // ADD MIDDLEWARE TO GET MORE CHARACTERS HERE
  getMoreChar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Use fetch to get all char data
      // example: https://swapi.info/api/people/1 to get char data
      //NOTE: response is from SWAPI to server (NOT same as res)
      const response = await fetch(`https://swapi.info/api/people/`);

      // Check if API resp success
      if (!response.ok) {
        throw new Error(`SWAPI responded with status: ${response.status}`);
      }

      // Parse API resp (FROM JSON input -> convert to usable JavaScript)
      const allChars = await response.json();

      // limit chars to manageable num
      const limitChars = allChars.slice(0, 15);

      // Store char data in res.locals obj (res -> Express res to client)
      res.locals.moreCharacters = limitChars;

      // Move to next middleware
      return next();
    } catch (err) {
      // Invoke global error handler
      return next({
        log: `getMoreChar error: ${err}`,
        message: { err: "getMoreCharData error" },
      });
    }
  },

// ADD MORE MIDDLEWARE HERE

};