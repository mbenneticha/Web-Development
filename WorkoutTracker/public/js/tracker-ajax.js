"use strict";
let siteURL = "http://52.25.91.135:3030";

let rows = {};


/**************************************************************************************
 queryServer(qString, route)
 
 Handle any requests sent. Builds a queryString, passes
 to server, and waits for a response. Once response received, updates page with new rows
 Arguments:
    qString- String. The queryString to use (Everything after the ?)
    route - String. The route to use to send the request to on server. e.g. "/insert"
 **************************************************************************************/
function queryServer(qString, route) {
    let req = new XMLHttpRequest();
    
    let fullURL = siteURL + route + "?" + qString;
    console.log("The query string being submitted: " + fullURL );
    
    // Send the GET request with the query string to the specified route
    req.open("GET", fullURL, true);
    
    // AJAX event listener:
    req.addEventListener('load', function () {
        if (req.responseText) {
            rows = JSON.parse(req.responseText); 
        } else {
            console.log ("Uhhh no JSON received!");
        }
        
        // Make sure we got a valid code in the response object before trying to update page
        if (req.status >= 200 && req.status < 400) {
            hideErrorMessage();
            console.log(rows); // For debug purposes
            document.forms["insert-form"].reset(); // Clear the insert form
            displayExerciseInfo(rows);
        
        // Display an error message and clear the form input if failure
        } else {
            if (rows.cod == "404") {
                displayErrorMessage("The server did not find any data for that entry");
            } else {
                displayErrorMessage("Some unknown error occured.");
            }
            if(document.fomrs["insert-form"])
                document.forms["insert-form"].reset(); // Clear the insert form
        }
    });
    
    req.send(null);
}


/**************************************************************************************
 bindButtons()
 
 Bind the static buttons on page
**************************************************************************************/
function bindButtons() {
    // Bind the button for the "Add a New Exercise" form
    var insertSubmitButton = document.getElementById("insert-submit");
    if (insertSubmitButton) {
        document.getElementById("insert-submit").addEventListener('click', function (event) {
            event.preventDefault(); // Stops button from reloading page
            // Check that a name was input
            if (document.getElementById("insert-name").value.length < 3) {
                alert("You must enter at least 3 characters for the name of the exercise.");
            } else {
                // Build queryString and send to queryServer function
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
            event.preventDefault(); // Stops button from reloading page
            // Check that a name was input
            if (document.getElementById("edit-name").value.length < 3) {
                alert("You must enter at least 3 characters for the name of the exercise.");
            } else {
                // Build queryString and send to queryServer function
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

                    // Send the GET request with the query string to the specified route
                    req.open("GET", fullURL, true);

                    // AJAX event listener:
                    req.addEventListener('load', function () {
                        // Make sure we got a valid code in the response object before trying to reload
                        if (req.status >= 200 && req.status < 400) {
                            window.location.href = "../";

                        // Display an error message and clear the form input if failure
                        } else {
                            if (rows.cod == "404") {
                                displayErrorMessage("The server did not find any data for that entry");
                            } else {
                                displayErrorMessage("Some unknown error occured.");
                            }
                            document.forms["insert-form"].reset(); // Clear the insert form
                        }
                    });
                    req.send(null);
            }
        });
    }
}

/**************************************************************************************
 bindDeleteButton(bttn, id)
 
 Bind the static buttons on page
**************************************************************************************/
function bindDeleteButton(bttn, id) {
    bttn.addEventListener('click', function (event) {
        event.preventDefault(); // Stop page from reloading
        let queryString = "id=" + String(id);
        
        queryServer(queryString, "/delete");
    });
}


/**************************************************************************************
 bindEditButton(bttn, id)
 
 Bind the static buttons on page
**************************************************************************************/
function bindEditButton(bttn, id) {
    bttn.addEventListener('click', function (event) {
        event.preventDefault();
        let queryString = "id=" + String(id);
        
        window.location.href = "../edit-by-id?" + queryString;
    });
}

/**************************************************************************************
displayExerciseInfo(rows)
Toggles results div to visible, clears the existing table, and rebuilds it
**************************************************************************************/
function displayExerciseInfo(rows) {
    console.log("Hello from displayExerciseInfo");
    let resultsPanel = document.getElementById("results-panel");
    resultsPanel.removeAttribute("hidden");
    // Delete the table and then rebuild it using the rows argument, which is an array
    deleteChildren("table-anchor");
    buildTable("table-anchor", rows);
}


/**************************************************************************************
deleteChildren(parentId)
Clear the table that is a child of the div with the passed in id
**************************************************************************************/
function deleteChildren(parentId) {
    console.log("Attempting to clear the table.");
    let parent = document.getElementById(parentId);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


/**************************************************************************************
buildTable(parentId, rows)
Build a table using the rows argument passed in. Rows is a json string.
**************************************************************************************/
function buildTable(parentId, rows) {
    // Convert rows into an object and grab its keys to build a table header row
    let data = JSON.parse(rows);
    console.log("Data is now: " + data);
    if (data) {
        var headerLabels = Object.keys(data[0]);
        console.log("headerLabels is now: " + headerLabels);
    }
    
    // Create a table, append it to our anchor, and give it a <thead> with its own <Tr>, and <tbody>
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
    
    // Add the headers for each column
    for (let i = 1; i < headerLabels.length; i++) {
        let thisHeaderCell = document.createElement("th");
        if (headerLabels[i] == "lbs") {
            thisHeaderCell.textContent = "units";            
        } else {
            thisHeaderCell.textContent = headerLabels[i];
        }
        headerRow.appendChild(thisHeaderCell);
    }
    // Add a Delete and Edit button last
    let deleteHeader = document.createElement("th");
    deleteHeader.textContent = "Delete";
    let editHeader = document.createElement("th");
    editHeader.textContent = "Edit";
    
    headerRow.appendChild(deleteHeader);
    headerRow.appendChild(editHeader);
    
    // For every row in the data array, createa  row and append each of its properties as a <td> element
    for (let i = 0; i < data.length; i++) {
        let currentData = data[i];
        let newRow = document.createElement("tr");
        
        // Add the values into the <td> elements one at a time
        for (let key in currentData) {
            if (key != "id") {
                let thisCell = document.createElement("td");
                // Convert the lbs column to say "lbs" or "kg", otherwise insert raw data
                if (key == "lbs") {
                    thisCell.textContent = (currentData[key] == 1) ? "lbs" : "kg";
                } else if (key == "date") {
                    let dateString = currentData[key];
                    dateString = dateString.slice(0, 10);
                    thisCell.textContent = dateString;
                } else {
                    thisCell.textContent = currentData[key];
                }
                // thisCell.setAttribute("id", key + "-" + row["id"]);
                newRow.appendChild(thisCell);
            }
            
        }
        // Add the delete button
        let deleteCell = document.createElement("td");
        let deleteButton = document.createElement("input");
        deleteButton.setAttribute("id", "delete-" + currentData["id"]);  
        deleteButton.setAttribute("type", "submit");
        deleteButton.setAttribute("class", "btn-danger");
        deleteButton.setAttribute("value", "Delete");
        deleteCell.appendChild(deleteButton);
        bindDeleteButton(deleteButton, currentData["id"]);
        
        // Add the edit button
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


/**************************************************************************************
displayErrorMessage(msg)
Shows the error panel div and sets the content to msg
**************************************************************************************/
function displayErrorMessage(msg) {
    let errorPanel = document.getElementById("error-panel")
    if (errorPanel) {
        errorPanel.removeAttribute("hidden");
        document.getElementById("error-message").textContent = msg;
    }
}


/**************************************************************************************
hideErrorMessage() 
Hides the error-panel div
**************************************************************************************/
function hideErrorMessage() {
    let errorPanel = document.getElementById("error-panel");
    if (errorPanel) {
        errorPanel.setAttribute("hidden", "");
    }
}


/**************************************************************************************
hideResultsPanel()
Hides the results-panel div
**************************************************************************************/
function hideResultsPanel() {
    let resultsPanel = document.getElementById("results-panel");
    if (resultsPanel) {
        resultsPanel.setAttribute("hidden", "");
    }
}


/**************************************************************************************
populateData()
Populates the data on the page - used on the home page for on-load event
**************************************************************************************/
function populateData() {
    console.log("Loading data...");
    let resultsPanel = document.getElementById("results-panel");
    if (resultsPanel) {
        queryServer("", "/load-data");
    }
}


/**************************************************************************************
Bind buttons and populate data on load
**************************************************************************************/
document.addEventListener('DOMContentLoaded', bindButtons);
window.onload = populateData;