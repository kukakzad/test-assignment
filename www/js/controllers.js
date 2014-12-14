angular.module('starter.controllers', [])

.controller('runningCtrl', function($scope, $cordovaGeolocation, $interval, GeolocationCalculator) {
  $scope.destination = {};
  $scope.currentPosition = {};
  $scope.distance = 0;
  // $scope.distanceCheck = 0;

  $scope.lastedPosition = -1;

  $scope.state = 'home';

  $scope.statusTime = 'nocal';

  $scope.lifeTime = 0;

  $scope.timeOut = 0;

  $scope.historyPoints = [];

  $scope.markPoints = [{
      name: 'วงเวียนเสาไฟ',
      latitude: 14.161119,
      longitude: 101.348319
    }, {
      name: 'แยกหอพัก',
      latitude: 14.163044,
      longitude: 101.351140
    }, {
      name: 'โค้ง',
      latitude: 14.160661,
      longitude: 101.359069
    }, {
      name: 'โรงแรม',
      latitude: 14.162076,
      longitude: 101.361708
    }, {
      name: 'หอสมุด',
      latitude: 14.157720054499805,
      longitude: 101.34612165391445
    }, {
      name: 'เสาธง',
      latitude: 14.159204908646643,
      longitude: 101.34735966101289
    }, {
      name: 'หอชาย',
      latitude: 14.165383083745837,
      longitude: 101.34507835842669
    }, {
      name: 'หอหญิงเก่า',
      latitude: 14.164764960296452,
      longitude: 101.34439883753657
    }, {
      name: 'หอหญิงใหม่',
      latitude: 14.165125382132828,
      longitude: 101.34368394501507
    }, {
      name: 'แยกหอพักอาจารย์',
      latitude: 14.16625832207501,
      longitude: 101.34697090834379
    }

  ];

  $scope.start = function(){
    // $scope.state = 'running';
    $scope.randomPosition();
    $scope.state = 'loading';
  };


  $scope.randomPosition = function() {
    var ran = Math.floor((Math.random() * 9) + 0);
    $scope.statusTime = 'cal';
    if(ran == $scope.lastedPosition)
    {
      $scope.randomPosition();
      return 0;
    }

    $scope.lastedPosition = ran;
    $scope.destination = $scope.markPoints[ran];
    
    var watch = $cordovaGeolocation.watchPosition({
    enableHighAccuracy: true,
    maximumAge: 1000,
    frequency: 500
    });

    watch.promise.then(function() { /* Not  used */ },
    function(err) {
      alert(err);
    },
    function(position) {
      
      $scope.currentPosition = position;
      $scope.distance = GeolocationCalculator.haversine(position.coords, $scope.destination);
      console.log($scope.distance);
      if($scope.distance < 50){
        $scope.state = 'loading';
        $scope.historyPoints.push(p);
        $scope.randomPosition();
      }
      else if($scope.statusTime == 'cal'){
        if($scope.distance%2 == 0){
          $scope.timeOut = $scope.distance/2;
        }
        else if($scope.distance%2 == 1){
          $scope.timeOut = ($scope.distance+1)/2; 
        }
        $scope.startTime($scope.timeOut);
        $scope.statusTime = 'nocal';
        // $scope.state = 'running';
        $scope.state = 'running';
      }
  });
    // console.log($scope.state);
    // if($scope.state == 'running'){
    //   console.log($scope.distance);
    //   if($scope.distance%2 == 0){
    //     $scope.timeOut = $scope.distance/2;
    //   }
    //   else if($scope.distance%2 == 1){
    //     $scope.timeOut = ($scope.distance+1)/2; 
    //   }
    //   $scope.startTime($scope.timeOut);
    // }
    var p = {
      id: $scope.historyPoints.length,
      data: $scope.destination,
      time: timeConverter(Date.now())//$scope.convertTimeToDate(Date.now())
    };
    
  };
  // $scope.convertTimeToDate = function(dateNow){

  //   var t = new Date();
  //   t.setSeconds( dateNow );
  //   var formatted = t.format("dd.mm.yyyy hh:MM:ss");
  // }

  function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp*1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = hour + ':' + min + ':' + sec ;
    return time;
  }

  var timmer;

  $scope.startTime = function(init){
    $scope.lifeTime = init;
    console.log($scope.lifeTime);
    if ( angular.isDefined(timmer) ) return;

    timmer = $interval(function() {
      $scope.lifeTime--;
      if($scope.lifeTime < 0){
        $scope.stopTime();
        $scope.lifeTime= -1;
        $scope.state = 'gameover';
        console.log($scope.state);
        //alert('lose');
      }
    }, 1000);
  };

  $scope.stopTime = function(){
    $interval.cancel(timmer);
    timmer = undefined;
  };

  $scope.resetGame = function(){
    $scope.historyPoints = [];
    $scope.start();
  }




  // var watch = $cordovaGeolocation.watchPosition({
  //   enableHighAccuracy: true,
  //   maximumAge: 1000,
  //   frequency: 500
  // });

  // watch.promise.then(function() { /* Not  used */ },
  // function(err) {
  //   alert(err);
  // },
  // function(position) {
    
  //   $scope.currentPosition = position;
    
  //   if($scope.state == 'loading'){
  //     $scope.distance = GeolocationCalculator.haversine(position.coords, $scope.destination);
  //     if($scope.distance < 20){
  //       $scope.state = 'loading';
  //       $scope.randomPosition();
  //     }  
  //     $scope.state = 'running';
  //   }
  // });


  $scope.getTime = function() {
    var date = new Date($scope.lo.timestamp);
    return date.toString();
  };


});