
var app = angular.module('AngularAuthApp', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar']);

app.config(function ($routeProvider) {

    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "/app/views/home.html"
    });

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "/app/views/login.html"
    });

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "/app/views/signup.html"
    });

    $routeProvider.when("/orders", {
        controller: "ordersController",
        templateUrl: "/app/views/orders.html"
    });

    $routeProvider.when("/refresh", {
        controller: "refreshController",
        templateUrl: "/app/views/refresh.html"
    });

    $routeProvider.when("/tokens", {
        controller: "tokensManagerController",
        templateUrl: "/app/views/tokens.html"
    });

    $routeProvider.when("/associate", {
        controller: "associateController",
        templateUrl: "/app/views/associate.html"
    });


    $routeProvider.when("/Merchant", {
        controller: "MerchantController",
        templateUrl: "/app/views/Merchant.html"
    });
    $routeProvider.when("/Employee", {
        controller: "EmployeeController",
        templateUrl: "/app/views/Employee.html"
    });
    $routeProvider.when("/Customer", {
        controller: "CustomerController",
        templateUrl: "/app/views/Customer.html"
    });
    $routeProvider.when("/Service", {
        controller: "ServiceController",
        templateUrl: "/app/views/Service.html"
    });
    $routeProvider.when("/Task", {
        controller: "TaskController",
        templateUrl: "/app/views/Task.html"
    });

    $routeProvider.when("/MerchantList", {
        controller: "MerchantListController",
        templateUrl: "/app/views/MerchantList.html"
    });

    $routeProvider.when("/Product", {
        controller: "productController",
        templateUrl: "/app/views/product.html"
    });

    $routeProvider.when("/ShoppingCart", {
        controller: "shoppingCartController",
        templateUrl: "/app/views/shoppingCart.html"
    });

    $routeProvider.when("/checkout", {
        controller: "checkOutController",
        templateUrl: "/app/views/checkOut.html"
    });
    

    $routeProvider.when("/ProductDetail", {
        controller: "ProductDetailController",
        templateUrl: "/app/views/ProductDetails.html"
    });

    $routeProvider.otherwise({ redirectTo: "/home" });

});

//var serviceBase = 'http://localhost:26264/';
//var _GlobalImagePath = "http://localhost:7080/";

var serviceBase = 'http://shivamface.shivamitconsultancy.com/';
var _GlobalImagePath = "http://shivamonline.shivamitconsultancy.com/";

//var serviceBase = 'http://ngauthenticationapi.azurewebsites.net/';
app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'ngAuthApp'
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);


