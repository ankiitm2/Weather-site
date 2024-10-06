import { SetStateAction, useEffect, useState } from "react";
import "./weather.css";
import Location from "../assets/svgs/solid/map-pin.svg";
import Temp from "../assets/svgs/solid/temperature-high.svg";
import Air from "../assets/svgs/solid/air-freshener.svg";
import Loading from "./loading/Loading";
import Mist from "../assets/mist.png";
import Clear from "../assets/mist.png"; // Example images
import Clouds from "../assets/clouds.png";
import Rain from "../assets/mist.png";
import Snow from "../assets/mist.png";

// Define the type for the weather data
interface WeatherData {
  name?: string;
  main?: {
    temp: number;
    humidity: number;
  };
  weather?: {
    main: string;
    description: string;
  }[];
}

const Weather = () => {
  const [data, setData] = useState<WeatherData>({});
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const api_key = "e3c37e16dd19deee115fcb80b830e060";

  const search = async () => {
    if (location) {
      setIsLoading(true);
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${api_key}&units=metric`;
        const res = await fetch(url);
        const resultsData = await res.json();

        // Safely check if the weather data is present
        if (
          resultsData &&
          resultsData.weather &&
          resultsData.weather.length > 0
        ) {
          console.log(resultsData); // Log the data for debugging
          setData(resultsData);

          // Access weather condition safely and update the background
          const weatherCondition = resultsData.weather[0].main;
          console.log("Weather Condition: ", weatherCondition); // Log the weather condition
          updateBackground(weatherCondition); // Call the function to update the background
        } else {
          console.log("Weather data not available.");
        }
      } catch (error) {
        console.log("error while fetching weather: ", error);
      }
      setIsLoading(false);
      setLocation("");
    }
  };

  const handleSearch = (e: { target: { value: SetStateAction<string> } }) => {
    setLocation(e.target.value);
  };

  const handleLoading = () => {
    setIsLoading(false);
  };

  // Function to update the background image based on the weather condition
  const updateBackground = (weatherCondition: string) => {
    let imageUrl = "";
    switch (weatherCondition) {
      case "Mist":
        imageUrl = Mist;
        break;
      case "Clear":
        imageUrl = Clear;
        break;
      case "Clouds":
        imageUrl = Clouds;
        break;
      case "Rain":
        imageUrl = Rain;
        break;
      case "Snow":
        imageUrl = Snow;
        break;
      default:
        imageUrl = Clear; // Default image if no match
    }

    const styleTag = document.createElement("style");
    styleTag.innerHTML = `body::before {
      background-image: url('${imageUrl}');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }`;
    document.head.append(styleTag);
  };

  useEffect(() => {
    window.addEventListener("load", handleLoading);
    return () => window.removeEventListener("load", handleLoading);
  }, []);

  return (
    <div className="weather">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <h1>
            <img src={Location} alt="" className="svg" />
            {data.name ? data.name : "Search city"}
            {data.weather && data.weather[0] && (
              <h4 className="descr">
                <img src={Air} className="svg" alt="" />
                {data.weather[0].description}
              </h4>
            )}
          </h1>
        </>
      )}
      <div className="search-box">
        <input
          type="text"
          onChange={handleSearch}
          onKeyPress={(e) => e.key === "Enter" && search()}
          value={location}
        />
        <button className="btn" onClick={search}>
          Search
        </button>
      </div>
      {data.main && (
        <div>
          <h1 className="mb-0">
            <img src={Temp} className="svg" alt="" /> {data.main.temp} °C
          </h1>
          <h4 className="mt-1">Humidity: {data.main.humidity} %</h4>
        </div>
      )}
    </div>
  );
};

export default Weather;
