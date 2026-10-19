const weatherForm=document.querySelector(".weatherForm");
const cityInput=document.querySelector(".cityInput");
const card=document.querySelector(".card");
const API_KEY = 'bc1f49f4c09c3560d7ce119eee259729';
const favoritesList = document.querySelector(".favoritesList");
const loading = document.querySelector(".loading");

weatherForm.addEventListener("submit", async event=>{
  event.preventDefault();
  
  const city = cityInput.value;

  if(city){
  try{
    const WeatherData= await getWeatherData(city);
    displayWeatherInfo(WeatherData);
  }
  catch(error){
    console.error(error);
    displayError(error);
  }
  }

  else{
    displayError("please enter a city")
  }
});
async function getWeatherData(city) {
    const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    const response = await fetch(apiurl);

    if (!response.ok) {
        throw new Error("City not found");
    }

    return await response.json();


}



 function displayWeatherInfo(data){
    console.log(data);
    const {
        name:city,
        main:{temp, humidity},
         weather:[{description, id}]
        } =data;
    card.textContent="";
    card.style.display= "flex";

    const cityDisplay=document.createElement("h1");
    const tempDisplay=document.createElement("p");
    const humidityDisplay=document.createElement("p");
    const descDisplay=document.createElement("p");
    const weatherEmoji=document.createElement("p");
    const favoriteBtn = document.createElement("button");

favoriteBtn.textContent = "⭐ Add to Favorites";

favoriteBtn.addEventListener("click", () => {
    addFavorite(city);
});



    cityDisplay.textContent=city;
    tempDisplay.textContent=temp;
    humidityDisplay.textContent=humidity;
    descDisplay.textContent=description;
   
     cityDisplay.classList.add("cityDisplay");
      tempDisplay.classList.add("tempDisplay");
       humidityDisplay.classList.add("humidityDisplay");
        descDisplay.classList.add("descDisplay");



    
    card.appendChild(cityDisplay);
        card.appendChild(tempDisplay);
             card.appendChild(humidityDisplay);

            card.appendChild(descDisplay);    
            card.appendChild(favoriteBtn);


};




 function getWeatherEmoji(weatherId){
    
};




 function displayError(message){
    const errorDisplay=document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay") ;
    card.textContent="";
    card.style.display="flex";
    card.appendChild(errorDisplay);

}
function addFavorite(city) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(city)) {
        alert("City is already in favorites!");
        return;
    }

    favorites.push(city);

    localStorage.setItem("favorites", JSON.stringify(favorites));

    loadFavorites();
}
function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favoritesList.textContent = "";

    favorites.forEach(city => {
        const li = document.createElement("li");

        const cityBtn = document.createElement("button");
        cityBtn.textContent = city;

        cityBtn.addEventListener("click", async () => {
            cityInput.value = city;

            try {
                const data = await getWeatherData(city);
                displayWeatherInfo(data);
            } catch (error) {
                displayError(error.message);
            }
        });

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "❌";
        removeBtn.setAttribute("aria-label", `Remove ${city} from favorites`);

        removeBtn.addEventListener("click", () => {
            removeFavorite(city);
        });

        li.appendChild(cityBtn);
        li.appendChild(removeBtn);

        favoritesList.appendChild(li);
    });
}
function removeFavorite(city) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favorites = favorites.filter(favorite => favorite !== city);

    localStorage.setItem("favorites", JSON.stringify(favorites));

    loadFavorites();
}
loadFavorites();