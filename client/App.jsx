import bgImage from "./assets/bgImage.jpg";
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./stylesheets/styles.css";
import Select from "react-select";

const App = () => {
  const [genre, setGenre] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")
  const [searchCount, setSearchCount] = useState(0);
  const [totalExplored, setTotalExplored] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoritesError, setFavoritesError] = useState("");
  const [view, setView] = useState("home");

  const options = [
    { value: "Action", label: "Action" },
    { value: "Adventure", label: "Adventure" },
    { value: "Avant Garde", label: "Avant Garde" },
    { value: "Award Winning", label: "Award Winning" },
    { value: "Boys love", label: "Boys Love" },
    { value: "Comedy", label: "Comedy" },
    { value: "Drama", label: "Drama" },
    { value: "Ecchi", label: "Ecchi" },
    { value: "Fantasy", label: "Fantasy" },
    { value: "Girls love", label: "Girls Love" },
    { value: "Gourmet", label: "Gourmet" },
    { value: "Horror", label: "Horror" },
    { value: "Mystery", label: "Mystery" },
    { value: "Romance", label: "Romance" },
    { value: "Sci-Fi", label: "Sci-Fi" },
    { value: "Slice of Life", label: "Slice of Life" },
    { value: "Sports", label: "Sports" },
    { value: "Supernatural", label: "Supernatural" },
    { value: "Suspense", label: "Suspense" },
  ]

  const handleChange = async (selected) => {
    setGenre(selected);
    setResults([]);
    setError("")  
    if(!selected) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/genre?genre=${encodeURIComponent(selected.value)}` 
      );
      console.log(response)

      if (!response.ok) throw new Error("Failed to fetch anime");

      const data = await response.json();
      console.log(data);

      if (!data.animeGenre || !Array.isArray(data.animeGenre)) {
        throw new Error("Unexpected response format");
      }

      setResults(data.animeGenre);

      setSearchCount((prev) => prev + 1);
      setTotalExplored((prev) => prev + data.animeGenre.length);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while loading anime.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = async (anime) => {

    try {
      const response = await fetch("/api/genre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: anime.title,
          ranking: anime.ranking,
          genres: anime.genres,
          image: anime.image,
          synopsis: anime.synopsis,
        })
      })
      console.log(response);

      if (!response.ok) throw new Error("Failed to add favorite");

      const data = await response.json();

      if (data.favorites && Array.isArray(data.favorites)) {
        setFavorites(data.favorites);
      }

      alert("Added to favorites!");
    } catch (err) {
      console.error(err);
      alert("Could not add favorite. Please log in and try again.");
    }
  };
  

  const loadFavorites = async () => {
    setFavoritesError("");
    setFavoritesLoading(true);
    try {
      const res = await fetch("/oauth/favorites", {
        credentials: "include",
      });

    
      if (res.redirected && res.url.includes("/login")) {
        window.location.href = "/oauth/login";
        return;
      }

      const data = await res.json();

      if (!data.userFavs || !Array.isArray(data.userFavs)) {
        throw new Error("Unexpected favorites response");
      }

      setFavorites(data.userFavs);
    } catch (err) {
      console.error(err);
      setFavoritesError(
        "Could not load favorites. Please log in and try again."
      );
    } finally {
      setFavoritesLoading(false);
    }
  };

  useEffect(() => {
    if (view === "favorites") {
      loadFavorites();
    }
  }, [view]);

  const handleShowFavorites = () => {
    setView("favorites");
  };

  const handleShowHome = () => {
    setView("home");
  };



  return (
    <div className="app-background">
        <div className="top-right-buttons">
          <a href="/signup.html" className="auth-btn signup-btn">Sign Up</a>
          <a href="/login.html" className="auth-btn login-btn">Login</a>
          <button
          type="button"
          className="auth-btn favorites-btn"
          onClick={handleShowFavorites}
        >
          Favorites
        </button>
        </div>

      

      
      {view === "home" && (
        <>
          <div className="dropdown">
            <h1>Get anime recommendations based on your preferred genre.</h1>
            <Select
              placeholder="Select a genre: "
              options={options}
              onChange={handleChange}
              value={genre}
              isSearchable
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "50px",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                }),
              }}
            />
          </div>

          <div className="status-bar">
            <span>
              {genre ? (
                <>
                  Genre: <strong>{genre.label} {"|"}</strong>
                </>
              ) : (
                "No genre selected yet."
              )}
            </span>

            <span>
              {results.length > 0
                ? `${results.length} result${
                    results.length > 1 ? "s" : ""
                  } for this search |`
                : "No results loaded"}
            </span>

            {searchCount > 0 && (
              <span>
                Session: <strong>{totalExplored}</strong> titles explored in{" "}
                <strong>{searchCount}</strong>{" "}
                search{searchCount > 1 ? "es" : ""}
              </span>
            )}
          </div>

          <div className="results">
            {/* loading grid */}
            {loading && (
              <div className="results-grid">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <article key={idx} className="anime-card skel-card">
                    <div className="skel-image shimmer" />
                    <div className="skel-line shimmer" />
                    <div className="skel-line skel-line-short shimmer" />
                  </article>
                ))}
              </div>
            )}

            {!loading && error && (
              <p className="status error">{error}</p>
            )}

            {!loading && !error && !genre && (
              <p className="status">Pick a genre to see recommendations.</p>
            )}

            {!loading && !error && results.length > 0 && (
              <div className="results-grid">
                {results.map((anime) => (
                  <article key={anime.id} className="anime-card">
                    <img
                      src={anime.image}
                      alt={anime.title}
                      className="anime-result"
                    />
                    <div className="anime-card-content">
                      <div className="title-row">
                        <h2 className="anime-title">{anime.title}</h2>
                        <span
                          className="favorite-star"
                          onClick={() => handleAddFavorite(anime)}
                        >
                          ☆
                        </span>
                      </div>
                      <span className="anime-rank">
                        #{anime.ranking}
                      </span>
                      <p className="anime-description">
                        {anime.synopsis}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {view === "favorites" && (
        <div className="favorites-page">
          <div className="favorites-header">
            <button
              type="button"
              className="auth-btn"
              onClick={handleShowHome}
            >
              ← Back to recommendations
            </button>
            <h1>Your favorite anime</h1>
            <p>
              These are the shows you've starred while logged in.
            </p>
          </div>

          {favoritesLoading && (
            <p className="status">Loading favorites...</p>
          )}

          {favoritesError && (
            <p className="status error">{favoritesError}</p>
          )}

          {!favoritesLoading &&
            !favoritesError &&
            favorites.length === 0 && (
              <p className="status">
                You don't have any favorites yet. Go back and star a
                few!
              </p>
            )}

          {!favoritesLoading &&
            !favoritesError &&
            favorites.length > 0 && (
              <div className="results-grid">
                {favorites.map((anime, idx) => (
                  <article key={idx} className="anime-card">
                    <img
                      src={anime.image}
                      alt={anime.title}
                      className="anime-result"
                    />
                    <div className="anime-card-content">
                      <div className="title-row">
                        <h2 className="anime-title">{anime.title}</h2>
                        <span className="anime-rank">
                          #{anime.ranking}
                        </span>
                      </div>
                      <p className="anime-description">
                        {anime.synopsis}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </div>
      )}
    </div>
  );
}

  

export default App;
