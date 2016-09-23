
angular.module('demoapp').controller('AuthCtrl',['$scope','$state','auth','Place', function ($scope, $state, auth, Place) {
  $scope.user={};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('nav');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error= error;
    }).then(function(){
      $state.go('nav');
    });
  };

}]);