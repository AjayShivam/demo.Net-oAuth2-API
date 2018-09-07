'use strict';
app.controller('ProductDetailController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {

    $scope.product = [];
    $scope.Images = [];
    $scope.IsProductLoading = false;
    var _localProductDetail = localStorage.getItem("ProductDetail");
    if (_localProductDetail != null && _localProductDetail != undefined) {
        _localProductDetail = JSON.parse(_localProductDetail);
    }
    else {
        _localProductDetail = [];
    }
    var slider = false;
    var _AttributesName = [];
    $scope.AttributesName = [];
    $scope.Tempproduct = _localProductDetail;


    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    function init() {
        $scope.GetProductDetail($scope.Tempproduct[8]);
    }

    function applyslider() {
        slider = $('.items-slider').owlCarousel({
            loop: true,
            items: 1,
            thumbs: true,
            thumbsPrerendered: true,
            dots: false,
            responsiveClass: false
        });
    }
    $scope.GetProductImage = function (Path) {
        if ($.trim(Path) != "") {
            return _GlobalImagePath + "/ProductImages/" + Path;
        }
        return "../img/no-image.png";
    }
    $scope.GetProductDetail = function (ID) {
        var _model = { ProductId: ID }
        $.ajax({
            url: serviceBase + 'api/Product/GetProductDetail',
            type: 'GET',
            dataType: 'json',
            data: _model,
            success: function (data, textStatus, xhr) {
                $scope.product = data;
                CheckScopeBeforeApply();


                $scope.AttributesData = $scope.product.product.attributes;
                _AttributesName = $scope.product.allAttributes;


                for (var i = 0; i < _AttributesName.length; i++) {
                    $scope.AttributesName.push({ Label: _AttributesName[i], Value: "" });
                }

                $scope.IsProductLoading = true;
                CheckScopeBeforeApply();
                $("#descriptiontab").trigger("click");
                $scope.Images = $scope.product._AllProductImages;
                CheckScopeBeforeApply();
                applyslider();

            },
            error: function (xhr, textStatus, errorThrown) {

                alert(xhr.error);
            }
        });
    }
    $('.dec-btn').on("click", function () {
        var siblings = $(this).siblings('input.quantity-no');
        if (parseInt(siblings.val(), 10) >= 1) {
            siblings.val(parseInt(siblings.val(), 10) - 1);
        }
    });


    $('.inc-btn').on("click", function () {
        var siblings = $(this).siblings('input.quantity-no');
        siblings.val(parseInt(siblings.val(), 10) + 1);
    });

    function CheckIfValueAvailable(Column, Value) {
        var _attributesDataArray = $scope.AttributesData;

        for (var i = 0; i < _attributesDataArray.length; i++) {
            if (_attributesDataArray[i].attributeName == Column && _attributesDataArray[i].attributeValue == Value) {
                return i;
            }

        }

        return -1;
    }

    function SetImages(Id) {
        var _array = [];
        for (var i = 0; i < $scope.Images.length; i++) {
            if ($scope.Images[i].productQuantityId == Id) {
                _array.push($scope.Images[i]);
            }

        }

        $scope.Images = _array.length > 0 ? _array : $scope.Images;
        CheckScopeBeforeApply();
        (".items-slider").data('owlCarousel').destroy();
        applyslider();
    }
    $scope.GetPrice = function (Value, Label) {
        var _attributesDataArray = $scope.AttributesData;
        var _attributesArray = [];
        var _attributeNameArray = _AttributesName;


        for (var i = 0; i < _attributeNameArray.length; i++) {
            var _ID = "#attribute" + (i + 1);
            _attributesArray.push({ ColumnName: $(_ID).attr("attributename"), Value: $(_ID).val() })

        }

        var _TempArray = [];

        for (var i = 0; i < _attributesArray.length; i++) {
            var _value = CheckIfValueAvailable(_attributesArray[i].ColumnName, _attributesArray[i].Value);
            if (_value != -1) {
                _TempArray.push(_value);
            }

        }

        var _Quantity = -1;

        if (_TempArray.length == _attributesArray.length) {
            $(".quantityFigure1").attr("data-max", _attributesDataArray[_TempArray[_TempArray.length - 1]].quantity);
            $("#Productprice").html(_attributesDataArray[_TempArray[_TempArray.length - 1]].cost);
            SetImages(_attributesDataArray[_TempArray[_TempArray.length - 1]].productQuantityId)

        }




    }
    $scope.GetAttributesData = function (Data) {
        var _array = [];
        for (var i = 0; i < $scope.AttributesData.length; i++) {
            if ($scope.AttributesData[i].attributeName == Data) {
                if ($.trim($scope.AttributesData[i].attributeValue)) {
                    var itemdata = _array.filter(function (item) {

                        return item === $scope.AttributesData[i].attributeValue;
                    })[0];

                    if (itemdata == undefined || itemdata == null) {
                        _array.push($scope.AttributesData[i].attributeValue);

                    }

                }
            }

        }

        return _array;
    }

    init();
}]);

