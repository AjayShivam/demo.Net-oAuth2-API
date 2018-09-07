using AngularJSAuthentication.API.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Script.Serialization;

namespace AngularJSAuthentication.API.Controllers
{

    [Route("api/Product/{action}")]
    public class ProductController : ApiController
    {
        public List<object> newcolumns = null;
        private int filteredRows = 0;
        private string cs = ConfigurationManager.ConnectionStrings["AuthContext"].ConnectionString;
        SHIVAMEcommerceDBEntities db = new SHIVAMEcommerceDBEntities();
        // GET api/featuedproduct

        [HttpGet]
        [ActionName("GetAttributes")]
        public HttpResponseMessage GetAttributes()
        {

            // Filling the list with data here...
            var result = db.ProductAttributes.Select(p => new { AttributeName = p.AttributeName, Id = p.Id });

            // Then I return the list
            return Request.CreateResponse(HttpStatusCode.OK, result.ToList());
        }
        [HttpGet]
        [ActionName("GetAttributesValue")]
        public HttpResponseMessage GetAttributesValue()
        {

            // Filling the list with data here...
            var result = db.ProductAttribute_view.Select(p => new { AttributeId = p.AttributeName, AttributeValue = p.AttributeValue });

            // Then I return the list
            return Request.CreateResponse(HttpStatusCode.OK, result.ToList());
        }




        [HttpPost]
        [ActionName("Post")]
        public HttpResponseMessage Post(ProductFilterViewModel model)
        {
            int displayLength = model.displayLength;
            int displayStart = model.displayStart;
            //int sortCol = int.Parse(context.Request["iSortCol_0"]);
            //string sortDir = context.Request["sSortDir_0"];
            string search = model.searchText;
            string filterText = model.filterText;
            string categories = model.Categories;
            string Lowprice = model.lowprice;
            string Highprice = model.highprice;
            string IsFeatured = model.isFeatured;
            string _ProductIds = "";

            if (model.isMostSale == "1")
            {
                var _orders = db.Orders.Include("OrderStatu").Where(x => x.OrderStatu.Status == "Completed").Select(x => x.Id);
                var _products = _orders != null && _orders.Count() != 0 ? db.OrderItems.Where(x => _orders.Contains(x.Orders_Id)).GroupBy(x => x.ProductID).Select(groupByRange => new { ProductID = groupByRange.Key, Total = groupByRange.Count() }) : null;

                var _productIDList = _products != null ? _products.OrderByDescending(x => x.Total).Take(10).Select(x => x.ProductID) : null;

                _ProductIds = _productIDList != null ? string.Join(",", Array.ConvertAll(_productIDList.ToArray(), i => i.ToString())) : "";
            }


            if (model.TopRated == "1")
            {
                var TopProducts = db.CustomerReviews.Where(x => x.Rating != null).GroupBy(x => x.ProductId).Select(x => x.FirstOrDefault())
                    .OrderByDescending(x => x.Rating).Take(5).ToList();

                var TopProductsIds = TopProducts.Select(x => x.ProductId);

                _ProductIds = TopProductsIds != null ? string.Join(",", Array.ConvertAll(TopProductsIds.ToArray(), i => i.ToString())) : "";
            }




            var allProducts = new List<object[]>();
            using (SqlConnection con = new SqlConnection(cs))
            {
                SqlCommand cmd = new SqlCommand("SP_GetAllSortedProductsFrontFace", con);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter paramDisplayLength = new SqlParameter()
                {
                    ParameterName = "@DisplayLength",
                    Value = displayLength
                };
                cmd.Parameters.Add(paramDisplayLength);

                SqlParameter paramDisplayStart = new SqlParameter()
                {
                    ParameterName = "@DisplayStart",
                    Value = displayStart
                };
                cmd.Parameters.Add(paramDisplayStart);

                SqlParameter paramSortCol = new SqlParameter()
                {
                    ParameterName = "@SortCol",
                    Value = "productName"
                };
                cmd.Parameters.Add(paramSortCol);

                SqlParameter paramSortDir = new SqlParameter()
                {
                    ParameterName = "@SortDir",
                    Value = "asc"
                };
                cmd.Parameters.Add(paramSortDir);

                SqlParameter paramSearchString = new SqlParameter()
                {
                    ParameterName = "@SearchText",
                    Value = string.IsNullOrEmpty(search) ? null : search
                };
                cmd.Parameters.Add(paramSearchString);
                SqlParameter paramFilterText = new SqlParameter()
                {
                    ParameterName = "@FilterText",

                    Value = string.IsNullOrEmpty(filterText) ? "" : filterText
                    //"([Color] in ('Red','Green') OR [Size] in ('X','L')) AND"
                };
                cmd.Parameters.Add(paramFilterText);
                SqlParameter paramCategoriesText = new SqlParameter()
                {
                    ParameterName = "@Categories",

                    Value = string.IsNullOrEmpty(categories) ? null : categories
                };
                cmd.Parameters.Add(paramCategoriesText);
                SqlParameter paramlowpriceText = new SqlParameter()
                {
                    ParameterName = "@LowPrice",

                    Value = string.IsNullOrEmpty(Lowprice) ? null : Lowprice
                };
                cmd.Parameters.Add(paramlowpriceText);

                SqlParameter paramhighpriceText = new SqlParameter()
                {
                    ParameterName = "@HighPrice",

                    Value = string.IsNullOrEmpty(Highprice) ? null : Highprice
                };
                cmd.Parameters.Add(paramhighpriceText);



                SqlParameter paramIsFeaturedText = new SqlParameter()
                {
                    ParameterName = "@IsFeatured",

                    Value = string.IsNullOrEmpty(IsFeatured) ? "0" : IsFeatured
                };

                cmd.Parameters.Add(paramIsFeaturedText);

                SqlParameter paramProductIDText = new SqlParameter()
          {
              ParameterName = "@ProductIds",

              Value = string.IsNullOrEmpty(_ProductIds) ? null : _ProductIds
          };
                cmd.Parameters.Add(paramProductIDText);


                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                using (rdr)
                {


                    allProducts = Read(rdr).ToList();


                }

            }

            var result = new
            {
                iTotalRecords = GetProductsTotalCount(),
                iTotalDisplayRecords = filteredRows,
                aaData = allProducts,
                aoColumns = newcolumns
            };

            //JavaScriptSerializer js = new JavaScriptSerializer();
            //return new JsonResult { Data = js.Serialize(result) };     
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        private int GetProductsTotalCount()
        {
            int totalEmployees = 0;
            using (SqlConnection con = new SqlConnection(cs))
            {
                SqlCommand cmd = new SqlCommand("[GetProductsCount] 1", con);
                con.Open();
                totalEmployees = (int)cmd.ExecuteScalar();
            }
            return totalEmployees;
        }
        private IEnumerable<object[]> Read(DbDataReader reader)
        {
            newcolumns = new List<object>();
            var k = 0;
            while (reader.Read())
            {

                var values = new List<object>();

                for (int i = 0; i < reader.FieldCount; i++)
                {
                    if (k == 0)
                    {
                        newcolumns.Add(reader.GetName(i));
                    }
                    filteredRows = Convert.ToInt32(reader["TotalCount"]);

                    values.Add(reader.GetValue(i));
                }
                k++;
                yield return values.ToArray();
            }
        }


        [HttpGet]
        [ActionName("GetProductDetail")]
        public HttpResponseMessage GetProductDetail(int ProductId)
        {

            AngularJSAuthentication.API.ProductDetail productDetail = new AngularJSAuthentication.API.ProductDetail();
            productDetail.Product = new AngularJSAuthentication.API.TempProduct();
            productDetail.ProductQuantityID = ProductId;

            var _ProductData = db.ProductAttributeWithQuantities.Where(p => p.Id == ProductId).FirstOrDefault();
            var _product = db.Products.Where(p => p.Id == _ProductData.ProductId).FirstOrDefault();
            productDetail.Product.CateogryID = _product.CateogryID;
            productDetail.Product.ProductName = _product.ProductName;
            productDetail.Product.Description = _product.Description;
            productDetail.Product.Id = _product.Id;
            productDetail.Product.IDSKU = _product.IDSKU;
            productDetail.Product.Notes = _product.Notes;
            productDetail.Product.SKU = _product.SKU;
            productDetail.Product.ProductCode = _product.ProductCode;

            productDetail.Attributes = new List<ProductDetailAttributes>();
            productDetail.Attributes = db.ProductValues_view.Where(p => p.productId == _ProductData.ProductId).Select(p => new ProductDetailAttributes() { AttributeName = p.AttributeName, AttributeValue = p.AttributeValue, Cost = p.Cost, ImageName = p.ImageName, ImagePath = p.ImagePath, Quantity = p.Quantity, ProductQuantityId = p.ProductQuantityID }).ToList();

            var result = new
            {
                product = productDetail,
                allAttributes = productDetail.Attributes.Select(p => p.AttributeName).Distinct().ToList(),
                _AllProductImages = productDetail.Attributes.GroupBy(test => test.ProductQuantityId)
                    .Select(grp => grp.First())
                    .ToList()
            };
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

    }
}
