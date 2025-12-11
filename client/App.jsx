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

  return (
    <div className="app-background">
        <div className="top-right-buttons">
          <a href="/signup.html" className="auth-btn signup-btn">Sign Up</a>
          <a href="/login.html" className="auth-btn login-btn">Login</a>
        </div>


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
            })
          }}
        />
      </div>
      
      <div className="status-bar">
        <span>
          {genre ? (
            <>
              Genre: <strong>{genre.label}</strong>
            </>
          ) : (
            "No genre selected yet"
          )}
        </span>

        <span>
          {results.length > 0 
            ? `${results.length} result${results.length > 1 ? "s" : ""} this search`
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
        {/*working on loading grid style*/}
        {loading && (
          <div className="results-grid">
            {Array.from({ length: 6}).map((_,indx) => (
              <article key={indx} className="anime-card skel-card">
                <div className="skel-image shimmer"/>
                <div className="skel-line shimmer" />
                <d className="skel-line skel-line-short shimmer" />
              </article>
            ))}
          </div>
        )}

        {!loading && error && <p className="status error">{error}</p>}

        {!loading && !error && !genre && (
          <p className="status">Pick a genre to see recommendations.</p>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="results-grid">
            {results.map((anime) => (
              <article key={anime.id} className="anime-card">
                  <img src={anime.image} alt={anime.title} className="anime-result" />
                  <div className="anime-card-content">
                    <div className="title-row">
                      <h2 className="anime-title">{anime.title}</h2>
                      <span className="favorite-star">☆</span>
                    </div>
                    <span className="anime-rank">#{anime.ranking}</span>
                    <p className="anime-description">{anime.synopsis}</p>
                  </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

  

export default App;
