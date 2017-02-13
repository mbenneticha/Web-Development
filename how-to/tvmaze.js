document.addEventListener('DOMContentLoaded', bindButtons);
document.addEventListener('DOMContentLoaded', personButtons);

function bindButtons(){
	document.getElementById('submitShow').addEventListener('click', function(event){
	var req = new XMLHttpRequest();
	var show = document.getElementById('showName').value;
	req.open('GET', 'http://api.tvmaze.com/singlesearch/shows?q=' + show + '&embed[]=episodes&embed[]=cast', true);
	req.addEventListener('load', function(){
		if (req.status >= 200 && req.status < 400){
			var response = JSON.parse(req.responseText);
			console.log(response);

			function htmlToPlaintext(text) {
			  return text ? String(text).replace(/<[^>]+>/gm, '') : '';
			}

			document.getElementById("shoName").textContent = response.name;
			document.getElementById("character").textContent = response._embedded.cast[0].character.name;
			document.getElementById('person').textContent = response._embedded.cast[0].person.name;
			document.getElementById('summary').textContent = htmlToPlaintext(response.summary);

			for(var i = document.getElementById("myTable").rows.length; i > 0;i--)
			{
				document.getElementById("myTable").deleteRow(i -1);
			}

			function addHeaders(){
				var table = document.getElementById("myTable");
				var header = table.createTHead();
				var row = header.insertRow(0);

				row.insertCell(0).innerHTML = "<h3>Episode List</h3>"

				var row = header.insertRow(1);

				row.insertCell(0).innerHTML = "<b>Season</b>";
				row.insertCell(1).innerHTML = "<b>Episode Number</b>";
				row.insertCell(2).innerHTML = "<b>Episode Name</b>";
				row.insertCell(3).innerHTML = "<b>Air Date</b>";
			}

			function addRow(m){
				var i = m;
				var col1 = response._embedded.episodes[i].season;
				var col2 = response._embedded.episodes[i].number;
				var col3 = response._embedded.episodes[i].name;
				var col4 = response._embedded.episodes[i].airdate;

				var table = document.getElementById("myTable");
				var rowCount = table.rows.length;
				var row = table.insertRow(rowCount);

				row.insertCell(0).innerHTML = col1;
				row.insertCell(1).innerHTML = col2;
				row.insertCell(2).innerHTML = col3;
				row.insertCell(3).innerHTML = col4;
				
			}

			var table = document.getElementById("myTable");
			table = addHeaders();

			for (var i = 0; i < response._embedded.episodes.length; i++){
				var table = document.getElementById("myTable");
				table = addRow(i);
			};
			
		} else {
			console.log("Error in network request: " + req.statusText);
		}
	});
	req.send(null);
	event.preventDefault();
	});
}



function personButtons(){
	document.getElementById('submitChar').addEventListener('click', function(event){
	var req = new XMLHttpRequest();
	var character = document.getElementById('showChar').value;
	req.open('GET', 'http://api.tvmaze.com/search/people?q=' + character, true);
	req.addEventListener('load', function(){
		if (req.status >= 200 && req.status < 400){
			var response = JSON.parse(req.responseText);
			console.log(response);

			function htmlToPlaintext(text) {
			  return text ? String(text).replace(/<[^>]+>/gm, '') : '';
			}

			document.getElementById("person").textContent = response[0].person.name;
			var actor = response[0].person.id;

			var request = new XMLHttpRequest();
			request.open('GET', 'http://api.tvmaze.com/people/' + actor + '/castcredits?&embed[]=show&embed[]=character', true);
			request.addEventListener('load', function(){
				if (request.status >= 200 && request.status < 400){
					var response = JSON.parse(request.responseText);
					console.log(response);

					function htmlToPlaintext(text) {
					  return text ? String(text).replace(/<[^>]+>/gm, '') : '';
					}

					for(var i = document.getElementById("myTable").rows.length; i > 0;i--)
					{
						document.getElementById("myTable").deleteRow(i -1);
					}

					function addHeaders(){
						var table = document.getElementById("myTable");
						var header = table.createTHead();
						var row = header.insertRow(0);

						row.insertCell(0).innerHTML = "<h3>Show List</h3>"

						var row = header.insertRow(1);

						row.insertCell(0).innerHTML = "<b>Show</b>";
						row.insertCell(1).innerHTML = "<b>Character</b>";
						row.insertCell(2).innerHTML = "<b>Summary</b>";
					}

					function addRow(m){
						var i = m;
						var col1 = response[i]._embedded.show.name;
						var col2 = response[i]._embedded.character.name;
						var col3 = response[i]._embedded.show.summary;

						var table = document.getElementById("myTable");
						var rowCount = table.rows.length;
						var row = table.insertRow(rowCount);

						row.insertCell(0).innerHTML = col1;
						row.insertCell(1).innerHTML = col2;
						row.insertCell(2).innerHTML = htmlToPlaintext(col3);
						
					}

					var table = document.getElementById("myTable");
					table = addHeaders();

					for (var i = 0; i < response.length; i++){
						var table = document.getElementById("myTable");
						table = addRow(i);
					};
					
				} else {
					console.log("Error in network request: " + request.statusText);
				}
			});
			request.send(null);


		} else {
			console.log("Error in network request: " + req.statusText);
		}

	});
	req.send(null);
	event.preventDefault();
	});}










