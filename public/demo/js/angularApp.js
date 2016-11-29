/**
 * Created by xicunhan on 17/09/2016.
 */

var app = angular.module('demoapp',["openlayers-directive","ui.router","ui.bootstrap","ngAnimate","ngSanitize","base64"]);

app.factory('auth',['$http','$window', function($http,$window){
  var auth = {};

  auth.saveToken = function(token){
    $window.localStorage['inscription-token'] = token;
  };

  auth.getToken = function() {
    return $window.localStorage['inscription-token'];

  };
  auth.isLoggedIn = function(){
    var token = auth.getToken();

    if(token){
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload.exp > Date.now()/1000;
    } else {
      return false;
    }
  };
  auth.currentUser = function(){
    if(auth.isLoggedIn()){
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.usr;
    }
  };

  auth.register = function(user){
    return $http.post('../api/v1/register',user).success(function(data){
      auth.saveToken(data.token);
    });
  };
  auth.logIn = function(user){
    return $http.post('../api/v1/login',user).success(function(data){
      auth.saveToken(data.token);
    });
  };

  auth.logOut = function(){
    $window.localStorage.removeItem('inscription-token');
  };

  return auth;
}]);

app.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function(){
        scope.$apply(function(){
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);

app.factory('Parcours',['$http','auth','$base64',function($http, auth) {
  var oo = {
    parcours: []
  };

  oo.createParcours = function (parcour) {
    return $http.post('../api/v1/routes', parcour, {
      headers: {Authorization: 'Bearer ' + auth.getToken()}
    }).success(function (data) {
      oo.parcours.push(data);
    })
  };
  oo.getAll = function(){
    return $http.get('../api/v1/routes/').success(function(data){
      angular.copy(data,oo.parcours);
    });
  };
  
    oo.delete = function(identity){
    return $http.delete('../api/v1/routes/'+identity.toString(),{
      headers:{Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      for (i=0;i < oo.parcours.length;i++){
        if (oo.parcours[i]._id===identity.toString()) {
          oo.parcours.splice(i,1);
          break;
        }
      }
    })
  };

  return oo;
}]);


app.factory('Place',['$http','$base64','auth', function($http,$base64,auth){
  var o = { //difinir un objet
    places :[]
  };

  o.getOnePlace = function(identity) {
    return $http.get('../api/v1/places/'+identity.toString()).success(function(){
    });
  };

  o.getAll = function(){
    return $http.get('../api/v1/places').success(function(data){
      angular.copy(data,o.places);
    });
  };
  o.create = function(place){
    return $http.post('../api/v1/places',place,{
      headers:{Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      o.places.push(data);

    });
  };

  o.createAndAddPhoto = function(place, picBin){

    return $http.post('../api/v1/places',place,{
      headers:{Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data,status,header,config){

      var sendUrl = '../api/v1/upload/'+header().location.toString().split('/').pop();
      var fd = new FormData();
      fd.append('file',picBin);
      console.log ("file name: "+picBin.name);
      var ct = "image/";
      if (picBin.name.split('.').pop()=='jpeg'|| picBin.name.split('.').pop()=='jpg'){
        ct += 'jpeg'
      } else {
        ct+='png'
      }
      picBin.name = '@'+picBin.name;

      $http.put(sendUrl,picBin,{headers:{'Content-Type': ct, Authorization: 'Bearer '+auth.getToken() }}).then(function(){
        console.log('reussir');
      });
      o.places.push(data);

    });
  };

  o.delete = function(identity){
    return $http.delete('../api/v1/places/'+identity.toString(),{
      headers:{Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      console.log(o.places);
      for (i=0;i < o.places.length;i++){
        if (o.places[i]._id===identity.toString()) {
          o.places.splice(i,1);
          break;
        }
      }
      console.log(o.places); // verifer and faire deep copy a faire!
    })
  };

  o.addPhotos=function (idPlace,imgBin){
    var fd = new FormData();
    fd.append('file',imgBin);
    console.log("name of file: "+imgBin.name);
    imgBin.name = '@'+imgBin.name;
    return $http.post('../api/v1/places/'+idPlace.toString()+'/pictures').success(function(data,status,header,config){
      var sendUrl = '../api/v1/upload/'+header().location.toString().split('/').pop();
      //var imgData = $base64.encode(imgBin);
      $http.put(sendUrl,imgBin,{headers:{'Content-Type':'image/png'}}).then(function(){
        console.log('reussir');
      });

    }).error(function(response){
      console.log('post failed');
    })
  };

  return o;
}]);

app.config(
  function($interpolateProvider,$stateProvider,$urlRouterProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');

    $stateProvider
      .state('nav', {
        url: '',
        templateUrl: 'templates/welcome.html',
        controller: 'NavCtrl'
      });
    $stateProvider
      .state('login', {
        url:'/login',
        templateUrl:"templates/login.html",
        controller: 'AuthCtrl',
        onEnter:['$state','auth',function($state,auth){
          if(auth.isLoggedIn()){
            $state.go('nav');
          }
        }]
      })
      .state('register',{
        url:'/register',
        templateUrl:'templates/register.html',
        controller:'AuthCtrl',
        onEnter:['$state','auth', function($state,auth){
          if(auth.isLoggedIn()){
            $state.go('nav');
          }
        }]
      })
      .state('nav.regclient',{
        url:'/regclient',
        templateUrl:'templates/regclient.html',
        //controller:'RegClient',
        resolve:{
          postPromise:['Place',function(Place){
            return Place.getAll();
          }]
        }
      });
    $stateProvider
      .state('nav.regclient.views',{
        url:'/views',
        templateUrl:'templates/regclient-view.html',
        controller: 'ClientViewCtrl'
      });
    $stateProvider
      .state('nav.regclient.views.place',{
        url:'/{place_id}',
        templateUrl:'templates/view-details-place.html',
        resolve:{
            aPlace : function(Place, $stateParams){return Place.getOnePlace($stateParams.place_id);}
        },
        controller:'ViewPlaceController'
      });

    $stateProvider
      .state('nav.regclient.create',{
        url:'/create',
        templateUrl:'templates/create-place.html',
        controller:'CreatePlaceCtrl'
      });
    $stateProvider
      .state('nav.regclient.iteration',{
        url:'/iteration',
        templateUrl: 'templates/iteration.html',
        controller:'IterationCtrl',
        resolve:{
          postPromise:['Parcours',function(Parcours){
            return Parcours.getAll();
          }]
        }
      });
    $stateProvider
      .state('nav.regclient.addPic',{
        url:'/addPic',
        templateUrl: 'templates/addPic.html',
        controller:'CreatePlaceCtrl'
    })
      .state('nav.regclient.addPic.telecharge', {
        url:'/telecharge',
        templateUrl: 'templates/telecharge.html',
        controller:'CreatePlaceCtrl'
      });


    $stateProvider
      .state('nav.regclient.upload',{
        utl:'/upload',
        templateUrl:'templates/upload.html',
        controller:'CreatePlaceCtrl'
      });





    $urlRouterProvider.otherwise('nav')


  }
);

