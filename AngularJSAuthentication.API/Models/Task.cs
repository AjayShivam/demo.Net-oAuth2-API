using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AngularJSAuthentication.API.Models
{
    public class Task
    {
        public int Id { get; set; }

        [Display(Name = "Task Name")]
        [Required]
        public string Name { get; set; }


        [Display(Name = "Some Detail")]
        public string Description { get; set; }

        [Display(Name = "Start Time")]
        public DateTime TaskStartTime { get; set; }

        [Display(Name = "Estimated Completion Time")]
        public DateTime TaskCompletionTime { get; set; }


        [Display(Name = "End Time")]
        public DateTime TaskEndTime { get; set; }

        public bool IsTaskReScheduable { get; set; }

        [Display(Name = "Task Reschedule Time")]
        public DateTime TaskRescheduleDate { get; set; }

    }
}