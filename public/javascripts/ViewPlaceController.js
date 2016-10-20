app.controller('ViewPlaceController',['$scope', 'aPlace','$timeout','Place', function ($scope,aPlace, Place, $timeout ,$state, $http) {

  $scope.onePlace = aPlace.data;


}]);