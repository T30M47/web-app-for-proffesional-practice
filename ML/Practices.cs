using DAL;
using Mapster;
using Models.Practices;
using Models.Users;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ML
{
    public static class Practices
    {
        public static async Task<Models.Practices.Responses.ResponsePractice> AddPracticeAsync(Models.Practices.Requests.RequestPractice newEditPractice)
        {
            using (DbConnection cn =await  DAL.DB.GetConnectionAsync())
            {
                using (DbTransaction tr = cn.BeginTransaction())
                {
                    var practiceZaBazu = newEditPractice.Adapt<Practice>();
                    await DAL.Practices.AddPracticeAsync(cn, null, practiceZaBazu);
                    await tr.CommitAsync();
                    return newEditPractice.Adapt<Models.Practices.Responses.ResponsePractice>();
                }
               
            }
        }

        public static async Task<Models.Practices.Responses.ResponsePractice> GetPracticeAsync(string Id_practice)
        {
            using (DbConnection cn =await  DAL.DB.GetConnectionAsync())
            {
                using (DbTransaction tr = cn.BeginTransaction())
                {
                    var practice = await DAL.Practices.GetPracticeAsync(cn, null, Id_practice);
                    await tr.CommitAsync();
                    return practice.Adapt<Models.Practices.Responses.ResponsePractice>();
                }
                
            }
        }

        public static async Task<IEnumerable<Models.Practices.Practice>> GetPracticesAYAsync(string Academic_year)
        {
            using (DbConnection cn =await  DAL.DB.GetConnectionAsync())
            {
                return await DAL.Practices.GetPracticesAYAsync(cn, null, Academic_year);
            }
        }

        public static async Task<IEnumerable<Models.Practices.Practice>> GetPracticesAsync()
        {
            using (DbConnection cn =await  DAL.DB.GetConnectionAsync())
            {
                return await DAL.Practices.GetPracticesAsync(cn, null);
            }
        }

        public static async Task RemovePracticeAsync(string Id_practice)
        {
            using (DbConnection cn =await  DAL.DB.GetConnectionAsync())
            {
                await DAL.Practices.RemovePracticeAsync(cn, null, Id_practice);
            }
        }

        public static async Task<Models.Practices.Responses.ResponsePractice> UpdatePracticeAsync(Models.Practices.Requests.RequestPractice newEditPractice)
        {
            using (DbConnection cn =await  DAL.DB.GetConnectionAsync())
            {
                using (DbTransaction tr = cn.BeginTransaction())
                {
                    var practiceZaBazu = newEditPractice.Adapt<Practice>();
                    await DAL.Practices.UpdatePracticeAsync(cn, null, practiceZaBazu);
                    await tr.CommitAsync();
                    return newEditPractice.Adapt<Models.Practices.Responses.ResponsePractice>();

                }
            }
        }
    }
}
