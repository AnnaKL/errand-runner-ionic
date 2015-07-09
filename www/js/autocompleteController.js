appCtrl.controller('AccountCtrl', function($scope, $http, $ionicPopup, $state) {
  $scope.$on('$ionicView.enter', function() {

var placeSearch, autocomplete;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  postal_code: 'short_name'
};

$scope.showAlert = function() {
  var alertPopup = $ionicPopup.alert({
    title: 'task added',
    template: "you'll get a message when someone accepts your task"
  });
  alertPopup.then(function(res){
    console.log("try again")
  })
};

$scope.showError = function() {
  var alertPopup = $ionicPopup.alert({
    title: 'Something went wrong',
    template: "Please check the details entered"
  });
  alertPopup.then(function(res){
    console.log("try again")
  })
};

$scope.geocodeError = function() {
  var alertPopup = $ionicPopup.alert({
    title: 'address lookup failed',
    template: "please make sure all the details are correct"
  });
  alertPopup.then(function(res){
    console.log("try again")
  })
};


$scope.taskData = {}


  $scope.pickupcodeAddress = function() {
    // var stnumber = document.getElementById('street_number').value
    // var route = document.getElementById('route').value
    // var city = document.getElementById('locality').value
    // var postcode = document.getElementById('postal_code').value
    // var address = stnumber + ' ' + route + ' ' + city + ' ' + postcode
    // var address = document.getElementById('locationField').value
    // var address2 = []
    // for (var i = 0; i < address.length; i++) {
    //   address2.push(address[i].long_name)

    // }
    // console.log(address2)
    $scope.taskData.pick_up_address = document.getElementById('autocomplete').value
    console.log($scope.taskData.pick_up_address)
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      'address': $scope.taskData.pick_up_address
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        $scope.taskData.pick_up_lat = latitude;
        $scope.taskData.pick_up_lon = longitude;
        console.log($scope.taskData)

      } else {
        $scope;
      }
    });
  };

  $scope.deliverycodeAddress = function() {
    $scope.taskData.drop_off_address = document.getElementById('autocomplete2').value
    console.log($scope.taskData.drop_off_address)
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      'address': $scope.taskData.drop_off_address
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        $scope.taskData.drop_off_lat = latitude;
        $scope.taskData.drop_off_lon = longitude;
        console.log($scope.taskData)

      } else {
        $scope.geocodeError()
      }
    });
  };


  $scope.newTask = function() {
    $scope.taskData.user_id = window.localStorage['user_id']
    var task = JSON.stringify({ "task": $scope.taskData })
    console.log(task)
    console.log(window.localStorage['auth_token'])
    var res = $http({
      method: 'POST',
      url: 'https://evening-plains-3275.herokuapp.com/users/' + window.localStorage['user_id'] + '/tasks',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': window.localStorage['auth_token']
      },
      data: task
    }).then(
      function(res) {
        console.log(res);
        $scope.showAlert()
        $state.go('tab.map')
      },
      function() {
        $scope.showError()
        console.log(res);
      });
  }

    ionic.Platform.ready(function(){
    autocomplete = new google.maps.places.Autocomplete(
      /** @type {HTMLInputElement} */
      (document.getElementById('autocomplete')), {
        types: ['geocode']
      })
     google.maps.event.addListener(autocomplete, 'place_changed', function() {
      // fillInAddress();
    })

     autocomplete2 = new google.maps.places.Autocomplete(
      /** @type {HTMLInputElement} */
      (document.getElementById('autocomplete2')), {
        types: ['geocode']
      })
     google.maps.event.addListener(autocomplete, 'place_changed', function() {

    })
  })

  $scope.geolocate = function() {
    console.log("geolocate")
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = new google.maps.LatLng(
          position.coords.latitude, position.coords.longitude);
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        // autocomplete.setBounds(circle.getBounds());
      });
    }
  }

  function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();

    for (var component in componentForm) {
      document.getElementById(component).value = '';
      document.getElementById(component).disabled = false;
    }
    console.log(place.address_components)
      // Get each component of the address from the place details
      // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        document.getElementById(addressType).value = val;
      }
    }
  }
})
})
