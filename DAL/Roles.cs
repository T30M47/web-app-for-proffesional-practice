using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public static class Roles
    {
        private static string TableName = "roles";

        public static async Task<Models.Roles.Role> AddRoleAsync(IDbConnection cn, IDbTransaction? tr, Models.Roles.Role role)
        {
            await cn.ExecuteAsync($"insert into {TableName} (Id_role, Role_name) values (@Id_role, @Role_name)", role, tr);
            return role;
        }

        public static async Task<Models.Roles.Role> GetRoleAsync(IDbConnection cn, IDbTransaction? tr, string Id_role)
        {
            return await cn.QueryFirstOrDefaultAsync<Models.Roles.Role>($"select * from {TableName} where Id_role=@Id_role", new { Id_role = Id_role }, tr);
        }

        public static async Task<Models.Roles.Role> GetRoleNameAsync(IDbConnection cn, IDbTransaction? tr, string Role_name)
        {
            return await cn.QueryFirstOrDefaultAsync<Models.Roles.Role>($"select * from {TableName} where Role_name=@Role_name", new { Role_name = Role_name }, tr);
        }

        public static async Task<IEnumerable<Models.Roles.Role>> GetRolesAsync(IDbConnection cn, IDbTransaction? tr)
        {
            return await cn.QueryAsync<Models.Roles.Role>($"select * from {TableName}", null, tr);
        }

        public static async Task<bool> RemoveRoleAsync(IDbConnection cn, IDbTransaction? tr, string Id_role)
        {
            return (await cn.ExecuteAsync($"delete from {TableName} where Id_role=@Id_role", new { Id_role = Id_role }, tr)) > 0;
        }

        public static async Task<bool> UpdateRoleAsync(IDbConnection cn, IDbTransaction? tr, Models.Roles.Role role)
        {
            return (await cn.ExecuteAsync($"update {TableName} set Id_role=@Id_role, Role_name=@Role_name where Id_role=@Id_role", role, tr)) > 0;
        }
    }
}
