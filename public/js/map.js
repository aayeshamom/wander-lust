    mapboxgl.accessToken = mapToken;

      const map = new mapboxgl.Map({
          container: "map", 
          style: "mapbox://styles/mapbox/streets-v12",
          center: [73.0483, 19.2813], 
          zoom: 9,
      });
      const marker = new mapboxgl.Marker()
      .setLngLat(coordinates)
      .addTo(map);