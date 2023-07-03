using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Sessions
{
    public class Session
    {
        public string RefreshToken { get; set; } = null!;
        public string Id_user { get; set;} = null!;
        
    }
}
