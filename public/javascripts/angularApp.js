/**
 * Created by xicunhan on 17/09/2016.
 */

var app = angular.module('demoapp',["openlayers-directive","ui.router","ui.bootstrap","ngAnimate","ngSanitize"]);

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
    return $http.post('register',user).success(function(data){
      auth.saveToken(data.token);
    });
  };
  auth.logIn = function(user){
    return $http.post('/login',user).success(function(data){
      auth.saveToken(data.token);
    });
  };

  auth.logOut = function(){
    $window.localStorage.removeItem('inscription-token');
  };

  return auth;
}]);


app.factory('Place',['$http', function($http){
  var o = { //difinir un objet
    places :[]
  };

  o.getAll = function(){
    return $http.get('/places').success(function(data){
      angular.copy(data,o.places);
    });
  };
  o.create = function(place){
    return $http.post('places',place).success(function(data){
      o.places.push(data);
    });
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
      })
      .state('nav.regclient.views',{
        url:'/views',
        templateUrl:'tpls/regclient-view.html',
        controller: 'ClientViewCtrl'
      });



    $urlRouterProvider.otherwise('nav')


  }
);

