window.onload = function() {    
    // Variables to handle pagination
    var currentPage = 1;
    var query;

    // anonymous function controlling what happens when search is 
    // clicked
    document.getElementById("search").onclick = function() {
        // CLear anything currently in the search-results table
        //$("table tbody").empty();
        document.getElementById("result-content").innerHTML = null;
        currentPage = 1;
        // Call the query building function
        query = buildQuery(currentPage);
        
        // Call the search function
        searchAPI(query, currentPage);
    }

    // This function allows a user to navigate through the pages by
    // typing in the page number they wish to visit
    document.getElementById("go-to-page").onclick = function() {
        //$("table tbody").empty();
        document.getElementById("result-content").innerHTML = null;
        currentPage = document.getElementById("page").value;
        //console.log(currentPage);
        query = buildQuery(currentPage);
        searchAPI(query, currentPage);
    }

    // This functions enables navigation descending through the pages
    // one page at a time. Loops to the last page if trying to move
    // backwards through page 1.
    document.getElementById("prev-page").onclick = function() {
        //$("table tbody").empty();
        document.getElementById("result-content").innerHTML = null;
        currentPage -= 1;
        //console.log(currentPage);
        if (currentPage < 1) {
            currentPage = 20;
        }
        query = buildQuery(currentPage);
        searchAPI(query, currentPage);
    }

    // This function enables navigating one by one through the pages
    // in an ascending order. Loops to the first page if trying to
    // move forwards through page 20.
    document.getElementById("next-page").onclick = function() {
        //$("table tbody").empty();
        document.getElementById("result-content").innerHTML = null;
        currentPage += 1;
        //console.log(currentPage);
        if (currentPage > 20) {
            currentPage = 1;
        }
        query = buildQuery(currentPage);
        searchAPI(query, currentPage);
    }
}

// This function adds navigation information and some buttons
// tfor moving through the available pages
function addPageNav(totalPages, currentPage) {
    //console.log(currentPage + " of " + totalPages);
    document.getElementById("page-info").innerHTML = "Page " 
    + currentPage + " of " + totalPages + "&emsp; Go to page:" ;
}

// This function builds a string to be passed into the url of the api 
// call. The string contains the parameters required by the filter
function buildQuery(currentPage) {
    // Decalre variables for each form element and collect their value
    var type = document.getElementById("type").value;
    var state = document.getElementById("state").value;
    var pubpriv = document.getElementById("pubpriv").value;
    var language = document.getElementById("language").value;
    var label = document.getElementById("label").value;
    var title = document.getElementById("title").value;
    var body = document.getElementById("body").value;
    var comments = document.getElementById("comments").value;
    var sort = document.getElementById("sort").value;
    var order = document.getElementById("order").value;
    
    // Variable to build a string to insert into the api call
    var queryString = "";
    
    // Build up the queryString depending on which elements are used in the form
    // We don't need to include both as it is the default option
    if (type != "both") {
        queryString += "type:" + type;
    }
    // We don't need to include both as it is the default option
    if (state != "both") {
        queryString += "+state:" + state;
    }
    // We don't need to include both as it is the default option
    if (pubpriv != "both") {
        queryString +=  "+is:" + pubpriv;
    }
    // If there is nothing entered then this ignores the language parameter
    if (language != "") {
        queryString += "+language:" + language;
    }
    // If there is nothing entered then this ignores the label parameter
    if (label != "") {
        queryString += "+label:\"" + label + "\"";
    }
    // If there is nothing entered then this ignores the title parameter
    if (title != "") {
        queryString +=  "+" + title + " in:title";
    }
    // If there is nothing entered then this ignores the body parameter
    if (body != "") {
        queryString += "+" + body + "in:body";
    }
    // If there is nothing entered then this ignores the comments parameter
    if (comments != "") {
        queryString += "+" + comments + "in:comments";
    }
    // We don't need to include bast-match as it is the default option
    if (sort != "best-match") {
        queryString += "&sort=" + sort;
    }
    queryString += "&order=" + order;

    // Increment the page and include in query if necessary
    if (currentPage > 1) {
        queryString += "&page=" + currentPage;
    }

    return queryString;
}

// This functions takes in the string previously built and calls the api.
// Data returned is processed and displayed in a HTML table.
function searchAPI(query, currentPage) {
    // Call GitHub API and return data
    $.get(
        "https://api.github.com/search/issues?q=" + query + "&per_page=50",
        function(data) {
            console.log(data);
            var totalCount = data.total_count
            totalPages = Math.ceil(totalCount / 50);
            if (totalPages > 20) {
                totalPages = 20;
            }
            //console.log(totalPages);
            // Loop through the array returned as data.items by GitHub
            for(i = 0; i < data.items.length; i++) {
                // Get the name of the repository
                var repoUrl = data.items[i].repository_url;
                var repoName = repoUrl.substring(repoUrl.lastIndexOf('/')+1);
                //console.log(repoName);
                // Get the title of the issue
                var issueTitle = data.items[i].title;
                //console.log(issueTitle);
                // Get the body of the issue
                var issueBody = data.items[i].body;
                //console.log(issueBody);
                // Get the labels attached to the issue
                var issueLabels = "";
                for(j = 0; j < data.items[i].labels.length; j++) {
                    issueLabels += data.items[i].labels[j].name + "; ";
                };
                //console.log(issueLabels);
                // Get the date the issue was created
                var dateCreated = data.items[i].created_at;
                //console.log(dateCreated);
                // Get the current state of the issue
                var issueState = data.items[i].state;
                //console.log(issueState);
                // Get a hyperlink to the issue
                var issueUrl = data.items[i].html_url;
                //console.log(issueUrl);
                // Add a row to the HTML results table after the last row
                //$("table").append("<tr><td>" + repoName + "</td><td>" + issueTitle + "</td><td>" 
                //+ issueBody + "</td><td>" + issueLabels + "</td><td>" + dateCreated + "</td><td>" 
                //+ issueState + "</td><td><a href=\"" + issueUrl + "\" target=\"_blank\"> Go to Issue </a></td></tr>");
                // Add sections to the result-content div
                document.getElementById("result-content").innerHTML += "<section class=\"issue\"><h3>" + repoName + "</h3><h4>" 
                + issueTitle + "</h4><p>" + issueBody + "</p><p>Labels:&emsp;" + issueLabels + "</p><p>" + dateCreated + "</p><p>" + issueState
                + "</p><a href=\"" + issueUrl + "\" target=\"_blank\">Go to Issue</a></section>"; 
            };
            addPageNav(totalPages, currentPage); 
        } 
    );
}