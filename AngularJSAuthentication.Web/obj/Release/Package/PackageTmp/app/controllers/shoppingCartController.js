'use strict';
app.controller('shoppingCartController', ['$scope', '$rootScope', function ($scope, $rootScope) {

    var _localCartItems = localStorage.getItem("shoppingCart");
   
    
    function LocalCartFiller() {
        _localCartItems = localStorage.getItem("shoppingCart");

        if (_localCartItems != null && _localCartItems != undefined) {
            _localCartItems = JSON.parse(_localCartItems);

        }
        else {
            _localCartItems = [];
        }
        $scope.shoppingCart = _localCartItems;
        $scope.TotalCartItems = _globalTotal;
        CheckScopeBeforeApply();
    }

    LocalCartFiller();
    $scope.GetProductImageGlobal = function (Path) {
        if ($.trim(Path) != "") {
            return _GlobalImagePath + "/ProductImages/" + Path;
        }
        return "../img/no-image.png";
    }
    //Get Product 
    function init() {
    }


    init();

    $scope.RemoveCartGlobal = function (product) {
        $rootScope.$emit("DeleteFromCart", product);
        LocalCartFiller();
        $scope.CalculateCartGlobal($scope.shoppingCart);
    }

    $scope.CalculateCartGlobal = function (cart) {
        $rootScope.$emit("CalculateCart", cart);
        $scope.TotalCartItems = _globalTotal;

    }
    $scope.UpdateQuantity = function (type, Index) {
        var _Objcopy = angular.copy($scope.shoppingCart[Index]);

        if (type == 1) {
            if (_Objcopy.Quantity == _Objcopy.ProductQuantity) {
                alert("Product Reached to its maximum limit");
            }
            else {
                _Objcopy.Quantity = _Objcopy.Quantity + 1;
            }

        }
        if (type == 2) {
            if (_Objcopy.Quantity > 1) {

                _Objcopy.Quantity = _Objcopy.Quantity - 1;
            }
        }
        $scope.shoppingCart[Index] = _Objcopy;
        CheckScopeBeforeApply();
        localStorage.setItem("shoppingCart", JSON.stringify($scope.shoppingCart));
        LocalCartFiller();
        $scope.CalculateCartGlobal($scope.shoppingCart);


    }


    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };



}]);