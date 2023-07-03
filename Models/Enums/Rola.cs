using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Enum
{
    public enum Rola
    {
        [Description("Student")]
        Student = 0,
        [Description("Asistent")]
        Asistent = 1,
        [Description("Profesor")]
        Profesor = 2,
        [Description("Administrator")]
        Administrator = 3
    }
}
