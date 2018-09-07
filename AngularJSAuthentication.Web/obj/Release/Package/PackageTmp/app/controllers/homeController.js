'use strict';
app.controller('homeController', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {

    $scope.searchcategoriesslider = [];
    $scope.pagedItems = [];
    $scope.MostSaledItems = [];
    $scope.TopRatedItems = [];
    $scope.ProductDetail = {};
    $scope.childmethod = function () {
        $rootScope.$emit("GetCategories", {});
    }

    $scope.AddToCartGlobal = function (productID,product,ID) {
        $rootScope.$emit("AddToCart", productID, product, ID);
    }
    var _localCategories = localStorage.getItem("Categories");
    if (_localCategories != null && _localCategories != undefined) {
        
        _localCategories = JSON.parse(_localCategories);

    }
    else {
         $scope.childmethod();
        _localCategories = localStorage.getItem("Categories")
        _localCategories = JSON.parse(_localCategories);
       
    }

 

    $scope.searchcategoriesslider = _localCategories;

    $scope.GetcatBgImage = function (Path) {
        if ($.trim(Path) != "") {
            return _GlobalImagePath + "/CategoryImage/" + Path;
        }
        return "../img/nocategory.png";
    }

    $scope.SetProduct = function (product) {
        localStorage.setItem("ProductDetail", JSON.stringify(product));
        $location.path('/ProductDetail');
    }

    function productSlider(className) {
        // ------------------------------------------------------- //
        // Products Slider
        // ------------------------------------------------------ //
        $(className).owlCarousel({
            loop: false,
            margin: 20,
            dots: true,
            nav: false,
            smartSpeed: 400,
            responsiveClass: true,
            navText: ['<i class="fa fa-long-arrow-left"></i>', '<i class="fa fa-long-arrow-right"></i>'],
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                1000: {
                    items: 4
                }
            }
        });
    }

    $scope.GetProductImage = function (Path) {
        if ($.trim(Path) != "") {
            return _GlobalImagePath + "/ProductImages/" + Path;
        }
        return "../img/no-image.png";
    }
    $scope.pagedItems = [];
    $scope.total = 0;

    $scope.GetSupplierImage = function (Path) {
        if ($.trim(Path) != "") {
            return _GlobalImagePath + "/SupplierImage/" + Path;
        }
        return "../img/no-image.png";
    }
    $scope.GetSuppliers = function () {
        $.ajax({
            url: serviceBase + '/api/Supplier/GetSuppliers',
            type: 'GET',
            dataType: 'json',
            success: function (data, textStatus, xhr) {


                debugger;
                $scope.Suppliers = data;


                console.log($scope.Suppliers);

                $scope.$apply();

                $('.brands-slider').owlCarousel({
                    loop: true,
                    margin: 20,
                    dots: true,
                    nav: false,
                    smartSpeed: 800,
                    responsiveClass: true,
                    responsive: {
                        0: {
                            items: 2
                        },
                        600: {
                            items: 3
                        },
                        1000: {
                            items: 6,
                            loop: false
                        }
                    }
                });


            },
            error: function (xhr, textStatus, errorThrown) {


                debugger;
            }
        });
    }

    $scope.GetFeaturedProducts = function (_Type) {

        var _isFeatured = "";
        var _MostSale = "";
        var _topRated = "";
        var _displaylength = 10;
        var _ClassName = "";
        switch (_Type) {
            case 1:
                _isFeatured = "1";
                _displaylength = 100;
                break;
            case 2:
                _MostSale = "1";
                _displaylength = 100;
                break;
            case 3:
                _topRated = "1";
                _displaylength = 20;
                break;
            default:

        }
        var _model = { displayLength: _displaylength, displayStart: 0, searchText: "", filtertext: "", Categories: "", lowprice: "", highprice: "", isFeatured: _isFeatured, isMostSale: _MostSale, TopRated: _topRated };
        $.ajax({
            url: serviceBase + 'api/Product/Post',
            type: 'POST',
            dataType: 'json',
            data: _model,
            success: function (data, textStatus, xhr) {

                $scope.total = data.iTotalDisplayRecords;
                

                switch (_Type) {
                    case 1:
                        $scope.pagedItems = data.aaData;
                        _ClassName = '.products-slider';
                        break;
                    case 2:
                        $scope.MostSaledItems = data.aaData;
                        _ClassName = '.mostsaled-slider';

                        break;
                    case 3:
                        $scope.TopRatedItems = data.aaData;
                        _ClassName = '.topRated-slider';

                        break;
                    default:

                }

                $("#loadingmessage").hide();
                $scope.$apply();
                productSlider(_ClassName);

            },
            error: function (xhr, textStatus, errorThrown) {

                alert(xhr.error);
            }
        });
    }

    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    
    $scope.getProductDetail = function (_Product) {

        $scope.ProductDetail = _Product;
        CheckScopeBeforeApply();
        $("#exampleModal").modal("show");
    }
    function init() {

      
        $scope.GetFeaturedProducts(1);
        $scope.GetFeaturedProducts(2);
        $scope.GetFeaturedProducts(3);
        $scope.GetSuppliers();
    }


    init();
}]);