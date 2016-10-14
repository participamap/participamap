
app.controller('IterationCtrl',['$scope','Place',function ($scope, Place) {

  $scope.saveParcours = function(){
    var listPar = document.getElementById('parcous');

    console.log($scope.titleParcours);
    var res =[];
    for (var i=1; i< listPar.childNodes.length; i++){
      console.log(listPar.childNodes[i].attributes.name );
      res.push(listPar.childNodes[i].attributes.name.value);
    }
    console.log(res);

  };

  /*Sortable.create(bar, {
    group: 'bar',
    animation: 100
  });

  Sortable.create(qux, {
    group: {
      name: 'qux',
      put: ['foo', 'bar']
    },
    animation: 100
  });*/

  $scope.allPlaces= Place.places;


}]);