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

      return payload.username;
    }
  };

  auth.register = function(user){
    return $http.post('/users/register',user).success(function(data){
      auth.saveToken(data.token);
    });
  };
  auth.logIn = function(user){
    return $http.post('/users/login',user).success(function(data){
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

app.factory('Parcours',['$http','$base64',function($http){
  var oo = {
    parcours:[]
  };
  oo.createParcours = function (parcour){
    return $http.post('parcours',parcour).success(function(data){
      oo.parcours.push(data);
    })
  };

  return oo;
}]);
app.factory('Place',['$http','$base64', function($http,$base64){
  var o = { //difinir un objet
    places :[]
  };

  o.getOnePlace = function(identity) {
    return $http.get('places/'+identity.toString()).success(function(){
    });
  };

  o.getAll = function(){
    return $http.get('places').success(function(data){
      angular.copy(data,o.places);
    });
  };
  o.create = function(place){
    return $http.post('places',place).success(function(data){
      o.places.push(data);

    });
  };

  o.createAndAddPhoto = function(place, picBin){

    return $http.post('places',place).success(function(data,status,header,config){

      var sendUrl = 'http://127.0.0.1:3000/upload/'+header().location.toString().split('/').pop();
      var fd = new FormData();
      fd.append('file',picBin);
      //console.log (picBin);
      picBin.name = '@'+picBin.name;
      $http.put(sendUrl,picBin,{headers:{'Content-Type':'image/png'}}).then(function(){
        console.log('reussir');
      });

      o.places.push(data);

    });
  };

  o.delete = function(identity){
    return $http.delete('http://127.0.0.1:3000/places/'+identity.toString()).success(function(data){
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
    imgBin.name = '@'+imgBin.name;
    return $http.post('http://127.0.0.1:3000/places/'+idPlace.toString()+'/pictures').success(function(data,status,header,config){
      var sendUrl = 'http://127.0.0.1:3000/upload/'+header().location.toString().split('/').pop();
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
        templateUrl: 'tpls/welcome.html',
        controller: 'NavCtrl'
      });
    $stateProvider
      .state('login', {
        url:'/login',
        templateUrl:"tpls/login.html",
        controller: 'AuthCtrl',
        onEnter:['$state','auth',function($state,auth){
          if(auth.isLoggedIn()){
            $state.go('nav');
          }
        }]
      })
      .state('register',{
        url:'/register',
        templateUrl:'tpls/register.html',
        controller:'AuthCtrl',
        onEnter:['$state','auth', function($state,auth){
          if(auth.isLoggedIn()){
            $state.go('nav');
          }
        }]
      })
      .state('nav.regclient',{
        url:'/regclient',
        templateUrl:'tpls/regclient.html',
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
        templateUrl:'tpls/regclient-view.html',
        controller: 'ClientViewCtrl'
      });
    $stateProvider
      .state('nav.regclient.views.place',{
        url:'/{place_id}',
        templateUrl:'tpls/view-details-place.html',
        resolve:{
            aPlace : function(Place, $stateParams){return Place.getOnePlace($stateParams.place_id);}
        },
        controller:'ViewPlaceController'
      });

    $stateProvider
      .state('nav.regclient.create',{
        url:'/create',
        templateUrl:'tpls/create-place.html',
        controller:'CreatePlaceCtrl'
      });
    $stateProvider
      .state('nav.regclient.iteration',{
        url:'/iteration',
        templateUrl: 'tpls/iteration.html',
        controller:'IterationCtrl'
      });
    $stateProvider
      .state('nav.regclient.addPic',{
        url:'/addPic',
        templateUrl: 'tpls/addPic.html',
        controller:'CreatePlaceCtrl'
    })
      .state('nav.regclient.addPic.telecharge', {
        url:'/telecharge',
        templateUrl: 'tpls/telecharge.html',
        controller:'CreatePlaceCtrl'
      });


    $stateProvider
      .state('nav.regclient.upload',{
        utl:'/upload',
        templateUrl:'tpls/upload.html',
        controller:'CreatePlaceCtrl'
      });





    $urlRouterProvider.otherwise('nav')


  }
);

