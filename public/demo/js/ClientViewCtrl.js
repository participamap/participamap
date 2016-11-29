/**
 * Created by xicunhan on 20/09/2016.
 */


app.controller('ClientViewCtrl',['$scope','$location', '$timeout','Place',function ($scope,$rootScope, $location, Place, $state) {
  $scope.centerP = {
    title: 'initial',
    lat: 0,
    lon: 0,
    zoom: 12,
    description: 'Initial',
    autodiscover: true,
    centerUrlHash: true
  };

  var promise;

  $scope.$on("centerUrlHash", function (event, centerHash) {
    $location.search({c: centerHash});
  });

  $scope.domeLocations = Place.places;

  $scope.ajouterVotes = function (eachL) {
    FacLoc.upvoter(eachL);
  };
  $scope.diminuerVotes = function (eachL) {
    //FacLoc.
  };


  $scope.focus = function (lat, lon){
    $scope.centerP.lat = lat;
    $scope.centerP.lon = lon;
    $scope.centerP.zoom = 18;
  };


}]);
