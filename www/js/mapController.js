appCtrl.controller('MapCtrl', function($scope, $ionicLoading, $compile, $http, $stateParams) {


$scope.tasks = []

 $scope.doRefresh = function() {
    $scope.updateMap1()
    $scope.$broadcast('scroll.refreshComplete');
    console.log("refresh")
    $scope.$apply()
  };

// $scope.task = $scope.tasks.get($stateParams.taskId)
// console.log($scope.task)

  // var coordinates = [
  //   new google.maps.LatLng( 51.517399, -0.073590),
  //   new google.maps.LatLng(51.518752, -0.081437)
  // ];


  ionic.Platform.ready(function() {
    // $scope.$on('$ionicView.enter', function() {

    $scope.updateMap1 = function(){
      $http.get('https://evening-plains-3275.herokuapp.com/tasks', {
      headers: {
                 'Authorization': window.localStorage['auth_token']
               }
               }).
    success(function(data, status, headers, config) {
      for (var i = 0; i < data.tasks.length; i++) {
        if(data.tasks[i].open != false) {
        $scope.tasks.push(data.tasks[i])
        }
      }
      $scope.placeMarkers()
    }).
    error(function(data, status, headers, config) {
    })
    }
    $scope.updateMap1()

    navigator.geolocation.getCurrentPosition(function(pos) {
      newLocation = (new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      map.setCenter(newLocation)
    });

    var myLatlng = new google.maps.LatLng(51.517399, -0.073590);

    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

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
  $scope.createMarker = function(info) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(info.pick_up_lat, info.pick_up_lon),
      map: $scope.map,
      icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/pink.png',
      animation: google.maps.Animation.DROP,
      title: info.title
    });

    marker.content = '<div class="infoWindowContent">' + info.description + '</div>';
    marker.id = info.id;
    marker.accept = '<a  href="#/tab/task/' + info.id +' ">Show more information</a>'
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content + marker.accept);
      infoWindow.open($scope.map, marker);
    });
    $scope.markers.push(marker);
  }

$scope.placeMarkers = function(){
  for (i = 0; i < $scope.tasks.length; i++) {
    $scope.createMarker($scope.tasks[i]);
  }
}




google.maps.event.addDomListener(window, 'load', $scope.initialize);
 });

});



