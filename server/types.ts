import type { RequestHandler } from "express";

export interface ErrorInfo {
  method: string;
  type: string;
  err: unknown;
}

export interface AnimeData {
  title: string;
  ranking: number;
  genres: string[];
  image: string;
  synopsis: string;
}

export interface UserController {
  getAllUsers: RequestHandler;
  createUser: RequestHandler;
  verifyUser: RequestHandler;
  addToFavorites: RequestHandler;
  getFavorites: RequestHandler;
}

export interface CookieController {
  setSSIDCookie: RequestHandler;
}

export interface SessionController {
  isLoggedIn: RequestHandler;
  startSession: RequestHandler;
}
