using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;

namespace ML
{
    public static class Roles
    {
        public static async Task<Models.Roles.Role> AddRoleAsync(Models.Roles.Role role)
        {
            using (DbConnection cn =await  DAL.DB.GetConnectionAsync())
            {
                return await DAL.Roles.AddRoleAsync(cn, null, role);
            }
        }

        public static async Task<Models.Roles.Role> GetRoleAsync(string Id_role)
        {
            using (DbConnection cn =await  DAL.DB.GetConnectionAsync())
            {
                return await DAL.Roles.GetRoleAsync(cn, null, Id_role);
            }
        }

        public static async Task<IEnumerable<Models.Roles.Role>> GetRolesAsync()
        {
            using (DbConnection cn =await  DAL.DB.GetConnectionAsync())
            {
                return await DAL.Roles.GetRolesAsync(cn, null);
            }
        }

        public static async Task RemoveRoleAsync(string Id_role)
        {
            using (DbConnection cn =await  DAL.DB.GetConnectionAsync())
            {
                await DAL.Roles.RemoveRoleAsync(cn, null, Id_role);
            }
        }

        public static async Task<Models.Roles.Role> UpdateRoleAsync(Models.Roles.Role role)
        {
            using (DbConnection cn =await  DAL.DB.GetConnectionAsync())
            {
                await DAL.Roles.UpdateRoleAsync(cn, null, role);
                return role;
            }
        }
    }
}
