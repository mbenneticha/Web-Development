/************************
* Author: Mariam Ben-Neticha
* Course: CS 290
* HW Assignment: AJAX Interactions
* Date: 5.8.16
* File Name: openWeather.js
* Related Files: openWeather.html
*************************/

var apiKey = "8f4e017ed2ddcd4df8182ebd0beeb768";
document.addEventListener('DOMContentLoaded', cityButtons);
document.addEventListener('DOMContentLoaded', zipButtons);

function cityButtons(){
	document.getElementById('submitCity').addEventListener('click', function(event){
	var req = new XMLHttpRequest();
	var city = document.getElementById('cityName').value;
	req.open('GET', 'http://api.openweathermap.org/data/2.5/weather?q=' + city + ',us&mode=json&units=imperial&appid=' + apiKey, true);
	req.addEventListener('load', function(){
		if (req.status >= 200 && req.status < 400){
			var response = JSON.parse(req.responseText);
			console.log(response);
			document.getElementById("city").textContent = response.name;
			document.getElementById('temp').textContent = response.main.temp + " F";
			document.getElementById('humidity').textContent = response.main.humidity + "%";
			document.getElementById('description').textContent = response.weather[0].description;
		} else {
			console.log("Error in network request: " + request.statusText);
		}
	});
	req.send(null);
	event.preventDefault();
	});
}

function zipButtons(){
	document.getElementById('submitZip').addEventListener('click', function(event){
	var req = new XMLHttpRequest();
	var zip = document.getElementById('zipCode').value;
	req.open('GET', 'http://api.openweathermap.org/data/2.5/weather?q=' + zip + ',us&mode=json&units=imperial&appid=' + apiKey, true);
	req.addEventListener('load', function(){
		if (req.status >= 200 && req.status < 400){
			var response = JSON.parse(req.responseText);
			console.log(response);
			document.getElementById("city").textContent = response.name;
			document.getElementById('temp').textContent = response.main.temp + " F";
			document.getElementById('humidity').textContent = response.main.humidity + "%";
			document.getElementById('description').textContent = response.weather[0].description;
		} else {
			console.log("Error in network request: " + request.statusText);
		}
	});
	req.send(null);
	event.preventDefault();
	});
}