const API_KEY = "76b88bf1b17386c11d9dce4da4425290";

$(function () {
    // Initial jQuery grabs
    var searchBar = $('#city-search');
    var searchList = $('#search-list');
    var searchItems = $('.search-item'); // array
    var cityList = $('#city-list');

    var cities; // Stores jQuery array
    var timer; // Used for typing timer
    const typingInterval = 1000;

    initializeCities(); // Pulls cities from localStorage when page is loaded

    // Empties localStorage and resets the page when clear button is pressed
    $('#clearButton').on('click', function() {
        localStorage.removeItem('cities');
        cityList.empty();
        $('#weather-box').empty();
        $('#current-weather').addClass('d-none');
        $('#city-name').text('');
    });

    // Uses timer to detect when the user has stopped typing
    // This reduces the amount of API calls and the possibility of overlapping data
    searchBar.on('input', function () {
        clearTimeout(timer); // The timer is reset when the user types
        timer = setTimeout(doneTyping, typingInterval); // Once this timer runs out, the function that calls the API runs
    });

    // Uses the name that the user entered and calls an API that returns GPS coordinates
    function getLocationData(cityName){
        if(cityName){
            var requestURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=" + API_KEY;
            fetch(requestURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    clearList();
                    displayList(data);
                })
        }else{
            clearList();
        }
    }

    // Empties the search results list
    function clearList(){
        searchList.empty();
    }

    // Creates a list of the replies from the API
    // Gives 5 possible cities for the user to use based on their input
    function displayList(data){
        for(var i = 0; i < data.length; i++){
            var newItem = $('<li>' + data[i].name + ', ' + data[i].state + '</li>');
            newItem.addClass('list-group-item text-center search-item');
            newItem.attr('id', i);
            searchList.append(newItem);
        }
        searchItems = $('.search-item');

        // Starts event handlers
        detectHover(searchItems);
        detectClick(data);
    }

    // Called when the timer runs out
    function doneTyping () {
        getLocationData(searchBar.val());
    }

    // Event handler for list items that makes them blue when hovered over
    function detectHover(item) {
        item.hover(
            function (e){
                $(e.target).addClass('active');
            }, 
            function (e){
                $(e.target).removeClass('active');
            });
    }

    // When a list item is clicked on, it is added to the city list and saved to localStorage
    function detectClick(data) {
        searchItems.on('click', function(e){
            clearList();
            searchBar.val('');
            addCity(data[$(e.target).attr('id')]);
            pushCityToLocal(data[$(e.target).attr('id')]);
        });
    }

    // Displays the added city on the list
    function addCity(city){
        console.log(city);
        var newCity = $('<li>' + city.name + ', ' + city.state + '</li>');
        newCity.addClass('list-group-item city-item');
        newCity.attr('data-lat', city.lat);
        newCity.attr('data-lon', city.lon);
        cityList.append(newCity);
        cities = $('.city-item');
        detectHover(cities);
        detectClickedCity();
    }

    // Pulls cities from localStorage and displays them
    function initializeCities(){
        var stored = pullFromLocal();
        for(var i = 0; i < stored.length; i++){
            addCity(stored[i]);
        }
    }

    // Grabs cities from localStorage and returns them
    // If cities is null, it returns an empty array
    function pullFromLocal(){
        var stored = JSON.parse(localStorage.getItem('cities'));
        if(stored !== null){
            return stored;
        }else{
            return [];
        }
    }

    // Appends the city info to the localStorage array
    function pushCityToLocal(city){
        var store = {name: city.name, state: city.state, lat: city.lat, lon: city.lon};
        var stored = pullFromLocal();
        stored.push(store);
        localStorage.setItem("cities", JSON.stringify(stored));
    }

    // Shows the weather data for the city that was clicked
    function detectClickedCity() {
        cities.on('click', function (e) {
            addWeatherInfo($(e.target));
        });
    }

    // Calls the API with the lat and lon data
    function addWeatherInfo(city){
        $('#city-name').text(city.text());
        getWeatherForecast(city.attr('data-lat'), city.attr('data-lon'));
        getCurrentWeather(city.attr('data-lat'), city.attr('data-lon'));
    }

    // Calls the API with lat and lon and displays it
    function getWeatherForecast(lat, lon){
        var requestURL = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid=" + API_KEY + "&units=imperial";
        fetch(requestURL)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                displayForecast(data);
            })
    }

    // Displays the weather data on cards
    function displayForecast(data){
        var weatherBox = $('#weather-box');
        weatherBox.empty();
        console.log(data);
        for(var i = 0; i < data.list.length; i++){
            if(data.list[i].dt_txt.at(11) == 1 && data.list[i].dt_txt.at(12) == 2){
                console.log(i);
                var newSect = $('<section>');
                var day = $('<h2>'+data.list[i].dt_txt.substr(5,5)+"</h2>");
                var temp = $('<p>Temp: '+parseFloat(data.list[i].main.temp).toFixed(2) + "°</p>");
                var wind = $('<p>Windspeed: '+parseFloat(data.list[i].wind.speed).toFixed(2) + " MPH</p>");
                var humid = $('<p>Humidity: '+parseFloat(data.list[i].main.humidity).toFixed(2)+"%</p>");
                var icon = $('<img>');
                icon.attr('src',"https://openweathermap.org/img/wn/"+data.list[i].weather[0].icon+"@2x.png")
                icon.addClass('mx-auto d-block');
                weatherBox.append(newSect);
                newSect.append(icon);
                newSect.append(day);
                newSect.append(temp);
                newSect.append(wind);
                newSect.append(humid);
                newSect.addClass('bg-white w-25 m-2 p-2 rounded text-center');
            }
        }
    }

    // Calls the API with lat and lon and displays it
    function getCurrentWeather(lat, lon){
        var requestURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY + "&units=imperial";
        fetch(requestURL)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                displayCurrentWeather(data);
            });
    }

    // Displays the data on main card
    function displayCurrentWeather(data){
        $('#current-weather').removeClass('d-none');
        $('#currTemp').text('Temp: ' + parseFloat(data.main.temp).toFixed(2) + '°');
        $('#currTempIcon').attr('src', "https://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png");
        $('#currWind').text('Windspeed: ' + parseFloat(data.wind.speed).toFixed(2) + " MPH");
        $('#currHumid').text('Humidity: ' + parseFloat(data.main.humidity).toFixed(2) + '%');
    }
});