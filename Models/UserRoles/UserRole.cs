using Models.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.UserRoles
{
    public class UserRole
    {
        public string Id_user { get; set; } = null!;
        public Rola Id_role { get; set; }

    }
}
