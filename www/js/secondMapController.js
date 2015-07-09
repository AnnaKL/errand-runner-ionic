appCtrl.controller('Map2Ctrl', function($scope, $ionicLoading, $compile, $http, $stateParams, $window) {

  $scope.tasks = []

  ionic.Platform.ready(function() {

    $scope.updateMap = function() {
      $http.get('https://evening-plains-3275.herokuapp.com/tasks', {
        headers: {
          'Authorization': window.localStorage['auth_token']
        }
      }).
      success(function(data, status, headers, config) {
        for (var i = 0; i < data.tasks.length; i++) {
          $scope.tasks.push(data.tasks[i])
        }
        for (var i = 0; i < $scope.tasks.length; i++) {
          if ($scope.tasks[i].id == $stateParams.taskId) {
            $scope.task = $scope.tasks[i]
          }
        }
        $scope.placeMarkers()
        $scope.getDirections();
      }).
      error(function(data, status, headers, config) {})
    }


    navigator.geolocation.getCurrentPosition(function(pos) {
      newLocation = (new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      map.setCenter(newLocation)
      var myLocation = new google.maps.Marker({
        position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
        map: map,
        title: "My Location",
        icon: ('https://maps.gstatic.com/mapfiles/ms2/micons/lightblue.png')
      });
    });

    var myLatlng = new google.maps.LatLng(51.517399, -0.073590);

    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map2"), mapOptions);

    $scope.map = map;


    $scope.centerOnMe = function() {
      if (!$scope.map) {
        return;
      }

      $scope.loading = $ionicLoading.show({
        content: 'Getting current location...',
        showBackdrop: false
      });

      navigator.geolocation.getCurrentPosition(function(pos) {
        $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        $scope.loading.hide();
      }, function(error) {
        alert('Unable to get location: ' + error.message);
      });
    };


    $scope.map = map;
    $scope.markers = [];
    var infoWindow = new google.maps.InfoWindow();
    $scope.pickupMarker = function(info) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(info.pick_up_lat, info.pick_up_lon),
        map: $scope.map,
        icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/pink.png',
        animation: google.maps.Animation.DROP,
        title: info.title,
        pickup: info.pick_up_address
      });
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.pickup);
        infoWindow.open($scope.map, marker);
      });
      $scope.markers.push(marker);
    }

    $scope.deliveryMarker = function(info) {
      var marker2 = new google.maps.Marker({
        position: new google.maps.LatLng(info.drop_off_lat, info.drop_off_lon),
        map: $scope.map,
        icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/pink.png',
        animation: google.maps.Animation.DROP,
        title: info.title,
        delivery: info.drop_off_address
      });
      google.maps.event.addListener(marker2, 'click', function() {
        infoWindow.setContent('<h2>' + marker2.title + '</h2><br>' + marker2.delivery);
        infoWindow.open($scope.map, marker2);
      });
      $scope.markers.push(marker2);
    }

    $scope.placeMarkers = function() {
      // for (i = 0; i < $scope.tasks.length; i++) {
      $scope.pickupMarker($scope.task);
      $scope.deliveryMarker($scope.task);
      $scope.directions = {
          origin: new google.maps.LatLng($scope.task.pick_up_lat, $scope.task.pick_up_lon),
          destination: new google.maps.LatLng($scope.task.drop_off_lat, $scope.task.drop_off_lon),
          showList: false
        }
        // }
    }

    // instantiate google map objects for directions

    var directionsDisplay = new google.maps.DirectionsRenderer({
      suppressMarkers: true
    });
    var directionsService = new google.maps.DirectionsService();
    var geocoder = new google.maps.Geocoder();


    // directions object -- with defaults


    // get directions using google maps api
    $scope.getDirections = function() {
      var request = {
        origin: $scope.directions.origin,
        destination: $scope.directions.destination,
        travelMode: google.maps.DirectionsTravelMode.WALKING
      };
      directionsService.route(request, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
          directionsDisplay.setMap($scope.map);
          $scope.directions.showList = true;
        } else {
          alert('Google route unsuccesfull!');
        }
      });
    }

    $scope.updateMap();


    $scope.$on("$ionicView.enter", function(scopes, states) {

    });

    google.maps.event.addDomListener(window, 'load', $scope.initialize);
  });

  // accept = function() {
  //   var update = JSON.stringify({task: {"open": false}})
  //   console.log(update)
  //   console.log($stateParams.taskId)
  //   var res = $http({
  //     method: 'PATCH',
  //     url: 'https://evening-plains-3275.herokuapp.com/users/' + window.localStorage['user_id'] + '/tasks/' + $stateParams.taskId,
  //     headers: {
  //       'Authorization': window.localStorage['auth_token']
  //     },
  //     data: update
  //   }).then(
  //   function(res){
  //     console.log(res);
  //   },
  //   function(err) {
  //     console.log(err)
  //   })

  // };

  accept = function() {
    console.log($scope.task.title)
    var email = $scope.task.user.email
    var topic = $scope.task.title
    window.localStorage['channel'] = email
      // post request happening before pusher has connected to channel
    startPusher()
    var userData = {
      "user": {
        "to": email,
        "body": "I want to accept your task",
        "topic": topic
      }
    }
    var data = JSON.stringify(userData)
    console.log(data)
    var res = $http({
      method: 'POST',
      url: 'https://evening-plains-3275.herokuapp.com/users/' + window.localStorage['user_id'] + '/send_message',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': window.localStorage['auth_token']
      },
      data: data
    }).then(
      function(res) {
        console.log(':)');
      },
      function(err) {
        console.log(':(')
      })
  }

  reload = function() {
    window.location.reload(true)
  };

});