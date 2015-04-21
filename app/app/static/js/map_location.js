document.getElementById("js-map_location").onclick = function() {
    if (Modernizer.sessionstorage) {
        // If session storage is available, save center of path/row

        sessionStorage['lat'] = lat;
        sessionStoarge['lng'] = lng;
    }
    location.href = "/#create";
}