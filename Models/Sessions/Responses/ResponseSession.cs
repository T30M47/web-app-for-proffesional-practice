using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Sessions.Responses
{
    public class ResponseSession
    {
        public string RefreshToken { get; set; } = null!;
        public string AccessToken { get; set; } = null!;
    }
}
