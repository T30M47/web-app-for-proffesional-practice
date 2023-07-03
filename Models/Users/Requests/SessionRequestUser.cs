using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Users.Requests
{
    public class SessionRequestUser
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
