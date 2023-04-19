const API_KEY = "d23b402078be68606254a346d9923bf8";
const BASE_URL = "https://api.openweathermap.org";

let elLocation = selectElement('.info__location');
let elDate = selectElement('.info__date');
let elDegree = selectElement('.info__degree');
let elWeatherName = selectElement('.info__weather-name');
let elWind = selectElement('.info__wind');
let elInput = selectElement('.form__input');
let elCitiesList = selectElement('.cities-list');

let days = {
     0: "Sunday",
     1: "Monday",
     2: "Tuesday",
     3: "Wednesday",
     4: "Thursday",
     5: "Friday",
     6: "Saturday",
}

let months = {
     0: "January",
     1: "February",
     2: "March",
     3: "April",
     4: "May",
     5: "June",
     6: "Jule",
     7: "August",
     8: "September",
     9: "October",
     10: "November",
     11: "December",
}

let getDate = () => {
     let date = new Date();
     let day = date.getDay();
     let month = date.getMonth();
     let year = date.getFullYear();
     let data = date.getDate();

     return (`${days[day]}, ${months[month]} ${data}, ${year}`);
}

let render = (weather) => {
     let degree = Math.round(weather.main.temp - 273.15);

     elLocation.textContent = weather.name;
     elDate.textContent = getDate()
     elDegree.textContent = `${degree}°C`;
     elWeatherName.textContent = weather.weather[0].main;
     elWind.textContent = `Wind: ${weather.wind.speed} km/h`
}


let getWeather = async (lat, lon) =>{
     let path = `/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

     let weather = await request(path);

     render(weather);
};


let  onSearch = debounce(async (evt) => {

     elCitiesList.innerHTML = null;

     if(evt.target.value){
          let cities = await request(`/geo/1.0/direct?q=${evt.target.value}&limit=5&appid=${API_KEY}`);

          elInput.classList.add('form__input__js');

          cities.forEach(city => {
               
               let elLi = createElement('li');
               elLi.textContent = city.name;
               elLi.dataset.lat = city.lat;
               elLi.dataset.lon = city.lon;
               
               elCitiesList.append(elLi);
          });
          
     }else {
          elInput.classList.remove('form__input__js');
     }
}, 500);

let onSearchCity = (evt) => {
     let lat = evt.target.dataset.lat;
     let lon = evt.target.dataset.lon;

     getWeather(lat, lon);

     elCitiesList.innerHTML = null;
     elInput.value = null;
}

elCitiesList.addEventListener('click', onSearchCity)
elInput.addEventListener("input", onSearch)

getWeather('41.31028350042324', '60.84285369999999');