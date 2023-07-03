using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Errors
{
    public class ValidatonErrorsResponse
    {
        public List<ValidatonErrorResponse> Errors { get; set; } = new List<ValidatonErrorResponse>();
    }
}
