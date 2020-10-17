'use strict';

function formatQueryParams(params) {
  const address = Object.keys(params).map
    (key => `${[encodeURIComponent(key)]}=${encodeURIComponent(params[key])}`);
  return address.join('&');
}

function structureCall(){
    const userAddress = $('.js-address').val();
    const type = $('.js-propertyType').val();
    console.log(userAddress);

    const queryAddress = {
    address: userAddress,
    }
    const queryType = {
    propertyType: type
    }
    
    const address = formatQueryParams(queryAddress);
    const propertyType = formatQueryParams(queryType);
    console.log(queryAddress);
    console.log(queryType);

	fetch(`https://rapidapi.p.rapidapi.com/rentalPrice?compCount=5&squareFootage=1600&bathrooms=2&${address}&bedrooms=4&${propertyType}`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "realty-mole-property-api.p.rapidapi.com",
		"x-rapidapi-key": "f31f4c4ae7msh19ad0c55e44bda2p1efe8ajsn5d61ef1eec85"
    }
})
    .then(response => response.json())
    .then(responseJson => {console.log(responseJson)})
/*.then(response => {
    console.log(response);
})*/
    
};


function mainSearch() {
    $(".rent-form").submit(event => {
        event.preventDefault();
        $(".rent-results").empty();
        structureCall();
        console.log('Main Ran')
    });
}

$(mainSearch);