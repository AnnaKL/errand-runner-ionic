appCtrl = angular.module('starter.controllers', [])

appCtrl.controller('DashCtrl', function($scope, $http, $state, $ionicPopup) {

$scope.showAlert = function() {
  var alertPopup = $ionicPopup.alert({
    title: 'Something went wrong',
    template: 'Username or email is already signed up - please try again'
  });
  alertPopup.then(function(res){
    console.log("try again")
  })
};

$scope.taskCompleted = function() {
  var alertPopup = $ionicPopup.alert({
    title: 'Task completed!',
    template: ''
  });
  alertPopup.then(function(res){
    console.log("try again")
  })
};

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
          $scope.showAlert()
          console.log(err);
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
      $scope.taskCompleted()
      var token = window.localStorage['auth_token']
      var taskId = this.$parent.item.id
      var url = 'https://evening-plains-3275.herokuapp.com/users/' + $scope.user_id + '/tasks/' + taskId

      $http.patch(url,
                      {"task":{"open": false}},
                      {headers: {"Authorization": token}}
                        );
      console.log(taskId)
                      }




})

appCtrl.controller('ChatsCtrl', function($scope, Chats, $http) {

  $scope.username = window.localStorage['username']
  $scope.user_id = window.localStorage['user_id']

  ionic.Platform.ready(function() {

    $scope.allTasks = []

    $scope.userTasks = function() {
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
      error(function(data, status, headers, config) {})

    }
    $scope.userTasks();
    $scope.allTasks = []

  })


  $scope.removeTask = function(taskIndex) {
    var token = window.localStorage['auth_token']
    console.log(token)
    var taskId = this.$parent.item.id
    var url = 'https://evening-plains-3275.herokuapp.com/users/' + $scope.user_id + '/tasks/' + taskId

    $http.patch(url, {
      "task": {
        "open": false
      }
    }, {
      headers: {
        "Authorization": token
      }
    });
    console.log(taskId)
  }


})


appCtrl.controller('ChatsCtrl', function($scope, Chats, $http) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  function Message() {}
  var users = []


  $scope.getUser = function(chats) {
    console.log("working")
    for (var i = 0; i < chats.length; i++) {
      task = chats[i].title
      user = chats[i].task[0].received_messageable_id
      $http.get('https://evening-plains-3275.herokuapp.com/users/' + user, {
        headers: {
          'Authorization': window.localStorage['auth_token']
        }
      }).
      success(function(data) {
          users.push(data)
          $scope.assignUser(chats, users)
          console.log(chats)
        })
        // err(function(data) {
        //   console.log('failure')
        // })
    }
  }

  $scope.assignUser = function(chats, users) {
    for (var i = 0; i < chats.length; i++) {
      chats[i].user = users[i]
    }
  }

  $scope.chats = Chats.all()
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
        convo.task = conversation
        convo.id = $scope.chats.length
        convo.title = eltopic
        $scope.chats.push(convo)
        conversation = []
        conversation.push(messages[i])
      }
    }
    var endConvo = new Message()
    var endKey = eltopic
    endConvo.task = conversation
    endConvo.title = eltopic
    endConvo.id = $scope.chats.length
    $scope.chats.push(endConvo)
    if ($scope.chats.length > 0) {
      $scope.getUser($scope.chats)
    }
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
      console.log(data)
      if (data.users.length > 0) {
        sortMessages(data.users)
      }
      console.log('messages received')

    }).
    error(function(data, status, headers, config) {
      console.log('chats fail')
    })
  }
  ionic.Platform.ready(function() {
    $scope.getMessages('inbox')
    $scope.getMessages('outbox')
  });

  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

appCtrl.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, $http) {
  $scope.chat = Chats.get($stateParams.chatId);

  $scope.findSender = function() {
    for (var i = 0; i < $scope.chat.task.length; i++) {
      if ($scope.chat.task[i].sent_messageable_id == window.localStorage['user_id']) {
        $scope.chat.task[i].sender = "you"
        console.log($scope.chat.task[i].sender)
      } else {
        console.log('me')
        $scope.chat.task[i].sender = $scope.chat.user.user.username
      }
    }

  }

  ionic.Platform.ready(function() {
    $scope.findSender()
  });



  $scope.sendMessage = function() {
    var messageData = {
      "user": {
        "to": window.localStorage['channel'],
        "topic": $scope.chat.title,
        "body": document.getElementById('body').value
      }
    }
    console.log(messageData)
      // post request happening before pusher has connected to channel
      // startPusher()
    var data = JSON.stringify(messageData)
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

})