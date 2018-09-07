'use strict';
app.controller('productController', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
    $scope.AllAttributeFilters = [];
    $scope.Attributes = [];
    $scope.AttributesValue = [];
    $scope.pagedItems = [];
    $scope.total = 0;
    $scope.itemsPerPage = 1000;
    $scope.active = '';
    $scope.currentPage = 0;
    $scope.startpage = 0;
    $scope.items = [];
    $scope.valuess = [];
    $scope.search = '';
    $scope.selectedAttribute = "";
    $scope.categoriesobj = '';
    $scope.TotalItems = 0;
    $scope.attrlenght = $scope.AttributesValue.length;
    $scope.categoriesarraySelect = [];
    $scope.categories = [];
    $scope.Minval = '';
    $scope.Maxval = '';



    $scope.getProductDetail = function (_Product) {

        $scope.ProductDetail = _Product;
        CheckScopeBeforeApply();
        $("#exampleModal").modal("show");
    }

    $scope.AddToCartGlobal = function (productID, product, ID) {
        $rootScope.$emit("AddToCart", productID, product, ID);
    }

    $scope.childmethod = function () {
        $rootScope.$emit("GetCategories", {});
    }
    var _localCategories = localStorage.getItem("Categories");
    var _localCatID = localStorage.getItem("filterCategoryID");
    if (_localCategories != null && _localCategories != undefined) {

        _localCategories = JSON.parse(_localCategories);

    }
    else {
        $scope.childmethod();
        _localCategories = localStorage.getItem("Categories")
        _localCategories = JSON.parse(_localCategories);

    }
    $scope.categories = _localCategories;

    if (_localCatID != null && _localCatID != undefined) {
        $scope.categoriesobj = _localCatID;
    }


    //Get Product 
    function init() {
        $scope.GetProducts();
    }


    $scope.SetProduct = function (product) {
        localStorage.setItem("ProductDetail", JSON.stringify(product));
        $location.path('/ProductDetail');
    }



    $scope.GetProducts = function () {
        var FilterText = "";
        var newcounter = 0;
        for (var i = 0; i < $scope.AllAttributeFilters.length; i++) {
            if ($scope.AllAttributeFilters[i].Values.length > 0) {
                if (newcounter == 0) {
                    FilterText = FilterText + "(";
                    newcounter++;
                }
                FilterText = FilterText + " [" + $scope.AllAttributeFilters[i].Name + "]  in (";
                for (var k = 0; k < $scope.AllAttributeFilters[i].Values.length; k++) {
                    FilterText = FilterText + "'" + $scope.AllAttributeFilters[i].Values[k] + "'" + ",";
                }
                FilterText = FilterText.replace(/,\s*$/, "");

                FilterText = FilterText + ") AND ";


            }
        }
        if (newcounter > 0) {
            FilterText = FilterText.substring(0, FilterText.length - 4);
            FilterText = FilterText + ") AND";
        }

        if ($.trim($scope.categoriesobj) != "" || $.trim(FilterText) != "" || $.trim($scope.Minval) != "" || $.trim($scope.Maxval) != "" || $.trim($scope.search) != "") {
            $scope.startpage = 0;
            $scope.pagedItems = [];
        }

        $("#loadingmessage").show();
        var _model = { displayLength: $scope.itemsPerPage, displayStart: $scope.startpage, searchText: $scope.search, filtertext: FilterText, Categories: $scope.categoriesobj, lowprice: $scope.Minval, highprice: $scope.Maxval, isFeatured: "0" };
        $.ajax({
            url: serviceBase + 'api/Product/Post',
            type: 'POST',
            dataType: 'json',
            data: _model,
            success: function (data, textStatus, xhr) {

                $scope.total = data.iTotalDisplayRecords;

                $scope.pagedItems = data.aaData;

                console.log("Data");
                console.log($scope.pagedItems);
                $("#loadingmessage").hide();
                $scope.$apply();
                getattribute();
            },
            error: function (xhr, textStatus, errorThrown) {

                alert(xhr.error);
            }
        });
    }
    $scope.Clearfilter = function () {
        $scope.search = '',
        $scope.categoriesobj = '',
        $scope.categoriesarraySelect = [];
        $scope.AllAttributeFilters = [];
        $scope.Minval = '';
        $scope.Maxval = '';
        CheckScopeBeforeApply();
        $scope.GetProducts();

    }
    init();



    //Get Image Path 

    $scope.GetProductImage = function (Path) {
        if ($.trim(Path) != "") {
            return _GlobalImagePath + "/ProductImages/" + Path;
        }
        return "../img/no-image.png";
    }


    $scope.range = function () {

        var rangeSize = parseInt($scope.itemsPerPage / 3);
        var ret = [];
        var start;

        start = $scope.currentPage;
        if (start > $scope.pageCount() - rangeSize - 1) {
            start = $scope.pageCount() - rangeSize + 1;

        }

        for (var i = start; i < start + (rangeSize - 1) ; i++) {
            if (i > -1) {
                ret.push(i);

            }
        }
        return ret;
    };

    $scope.prevPage = function () {

        if ($scope.currentPage > 0) {
            $scope.currentPage--;
            CheckScopeBeforeApply();
            $scope.startpage = ($scope.currentPage * $scope.itemsPerPage);
            init();
        }
    };

    $scope.prevPageDisabled = function () {
        return $scope.currentPage === 0 ? "disabled" : "";
    };
    $scope.pageCount = function () {
        return Math.ceil($scope.total / $scope.itemsPerPage);
    };


    $scope.DisableCursor = function (path) {
        for (var i = 0; i < $scope.AlreadySelectedImages.length; i++) {
            if ($.trim($scope.AlreadySelectedImages[i]) == $.trim(path)) {
                return "NonePointer";
            }
        }

        return "";
    }

    $scope.nextPage = function () {

        if ($scope.currentPage < $scope.pageCount()) {
            $scope.currentPage++;
            CheckScopeBeforeApply();
            $scope.startpage = ($scope.currentPage * $scope.itemsPerPage);
            init();

        }
    };

    $scope.nextPageDisabled = function () {
        return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
    };

    $scope.setPage = function (n) {

        $scope.currentPage = n;
        $scope.startpage = n;
        CheckScopeBeforeApply();
        if (n == 0) {
            $scope.startpage = ($scope.startpage * $scope.itemsPerPage);


        }
        else {
            $scope.startpage = ($scope.startpage * $scope.itemsPerPage) + 1;

        }

        init();
    };


    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    function AddCatID(CategoryId) {

        var idx = $scope.categoriesarraySelect.indexOf(CategoryId);
        if (idx > -1) {
            // is currently selected
            $scope.pagedItems = [];
            $scope.currentPage = 0;
            $scope.checkboxclass = "";
            $scope.categoriesarraySelect.splice(idx, 1);
        }
        else {
            // is newly selected
            $scope.categoriesarraySelect.push(CategoryId);
            $scope.checkboxclass = "fa fa-check";
        }



        $scope.categoriesobj = $scope.categoriesarraySelect.join();
    }
    $scope.AddCatArray = function (CategoryId) {


        AddCatID(CategoryId);
        init();
    }


    $(document).on("change", "#sliderChange", function () {
        $scope.pricefilter();
    });

   

    $scope.pricefilter = function () {
        $scope.Minval = $("#slider-snap-value-lower").html();
        $scope.Maxval = $("#slider-snap-value-upper").html();
        init();
    }

    $scope.myFunc = function () {

        $scope.pagedItems = [];
        $scope.setPage = 0;

        $scope.GetProducts();
    };


    $scope.SetCheckedAttribute = function (Name, Value) {
        var _ID = $("#attr_" + Value);

        for (var i = 0; i < $scope.AllAttributeFilters.length; i++) {
            if ($scope.AllAttributeFilters[i].Name === Name) {

                if ($.trim($scope.AllAttributeFilters[i].Values) != "") {

                    for (var k = 0; k < $scope.AllAttributeFilters[i].Values.length; k++) {
                        var _val = $scope.AllAttributeFilters[i].Values[k];
                        if (_val == Value) {

                            $(_ID).removeClass("fa-square-o");
                            return true;
                        }
                    }
                }
            }
        }

        $(_ID).removeClass("fa-square-o").addClass("fa-square-o");
        return false;
    }

    $scope.IsFilterChecked = function (name, Value) {
        var _ID = "#attr_" + Value;

        if ($(_ID).hasClass("fa-square-o")) {

            $scope.AddAttrToFilter('1', name, Value);

        }
        else {

            $scope.AddAttrToFilter('0', name, Value);

        }


        $scope.GetProducts();
    }
    function CheckVarFromArray(array, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return true;
            }

        }
        return false;
    }
    $scope.AddAttrToFilter = function (ischecked, name, value) {

        // if (ischecked == 1)
        {
            for (var i = 0; i < $scope.AllAttributeFilters.length; i++) {
                if ($scope.AllAttributeFilters[i].Name === name) {
                    if (ischecked == "1" || ischecked == 1) {
                        if ($scope.AllAttributeFilters[i].Values.indexOf(value) === -1) {
                            $scope.AllAttributeFilters[i].Values.push(value);
                        }
                    }
                    else {
                        if (CheckVarFromArray($scope.AllAttributeFilters[i].Values, value) == true) {
                            $scope.AllAttributeFilters[i].Values.splice($scope.AllAttributeFilters[i].Values.indexOf(value), 1);
                        }
                    }
                }
            }
        }

        //else {
        //    for (var i = 0; i < $scope.AllAttributeFilters.length; i++) {
        //        if ($scope.AllAttributeFilters[i].Name === name) {
        //            if ($scope.AllAttributeFilters[i].Values.indexOf(value) === 1) {

        //                $scope.AllAttributeFilters[i].Values.splice($scope.AllAttributeFilters[i].Values.indexOf(value), 1);
        //            }

        //        }
        //    }
        //}

    }
    $scope.TrimString = function (_String) {

        return $.trim(_String)


    }

    $scope.getValues = function (name) {
        for (var i = 0; i < $scope.AllAttributeFilters.length; i++) {
            if ($scope.AllAttributeFilters[i].Name === name) {
                if ($.trim($scope.AllAttributeFilters[i].Values) != "") {



                    return $scope.AllAttributeFilters[i].Values;
                }

            }
        }

        return [];

    }
    $scope.isAlreadyName = function (name) {

        for (var i = 0; i < $scope.AllAttributeFilters.length; i++) {
            if ($scope.AllAttributeFilters[i].Name === name) {


                return true;

            }
        }

        return false;

    }

    function getattribute() {

        $.ajax({
            url: serviceBase + 'api/Product/GetAttributes',
            type: 'Get',
            dataType: 'json',
            success: function (data, textStatus, xhr) {

                $scope.Attributes = data;
                console.log("mainAttribute");
                console.log($scope.Attributes);
                CheckScopeBeforeApply();


                for (var i = 0; i < $scope.Attributes.length; i++) {
                    if ($scope.isAlreadyName($scope.Attributes[i].attributeName) != true) {

                        $scope.AllAttributeFilters.push({
                            Name: $scope.Attributes[i].attributeName,
                            Values: $scope.getValues($scope.Attributes[i].attributeName)
                        });

                    }
                    //else {
                    //    alert("into values");
                    //    for (var k = 0; k < $scope.AllAttributeFilters[i].Values.length; k++) {
                    //        var x = $scope.AllAttributeFilters[i].Values[k];

                    //        SetCheckedAttribute(x);
                    //    }
                    //}
                }

                console.log("mixattribute");
                console.log($scope.AllAttributeFilters);
                CheckScopeBeforeApply();
            },
            error: function (xhr, textStatus, errorThrown) {
                $scope.Attributes = [];
            }
        });
        $.ajax({
            url: serviceBase + 'api/Product/GetAttributesValue',
            type: 'GET',
            dataType: 'json',
            success: function (data, textStatus, xhr) {

                $scope.AttributesValue = data;
                console.log("mainattributeValue");
                console.log($scope.AttributesValue);
                CheckScopeBeforeApply();
            },
            error: function (xhr, textStatus, errorThrown) {
                $scope.Attributes = [];
            }
        });

    }


}]);


app.filter('unique', function () {
    // we will return a function which will take in a collection
    // and a keyname
    return function (collection, keyname) {
        // we define our output and keys array;
        var output = [],
            keys = [];

        // we utilize angular's foreach function
        // this takes in our original collection and an iterator function
        angular.forEach(collection, function (item) {
            // we check to see whether our object exists
            var key = item[keyname];
            // if it's not already part of our keys array
            if (keys.indexOf(key) === -1) {
                // add it to our keys array
                keys.push(key);
                // push this item to our final output array
                output.push(item);
            }
        });
        // return our array which should be devoid of
        // any duplicates
        return output;
    };
});