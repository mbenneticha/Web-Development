"use strict";
let siteURL = "http://52.25.91.135:3030";

let rows = {};



function queryServer(qString, route) {
    let req = new XMLHttpRequest();
    
    let fullURL = siteURL + route + "?" + qString;
    console.log("submitted query = " + fullURL );

    req.open("GET", fullURL, true);
    

    req.addEventListener('load', function () {
        if (req.responseText) {
            rows = JSON.parse(req.responseText); 
        } else {
            console.log ("JSON error");
        }
        
        if (req.status >= 200 && req.status < 400) {
            hideErrorMessage();
            document.forms["insert-form"].reset();
            displayExerciseInfo(rows);
        
        } else {
            if (rows.cod == "404") {
                displayErrorMessage("The server did not find any data for that entry");
            } else {
                displayErrorMessage("Some unknown error occured.");
            }
            if(document.fomrs["insert-form"])
                document.forms["insert-form"].reset();
        }
    });
    
    req.send(null);
}


function bindButtons() {
    var insertSubmitButton = document.getElementById("insert-submit");
    if (insertSubmitButton) {
        document.getElementById("insert-submit").addEventListener('click', function (event) {
            event.preventDefault();
            if (document.getElementById("insert-name").value.length < 3) {
                alert("Exercise name must contain at least 3 characters.");
            } else {
                let queryString = 
                    "name=" + document.getElementById("insert-name").value + "&" + 
                    "reps=" + document.getElementById("insert-reps").value + "&" + 
                    "weight=" + document.getElementById("insert-weight").value + "&" + 
                    "date=" + document.getElementById("insert-date").value + "&" + 
                    "lbs=" + document.getElementById("insert-lbs").value;

                queryServer(queryString, "/insert");
            }
        });
    }
    
    var editSubmitButton = document.getElementById("edit-submit");
    if (editSubmitButton) {
        document.getElementById("edit-submit").addEventListener('click', function (event) {
            event.preventDefault(); 
            if (document.getElementById("edit-name").value.length < 3) {
                alert("You must enter at least 3 characters for the name of the exercise.");
            } else {
                let queryString = 
                    "name=" + document.getElementById("edit-name").value + "&" + 
                    "reps=" + document.getElementById("edit-reps").value + "&" + 
                    "weight=" + document.getElementById("edit-weight").value + "&" + 
                    "date=" + document.getElementById("edit-date").value + "&" + 
                    "lbs=" + document.getElementById("edit-lbs").value + "&" + 
                    "id=" + document.getElementById("edit-id").value;

                    let req = new XMLHttpRequest();

                    let fullURL = siteURL + '/edit-safe' + "?" + queryString;
                    console.log("The query string being submitted: " + fullURL );

                    req.open("GET", fullURL, true);

                    req.addEventListener('load', function () {
                        if (req.status >= 200 && req.status < 400) {
                            window.location.href = "../";

                        } else {
                            if (rows.cod == "404") {
                                displayErrorMessage("The server did not find any data for that entry");
                            } else {
                                displayErrorMessage("Some unknown error occured.");
                            }
                            document.forms["insert-form"].reset(); 
                        }
                    });
                    req.send(null);
            }
        });
    }
}

function bindDeleteButton(bttn, id) {
    bttn.addEventListener('click', function (event) {
        event.preventDefault(); // Stop page from reloading
        let queryString = "id=" + String(id);
        
        queryServer(queryString, "/delete");
    });
}


function bindEditButton(bttn, id) {
    bttn.addEventListener('click', function (event) {
        event.preventDefault();
        let queryString = "id=" + String(id);
        
        window.location.href = "../edit-by-id?" + queryString;
    });
}

function displayExerciseInfo(rows) {
    console.log("Hello from displayExerciseInfo");
    let resultsPanel = document.getElementById("results-panel");
    resultsPanel.removeAttribute("hidden");
    deleteChildren("table-anchor");
    buildTable("table-anchor", rows);
}


function deleteChildren(parentId) {
    console.log("Attempting to clear the table.");
    let parent = document.getElementById(parentId);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


function buildTable(parentId, rows) {
    let data = JSON.parse(rows);
    console.log("Data is now: " + data);
    if (data) {
        var headerLabels = Object.keys(data[0]);
        console.log("headerLabels is now: " + headerLabels);
    }
    
    let anchor = document.getElementById(parentId);
    let table = document.createElement("table");
    table.setAttribute("class", "table table-striped table-responsive");
    anchor.appendChild(table);
    
    let tableHead = document.createElement("thead");
    table.appendChild(tableHead);
    let headerRow = document.createElement("tr");
    tableHead.appendChild(headerRow);
    
    let tableBody = document.createElement("tbody");
    table.appendChild(tableBody);
    
    for (let i = 1; i < headerLabels.length; i++) {
        let thisHeaderCell = document.createElement("th");
        if (headerLabels[i] == "lbs") {
            thisHeaderCell.textContent = "units";            
        } else {
            thisHeaderCell.textContent = headerLabels[i];
        }
        headerRow.appendChild(thisHeaderCell);
    }
    let deleteHeader = document.createElement("th");
    deleteHeader.textContent = "Delete";
    let editHeader = document.createElement("th");
    editHeader.textContent = "Edit";
    
    headerRow.appendChild(deleteHeader);
    headerRow.appendChild(editHeader);
    
    for (let i = 0; i < data.length; i++) {
        let currentData = data[i];
        let newRow = document.createElement("tr");
        
        for (let key in currentData) {
            if (key != "id") {
                let thisCell = document.createElement("td");
                if (key == "lbs") {
                    thisCell.textContent = (currentData[key] == 1) ? "lbs" : "kg";
                } else if (key == "date") {
                    let dateString = currentData[key];
                    dateString = dateString.slice(0, 10);
                    thisCell.textContent = dateString;
                } else {
                    thisCell.textContent = currentData[key];
                }
                newRow.appendChild(thisCell);
            }
            
        }
        let deleteCell = document.createElement("td");
        let deleteButton = document.createElement("input");
        deleteButton.setAttribute("id", "delete-" + currentData["id"]);  
        deleteButton.setAttribute("type", "submit");
        deleteButton.setAttribute("class", "btn-danger");
        deleteButton.setAttribute("value", "Delete");
        deleteCell.appendChild(deleteButton);
        bindDeleteButton(deleteButton, currentData["id"]);
        
        let editCell = document.createElement("td");
        let editButton = document.createElement("input");
        editButton.setAttribute("id", "edit-" + currentData["id"]);
        editButton.setAttribute("type", "submit");
        editButton.setAttribute("class", "btn-warning");
        editButton.setAttribute("value", "Edit");
        editCell.appendChild(editButton);
        bindEditButton(editButton, currentData["id"]);
        
        newRow.appendChild(deleteCell);
        newRow.appendChild(editCell);
        tableBody.appendChild(newRow);
    }
    
}


function displayErrorMessage(msg) {
    let errorPanel = document.getElementById("error-panel")
    if (errorPanel) {
        errorPanel.removeAttribute("hidden");
        document.getElementById("error-message").textContent = msg;
    }
}


function hideErrorMessage() {
    let errorPanel = document.getElementById("error-panel");
    if (errorPanel) {
        errorPanel.setAttribute("hidden", "");
    }
}


function hideResultsPanel() {
    let resultsPanel = document.getElementById("results-panel");
    if (resultsPanel) {
        resultsPanel.setAttribute("hidden", "");
    }
}


function populateData() {
    console.log("Loading data...");
    let resultsPanel = document.getElementById("results-panel");
    if (resultsPanel) {
        queryServer("", "/load-data");
    }
}


document.addEventListener('DOMContentLoaded', bindButtons);
window.onload = populateData;