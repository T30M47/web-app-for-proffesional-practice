using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Users
{
    public class UserPasswordValidation
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = "Lozinka ne smije biti prazna")]
        [MinLength(6, ErrorMessage = "Lozinka mora sadržavati minimalno 6 znakova")]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*[0-9]).+$", ErrorMessage = "Lozinka mora imati najmanje jedno veliko slovo i najmanje jedan broj.")]
        public string Password { get; set; } = null!;

    }
}
