import logo from './logo.svg';
import './App.css';
import axios from "axios";
import React, { useState, useEffect } from "react";

function Watchlist(props) {
  return (
    <div>
      <h2>There are {props.children.length} movies in your watchlist!</h2>
      <ul>
        {props.children}
      </ul>
    </div>
  )
}

function WatchlistMovie(props) {
  const deleteByIndex = (index) => {
    props.setWatchlist((oldValues) => {
      return oldValues.filter((_, i) => i !== index);
    });
  };

  const handleRemoveFromWatchlist = () => {
    props.setWatchlist((prevWatchlist) => {
      return prevWatchlist.filter((_, i) => i !== props.index);
    });
  };

  return (
    <div>
      <li>{props.movie.Title} ({props.movie.Year})</li>
      <button onClick={handleRemoveFromWatchlist}>Delete</button>
    </div>
  );
}


function App() {
  let initialWatchlist;

  if (localStorage.getItem("watchlist") == null){
    localStorage.setItem("watchlist", JSON.stringify([]));
  }
  else {
    initialWatchlist = JSON.parse(localStorage.getItem("watchlist"));
  }

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchlist, setWatchlist] = useState(initialWatchlist);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    console.log(searchTerm);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData(searchTerm);
  };

  const handleAddToWatchlist = (movie) => {
    const currentWatchList = [...watchlist];
    currentWatchList.push(movie);
    setWatchlist(currentWatchList);
  };
  
  useEffect(() => {
    document.title = "The Open Movie Database";
  }, []);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const fetchData = async (searchTerm) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://www.omdbapi.com/?apikey=c234a623&t=${searchTerm}`
      );
      setMovie(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  
  

  useEffect(() => {
    fetchData("The Matrix");
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>An error occurred: {error.message}</p>;
  if (!movie) return null;

  return (
    <div class="content column">
      <h1>Open Movie Database</h1>

      <form class="search" onSubmit={handleSubmit}>
        <input class="search-bar" type="text" value={searchTerm} onChange={handleSearch} />
        <button class="search-button" type="submit">Search</button>
      </form>

      <div class="movie-container row">
        <div class="movie-text-container column">
          <h2>{movie.Title} ({movie.Year})</h2>
          <p>Directed by {movie.Director}</p>
          <p>{movie.Plot}</p>
          <p>{movie.Actors}</p>
          <button class="watchlist-button" onClick={() => handleAddToWatchlist(movie)}>Add To Watchlist</button>
        </div>
        <img src={movie.Poster} />
      </div>
      <h1>Watchlist</h1>

      <Watchlist>
        {
          watchlist.map(
            function (movie, index) {
              return <WatchlistMovie index={index} movie={movie} watchlist={watchlist} setWatchlist={setWatchlist} />
            }
          )
        }

      </Watchlist>

    </div>
  );
}

export default App;
