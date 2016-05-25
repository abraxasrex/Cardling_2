angular.module('myApp').controller('loginController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
          $location.path('/');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };

}]);

angular.module('myApp').controller('logoutController',
  ['$scope', '$location', 'AuthService', '$http',
  function ($scope, $location, AuthService, $http) {

    $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/login');
        });

    };

  $scope.formData = {};
  $scope.submitText = "Add card";
  $scope.formData.edit = null;

///helper func declarations
  function initCards(){
     if(!!$scope.cards) {
       $scope.cards.forEach( function(card) {
          if(!card.text) {
            card.text = card.translated;
          }
       });
     }
  }


/// gets and posts //
$scope.getAllCards = function(){
  $http.get('/api/cards').success(function(data) {
    $scope.cards = data;
    initCards();
    console.log(data);
  }).error(function(data) {
    console.log('Get Error: ' + data);
  });
}

// $scope.getMyCards = function(){
//   $http.get('api/cards/' + $scope.formData.targetSetRoute).success(function(data){
//     $scope.cards = data;
//   //  getAllCards();
//     initCards();
//   }).error(function(data){
//     console.log('set view redirect err:', data);
//   });
// }

$scope.getMatchingCards = function(){
  $http.get('api/cards/' + $scope.formData.targetCard).success(function(data){
    $scope.cards = data;
  //  getAllCards();
    initCards();
  }).error(function(data){
    console.log('set view redirect err:', data);
  });
}

  $scope.getCardSet = function(){
    $http.get('api/cards/' + $scope.formData.targetSetRoute).success(function(data){
      $scope.cards = data;
    //  getAllCards();
      initCards();
    }).error(function(data){
      console.log('set view redirect err:', data);
    });
  }

  $scope.submitCard = function() {
    $http.post('/api/cards', $scope.formData).success(function(data) {
      $scope.formData = {};
      $scope.cards = data;
      initCards();
    //  console.log('card ', data);
    }).error(function(data) {
      console.log('Create Error: ' + data);
    });
  };

  $scope.deleteCard = function(id) {
    $http.delete('/api/cards/' + id).success(function(data) {
      $scope.cards = data;
      initCards();
    }).error(function(data) {
      console.log('Delete Error: ' + data);
    });
  };

  $scope.editCard = function(card) {
    if($scope.formData.edit === card._id) {
      $scope.formData.edit = null;
      $scope.submitText = "Add card";
      $scope.formData.original = "";
      $scope.formData.translated = "";
      $scope.formData.cardSet = "";
      $scope.formData.src = "";
    }
   else {
     //console.log('card to edit is ', card)
     $scope.formData.original = card.original;
     $scope.formData.translated = card.translated;
     $scope.formData.src = card.src;
     $scope.formData.cardSet = card.cardSet;
     $scope.formData.edit = card._id;
     $scope.submitText = "Edit card";
   }
   initCards();
 };

// below here: separate into UX controller

function toggleForm(){

}

  $scope.flip = function(card, id) {
    var flipper = document.getElementsByClassName(id)[0];
  if(flipper.classList.contains('back-flip')) {
    flipper.classList.remove('back-flip');
    flipper.classList.add('front-flip');
  }
  else if(flipper.classList.contains('front-flip')) {
    flipper.classList.remove('front-flip');
      flipper.classList.add('back-flip');
  } else {
 flipper.classList.add('front-flip');
  }
    if(card.text === card.original) {
      card.text = card.translated;
    } else {
      card.text = card.original;
    }
  };

  // $scope.langChoices = [];
  // $scope.eng = 'English       (English)';
  //
  // $http.get('languages.json').success(function(languages) {
  //   for (item in languages.lang) {
  //     $scope.langChoices.push(languages.lang[item][0]);
  //   }
  // }).error( function(err) {
  //   console.log('getting lang json err: ', err);
  // });

  $scope.getAllCards();

}]);

angular.module('myApp').controller('registerController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function () {
          $location.path('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };

}]);
