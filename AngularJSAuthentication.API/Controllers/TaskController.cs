using AngularJSAuthentication.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace AngularJSAuthentication.API.Controllers
{
    public class TaskController : ApiController
    {
        public IHttpActionResult Get()
        {
            using (AuthContext db = new AuthContext())
            {
                return Ok(db.Tasks.ToList());
            }
        }


        public Task Get(int id)
        {
            using (AuthContext db = new AuthContext())
            {
                return db.Tasks.FirstOrDefault(x => x.Id == id);
            }
        }

        public HttpResponseMessage Post([FromBody]Task Task)
        {
            try
            {

                using (AuthContext db = new AuthContext())
                {
                    db.Tasks.Add(Task);
                    db.SaveChanges();

                    var message = Request.CreateResponse(HttpStatusCode.Created, Task);
                    message.Headers.Location = new Uri(Request.RequestUri + Task.Id.ToString());
                    return message;
                }

            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        }



        public HttpResponseMessage Delete(int id)
        {
            try
            {
                using (AuthContext db = new AuthContext())
                {
                    var Task = db.Tasks.FirstOrDefault(e => e.Id == id);

                    if (Task == null)
                    {
                        return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Task Not Found");
                    }
                    else
                    {
                        db.Tasks.Remove(Task);
                        db.SaveChanges();
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                }
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }

        }



        public void put(int id, [FromBody] Task Task)
        {
            using (AuthContext db = new AuthContext())
            {
                var TaskFromDb = db.Tasks.FirstOrDefault(e => e.Id == id);

                TaskFromDb.Name = Task.Name;

                TaskFromDb.Description = Task.Description;

                db.SaveChanges();

            }
        }
    }
}
