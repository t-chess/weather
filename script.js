let form = document.querySelector(".top form");
let input = document.querySelector(".top input");
let msg = document.querySelector("#msg");
let list = document.querySelector(".list");

let apiKey = "5ae2bca03b7698eb7fc1538952e02428";
let inputVal = "";

let track = "";
let isPlaying = false;

//checking local storage
$(document).ready(function() {
    if (localStorage.cities) {
        refreshCities();
    }
});
function refreshCities() {
    let cities = JSON.parse(localStorage.getItem("cities"));
    //auto searching cities from local storage
    cities.forEach(function(item) {
        let inputVal = item;
        let baseurl = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
        $.post(baseurl, function(result) {
        let {name, id, main, weather, sys} = result;
        
        //working with result
        let weatherType = weather[0].main;
        if (weatherType == "Thunderstorm") {
            track = "music/thunderstorm.mp3";
            cover = "linear-gradient(to right, #b92b27, #1565c0)";
        } else if (weatherType == "Rain" || weatherType == "Drizzle"){
            track = "music/rain.mp3";
            cover = "linear-gradient(to right, #8360c3, #2ebf91)";
        } else if (weatherType == "Snow"){
            track = "music/snow.mp3";
            cover = "linear-gradient(to right, #3a1c71, #d76d77, #ffaf7b)";
        } else if (weatherType == "Clouds") {
            track = "music/clouds.mp3";
            cover = "linear-gradient(to right, #aa4b6b, #6b6b83, #3b8d99)";
        } else if (weatherType == "Clear"){
            track = "music/clear.mp3";
            cover = "linear-gradient(to right, #22c1c3, #fdbb2d)";
        } else {
            track = "music/atmosphere.mp3";
            cover = "linear-gradient(to right, #3E1A4B, #B284BA)";
        };
        let li = document.createElement("li");
        li.classList.add("city");
        let box = `
            <h2 class="name" data-name="${name},${sys.country}">
                <span>${name}</span>
                <sup>${sys.country}</sup>
            </h2>
            <div class="temp">${Math.round(main.temp)}<sup>°C</sup></div>
            <div class="caption">${weather[0]["description"]}</div>
            <audio class="player" src="${track}"></audio>
            <span class="playpauseBtn" onclick="playpause(this)"><i class="fa fa-play-circle"></i></span>
            <button class="remove" onclick="removeCity(this)">remove</button>
        `;
        li.innerHTML = box;
        li.style.backgroundImage = cover;
        list.appendChild(li);
    });
}
)};


form.addEventListener("submit", function(e) {
    e.preventDefault();
    let inputVal = input.value;
    
    //ajax
    let baseurl = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
    $.post(baseurl, function(result) {
        let {name, id, main, weather, sys} = result;
        
        //checking same cities 
    let listItems = list.querySelectorAll(".city");
    let listArr = Array.from(listItems);
    let resultCity = name + "," + sys.country;
    if (listArr.length > 0) {
        let filteredArr = listArr.filter(e =>{
            let content = e.querySelector(".name").dataset.name.toLowerCase();
            return content == resultCity.toLowerCase();
        });
        if (filteredArr.length > 0) {
            msg.textContent = "You've already found the weather for this city...otherwise type the country code as well to be more specific.";
            form.reset();
            input.focus();
            return;
        }
    }
        //max 6 cities on page
        if (listArr.length > 5) {
        $("ul li:first").remove();
        //remove from local storage
        let cities = JSON.parse(localStorage.getItem("cities"));
        cities.shift();
        localStorage.setItem("cities", JSON.stringify(cities));
    }
        //working with result
        let weatherType = weather[0].main;
        if (weatherType == "Thunderstorm") {
            track = "music/thunderstorm.mp3";
            cover = "linear-gradient(to right, #b92b27, #1565c0)";
        } else if (weatherType == "Rain" || weatherType == "Drizzle"){
            track = "music/rain.mp3";
            cover = "linear-gradient(to right, #8360c3, #2ebf91)";
        } else if (weatherType == "Snow"){
            track = "music/snow.mp3";
            cover = "linear-gradient(to right, #3a1c71, #d76d77, #ffaf7b)";
        } else if (weatherType == "Clouds") {
            track = "music/clouds.mp3";
            cover = "linear-gradient(to right, #aa4b6b, #6b6b83, #3b8d99)";
        } else if (weatherType == "Clear"){
            track = "music/clear.mp3";
            cover = "linear-gradient(to right, #22c1c3, #fdbb2d)";
        } else {
            track = "music/atmosphere.mp3";
            cover = "linear-gradient(to right, #3E1A4B, #B284BA)";
        };
        let li = document.createElement("li");
        li.classList.add("city");
        let box = `
            <h2 class="name" data-name="${name},${sys.country}">
                <span>${name}</span>
                <sup>${sys.country}</sup>
            </h2>
            <div class="temp">${Math.round(main.temp)}<sup>°C</sup></div>
            <div class="caption">${weather[0]["description"]}</div>
            <audio class="player" src="${track}"></audio>
            <span class="playpauseBtn" onclick="playpause(this)"><i class="fa fa-play-circle"></i></span>
            <button class="remove" onclick="removeCity(this)">remove</button>
        `;
        li.innerHTML = box;
        li.style.backgroundImage = cover;
        list.appendChild(li);
        
        
        //save to local storage
        let cities = JSON.parse(localStorage.getItem("cities"));
        if (!cities) {
            cities = JSON.parse('[]');
        }
        let newCity = name + "," + sys.country;
        cities.push(newCity);        
        localStorage.setItem("cities", JSON.stringify(cities));        
        
        
        msg.textContent = "";
        form.reset();
        
    //bad input
    }).fail(function() {
    msg.textContent = "Please enter a valid city.";
    });
});

function removeCity(e) {
    e.parentNode.parentNode.removeChild(e.parentNode);
    //remove from local storage
    let cities = JSON.parse(localStorage.getItem("cities"));
    let removedCity = e.parentElement.querySelector(".name").dataset.name;
    let index = cities.indexOf(removedCity);
    cities.splice(index, 1);
    localStorage.setItem("cities", JSON.stringify(cities));
}

//music
function playpause(e) {
    if (!isPlaying) {
        e.previousElementSibling.play();
        e.innerHTML = `<i class="fa fa-pause-circle"></i>`;
        isPlaying = true;
        return;
} 
    if (isPlaying) {
        //just pause
        if (e.innerHTML== `<i class="fa fa-pause-circle"></i>`) {
            var sounds = document.getElementsByTagName('audio');
        for(i=0; i<sounds.length; i++) {
            if (!sounds[i].paused && sounds[i].currentTime > 0) {
                sounds[i].pause();
                sounds[i].nextElementSibling.innerHTML=`<i class="fa fa-play-circle"></i>`;
            }
        }
        isPlaying = false;
    } else if (e.innerHTML== `<i class="fa fa-play-circle"></i>`){
        //pause and play different track
        var sounds = document.getElementsByTagName('audio');
        for(i=0; i<sounds.length; i++) {
            if (!sounds[i].paused && sounds[i].currentTime > 0) {
                sounds[i].pause();
                sounds[i].nextElementSibling.innerHTML=`<i class="fa fa-play-circle"></i>`;
            }
        }
            e.previousElementSibling.play();
            e.innerHTML = `<i class="fa fa-pause-circle"></i>`;
            isPlaying = true;
            }
    }
}