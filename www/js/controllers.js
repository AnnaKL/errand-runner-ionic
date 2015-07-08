appCtrl = angular.module('starter.controllers', [])

appCtrl.controller('DashCtrl', function($scope, $http, $state, $window, Tasks) {

 
  $scope.userData = {}

  if (window.localStorage['auth_token'] === undefined) {

    $scope.newUser = function() {
      var data = JSON.stringify({
        "user": $scope.userData
      })
      
      var res = $http({
        method: 'POST',
        url: 'http://evening-plains-3275.herokuapp.com/users',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }).then(
        function(res) {
          window.localStorage['auth_token'] = (res.data.user.auth_token);
          window.localStorage['user_id'] = (res.data.user.id);
          window.localStorage['username'] = (res.data.username)
          $state.go('tab.map')
        },
        function(err) {
          alert(err);
        });

    }
    } else {
      $state.go('tab.map')

    }  
  $scope.username = window.localStorage['username']
  $scope.user_id = window.localStorage['user_id']

   ionic.Platform.ready(function() {
    
    $scope.allTasks= []

       $scope.userTasks = function(){
        $http.get('https://evening-plains-3275.herokuapp.com/users/' + $scope.user_id + '/tasks', {
        headers: {
                   'Authorization': window.localStorage['auth_token']
                 }
                 }).
      success(function(data, status, headers, config) {
        for (var i = 0; i < data.users.length; i++) {
          $scope.allTasks.push(data.users[i])
        }
       }).
      error(function(data, status, headers, config) {
      })

      }
      $scope.userTasks();
      $scope.allTasks= []

  })


    $scope.removeTask = function(taskIndex){
      var token = window.localStorage['auth_token']
      console.log(token)
      var taskId = this.$parent.item.id
      var url = 'https://evening-plains-3275.herokuapp.com/users/' + $scope.user_id + '/tasks/' + taskId
     
      $http.patch(url, 
                      {"task":{"open": false}}, 
                      {headers: {"Authorization": token}}
                        );
      console.log(taskId)
                      }
      



})


appCtrl.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});



  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

appCtrl.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, $http) {
  $scope.chat = Chats.get($stateParams.chatId);

  $scope.userChat = {}

  $scope.newMessage = function() {
    // console.log($scope.userChat)
    var data = JSON.stringify({
      "chat": $scope.userChat
    })
    console.log(data)
    var res = $http({
      method: 'POST',
      url: 'http://localhost:3000/chats',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }).then(
      function() {
        console.log('posted');
      },
      function() {
        console.log('errors');
      });
  }
})
