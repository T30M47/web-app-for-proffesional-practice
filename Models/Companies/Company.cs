using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Companies
{
    public class Company
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = "Polje {0} ne smije biti prazno!")]
        public string Id_company { get; set; } = null!;

        [Required(AllowEmptyStrings = false, ErrorMessage = "Naziv ne smije biti prazan!")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Naziv mora imati minimalno 3 znakova i maksimalno 50 znakova!")]
        [RegularExpression(@"^[a-zA-Z0-9šŠčČćĆžŽđĐ\s]*$", ErrorMessage = "Naziv mora biti kombinacija brojeva ili slova.")]
        public string Name { get; set; } = null!;

        [StringLength(50, ErrorMessage = "Adresa može imati maksimalno 50 znakova!")]
        public string? Address { get; set; }

        [StringLength(50, ErrorMessage = "Grad može imati maksimalno 50 znakova!")]
        [RegularExpression(@"^[a-zA-ZšŠčČćĆžŽđĐ\s]*$", ErrorMessage = "Grad mora biti kombinacija slova.")]
        public string? City { get; set; }

        
        [EmailAddress(ErrorMessage = "Molimo unesite valjani Email!")]
        public string? Email { get; set; }

    }
}