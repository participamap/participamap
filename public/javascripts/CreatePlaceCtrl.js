/**
 * Created by xicunhan on 20/09/2016.
 */


app.controller('CreatePlaceCtrl',['$scope','$location', '$timeout','Place','$http', function ($scope,$location,$rootScope,Place, $timeout ,$state, $http) {
  angular.extend($scope, {

    defatults: {
      events: {
        map: ['singleclick']
      }
    },
    markers: []
  });

  $scope.$on('openlayers.map.singleclick', function (event, data) {
    var prj = ol.proj.transform([data.coord[0], data.coord[1]], data.projection, 'EPSG:4326').map(function (c) {
      return c.toFixed(4);
    });

    $scope.$apply(function () {
      console.log(data);
      $scope.markers.push({
        lat: data.coord[1],
        lon: data.coord[0],
        projection: data.projection,
        label: {
          message: "Lat: " + prj[1] + ", Lon: " + prj[0],
          show: true,
          showOnMouseOver: true
        }
      });
    });
  });

  $scope.showFramePic = false;
  $scope.showFrame = function(idPlace){
    $scope.showFramePic = true;
    $scope.placeId = idPlace;
  };

  $scope.centerP = {
    title: '',
    lat:49.181650423226046 ,
    lon:-0.34701264804824783,
    zoom:18,
    centerUrlHash:true,
    description: '',
    autodiscover: false
  };

  $scope.domeLocations = Place.places;

  var promise;
  $scope.$on("centerUrlHash", function(event, centerHash) {
    $location.search({ c: centerHash });
  });

  $scope.delPlace = function(identity){
    console.log("running controller deletePlace");
    Place.delete(identity);
  };


  $scope.saveLocation=function (){
    if(!$scope.centerP.title || $scope.centerP.title===''){
      return;
    } else {
      Place.create({
        title: $scope.centerP.title,
        author:$scope.currentUser,
        location:{
          latitude: $scope.centerP.lat,
          longitude: $scope.centerP.lon
        },
        description: $scope.centerP.description,
        isVerified : false
        //commentaire: [{author:'anonyme', body: $scope.centerP.commentaire}],
      });
    }
  };
  $scope.addPhoto = function(placeId){
    Place.addPhotos(placeId);
  }




}]);