// on click of map_location button, save lat/lng and redirect to index page map
// and center on location of this path/row
document.getElementById("js-map_location").onclick = function() {
    if (Modernizr.sessionstorage) {
        // If session storage is available, save center of path/row
        var lat_lng = document.getElementsByTagName('td')[3].innerHTML.replace(/\s+/g, '').split(/\/|,/)
        var lat = (parseFloat(lat_lng[0])+parseFloat(lat_lng[2]))/2
        var lng = (parseFloat(lat_lng[1])+parseFloat(lat_lng[3]))/2
        sessionStorage['lat'] = lat;
        sessionStorage['lng'] = lng;
    }
    location.href = "/#create";
}