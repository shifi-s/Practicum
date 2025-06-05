using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Jungle_Single.Core.Models
{
    public enum Roles { Admin, User }
    public class User
    {

        public int Id { get; set; }
        public string UserName { get; set; }
         public string PasswordHash { get; set; }
        public string Email { get; set; }

        public bool IsDeleted { get; set; }= false;
        public Roles Role { get; set; }


    }
}
