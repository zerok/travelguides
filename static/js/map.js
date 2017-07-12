function initMap() {
    var mapNode = document.getElementById('map');
    var lat = parseFloat(mapNode.getAttribute('data-lat'));
    var lng = parseFloat(mapNode.getAttribute('data-lng'));
    var zoom = parseInt(mapNode.getAttribute('data-zoom') || 15);
    var pos = {lat: lat, lng: lng};
    var map = new google.maps.Map(mapNode, {
        zoom: zoom,
        center: pos
    });
    var marker = new google.maps.Marker({
        position: pos,
        map: map
    });
}
