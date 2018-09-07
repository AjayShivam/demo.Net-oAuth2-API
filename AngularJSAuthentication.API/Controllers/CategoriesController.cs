using AngularJSAuthentication.API.Models;
using AngularJSAuthentication.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace AngularJSAuthentication.API.Controllers
{
    public class CategoriesController : ApiController
    {

        SHIVAMEcommerceDBEntities db = new SHIVAMEcommerceDBEntities();
      

        public HttpResponseMessage GetCategories()
        {
            var _results = db.Categories.ToList();
            var tree = _results.BuildTree().ToList();
            var nresult = new List<CategoryViewModel>();
            tree.ForEach(c =>
            {

                nresult.Add(new CategoryViewModel()
                {
                    CategoryName = c.CategoryName,
                    CategoryImage = c.CategoryImage,
                    Id = c.Id,
                    Description = c.Description,
                    ParentCategory = c.ParentCategory,
                    Categories1 = c.Categories1.Count() == 0 ? new List<CategoryViewModel>() : GetChildren(c.Categories1.ToList(), c.Id)
                });




            });


            return Request.CreateResponse(HttpStatusCode.OK, nresult);
        }

        private static List<CategoryViewModel> GetChildren(List<Category> categories, int p)
        {
            return categories
                    .Select(c => new CategoryViewModel
                    {
                        CategoryName = c.CategoryName,
                        CategoryImage = c.CategoryImage,
                        Id = c.Id,
                        Categories1 = GetChildren(c.Categories1.ToList(), c.Id)
                    })
                    .ToList();
        }

        // POST api/categories
        public void Post([FromBody]string value)
        {
        }

        // PUT api/categories/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/categories/5
        public void Delete(int id)
        {
        }
    }
}
