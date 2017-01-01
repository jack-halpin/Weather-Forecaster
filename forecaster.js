        var map;
        var marker;
        var dates = [];
        var cityID;
        var cityName;
        var unitType;
        var numDays;
        var ids = [];


        function checkInput() {
            //This function is for error handling.
            cityName = document.getElementById("cityname");

            unitType = document.getElementById("units");
            var units = unitType.options[unitType.selectedIndex].text;
            units = units.toLowerCase();

            //If the cityName form is empty then return an error to the user just underneath the form
            if (cityName.elements[0].value == '') {
                displayError(001);
            }
            //If it not empty, then query the OWM API for a list of cities with the name the user has entered
            else {


                var checkurl = 'http://api.openweathermap.org/data/2.5/find?q=' + cityName.elements[0].value + '&type=accurate&mode=json&units=' + units + '&appid=578beb639122d4ef8ede73f3e2698ff5';
                console.log(checkurl);

                //The following code used to fetch JSON data using HMLHttpRequest() was created using a tutorial from w3schools: http://www.w3schools.com/json/json_http.asp

                var checkhttp = new XMLHttpRequest();

                checkhttp.onreadystatechange = function() {
                    if (checkhttp.readyState == 4 && checkhttp.status == 200) {
                        var checkdata = JSON.parse(checkhttp.responseText);
                        //Once we have the data we then decide what to do based on the number of cities that the API returns
                        if (checkdata.count == 0) {
                            //Ask the user to try again
                            displayError(002);
                        }
                        if (checkdata.count > 1) {
                            //Display the users options
                            displayOptions(checkdata);
                        } else {
                            //Get the data and proceed
                            getData(checkdata.list[0].id);
                        }
                    }
                };

                checkhttp.open("GET", checkurl, true);
                checkhttp.send();
            }
        }

        function displayError(errorCode) {
            //This function is used to display error messages based on the error code fed into it
            var messageSpace = document.getElementById("errorSpace");

            //ERROR 001: The search form is empty.
            if (errorCode == 001) {
                messageSpace.innerHTML = '<h1>Please enter a value into the search form!</h1>'
            }
            //ERROR 002: The city the user requested is not available from the API.
            if (errorCode == 002) {
                messageSpace.innerHTML = '<h1>Sorry, we do not have weather for that region!</h1>'
            }
        }

        function displayOptions(data) {
            //This function is used to display the users options if the results are ambiguous


            ids = [];
            document.getElementById("pre").style.display = "block";
            document.getElementById("options").innerHTML = "<h2>Did you mean: </h2>";
            document.getElementById("welcomeMessage").style.display = "none";
            document.getElementById("errorSpace").innerHTML = "";

            if (unitType.options[unitType.selectedIndex].text == "Metric") {
                tempSymbol = "C";
                titleSymbol = "Celcius";
                speedSymbol = "km/h";
            } else if (unitType.options[unitType.selectedIndex].text == "Imperial") {
                tempSymbol = "F";
                titleSymbol = "Farenheit";
                speedSymbol = "m/h";
            }




            for (i = 0; i < data.count; i++) {
                var content = '<div class="option">' +
                    '<h3 id="option' + i + '" class="optionname" onclick="selectCity(this)">' + data.list[i].name + ', ' + data.list[i].sys.country + '</h3>' +
                    '<h3 class="optiontemp">' + parseInt(data.list[i].main.temp) + '&deg;' + tempSymbol + '</h3>' +
                    '<h3 class="optiondescrip">' + data.list[i].weather[0].description + '</h3>' +
                    '<p>Location: [' + data.list[i].coord.lon + ',' + data.list[i].coord.lat + ']</p>' +
                    '</div>';
                console.log(data.list[i].id)
                ids.push(data.list[i].id);
                var div = document.getElementById("options");
                div.insertAdjacentHTML('beforeend', content);
            }


        }

        function selectCity(selectedDiv) {
            //This function checks which of the options was selected by the user and then sends the city id associated with that option to the getData function.
            var divs = document.getElementsByClassName("optionname");

            for (i = 0; i < divs.length; i++) {
                if (divs[i].id == selectedDiv.id) {
                    var selectedCityIndex = i;
                    break;
                }
            }
            getData(ids[selectedCityIndex]);
        }


        function hideInfo(elemid, box) {
            //This function is called by a checkbox when clicked and hides data associated with that checkbox if it is unchecked
            var elements = document.getElementsByClassName(elemid)

            for (var i = 0; i < elements.length; i++) {
                elements[i].style.display = box.checked ? "block" : "none";
            }
        }


        //This code was created using the Google Maps API tutorial on w3schools: http://www.w3schools.com/googleapi/
        function initialize() {
            var mapProp = {
                center: new google.maps.LatLng(51.508742, -0.120850),
                zoom: 5,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
        }

        function maprecenter(data) {
            var center = new google.maps.LatLng(data.city.coord.lat, data.city.coord.lon);
            map.panTo(center);
            addMarker(center);
        }
        google.maps.event.addDomListener(window, 'load', initialize);

        function addMarker(location) {
            if (!marker) {
                marker = new google.maps.Marker({
                    position: location,
                    map: map
                });
            } else {
                marker.setPosition(location);
            }

        }




        function getData(id) {
            //This function gets the daily forecast for the city ID associated with the users selection
            console.log(id);

            //Hide the welcome message div and any error that might be displayed
            document.getElementById("pre").style.display = 'none';
            document.getElementById("errorSpace").innerHTML = "";


            //Display the map
            if (document.getElementById("googleMap").style.display = "None") {
                displayMap();
            }

            //Display the checkbox area
            if (document.getElementById("checkboxarea").style.display = "None") {
                document.getElementById("checkboxarea").style.display = "Inline-block";
            }

            //Get the units the user entered
            if (unitType.options[unitType.selectedIndex].text == "Metric") {
                tempSymbol = "C";
                titleSymbol = "Celcius";
                speedSymbol = "km/h";
            } else if (unitType.options[unitType.selectedIndex].text == "Imperial") {
                tempSymbol = "F";
                titleSymbol = "Farenheit";
                speedSymbol = "m/h";
            }




            //Get the number of days the user wants to see
            numDays = document.getElementById("days");

            //Construct the url based on the entered information
            var url = "http://api.openweathermap.org/data/2.5/forecast/daily?id=" + id + "&units=" + unitType.options[unitType.selectedIndex].text + "&cnt=" + numDays.options[numDays.selectedIndex].text + "&appid=578beb639122d4ef8ede73f3e2698ff5";

            //Output the URL to be queried to the console
            console.log(url);

            //Create the xmlhhtp object
            var xmlhttp = new XMLHttpRequest();

            //This function is async so all manipulation of the JSON data will be performed in hear through function calls.
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var data = JSON.parse(xmlhttp.responseText);
                    insertWeatherInfo(data, id);
                    maprecenter(data);
                }
            };

            xmlhttp.open("GET", url, true);
            xmlhttp.send();


        }

        function displayMap() {
            //This function is used to the the googleMap div to block display. The map then has to be resized in order to display property.
            document.getElementById("googleMap").style.display = 'block';
            var center = map.getCenter();
            google.maps.event.trigger(map, 'resize');
            map.setCenter(center);
        }

        function getDayOfWeek(date) {
            //This function takes in a date and returns the day of the week as a string
            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return days[date.getDay()];
        }

        function getMonthOfYear(date) {
            //This function takes in a date and returns the month of the year as a string
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return months[date.getMonth()];
        }

        function insertWeatherInfo(data, id) {
            //This is the function used to retrieve and display the daily weather forecast
            dates = [];
            cityID = id;
            console.log(id);
            console.log(cityID);
            //Place the name of the city above the map
            var cityTitle = '<h2>' + data.city.name + '</h2>';
            var d = document.getElementById("chosenCity").innerHTML = cityTitle;



            //This resets the div to prevent duplicates
            document.getElementById("forecast").innerHTML = "";
            document.getElementById("forecastTitle").style.display = 'block';
            for (i = 0; i < data.list.length; i++) {
                //Need to convert the UNIX timestamp in order to get the day of the week
                var timestamp = data.list[i].dt;
                var a = new Date(timestamp * 1000);
                var dayOfWeek = getDayOfWeek(a);

                //Rainfall data in the API is somtimes not present so this must be checked before displaying the data
                var rainfall;
                if ("rain" in data.list[i]) {
                    rainfall = data.list[i].rain;
                } else {
                    rainfall = "0";
                }


                //This is the html content used to display each day


                content = '<div id="dailyWeather' + i + '" class="dailyReport" onclick="checkdiv(this)">' +
                    '<div class="dayOfWeek"><h3>' + dayOfWeek + '</h3></div>' +
                    '<div class="weatherImage"><img class="icon" src="http://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png"></div>' +
                    '<div class="dayTemp"><h3>' + parseInt(data.list[i].temp.day) + '&deg;' + tempSymbol + '</h3></div>' +

                    '<div class="weatherDescription"><h3>' + data.list[i].weather[0].main + '</h3></div>' +

                    '<div class="weatherDetails">' +
                    '<div class="detailsLeft">' +
                    '<div class="maxtemp"><h4 class="descriptionTitle">Max Temp:&nbsp;</h4><p class="dailyReading">' + data.list[i].temp.max + '&deg;' + tempSymbol + '</p></div>' +
                    '<div class="mintemp"><h4 class="descriptionTitle">Min Temp: &nbsp;</h4><p class="dailyReading">' + data.list[i].temp.min + '&deg;' + tempSymbol + '</p></div>' +
                    '<div class="rainfall"><h4 class="descriptionTitle">Rainfall: &nbsp;</h4><p class="dailyReading">' + rainfall + 'mm</p></div>' +
                    '</div>' +
                    '<div class="detailsRight">' +
                    '<div class="pressure"><h4 class="descriptionTitle">Pressure: &nbsp;</h4><p class="dailyReading">' + data.list[i].pressure + 'hpa</p></div>' +
                    '<div class="humidity"><h4 class="descriptionTitle">Humidity: &nbsp;</h4><p class="dailyReading">' + data.list[i].humidity + '%</p></div>' +
                    '<div class="windspeed"><h4 class="descriptionTitle">Windspeed: &nbsp;</h4><p class="dailyReading">' + data.list[i].speed + speedSymbol + '</p></div>' +
                    '</div>' +
                    '</div>' +
                    '<div id="detail' + i + '" class="detail"></div>' +
                    '<div id="chart' + i + '" class="chartType"></div>' +
                    '</div>';

                var divDate = new Date(data.list[i].dt * 1000);

                dates.push(divDate);



                var d1 = document.getElementById('forecast');

                d1.insertAdjacentHTML('beforeend', content);
                var contain = document.getElementById("container");

            }
        }

        function checkdiv(selectedDiv) {
            //This loop will check which box was picked, and then match that box up with the index of dates[] in order to find out which date was queried
            var dailys = document.getElementsByClassName("dailyReport");
            var datepicked;



            for (i = 0; i < dailys.length; i++) {
                if (selectedDiv.id == dailys[i].id) {
                    console.log(dates[i]);
                    datepicked = dates[i];
                    var dateindex = i;
                    break;
                }
            }

            getDailyInfo(datepicked, dateindex, ids[dateindex]);
        }

        function getDailyInfo(datepicked, dateindex) {
            //This function is used to retrieve the in 3 hour forecast for a selected day of the week
            var url2 = "http://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&units=" + unitType.options[unitType.selectedIndex].text + "&appid=578beb639122d4ef8ede73f3e2698ff5";

            //Output the URL to be queried to the console
            console.log(url2);


            //Create the xmlhhtp object
            var xmlhttp2 = new XMLHttpRequest();

            //This function is async so all manipulation of the JSON data will be performed in hear through function calls.
            xmlhttp2.onreadystatechange = function() {
                if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
                    var data2 = JSON.parse(xmlhttp2.responseText);
                    console.log(data2.list.length);
                    displayDetail(datepicked, data2, dateindex);
                }
            };

            xmlhttp2.open("GET", url2, true);
            xmlhttp2.send();
        }

        function displayDetail(datepicked, data2, dateindex) {
            //This function is used to display the data retrieved from getDailyInfo into a table 
            var tables = document.getElementsByClassName("detail");
            var charts = document.getElementsByName("charType");

            //remove any tables that are currently displayed on the screen
            for (i = 0; i < tables.length; i++) {
                var tableid = 'detail' + i;
                var chartID = 'chart' + i;
                document.getElementById(chartID).innerHTML = "";
                document.getElementById(tableid).innerHTML = "";
            }

            console.log(dateindex);
            console.log(datepicked);

            //First we must check that the weather data for the picked day is available. 3 hour forecast not available for a particular day after 9pm
            var checkDate = new Date(data2.list[0].dt * 1000);
            console.log(checkDate.getDate());
            console.log(datepicked.getDate());
            if (checkDate.getDate() > datepicked.getDate()) {
                console.log("got here");
                var tablecontent = "<h2>Sorry, the weather for this day is no longer available</h2>";
            } else {
                var startIndex; //index to determine which index the selected day starts in the JSON

                for (i = 0; i < data2.list.length; i++) {
                    var sampleDate = new Date(data2.list[i].dt * 1000);
                    console.log(sampleDate.getDate());
                    if (datepicked.getDate() == sampleDate.getDate()) {
                        startIndex = i;
                        break;
                    }
                }

                var times = [];
                var rainfall = [];
                var dailyData = [];
                //create a new array with the data from the lists that we want
                for (i = 0; i < 8; i++) {
                    dailyData.push(data2.list[startIndex + i]);

                    //This allows the time in the detailed section to be updated automatically.
                    console.log(data2.list[startIndex + i].dt_txt);
                    var timeofday = new Date(data2.list[startIndex + i].dt * 1000);

                    var hour = timeofday.getUTCHours();
                    console.log(data2.list[startIndex + i].dt * 1000);
                    console.log(hour);


                    if (timeofday.getUTCHours() < 10) {

                        times.push("0" + hour.toString() + ':00');
                    } else {

                        times.push(hour.toString() + ':00');
                    }

                    //We also need to create an array of obejects for rainfall because not all data in the API contains that object
                    if ("rain" in data2.list[startIndex + i]) {
                        if ("3h" in data2.list[startIndex + i].rain) {
                            console.log("pushed");
                            rainfall.push(data2.list[startIndex + i].rain["3h"]);
                        } else {
                            rainfall.push("0");
                        }
                    } else {
                        console.log("pusheddash");
                        rainfall.push("0");
                    }


                }
                console.log(rainfall[0]);
                console.log(rainfall[1]);

                //Now to dynamically create the table
                var titlestring = getDayOfWeek(datepicked) + ", " + datepicked.getDate() + " " + getMonthOfYear(datepicked);
                var titlecontent = '<h1>' + titlestring + '</h1>';


                var tablecontent = '<div class="detailtable">' +
                    '<table style="width: 100%">' +
                    '<tr>' +
                    '<td class="columnTitle"></td>' +
                    '<td class="columnTitle">' + times[0] + ':00</td>' +
                    '<td class="columnTitle">' + times[1] + ':00</td>' +
                    '<td class="columnTitle">' + times[2] + ':00</td>' +
                    '<td class="columnTitle">' + times[3] + ':00</td>' +
                    '<td class="columnTitle">' + times[4] + ':00</td>' +
                    '<td class="columnTitle">' + times[5] + ':00</td>' +
                    '<td class="columnTitle">' + times[6] + ':00</td>' +
                    '<td class="columnTitle">' + times[7] + ':00</td>' +

                    '</tr>' +
                    '<tr>' +
                    '<td class="detaildescription">Condition:</td>' +
                    '<td><img src="http://openweathermap.org/img/w/' + dailyData[0].weather[0].icon + '.png"></td>' +
                    '<td><img src="http://openweathermap.org/img/w/' + dailyData[1].weather[0].icon + '.png"></td>' +
                    '<td><img src="http://openweathermap.org/img/w/' + dailyData[2].weather[0].icon + '.png"></td>' +
                    '<td><img src="http://openweathermap.org/img/w/' + dailyData[3].weather[0].icon + '.png"></td>' +
                    '<td><img src="http://openweathermap.org/img/w/' + dailyData[4].weather[0].icon + '.png"></td>' +
                    '<td><img src="http://openweathermap.org/img/w/' + dailyData[5].weather[0].icon + '.png"></td>' +
                    '<td><img src="http://openweathermap.org/img/w/' + dailyData[6].weather[0].icon + '.png"></td>' +
                    '<td><img src="http://openweathermap.org/img/w/' + dailyData[7].weather[0].icon + '.png"></td>' +
                    '</tr>' +
                    '<tr class="colouredrow">' +
                    '<td class="detaildescription">Avg. Temp (&deg;' + tempSymbol + ')</td>' +
                    '<td>' + dailyData[0].main.temp + '</td>' +
                    '<td>' + dailyData[1].main.temp + '</td>' +
                    '<td>' + dailyData[2].main.temp + '</td>' +
                    '<td>' + dailyData[3].main.temp + '</td>' +
                    '<td>' + dailyData[4].main.temp + '</td>' +
                    '<td>' + dailyData[5].main.temp + '</td>' +
                    '<td>' + dailyData[6].main.temp + '</td>' +
                    '<td>' + dailyData[7].main.temp + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td class="detaildescription">Max. Temp (&deg;' + tempSymbol + ')</td>' +
                    '<td>' + dailyData[0].main.temp_max + '</td>' +
                    '<td>' + dailyData[1].main.temp_max + '</td>' +
                    '<td>' + dailyData[2].main.temp_max + '</td>' +
                    '<td>' + dailyData[3].main.temp_max + '</td>' +
                    '<td>' + dailyData[4].main.temp_max + '</td>' +
                    '<td>' + dailyData[5].main.temp_max + '</td>' +
                    '<td>' + dailyData[6].main.temp_max + '</td>' +
                    '<td>' + dailyData[7].main.temp_max + '</td>' +

                    '</tr>' +
                    '<tr class="colouredrow">' +
                    '<td class="detaildescription">Min. Temp (&deg;' + tempSymbol + ')</td>' +
                    '<td>' + dailyData[0].main.temp_min + '</td>' +
                    '<td>' + dailyData[1].main.temp_min + '</td>' +
                    '<td>' + dailyData[2].main.temp_min + '</td>' +
                    '<td>' + dailyData[3].main.temp_min + '</td>' +
                    '<td>' + dailyData[4].main.temp_min + '</td>' +
                    '<td>' + dailyData[5].main.temp_min + '</td>' +
                    '<td>' + dailyData[6].main.temp_min + '</td>' +
                    '<td>' + dailyData[7].main.temp_min + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td class="detaildescription">Rainfall (mm)</td>' +
                    '<td>' + rainfall[0] + 'mm</td>' +
                    '<td>' + rainfall[1] + 'mm</td>' +
                    '<td>' + rainfall[2] + 'mm</td>' +
                    '<td>' + rainfall[3] + 'mm</td>' +
                    '<td>' + rainfall[4] + 'mm</td>' +
                    '<td>' + rainfall[5] + 'mm</td>' +
                    '<td>' + rainfall[6] + 'mm</td>' +
                    '<td>' + rainfall[7] + 'mm</td>' +


                    '</tr>' +
                    '<tr class="colouredrow">' +
                    '<td class="detaildescription">Wind Speed (' + speedSymbol + ')</td>' +
                    '<td>' + dailyData[0].wind.speed + '</td>' +
                    '<td>' + dailyData[1].wind.speed + '</td>' +
                    '<td>' + dailyData[2].wind.speed + '</td>' +
                    '<td>' + dailyData[3].wind.speed + '</td>' +
                    '<td>' + dailyData[4].wind.speed + '</td>' +
                    '<td>' + dailyData[5].wind.speed + '</td>' +
                    '<td>' + dailyData[6].wind.speed + '</td>' +
                    '<td>' + dailyData[7].wind.speed + '</td>' +
                    '</tr>' +

                    '<tr>' +
                    '<td class="detaildescription">Humidity (%)</td>' +
                    '<td>' + dailyData[0].main.humidity + '</td>' +
                    '<td>' + dailyData[1].main.humidity + '</td>' +
                    '<td>' + dailyData[2].main.humidity + '</td>' +
                    '<td>' + dailyData[3].main.humidity + '</td>' +
                    '<td>' + dailyData[4].main.humidity + '</td>' +
                    '<td>' + dailyData[5].main.humidity + '</td>' +
                    '<td>' + dailyData[6].main.humidity + '</td>' +
                    '<td>' + dailyData[7].main.humidity + '</td>' +
                    '</tr>' +
                    
                    '<tr class="colouredrow">' +
                    '<td class="detaildescription">Pressure (hpa)</td>' +
                    '<td>' + dailyData[0].main.pressure + '</td>' +
                    '<td>' + dailyData[1].main.pressure + '</td>' +
                    '<td>' + dailyData[2].main.pressure + '</td>' +
                    '<td>' + dailyData[3].main.pressure + '</td>' +
                    '<td>' + dailyData[4].main.pressure + '</td>' +
                    '<td>' + dailyData[5].main.pressure + '</td>' +
                    '<td>' + dailyData[6].main.pressure + '</td>' +
                    '<td>' + dailyData[7].main.pressure + '</td>' +
                    '</tr>' +

                    '</table>' +
                    '</div>';


                drawChart(dailyData, rainfall, times, dateindex);
            }

            var insertdiv = 'detail' + dateindex;
            var d1 = document.getElementById(insertdiv);
            d1.insertAdjacentHTML('beforeend', tablecontent);
        }

        google.charts.load('current', {
            packages: ['corechart']
        });
        
        //This code was created using the Google Charts API Docs: https://developers.google.com/chart/
        function drawChart(dailydata, rainfall, times, index) {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Time');
            data.addColumn('number', 'Temperature');
            for (i = 0; i < 8; i++) {
                data.addRow([times[i], dailydata[i].main.temp]);
            }

            var options = {
                titlePosition: 'none',
                legend: {
                    position: 'none'
                },
                curveType: 'function',
                colors: ['lightblue'],
                bar: {
                    gap: 5
                },
                gridlines: {
                    color: 'none'
                },
                vAxis: {
                    gridlines: {
                        color: 'transparent'
                    },
                    title: 'Temperature (' + titleSymbol + ')'
                }
            };
            var chartdivID = 'chart' + index;
            var chart = new google.visualization.ColumnChart(document.getElementById(chartdivID));
            chart.draw(data, options);
        }