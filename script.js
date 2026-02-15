const CityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const notFound = document.querySelector(".not-found");
const searchCity = document.querySelector(".search-city");
const weatherInfo = document.querySelector(".weather-info");
const countryTxt = document.querySelector(".country-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityValuetxt = document.querySelector(".humidity-value-txt");
const windValuetxt = document.querySelector(".wind-value-txt");
const weatherSummaryImg = document.querySelector(".weather-summary-image");
const currentDatatxt = document.querySelector(".country-date-txt");
const forecastitemcontainer = document.querySelector(
  ".forecast-items-container"
);

const ApiKey = "3f3c422913b6417be1410036ab343f5a";

searchBtn.addEventListener("click", () => {
  if (CityInput.value.trim() !== "") {
    upateWeatherInfo(CityInput.value);
    CityInput.value = "";
    CityInput.blur();
  }
});

CityInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && CityInput.value.trim() !== "") {
    upateWeatherInfo(CityInput.value);
    CityInput.value = "";
    CityInput.blur();
  }
});

async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${ApiKey}&units=metric`;
  const response = await fetch(apiUrl);
  return response.json();
}

function getweathericon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id == 800) return "clear.svg";
  else return "clouds.svg";
}
function getCurrentdate() {
  const currentdate = new Date();
  const option = { weekday: "short", day: "2-digit", month: "short" };
  return currentdate.toLocaleDateString("en-GB", option);
}

async function upateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);
  console.log(weatherData);
  if (weatherData.cod != 200) {
    showDisplaynotfound(notFound);
    return;
  }

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  countryTxt.textContent = country;
  tempTxt.textContent = Math.round(temp) + "°C";
  conditionTxt.textContent = main;
  humidityValuetxt.textContent = humidity + "%";
  windValuetxt.textContent = speed + " M/s";

  currentDatatxt.textContent = getCurrentdate();
  weatherSummaryImg.src = `assets/weather/${getweathericon(id)}`;

  await updateforecastinfo(city);
  showDisplaynotfound(weatherInfo);
}

async function updateforecastinfo(city) {
  const forecastdata = await getFetchData("forecast", city);
  const timetaken = "12:00:00";
  const todaydata = new Date().toISOString().split("T")[0];

  forecastitemcontainer.innerHTML = "";

  forecastdata.list.forEach((forcastweather) => {
    if (
      forcastweather.dt_txt.includes(timetaken) &&
      !forcastweather.dt_txt.includes(todaydata)
    ) {
      updatecastitem(forcastweather);
    }
  });
}

function updatecastitem(weatherData) {
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const dataTaken = new Date(date);
  const dataoption = { day: "2-digit", month: "short" };
  const dataresult = dataTaken.toLocaleDateString("en-US", dataoption);

  // FIX: Corrected the template literal and variable name
  const forecastitem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular">${dataresult}</h5>
            <img src="assets/weather/${getweathericon(
              id
            )}" alt="" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
        </div>`;

  forecastitemcontainer.insertAdjacentHTML("beforeend", forecastitem);
}

function showDisplaynotfound(section) {
  [weatherInfo, searchCity, notFound].forEach(
    (sec) => (sec.style.display = "none")
  );
  section.style.display = "flex";
}
