/************************
* Author: Mariam Ben-Neticha
* Course: CS 290
* HW Assignment: DOM and Events
* Date: 4.26.16
* File Name: script.js
* Related Files: index.html, indexStyle.css
*************************/

/************ Description ************
//A 4x4 Table 
//Top row = header row + header cells; 'Header 1', 'Header 2', 'Header 3', 'Header 4'
//Non-header cells contain their position: '1,1' , '2,1', '3, 1' , '4, 1'
// '2,1', '2, 2' ....
//4 directional buttons (up, down, left, right)
//Button labeled "Mark Cell" permanently changes cell background color to yellow
//'1,1' cell should be selected upon initial load of page
***************************************/

/************ Functions ************/

//Build the Table
function createTable( numRows, numCols){
	var body = document.body;
	var newTable = document.createElement('table');
	newTable.style.width = '300px';
	newTable.setAttribute('border' ,'1');
  	newTable.style.border = '1px solid black';

  	//setup header row
	var thead = document.createElement('thead');
	for (var i = 0; i < 1; i++){
		var tr = document.createElement('tr');
		for (var j = 0; j < numCols; j++){
			var th = document.createElement('th');
			var n = j + 1;
			th.appendChild(document.createTextNode('Header' + n));
			tr.appendChild(th)
		}
		thead.appendChild(tr);
	}

	//setup body rows
	var tbody = document.createElement('tbody');
	for (var r = 0; r < numRows; r++){
  		var trbody = document.createElement('tr');
		for (var s = 0; s < numCols; s++){
			var td = document.createElement('td');
			var t = s + 1;
      		var v = r + 1;
			td.appendChild(document.createTextNode('(' + t + "," + v + ')'));
			var idLabel = t + "-" + v;
      		td.setAttribute('id', idLabel);
    		td.setAttribute('border', '1');
			td.style.border = '1px solid black';
			trbody.appendChild(td);
    	}
  		tbody.appendChild(trbody);
  	}

  	//add header and body rows to the table
	newTable.appendChild(thead);
	newTable.appendChild(tbody);

  	//add table to the document's body
	body.appendChild(newTable);
}



function makeButtons(button){
	var body = document.body;

    for (var i = 0; i < button.length; i++){
    	var curButton = document.createElement('button');
    	curButton.setAttribute('type', 'button');
    	curButton.setAttribute('id', 'b ' + button[i]);
    	if (i === button.length){
    		curButton.textContent = 'Mark Cell';
    	}
    	else{
    		curButton.textContent = button[i];
    	}
    	body.appendChild(curButton);
    }
}



//Selects currentCell
function selectCursor(){
	var CellId = currentCell.getIdString();
	var Cell = document.getElementById(CellId);
	Cell.style.border = '3px solid black';
}



//Deselects previously selected cell
function deselectCursor(){
	var CellId = currentCell.getIdString();
	var Cell = document.getElementById(CellId);
	Cell.style.border = '1px solid black';
}



//Adjust cursor according to specific direction
function adjustCursor(direction){
	switch (direction) {
		case "Up":
			if (currentCell.row === 1)
				return;
			else
				deselectCursor();
				currentCell.row --;
			break;
		case "Down":
			if (currentCell.row === (numRows))
				return;
			else
				deselectCursor();
				currentCell.row ++;
			break;
		case "Right":
			if (currentCell.col === (numCols))
				return;
			else
				deselectCursor();
				currentCell.col ++;
			break;
		case "Left":
			if (currentCell.col === 1)
				return;
			else
				deselectCursor();
				currentCell.col --;
			break;
	}
	selectCursor();
	return;
}



//'Mark Cell' button changes backround of cell to yellow permanently
function markCell(color){
	var markCellId = currentCell.getIdString();
	var markCell = document.getElementById(markCellId);
	markCell.style.backgroundColor = color;
}
/************ FUNCTIONS END ************/


/************ MAIN ************/
// Global variables ,etc 
var numRows = 4;
var numCols = 4;
var color = 'yellow';
var button = ['Up', 'Down', 'Left', 'Right', 'Mark Cell'];
var currentCell = {
	row : 1,	col : 1,
};
//retrieves 'id' of the currentCell
currentCell.getIdString = function(){
	var cellIdString = String(this.col) + '-' + String(this.row);
	return cellIdString;
};

//create a 4x4 table;
createTable( numRows, numCols);

//create 4 directional buttons and 'Mark Cell' button
makeButtons(button);

//select initial cursor at current Cell (1,1)
selectCursor();

//give each directional button movement
document.getElementById('b Up').addEventListener('click', function(){
		adjustCursor("Up");});
document.getElementById('b Down').addEventListener('click', function(){
		adjustCursor("Down");});
document.getElementById('b Right').addEventListener('click', function(){
		adjustCursor("Right");});
document.getElementById('b Left').addEventListener('click', function(){
		adjustCursor("Left");});

//add mark cell event listener to 'Mark Cell' button
document.getElementById('b Mark Cell').addEventListener('click', function(){
	markCell(color);
});

/************ MAIN END ************/