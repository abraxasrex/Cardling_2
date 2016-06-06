// auth service from Michael Herman's MEAN authentication tutorial: http://mherman.org/blog/2015/07/02/handling-user-authentication-with-the-mean-stack/#.V1SyDkorI8o
angular.module('cardLing').factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {
    var user = null;
    var currentUser = null;
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register
    });

    function isLoggedIn() {
      if(user) {
        return true;
      } else {
        return false;
      }
    }

    function getUserStatus() {
      return $http.get('/user/status')
      .success(function (data) {
        if(data.status){
          user = true;
        } else {
          user = false;
        }
      })
      .error(function (data) {
        user = false;
      });
    }

    function login(username, password) {
      var deferred = $q.defer();

      $http.post('/user/login',
        {username: username, password: password})
        .success(function (data, status) {
          if(status === 200 && data.status){
            currentUser = username;
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        .error(function (data) {
          user = false;
          deferred.reject();
        });
      return deferred.promise;
    }

    function logout() {
      var deferred = $q.defer();

      $http.get('/user/logout')
        .success(function (data) {
          currentUser = null;
          user = false;
          deferred.resolve();
        })
        .error(function (data) {
          user = false;
          deferred.reject();
        });
      return deferred.promise;
    }

    function register(username, password) {
      var deferred = $q.defer();

      $http.post('/user/register',
        {username: username, password: password})
        .success(function (data, status) {
          currentUser = username;
          if(status === 200 && data.status){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        .error(function (data) {
          deferred.reject();
        });
      return deferred.promise;
    }
}]);
