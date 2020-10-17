'use strict';

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map
    (key => `${[encodeURIComponent(key)]}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayCompData(responseJson, compCount) {
    //Responsible for displaying the results to the DOM
    console.log(responseJson);

    $('#rent-results').empty();

    for (let i = 0; i < compCount; i++) {
        $('#rent-results').append(`
        <div>
            <ul>
                <li class="result-item">Address: ${responseJson.listings[i].formattedAddress}</li>
                <li class="result-item">Rent Price: ${responseJson.listings[i].price}</li>
                <li class="result-item">Rent low-end: ${responseJson.rentRangeLow}</li>
                <li class="result-item">Rent high-end: ${responseJson.rentRangeHigh}</li>
            </ul>
        </div>`);
        console.log('test')   
    }
    $("#rent-results").removeClass("hidden");
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
    .then(responseJson => displayCompData(responseJson, comps))
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