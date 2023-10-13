import { api_key } from "../../config.js";

// ! City holen und Datum zusammenkleben
const ortInput = document.querySelector(".locationInput");
const tag = new Date().toLocaleDateString("default", { weekday: "long" });
const tagZahl = new Date().getDate();
const monat = new Date().toLocaleDateString("default", { month: "long" });
const jahr = new Date().getFullYear();
const datum = `${tag}, ${tagZahl}/${monat}/${jahr}`;
let checkDup = [];

// ! Datum injizieren
let date = document.createElement("h2");
date.innerHTML = datum;
document.querySelector(".date").appendChild(date);

// # Duplikate herausfinden function
const check_duplicate_in_array = (input_array) => {
  const duplicates = input_array.filter(
    (item, index) => input_array.indexOf(item) !== index
  );
  return Array.from(new Set(duplicates));
};
// ! Man kann vorerst nur bestätigen indem man "ENTER" Taste schmettert
ortInput.addEventListener("keypress", () => {
  if (event.key === "Enter") {
    checkDup.push(ortInput.value);

    // # Duplikat Magie (^o^)
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
      // ! Daten von der API melken
      const iconId = data.weather[0].icon;
      const city = data.name;
      const temperature = Math.round(data.main.temp);
      const likeTemperature = Math.round(data.main.feels_like);
      const weatherState = data.weather[0].description;
      const windSpeed = Math.round(data.wind.speed);
      const humidity = Math.round(data.main.humidity);
      // ! Icon mit der ID von der API klauen
      const urlIcon = `https://openweathermap.org/img/wn/${iconId}@2x.png`;

      // # z.B. Wolkiges Wetter = Wolken Icon
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

      // ! Kinder anhängen
      itemCol.appendChild(name);
      itemCol.appendChild(wind);
      itemCol.appendChild(hum);

      // ! weitere Kinder anhängen
      weatherElement.appendChild(cityName);
      weatherElement.appendChild(temp);
      weatherElement.appendChild(likeTemp);
      weatherElement.appendChild(status);

      // ! gefüllte kinder anhängen
      document.querySelector(".mainInfo").appendChild(weatherElement);
      document.querySelector(".otherItems").appendChild(itemCol);

      //# Damit erst bei ausführung der nice shit gezeigt wird
      document.querySelector(".weatherWrapper").classList.add("display");
      document.querySelector(".weatherWrapper").classList.remove("displayNo");
    })
    .catch((err) => console.error("Yan... nicht schon wieder", err));
};
