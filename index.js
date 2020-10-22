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
        <div class="result-item">
            <ul>
            <div class="result-item">
                <li class="result-item-address">Address: ${responseJson.listings[i].formattedAddress}</li>
            </div>
            <div class="result-item">
                <li class="result-item-bed">Bedrooms: ${responseJson.listings[i].bedrooms}</li>
            </div>
            <div class="result-item">
                <li class="result-item-bath">Bathrooms: ${responseJson.listings[i].bathrooms}</li>
            </div>
            <div class="result-item">
                <li class="result-item-sq">Square Footage: ${responseJson.listings[i].squareFootage}</li>
            </div>
            <div class="result-item">
                <li class="result-item-rent">Rent Price: ${responseJson.listings[i].price}</li>
            </div>
            
            </ul>
        </div>`);
    }
    $('#rent-results').append(`
    <div class="result-item">
        <ul>
            <li class="result-item">Average low-end: ${responseJson.rentRangeLow}</li>
            <br>
            <li class="result-item">Average high-end: ${responseJson.rentRangeHigh}</li>
        </ul>
    </div>`)
    $("#rent-results").removeClass("hidden");
}

function averageRent(responseJson, compCount) {
    $('#average-price').empty();
    //Responsible for displaying the average rent to the DOM
    let combinedPrice = 0;
    for (let i = 0; i < compCount; i++) {
        combinedPrice += responseJson.listings[i].price;
    }
    let rawPrice = (combinedPrice / compCount);
    const averagedPrice = rawPrice.toFixed(0);
    //Rounds the decimal to the hundredth
    console.log(averagedPrice);
    $('#average-price').append(`
    <div class="result-item-av">
        <ul>
            <li class="result-item">Average Price: $${averagedPrice}</li>
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


/////////////////////// CASH-FLOW CALCULATOR ///////////////////////////


function calculateTotalExpenses(mortgage, insurance, taxes, hoa, vacancy, capEx, repairs, propManFees) {
    //Totals amount for expenses
    const rent = parseInt($(".js-monthly-rent").val());
    console.log("Monthly Income: " + rent);

    const totalExpenses = (mortgage+insurance+taxes+hoa);
    console.log("Total expenses calculated: " + totalExpenses);

    const totalAddCosts = (vacancy+capEx+repairs+propManFees);
    console.log("Total additional costs calculated: " + totalAddCosts);

    calculateCashFlow(totalExpenses, totalAddCosts, rent)
}

function calculateCashFlow(totalExpenses, totalAddCosts, rent) {
    //Calculates cash-flow for monthly rental
    const firstRemainder = (rent-totalExpenses);
    console.log(firstRemainder);

    const secondRemainder = (firstRemainder*totalAddCosts);
    console.log(secondRemainder.toFixed(2));

    const cashFlow = (firstRemainder - secondRemainder);
    console.log("Estimated Monthly Cash-Flow: " + cashFlow)

    displayCashFlow(cashFlow);
}

function displayCashFlow(cashFlow) {
    //Responsible for displaying the results to the DOM
    $('#cashflow-results').empty();

    $('#cashflow-results').append(`
        <div>
            <ul>
                <li class="result-item">Monthly Cash-Flow: $${cashFlow}</li>
            </ul>
        </div>`);
    $('#cashflow-results').removeClass('hidden');
}

function handleCriteria() {
    //Input bank for calculation
    $(".cash-flow-form").submit(event => {
        event.preventDefault();
        $("#cashflow-results").empty();

        const mortgage = parseInt($(".js-mortgage").val());
        const insurance = parseInt($(".js-insurance").val());
        const taxes = parseInt($(".js-taxes").val());
        const hoa = parseInt($(".js-hoa").val());
        const vacancy = parseFloat($(".js-vacancy").val());
        const capEx = parseFloat($(".js-cap-ex").val());
        const repairs = parseFloat($(".js-savings-repairs").val());
        const propManFees = parseFloat($(".js-property-management").val());

        calculateTotalExpenses(mortgage, insurance, taxes, hoa, vacancy, capEx, repairs, propManFees);
    })
}

$(handleCriteria);