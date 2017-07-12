function initMap() {
    var mapNode = document.getElementById('map');
    if (!mapNode) {
        return;
    }
    var mode = mapNode.getAttribute('data-map-mode') || 'single';
    var bounds = new google.maps.LatLngBounds();
    var zoom = parseInt(mapNode.getAttribute('data-map-zoom') || 15);
    var points = [];
    var map = null;
    if (mode === 'list') {
        points = Array.prototype.map.call(document.querySelectorAll('.map__marker'), node => {
            var pos = {
                lat: parseFloat(node.getAttribute('data-lat')),
                lng: parseFloat(node.getAttribute('data-lng')),
                title: node.getAttribute('title'),
                url: node.getAttribute('href')
            };
            node.addEventListener('mouseover', () => {
                map.panTo(pos);
            });
            
            return pos;
        });
    } else {
        var lat = parseFloat(mapNode.getAttribute('data-lat'));
        var lng = parseFloat(mapNode.getAttribute('data-lng'));
        points = [{lat: lat, lng: lng}];
    }
    if (!points.length) {
        return;
    }
    points.forEach(point => {
        bounds.extend(new google.maps.LatLng(point.lat, point.lng));
    });
    map = new google.maps.Map(mapNode);
    if (points.length > 1) {
        map.fitBounds(bounds);
    } else {
        if (points.length === 1) {
            map.setCenter(points[0]);
            map.setZoom(zoom);
        }
    }
    points.forEach(point => {
        new google.maps.Marker({
            position: point,
            title: point.title || null,
            label: point.title || null,
            map: map
        }).addListener('click', () => {
            if (point.url) {
                window.location = point.url;
            }
        });
    });
    
}
