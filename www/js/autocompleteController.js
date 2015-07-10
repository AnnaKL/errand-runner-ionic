appCtrl.controller('AccountCtrl', function($scope, $http, $ionicPopup, $state) {

  $scope.taskData = {}

  $scope.savetaskDeets = function(){
    window.localStorage['task_title'] = $scope.taskData.title
    window.localStorage['task_desc'] = $scope.taskData.description
  }


  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'task added',
      template: "you'll get a message when someone accepts your task"
    });
    alertPopup.then(function(res) {
    })
  };

  $scope.showError = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Something went wrong',
      template: "Please check the details entered"
    });
    alertPopup.then(function(res) {
    })
  };

  $scope.geocodeError = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'address lookup failed',
      template: "please make sure all the details are correct"
    });
    alertPopup.then(function(res) {
    })
  };


  $scope.pickupcodeAddress = function() {
    var stnumber = document.getElementById('housenumber').value
    var street = document.getElementById('streetname').value
    var postcode = document.getElementById('postcode').value
    $scope.taskData.pick_up_address = stnumber + ' ' + street + ' ' + postcode
    console.log($scope.taskData.pick_up_address)
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      'address': $scope.taskData.pick_up_address
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        window.localStorage['pick_up_lat'] = latitude;
        window.localStorage['pick_up_long'] = longitude;
        window.localStorage['pick_up_add'] = $scope.taskData.pick_up_address
        $state.go('tab.account')

      } else {
        $scope.geocodeError()
      }
    });
  };

  $scope.deliverycodeAddress = function() {
    var stnumber = document.getElementById('2housenumber').value
    var street = document.getElementById('2streetname').value
    var postcode = document.getElementById('2postcode').value
    $scope.taskData.drop_off_address = stnumber + ' ' + street + ' ' + postcode
    console.log($scope.taskData.drop_off_address)
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      'address': $scope.taskData.drop_off_address
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        window.localStorage['drop_off_lat'] = latitude;
        window.localStorage['drop_off_long'] = longitude;
        window.localStorage['drop_off_add'] = $scope.taskData.drop_off_address
        $state.go('tab.account')

      } else {
        $scope.geocodeError()
      }
    });
  };

  $scope.formatTask = function() {
    $scope.taskData.title = window.localStorage['task_title']
    $scope.taskData.description = window.localStorage['task_desc']
     $scope.taskData.drop_off_lat = window.localStorage['drop_off_lat']
     $scope.taskData.drop_off_lon = window.localStorage['drop_off_long']
     $scope.taskData.drop_off_address = window.localStorage['drop_off_add']
     $scope.taskData.pick_up_lat = window.localStorage['pick_up_lat']
     $scope.taskData.pick_up_lon = window.localStorage['pick_up_long']
     $scope.taskData.pick_up_address = window.localStorage['pick_up_add']

  }


  $scope.newTask = function() {
    $scope.formatTask()
    $scope.taskData.user_id = window.localStorage['user_id']
    console.log(task)
    var task = JSON.stringify({
      "task": $scope.taskData
    })
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
})