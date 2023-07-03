using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Roles
{
    public class Role
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = "Polje {0} ne smije biti prazno!")]
        public string Id_role { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Naziv role ne smije biti prazan!")]
        [StringLength(30, MinimumLength = 3, ErrorMessage = "Naziv role mora imati minimalno 3 znakova i maksimalno 30 znakova!")]
        [RegularExpression(@"^[a-zA-ZšŠčČćĆžŽđĐ\s]*$", ErrorMessage = "Naziv role mora biti kombinacija slova.")]
        public string Role_name { get; set; }

    }
}