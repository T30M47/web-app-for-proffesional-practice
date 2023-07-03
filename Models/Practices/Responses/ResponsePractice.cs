﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Practices.Responses
{
    public class ResponsePractice
    {
        public string Id_practice { get; set; } = null!;
        public string Id_student { get; set; } = null!;
        public string Id_company { get; set; } = null!;
        public string Academic_year { get; set; } = null!;
        public string Study { get; set; } = null!;
        public DateTime Begin_date { get; set; }
        public DateTime? End_date { get; set; }
        public string? Position { get; set; }
        public int? Hours_worked { get; set; }
        public string? Mentor { get; set; }
        public string? Mentor_comment { get; set; }
        public string? Job_description_practice_diary { get; set; }
    }
}
