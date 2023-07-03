using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Users.Responses
{
    public class ResponseUser
    {
        public string Id_user { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Surname { get; set; } = null!;
        public string? JMBAG { get; set; } = null!;
        public IEnumerable<string> Role { get; set; } = new List<string>();
    }
}
