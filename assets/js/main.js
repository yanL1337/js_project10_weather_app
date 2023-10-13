import { api_key } from "../../config.js";

const ortInput = document.querySelector(".locationInput");
const tag = new Date().toLocaleDateString("default", { weekday: "long" });
const tagZahl = new Date().getDate();
const monat = new Date().toLocaleDateString("default", { month: "long" });
const jahr = new Date().getFullYear();
const datum = `${tag}, ${tagZahl}/${monat}/${jahr}`;
let checkDup = [];

let date = document.createElement("h2");
date.innerHTML = datum;
document.querySelector(".date").appendChild(date);

const check_duplicate_in_array = (input_array) => {
  const duplicates = input_array.filter(
    (item, index) => input_array.indexOf(item) !== index
  );
  return Array.from(new Set(duplicates));
};
ortInput.addEventListener("keypress", () => {
  if (event.key === "Enter") {
    checkDup.push(ortInput.value);

    let arr = check_duplicate_in_array(checkDup);
    if (arr.length == 0) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${ortInput.value}&appid=${api_key}&lang=de&units=metric`;

      fetchData(url);
    } else {
      arr.pop();
      checkDup.pop();
    }
  }
});

const fetchData = (url) => {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const iconId = data.weather[0].icon;
      const city = data.name;
      const temperature = Math.round(data.main.temp);
      const likeTemperature = Math.round(data.main.feels_like);
      const weatherState = data.weather[0].description;
      const windSpeed = Math.round(data.wind.speed);
      const humidity = Math.round(data.main.humidity);
      const urlIcon = `https://openweathermap.org/img/wn/${iconId}@2x.png`;
      console.log(data);
      let weatherIcon = document.createElement("img");
      weatherIcon.setAttribute("src", urlIcon);
      document.querySelector(".weatherState").appendChild(weatherIcon);

      let weatherElement = document.createElement("div");

      let cityName = document.createElement("h2");
      cityName.innerHTML = city;

      let temp = document.createElement("h1");
      temp.innerHTML = `${temperature}°`;

      let likeTemp = document.createElement("h2");
      likeTemp.innerHTML = `Gefühlt: ${likeTemperature}°`;

      let status = document.createElement("h2");
      status.innerHTML = weatherState;

      let itemCol = document.createElement("div");
      itemCol.classList.add("itemCol");

      let wind = document.createElement("p");
      wind.innerHTML = `${windSpeed} km/h`;
      let hum = document.createElement("p");
      hum.innerHTML = `${humidity}%`;
      let name = document.createElement("p");
      name.innerHTML = city;

      itemCol.appendChild(name);
      itemCol.appendChild(wind);
      itemCol.appendChild(hum);

      weatherElement.appendChild(cityName);
      weatherElement.appendChild(temp);
      weatherElement.appendChild(likeTemp);
      weatherElement.appendChild(status);
      document.querySelector(".mainInfo").appendChild(weatherElement);
      document.querySelector(".otherItems").appendChild(itemCol);

      document.querySelector(".weatherWrapper").classList.add("display");
      document.querySelector(".weatherWrapper").classList.remove("displayNo");
    })
    .catch((err) => console.error("Yan... nicht schon wieder", err));
};
