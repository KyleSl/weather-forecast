const API_KEY = "76b88bf1b17386c11d9dce4da4425290";

$(function () {
    var searchBar = $('#city-search');
    var searchList = $('#search-list');
    var searchItems = $('.search-item'); // array
    var cityList = $('#city-list');
    var cities;
    var timer;
    const typingInterval = 1000;

    initializeCities();

    $('#clearButton').on('click', function() {
        localStorage.removeItem('cities');
        cityList.empty();
    });

    // DONE
    searchBar.on('input', function () { // Detects when user types in search bar
        clearTimeout(timer);
        timer = setTimeout(doneTyping, typingInterval);
    });

    // DONE
    function getLocationData(cityName){
        if(cityName){
            var requestURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=" + API_KEY;
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

    // DONE
    function clearList(){
        searchList.empty();
    }

    // DONE
    function displayList(data){
        for(var i = 0; i < data.length; i++){
            var newItem = $('<li>' + data[i].name + ', ' + data[i].state + '</li>');
            newItem.addClass('list-group-item text-center search-item');
            newItem.attr('id', i);
            searchList.append(newItem);
        }
        searchItems = $('.search-item');
        detectHover(searchItems);
        detectClick(data);
    }

    // DONE
    function doneTyping () {
        getLocationData(searchBar.val());
    }

    // DONE
    function detectHover(item) {
        item.hover(
            function (e){
                $(e.target).addClass('active');
            }, 
            function (e){
                $(e.target).removeClass('active');
            });
    }

    // DONE
    function detectClick(data) {
        searchItems.on('click', function(e){
            clearList();
            searchBar.val('');
            addCity(data[$(e.target).attr('id')]);
            pushCityToLocal(data[$(e.target).attr('id')]);
        });
    }

    // DONE
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

    function initializeCities(){
        var stored = pullFromLocal();
        for(var i = 0; i < stored.length; i++){
            addCity(stored[i]);
        }
    }

    function pullFromLocal(){
        var stored = JSON.parse(localStorage.getItem('cities'));
        if(stored !== null){
            return stored;
        }else{
            return [];
        }
    }

    function pushCityToLocal(city){
        var store = {name: city.name, state: city.state, lat: city.lat, lon: city.lon};
        var stored = pullFromLocal();
        stored.push(store);
        localStorage.setItem("cities", JSON.stringify(stored));
    }

    // DONE
    function detectClickedCity() {
        cities.on('click', function (e) {
            addWeatherInfo($(e.target));
        });
    }

    function addWeatherInfo(city){
        $('#city-name').text(city.text());
        getWeatherForecast(city.attr('data-lat'), city.attr('data-lon'));
        getCurrentWeather(city.attr('data-lat'), city.attr('data-lon'));
    }

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

    function displayForecast(data){
        var weatherBox = $('#weather-box');
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

    // DONE
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

    // DONE
    function displayCurrentWeather(data){
        $('#current-weather').removeClass('d-none');
        $('#currTemp').text('Temp: ' + parseFloat(data.main.temp).toFixed(2) + '°');
        $('#currTempIcon').attr('src', "https://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png");
        $('#currWind').text('Windspeed: ' + parseFloat(data.wind.speed).toFixed(2) + " MPH");
        $('#currHumid').text('Humidity: ' + parseFloat(data.main.humidity).toFixed(2) + '%');
    }
});