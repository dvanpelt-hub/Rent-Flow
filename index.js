'use strict';

function mainSearch() {
    $("rent-form").submit(event => {
        event.preventDefault();
        const apiKey = "f31f4c4ae7msh19ad0c55e44bda2p1efe8ajsn5d61ef1eec85";
        const baseURL = "realty-mole-property-api.p.rapidapi.com";
        const zipCode = $("zip");

        $("rent-results").empty();
        handleRentalSearch(apiKey, baseURL, zipCode);
        console.log("mainSearch Ran")
    });
}

$(mainSearch);