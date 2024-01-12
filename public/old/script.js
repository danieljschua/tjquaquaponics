const latitude = 38.8177;
const longitude = -77.1677;

const loadWeather = async (city) => {
  try {
    let data = await fetch(
      `https://api.weather.gov/points/${38.8177},${-77.1677}`
    );
    data = await data.json();
    console.log(data);
    const forecastURL = data.properties.forecast;
    console.log(forecastURL);
    let weather = await fetch(forecastURL);
    weather = await weather.json();
    console.log(weather);
    
    let x = document.querySelector('.heading');
    let y = weather.properties.periods[0].detailedForecast;
    console.log('properties:');
    console.log(y);
    x.textContent = `${y}`;
    
    x = document.querySelector('.temp');
    y = weather.properties.periods[0].temperature;
    
    x = document.querySelector('.cloud');
    y = weather.properties.periods[0].detailedForecast;
    if(weather.toLowerCase().includes('cloud')) {
        x.textContent = 'not cloudy at all';
    } else {
        x.textContent = 'some cloud cover (will specify later with more if statements lol)';
    }
    
    // return weather;
  } catch (error) {
    // alert(
    //   'Please check the spelling of the desired city; it was not found within the API. The city may also not be tracked by the API.'
    // );
    console.error("error");
  }
};

// const display = (weather) => {
//     let x = document.querySelector('.heading');
//     let y = weather.properties;
//     console.log('properties:');
//     console.log(y);
//     x.textContent = `${y}`;
// };

loadWeather();
// console.log('finished')
