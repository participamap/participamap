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


  $scope.saveLocation=function (){
    if(!$scope.centerP.title || $scope.centerP.title===''){
      return;
    } else {
      Place.create({
        title: $scope.centerP.title,
        author:$scope.currentUser,
        latitude: $scope.centerP.lat,
        longitude: $scope.centerP.lon,
        zoom : $scope.centerP.zoom,
        description: $scope.centerP.description,
        isVerified : false
        //commentaire: [{author:'anonyme', body: $scope.centerP.commentaire}],
      });
    }

  };


}]);