'use strict';

function formatQueryParams(params) {
//Responsible for formatting the params object for the request
  const queryItems = Object.keys(params).map
    (key => `${[encodeURIComponent(key)]}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayCompData(responseJson, compCount) {
    //Responsible for displaying the results to the DOM
    $('#rent-results').empty();

    for (let i = 0; i < compCount; i++) {
    $('#rent-results').append(`
        <div>
            <ul>
                <li class="result-item">Address: ${responseJson.listings[i].formattedAddress}</li>
                <li class="result-item">Rent Price: ${responseJson.listings[i].price}</li>
            </ul>
        </div>`);
    }
    $('#rent-results').append(`
    <div>
        <ul>
            <li class="result-item">Rent low-end: ${responseJson.rentRangeLow}</li>
            <br>
            <li class="result-item">Rent high-end: ${responseJson.rentRangeHigh}</li>
        </ul>
    </div>`)
    $("#rent-results").removeClass("hidden");
}

function averageRent(responseJson, compCount) {
    //Responsible for displaying the average rent to the DOM
    let combinedPrice = 0;
    for (let i = 0; i < compCount; i++) {
        combinedPrice += responseJson.listings[i].price;
    }
    let rawPrice = (combinedPrice / compCount);
    const averagedPrice = rawPrice.toFixed(2);
    //Rounds the decimal to the hundredth
    console.log(averagedPrice);
    $('#average-price').append(`
    <div>
        <ul>
            <li class="result-item">Average Price: ${averagedPrice}</li>
        </ul>
    </div>
    `)
}

function handleRentalSearch(baseURL, comps, sqFoot, bath, rentalAddress, bed, type) {
    //Handles the construction of request with parameters and makes the fetch call
    const params = {
        compCount: comps,
        squareFootage: sqFoot,
        bathrooms: bath,
        address: rentalAddress,
        bedrooms: bed,
        propertyType: type        
    };
    console.log(params);

    const queryItems = formatQueryParams(params);
    const url = baseURL + '?' + queryItems;
    console.log(url);
    fetch(url, {
    //Call with fetch
        "method": "GET",
	    "headers": {
		"x-rapidapi-host": "realty-mole-property-api.p.rapidapi.com",
		"x-rapidapi-key": "f31f4c4ae7msh19ad0c55e44bda2p1efe8ajsn5d61ef1eec85"
    }})
    .then(response => {
        console.log(response);
        if (response.ok) {
            console.log('Response successful')
            return response.json();
        }
        throw new Error(response.statusText);
    }) 
    .then(responseJson => {
    //Handles averaging the rent for each property in the responseJson
        averageRent(responseJson, comps);
    //Returns another responseJson object to be used in displayCompData
        return responseJson;
    })
    .then(responseJson => {
    //Handles displaying the responseJson data in the DOM once called
        displayCompData(responseJson, comps)
    })
    .catch(err => {
        $('#js-error-message').text(`Sorry, something went wrong. Try again: ${err.message}`)
    console.log('Rental Search ran successfully')
    })
}

function mainSearch() {
    //Responsible for initiating search once user clicks submit button
    $(".rent-form").submit(event => {
    //Prevents default action and clears previous results
        event.preventDefault();
        $(".rent-results").empty();
        //API key and base URL for request call
        const apiKey = "f31f4c4ae7msh19ad0c55e44bda2p1efe8ajsn5d61ef1eec85";
        const baseURL = "https://rapidapi.p.rapidapi.com/rentalPrice";
        //Endpoints for rental property search criteria
        const comps = $('.js-compCount').val();
        const sqFoot = $('.js-square-foot').val();
        const bath = $('.js-bathrooms').val();
        const rentalAddress = $('.js-address').val();
        const bed = $('.js-bedrooms').val();
        const type = $('.js-propertyType').val();
        //Uses these as arguments for the handleRentalSearch function
        handleRentalSearch(baseURL, comps, sqFoot, bath, rentalAddress, bed, type, apiKey);
        //Check mainSearch function has ran
        console.log('Main Ran')
    });
}

$(mainSearch);