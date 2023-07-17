using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Practices.Requests
{
    public class RequestPractice
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = "Polje {0} ne smije biti prazno!")]
        public string Id_practice { get; set; } = null!;

        [Required(AllowEmptyStrings = false, ErrorMessage = "Polje {0} ne smije biti prazno!")]
        public string Id_student { get; set; } = null!;

        [Required(AllowEmptyStrings = false, ErrorMessage = "Polje {0} ne smije biti prazno!")]
        public string Id_company { get; set; } = null!;

        [Required(AllowEmptyStrings = false, ErrorMessage = "Akademska godina ne smije biti prazna")]
        [MaxLength(11, ErrorMessage = "Akademska godina mora imati točno 11 znakova!")]
        [MinLength(11, ErrorMessage = "Akademska godina mora imati točno 11 znakova!")]
        [RegularExpression(@"^\d{4}\./\d{4}\.$", ErrorMessage = "Akademska godina mora imati format YYYY./YYYY.")]
        public string Academic_year { get; set; } = null!;

        [Required(AllowEmptyStrings = false, ErrorMessage = "Studij ne smije biti prazan")]
        [RegularExpression(@"^(Preddiplomski|Diplomski)$", ErrorMessage = "Dopuštene vrijednosti za studij su Preddiplomski ili Diplomski.")]
        public string Study { get; set; } = null!;

        [Required(AllowEmptyStrings = false, ErrorMessage = "Datum početka ne smije biti prazan")]
     
        public DateTime Begin_date { get; set; }


        public DateTime? End_date { get; set; }

        [StringLength(30, ErrorMessage = "Pozicija može imati maksimalno 30 znakova!")]
        public string? Position { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Molimo unesite ispravan broj.")]
        public int? Hours_worked { get; set; }

        [StringLength(40, MinimumLength = 3, ErrorMessage = "Mentor mora imati minimalno 3 znakova i maksimalno 40 znakova!")]
        [RegularExpression(@"^[a-zA-ZšŠčČćĆžŽđĐ\.\s]*$", ErrorMessage = "Mentor mora biti kombinacija slova.")]
        public string? Mentor { get; set; }
        public string? Mentor_comment { get; set; }
        public string? Job_description_practice_diary { get; set; }
    }
}
