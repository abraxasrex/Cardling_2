angular.module('cardLing').controller('loginController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.login = function () {

      $scope.error = false;
      $scope.disabled = true;

      AuthService.login($scope.loginForm.username, $scope.loginForm.password)

        .then(function () {
          $location.path('/');
          $scope.disabled = false;
          $scope.loginForm = {};
        })

        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };

}]);

angular.module('cardLing').controller('mainController',
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
  //$scope.formData.owner = AuthService.getCurrentUser();
  $scope.formData.user = 'loogy';

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

/// the R in CRUD //
$scope.getAllCards = function(){
  $http.get('/api/cards').success(function(data) {
    $scope.cards = data;
    initCards();
    console.log($scope.cards);
  }).error(function(data) {
    console.log('Get Error: ' + data);
  });
}

$scope.getMyCards = function(){
  $http.get('api/cards/owner/' + $scope.formData.owner).success(function(data){
    $scope.cards = data;
    initCards();
  }).error(function(data){
    console.log('my cards view redirect err:', data);
  });
}

$scope.getMatchingCards = function(){
  $http.get('api/cards/term/' + $scope.formData.targetCard).success(function(data){
    $scope.cards = data;
    initCards();
  }).error(function(data){
    console.log('set view redirect err:', data);
  });
}

  $scope.getCardSet = function(){
    $http.get('api/cards/cardSet/' + $scope.formData.targetSetRoute).success(function(data){
      $scope.cards = data;
      initCards();
    }).error(function(data){
      console.log('set view redirect err:', data);
    });
  }

/// the C U and D in CRUD
  $scope.submitCard = function() {
    $http.post('/api/cards', $scope.formData).success(function(data) {
      $scope.formData = {};
      $scope.cards = data;
      initCards();
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
     $scope.formData.original = card.original;
     $scope.formData.translated = card.translated;
     $scope.formData.src = card.src;
     $scope.formData.cardSet = card.cardSet;
     $scope.formData.edit = card._id;
     $scope.submitText = "Edit card";
   }
   initCards();
 };

// UI/UX controller

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

angular.module('cardLing').controller('registerController',
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

// directives
angular.module('cardLing')
.directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')',
                'background-size' : 'cover'
            });
        });
    };
});
