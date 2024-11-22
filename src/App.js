import React, { useState } from 'react';

//API configuration with key and base URL
const api = {
  key: "448baf02ace2b0941ff5b22ea0a1554d",
  base: "https://api.openweathermap.org/data/2.5/"
};

function App() {
    //state variables to store the user input, weather data, and the temperature unit
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [unit, setUnit] = useState('imperial'); 

  //function to toggle between Fahrenheit and Celsius
  const toggleUnit = () => {
    setUnit(prevUnit => (prevUnit === 'imperial' ? 'metric' : 'imperial'));
  };

  //function to handle search when the user presses "Enter"
  const search = evt => {
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=${unit}&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result); //update the weather state with the fetched data
          setQuery('');
          console.log(result); 
        });
    }
  };

  //function to format the current date in a user-friendly format
  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  };
  //function to convert the temperature based on the selected unit (imperial or metric)
  const convertTemp = (temp) => {
    return unit === 'imperial'
      ? temp //fahrenheit (already in Fahrenheit from API)
      : (temp - 32) * (5 / 9); //convert to Celsius
  };


  return (
    <div className={
      (typeof weather.main != "undefined") //check if weather data is available
        ? ((weather.main.temp > 60) //if temperature is greater than 60°F
          ? 'app warm' : 'app') : 'app'}>
      <main>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={e => setQuery(e.target.value)} //update query state as user types
            value={query}
            onKeyPress={search}
          />
        </div>

        <button onClick={toggleUnit} className="unit-toggle">
          Switch to {unit === 'imperial' ? 'Celsius' : 'Fahrenheit'}
        </button>

        {(typeof weather.main != "undefined") ? (
          <div className="weather-container">
            <div className="location-box">
              <div className="location">{weather.name}, {weather.sys.country}</div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div> 
            <div className="weather-box"> 
              <div className="temp">
                {Math.round(convertTemp(weather.main.temp))}°{unit === 'imperial' ? 'F' : 'C'}
              </div>
              <div className="weather">{weather.weather[0].main}</div>
            </div>
          </div>
        ) : ('')}
      </main>
    </div>
  );
}
export default App;
