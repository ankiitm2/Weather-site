import React, { useEffect, useState } from "react";
import "./weather.css";
import Loading from "./loading/Loading";

const weather = () => {
  const [data, setData] = useState({});
  const [location, setLoaction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const api_key = "e3c37e16dd19deee115fcb80b830e060";

  const search = async () => {
    if (location) {
      setIsLoading(true);
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${api_key}&units=metric`;
        const res = await fetch(url);
        const resultsData = await res.json();
        console.log(resultsData);
        setData(resultsData);
      } catch (error) {
        console.log("error while fetching weather: ", error);
      }
      setIsLoading(false);
      setLoaction("");
    }
  };

  const handleSearch = (e) => {
    setLoaction(e.target.value);
  };

  const handleLoading = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    window.addEventListener("load", handleLoading);
    return () => window.removeEventListener("load", handleLoading);
  }, []);

  return (
    <div className="weather">
      <div className="search-box">
        <input
          type="text"
          onChange={handleSearch}
          onKeyPress={(e) => e.key === "Enter" && search()}
          value={location}
        />
        <button className="btn" onClick={search}>
          search
        </button>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          {data.main ? (
            <div>
              <h1>{data.name}</h1>
              <h3>Temp: {data.main.temp}</h3>
              <h3>Humid: {data.main.humidity}</h3>
            </div>
          ) : (
            <h5>Search City</h5>
          )}
        </>
      )}
    </div>
  );
};

export default weather;
