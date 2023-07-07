using Models.Enum;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Users.Requests
{
    public class RequestUpdateUser
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = "Polje {0} ne smije biti prazno!")]
        public string Id_user { get; set; } = null!;

        [Required(AllowEmptyStrings = false, ErrorMessage = " ne smije biti prazan!")]
        [StringLength(30, MinimumLength = 3, ErrorMessage = " mora imati minimalno 3 znakova i maksimalno 30 znakova!")]
        [RegularExpression(@"^[a-zA-Z0-9]*$", ErrorMessage = " mora biti kombinacija brojeva ili slova bez razmaka.")]
        public string Username { get; set; } = null!;

        [Required(AllowEmptyStrings = false, ErrorMessage = "Email ne smije biti prazan!")]
        [EmailAddress(ErrorMessage = "Molimo unesite valjani Email!")]
        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        [Required(AllowEmptyStrings = false, ErrorMessage = "Ime ne smije biti prazan")]
        [StringLength(30, MinimumLength = 3, ErrorMessage = "Ime mora imati minimalno 3 znakova i maksimalno 30 znakova!")]
        [RegularExpression(@"^[a-zA-ZšŠčČćĆžŽđĐ\s]*$", ErrorMessage = "Ime mora biti kombinacija slova.")]
        public string Name { get; set; } = null!;

        [Required(AllowEmptyStrings = false, ErrorMessage = "Prezime ne smije biti prazan")]
        [StringLength(30, MinimumLength = 3, ErrorMessage = "Prezime mora imati minimalno 3 znakova i maksimalno 30 znakova!")]
        [RegularExpression(@"^[a-zA-ZšŠčČćĆžŽđĐ\s]*$", ErrorMessage = "Prezime mora biti kombinacija slova.")]
        public string Surname { get; set; } = null!;

        [MinLength(10, ErrorMessage = "JMBAG mora sadržavati točno 10 znamenki!")]
        [MaxLength(10, ErrorMessage = "JMBAG mora sadržavati točno 10 znamenki!")]
        [RegularExpression(@"^[0-9]*$", ErrorMessage = "JMBAG mora sadržavati samo brojke.")]
        public string? JMBAG { get; set; } = null!;

        public IEnumerable<string> Role { get; set; } = new List<string>();
    }
}
