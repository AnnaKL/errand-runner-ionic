appCtrl = angular.module('starter.controllers', [])

appCtrl.controller('DashCtrl', function($scope, $http, $state) {
  $scope.userData = {}

  if (window.localStorage['auth_token'] === undefined) {

    $scope.newUser = function() {
      console.log($scope.userData)
      var data = JSON.stringify({
        "user": $scope.userData
      })
      console.log(data)
      var res = $http({
        method: 'POST',
        url: 'http://evening-plains-3275.herokuapp.com/users',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }).then(
        function(res) {
          console.log(res.data.user)
          window.localStorage['auth_token'] = (res.data.user.auth_token);
          window.localStorage['user_id'] = (res.data.user.id)
          $state.go('tab.map')
        },
        function(err) {
          alert(err);
        });

    }
  } else {
    $state.go('tab.map')
  }
})

appCtrl.controller('ChatsCtrl', function($scope, $http) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  function Message() {}
  chats = []
  var sortMessages = function(messages) {
    var conversation = [];
    for (var i = 0; i < messages.length; i++) {
      var eltopic;
      if (i === 0) {
        eltopic = messages[0].topic
      } else {
        eltopic = messages[i - 1].topic
      }
      if (eltopic === messages[i].topic) {
        conversation.push(messages[i])
      } else {
        var convo = new Message()
        var key = eltopic
        convo[eltopic] = conversation
        convo.id = chats.length
        convo.title = eltopic
        chats.push(convo)
        conversation = []
        conversation.push(messages[i])
      }
    }
    var endConvo = new Message()
    var endKey = eltopic
    endConvo[endKey] = conversation
    endConvo.title = eltopic
    endConvo.id = chats.length
    chats.push(endConvo)
  }

  var includes = function(array, element) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == element) {
        true
      } else {
        false
      }
    }
  }

  $scope.getMessages = function(box) {
    $http.get('https://evening-plains-3275.herokuapp.com/users/' + window.localStorage['user_id'] + '/' + box, {
      headers: {
        'Authorization': window.localStorage['auth_token']
      }
    }).
    success(function(data, status, headers, config) {
      sortMessages(data.users)
      console.log($scope.chats)
      console.log('messages received')
    }).
    error(function(data, status, headers, config) {
      console.log('chats fail')
    })
  }
  ionic.Platform.ready(function() {
    $scope.getMessages('conversations')
  });

  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

appCtrl.controller('ChatDetailCtrl', function($scope, $stateParams, $http) {
  $scope.chat = Chats.get($stateParams.chatId);

  $scope.userChat = {}

  // $scope.newMessage = function() {
  //   // console.log($scope.userChat)
  //   var data = JSON.stringify({
  //     "chat": $scope.userChat
  //   })
  //   console.log(data)
  //   var res = $http({
  //     method: 'POST',
  //     url: 'http://localhost:3000/chats',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     data: data
  //   }).then(
  //     function() {
  //       console.log('posted');
  //     },
  //     function() {
  //       console.log('errors');
  //     });
  //}
})