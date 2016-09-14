var app = angular.module('buttonsDemo1', ['ngMaterial']);

app.controller('AppCtrl', function($scope, $rootScope, $document, $timeout, $q, $element) {

  $scope.title1 = 'Button';
  $scope.title4 = 'Warn';
  $scope.isDisabled = true;
  $scope.tempValue = 0;
  $scope.tempDisc = "";
  $scope.lightValue = 0;
  $scope.lightDisc = "";
  $scope.touchValue = 0;
  $scope.touchDisc = "";
  $scope.showDarkTheme = false;

  AWS.config.region = 'us-west-2'; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'youridpool',
  });

  var iotdata = new AWS.IotData({endpoint: 'youriotendpoint'});
  var params = {
    thingName: 'IOTTHING' /* required */
  };
  setInterval(function() {
    iotdata.getThingShadow(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else {
          var output = JSON.parse(data.payload);
          console.log(output.state.desired.TEMPERATURE);
          tempValue = output.state.desired.TEMPERATURE;
          lightValue = output.state.desired.LIGHT;
          touchValue = output.state.desired.TOUCH;
          $scope.lightValue = lightValue;
          $scope.tempValue = tempValue;
          $scope.touchValue = touchValue;
          if (lightValue < 100) {
            $scope.lightDisc = "Bright"
          } else {
            $scope.lightDisc = "Dark"
          }
          if (tempValue < 20) {
            $scope.tempDisc = "Cold"
          } else if (tempValue > 40) {
            $scope.tempDisc = "Hot"
          } else {
            $scope.tempDisc = "Normal"
          }
          if (touchValue == 1) {
            $scope.touchDisc = "Touched"
            $scope.showDarkTheme = true
          } else {
            $scope.touchDisc = "unTouched"
            $scope.showDarkTheme = false;
          }
          $scope.$apply();
      }
    });
  },5000);

  $scope.updateFunc = function() {

  }

  //$scope.$apply();

});
