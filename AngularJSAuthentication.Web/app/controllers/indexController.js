'use strict';
app.controller('indexController', ['$scope', '$rootScope', '$location', 'authService', function ($scope, $rootScope, $location, authService) {
    $scope.searchcategories = [];
    var _localCategories = localStorage.getItem("Categories");
    if (_localCategories != null && _localCategories != undefined) {
        _localCategories = JSON.parse(_localCategories);

    }
    else {
        _localCategories = [];
    }
    $scope.shoppingCart = [];
    $scope.TotalOfCartItems = 0;

    var _localCartItems = localStorage.getItem("shoppingCart");
    if (_localCartItems != null && _localCartItems != undefined) {
        _localCartItems = JSON.parse(_localCartItems);

    }
    else {
        _localCartItems = [];
    }
    $scope.shoppingCart = _localCartItems;
  
    CalculateTotal();

    $scope.logOut = function () {
        authService.logOut();
        $location.path('/home');
    }

   


    $rootScope.$on("GetCategories", function () {
        $scope.GetCategories();
    });

    $rootScope.$on("AddToCart", function (event, productId, product, ID) {
        $scope.AddToCart(productId, product, ID);
    });
    $rootScope.$on("DeleteFromCart", function (event, product) {
        $scope.DeleteFromCart(product);
    });
    $rootScope.$on("CalculateCart", function (event, cart) {
        CalculateTotal(cart);
    });
    
    $scope.GetCategories = function () {
        $.ajax({
            url: serviceBase + '/api/Categories/GetCategories',
            type: 'GET',
            dataType: 'json',
            success: function (data, textStatus, xhr) {
                $scope.searchcategories = data;

                localStorage.setItem("Categories", JSON.stringify(data));

                $scope.$apply();



            },
            error: function (xhr, textStatus, errorThrown) {
                $scope.categories = [];
            }
        });
    };

    $scope.GoToProductsWithCategoryID = function (ID) {
        localStorage.setItem("filterCategoryID", ID);
        $location.path('/Product');
    }


    $scope.GetProductImageGlobal = function (Path) {
        if ($.trim(Path) != "") {
            return _GlobalImagePath + "/ProductImages/" + Path;
        }
        return "../img/no-image.png";
    }

    $scope.AddToCart = function (productId, product, ID) {

        if (product[5] !== 0) {


            var item = $scope.shoppingCart.filter(function (item) {
                if (item.ProductId === product[8]) {
                    item.Quantity = item.Quantity + 1;
                }
                return item.ProductId === product[8];
            })[0];
            if (item == undefined) {
                $scope.CartProductsCounter++;


                $scope.shoppingCart.push({ ProductId: product[8], Image: product[2], Quantity: 1, ProductName: product[3], ProductQuantity: product[5], Cost: product[4], discount: 0, SupplierID: product[11] });


            }
            Animate2Item("#" + ID + productId);
            localStorage.setItem("shoppingCart", JSON.stringify($scope.shoppingCart));
            CheckScopeBeforeApply();
            CalculateTotal();
        }
        else {
            toastr.error("You can't Add this Item becasue it is Not Available in Stock");
        }

    };

    $scope.DeleteFromCart = function (Product) {
        for (var i = 0; i < $scope.shoppingCart.length; i++) {
            if ($scope.shoppingCart[i].ProductId == Product.ProductId) {
                $scope.shoppingCart.splice($.inArray(Product, $scope.shoppingCart), 1);
            }
        }

        localStorage.setItem("shoppingCart", JSON.stringify($scope.shoppingCart));

        CheckScopeBeforeApply();
        CalculateTotal();

        return false;
    }

    function CalculateTotal(cart) {
        $scope.shoppingCart = cart==undefined || cart==null ?$scope.shoppingCart:cart;
        var total = 0;

        for (var i = 0; i < $scope.shoppingCart.length; i++) {
            var product = $scope.shoppingCart[i];
            total += (product.Cost * product.Quantity);
        }
        $scope.TotalOfCartItems = total;
        _globalTotal = total;
        CheckScopeBeforeApply();
    }
    if (_localCategories.length == 0) {
        $scope.GetCategories();

    }
    else {
        $scope.searchcategories = _localCategories;
    }
    $scope.authentication = authService.authentication;


    function Animate2Item(originalID) {
        $(originalID).animate_from_to('.cart', {
            pixels_per_second: 700,
            initial_css: {
                'background': 'rgb(214, 209, 216,0.5)',
                'border-radius': '100%'
            }
        });

        //$('html, body').animate({
        //    'scrollTop': $(".cart").position().top
        //},1500);
    }


    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

}]);