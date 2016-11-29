
app.controller('IterationCtrl',['$scope','Place','Parcours',function ($scope, Place, Parcours) {

  $scope.saveParcours = function(){
    var listPar = document.getElementById('parcous');

    console.log($scope.titleParcours);
    var res =[];
    for (var i=1; i< listPar.childNodes.length; i++){
      console.log(listPar.childNodes[i].attributes.name );
      res.push(listPar.childNodes[i].attributes.name.value);
    }
    console.log(res);
    Parcours.createParcours({
      title: $scope.titleParcours,
      places: res

    })

  };

  $scope.parcoursFam = Parcours.parcours;

  $scope.delParcours=function (identity){
    Parcours.delete(identity);
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
