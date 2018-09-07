'use strict';
app.controller('checkOutController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {

    $scope.emailvalidation = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
    $scope.ccinfo = { type: "fa fa-credit-card" }
    $scope.CurrentTab = 1;
    $scope.shipping = 10;
    $scope.ChangeTab = function (CurrentTab) {
        $scope.CurrentTab = CurrentTab;
        CheckScopeBeforeApply();
    }

    $scope.CustomerDetails = {FirstName:'' , LastName:'' , Phone:'' , Email:'' ,Street:'',City:'',PinCode:'',State:'',Country:'',UserName: '', Password: '' };

    $scope.PaymentInformation={cardType:'2', Nameoncard:'',ExpiryDate:'', CardNumber:'',Zip:'',CVV:''}

  

    $scope.PlaceOrder = function (cartitem) {
        debugger;

        var allDataToSend = {CartItems: cartitem, CustomerData: $scope.CustomerDetails, PaymentInfo: $scope.PaymentInformation };


    };






}]);

app.directive
 ('creditCardType'
 , function () {

     var directive =
       {
           require: 'ngModel'
       , link: function (scope, elm, attrs, ctrl) {
           ctrl.$parsers.unshift(function (value) {
               scope.ccinfo.type =
                 (/^5[1-5]/.test(value)) ? "fa fa-cc-mastercard"
                 : (/^4/.test(value)) ? "fa fa-cc-visa"
                 : (/^3[47]/.test(value)) ? 'fa fa-cc-amex'
                 : (/^6011|65|64[4-9]|622(1(2[6-9]|[3-9]\d)|[2-8]\d{2}|9([01]\d|2[0-5]))/.test(value)) ? 'fa fa-cc-discover'
                 : undefined
               ctrl.$setValidity('invalid', !!scope.ccinfo.type)
               return value
           })
       }
       }
     return directive
 }
   )
