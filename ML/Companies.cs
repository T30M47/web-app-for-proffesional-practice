using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ML
{
    public static class Companies
    {
        public static async Task<Models.Companies.Company> AddCompanyAsync(Models.Companies.Company company)
        {
            using (DbConnection cn =await  DAL.DB.GetConnectionAsync())
            {
                return await DAL.Companies.AddCompanyAsync(cn, null, company);
            }
        }
        
        public static async Task<Models.Companies.Company> GetCompanyAsync(string Id_company)
        {
            using (DbConnection cn =await  DAL.DB.GetConnectionAsync())
            {
                return await DAL.Companies.GetCompanyAsync(cn, null, Id_company);
            }
        }

        public static async Task<IEnumerable<Models.Companies.Company>> GetCompaniesAsync()
        {
            using (DbConnection cn =await  DAL.DB.GetConnectionAsync())
            {
                return await DAL.Companies.GetCompaniesAsync(cn, null);
            }
        }
        
        public static async Task RemoveCompanyAsync(string Id_company)
        {
            using (DbConnection cn =await  DAL.DB.GetConnectionAsync())
            {
                await DAL.Companies.RemoveCompanyAsync(cn, null, Id_company);
            }
        }

        public static async Task<Models.Companies.Company> UpdateCompanyAsync(Models.Companies.Company company)
        {
            using (DbConnection cn =await  DAL.DB.GetConnectionAsync())
            {
                await DAL.Companies.UpdateCompanyAsync(cn, null, company);
                return company;
            }
        }
    }
}
