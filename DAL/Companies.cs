using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public static class Companies
    {
        private static string TableName = "companies";

        public static async Task<Models.Companies.Company> AddCompanyAsync(IDbConnection cn, IDbTransaction? tr, Models.Companies.Company company)
        {
            await cn.ExecuteAsync($"insert into {TableName} (Id_company, Name, Address, City, Email) values (@Id_company, @Name, @Address, @City, @Email)", company, tr);
            return company;
        }
       
        public static async Task<Models.Companies.Company> GetCompanyAsync(IDbConnection cn, IDbTransaction? tr, string Id_company)
        {
            return await cn.QueryFirstOrDefaultAsync<Models.Companies.Company>($"select * from {TableName} where Id_company=@Id_company", new { Id_company = Id_company }, tr);
        }

        public static async Task<IEnumerable<Models.Companies.Company>> GetCompaniesAsync(IDbConnection cn, IDbTransaction? tr)
        {
            return await cn.QueryAsync<Models.Companies.Company>($"select * from {TableName}", null, tr);
        }
        
       public static async Task<bool> RemoveCompanyAsync(IDbConnection cn, IDbTransaction? tr, string Id_company)
       {
           return (await cn.ExecuteAsync($"delete from {TableName} where Id_company=@Id_company", new { Id_company = Id_company }, tr)) > 0;          
       }

       public static async Task<bool> UpdateCompanyAsync(IDbConnection cn, IDbTransaction? tr, Models.Companies.Company company)
       {
           return (await cn.ExecuteAsync($"update {TableName} set Id_company=@Id_company, Name=@Name, Address=@Address, City=@City, Email=@Email where Id_company=@Id_company", company, tr)) > 0;
       }
       
    }
}
