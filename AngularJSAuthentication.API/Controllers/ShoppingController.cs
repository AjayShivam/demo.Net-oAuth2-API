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
  

    public class ShoppingController : ApiController
    {

        SHIVAMEcommerceDBEntities db = new SHIVAMEcommerceDBEntities();
        [HttpPost]

        public HttpResponseMessage ShoppingcartDetail(ShoppingCart CartDetails)
        {
           



         return Request.CreateResponse(HttpStatusCode.OK);
        }


        [HttpGet]
        public HttpResponseMessage GetRelatedProducts(int productID)
        {
            try
            {

                var _product = db.ProductAttributeWithQuantities.Where(p => p.Id == productID).FirstOrDefault();
                var _RelatedProducts = db.ProductAttributeWithQuantities.Where(x => x.Product.CateogryID == _product.Product.CateogryID && x.Product.ManuFacturerID == _product.Product.ManuFacturerID).Take(10).ToList();
                _RelatedProducts = _RelatedProducts == null ? new List<ProductAttributeWithQuantity>() : _RelatedProducts;
                var result =new{
                    Success = true,
                    Data =_RelatedProducts.Select(x => new { ProductName = x.Product.ProductName, ProductID = x.ProductId, x.ProductPrice}).ToList()
            
                };
                  return Request.CreateResponse(HttpStatusCode.OK, result);
            
            }
            catch (Exception ex)
            {
                var result = new
                {
                    error = ex.InnerException.Message.ToString(),
                    data = ""
                };
                return Request.CreateResponse(HttpStatusCode.OK, result);
              
            }


        }



    }
}
