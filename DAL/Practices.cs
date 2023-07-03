using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public static class Practices
    {
        private static string TableName = "practices";

        public static async Task<Models.Practices.Practice> AddPracticeAsync(IDbConnection cn, IDbTransaction? tr, Models.Practices.Practice practice)
        {
            await cn.ExecuteAsync($"insert into {TableName} (Id_practice, Id_student, Id_company, Academic_year, Study, Begin_date, End_date, Position, Hours_worked, Mentor, Mentor_comment, Job_description_practice_diary) values (@Id_practice, @Id_student, @Id_company, @Academic_year, @Study, @Begin_date, @End_date, @Position, @Hours_worked, @Mentor, @Mentor_comment, @Job_description_practice_diary)", practice, tr);
            return practice;
        }

        public static async Task<Models.Practices.Practice> GetPracticeAsync(IDbConnection cn, IDbTransaction? tr, string Id_practice)
        {
            return await cn.QueryFirstOrDefaultAsync<Models.Practices.Practice>($"select * from {TableName} where Id_practice=@Id_practice", new { Id_practice = Id_practice }, tr);
        }

        public static async Task<IEnumerable<Models.Practices.Practice>> GetPracticesAsync(IDbConnection cn, IDbTransaction? tr)
        {
            return await cn.QueryAsync<Models.Practices.Practice>($"select * from {TableName}", null, tr);
        }

        public static async Task<IEnumerable<Models.Practices.Practice>> GetPracticesAYAsync(IDbConnection cn, IDbTransaction? tr, string Academic_year)
        {
            return await cn.QueryAsync<Models.Practices.Practice>($"select * from {TableName} where Academic_year=@Academic_year", new {Academic_year=Academic_year}, tr);
        }

        public static async Task<bool> RemovePracticeAsync(IDbConnection cn, IDbTransaction? tr, string Id_practice)
        {
            return (await cn.ExecuteAsync($"delete from {TableName} where Id_practice=@Id_practice", new { Id_practice = Id_practice }, tr)) > 0;
        }

        public static async Task<bool> UpdatePracticeAsync(IDbConnection cn, IDbTransaction? tr, Models.Practices.Practice practice)
        {
            return (await cn.ExecuteAsync($"update {TableName} set Id_practice=@Id_practice, Id_student=@Id_student, Id_company=@Id_company, Academic_year=@Academic_year, Study=@Study, Begin_date=@Begin_date, End_date=@End_date, Position=@Position, Hours_worked=@Hours_worked, Mentor=@Mentor, Mentor_comment=@Mentor_comment, Job_description_practice_diary=@Job_description_practice_diary where Id_practice=@Id_practice", practice, tr)) > 0;
        }
    }
}
