/************************
* Author: Mariam Ben-Neticha
* Course: CS 290
* HW Assignment: AJAX Interactions
* Date: 5.8.16
* File Name: ajaxForm.js
* Related Files: ajaxForm.html
*************************/

document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
	document.getElementById('submitText').addEventListener('click',function(event){
		var req = new XMLHttpRequest();
		var payload = {input:null};
		payload.input = document.getElementById('input').value;
		req.open('POST', 'http://httpbin.org/post', true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load',function(){
			if (req.status >= 200 && req.status < 400){
				var response = JSON.parse(req.responseText);
				document.getElementById('userInput').textContent = response.json.input;
				document.getElementById('resultOutput').textContent = response.data;
			} else {
				console.log("Error in network request: " + req.statusText);
			}
		});
		req.send(JSON.stringify(payload));
		event.preventDefault();
	})
}