using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Errors
{
    public class ValidatonErrorResponse
    {
        public string FieldName { get; set; } = null!;
        public string? Message { get; set; }
    }
}
