using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public static class UserRoles
    {
        private static string TableName = "user_roles";

        public static async Task RemoveUserRolesAsync(IDbConnection cn, IDbTransaction? tr, string Id_user)
        {
            await cn.ExecuteAsync($"delete from {TableName} where Id_user=@Id_user", new { Id_user }, tr);
        }

        public static async Task<Models.UserRoles.UserRole> AddUserRoleAsync(IDbConnection cn, IDbTransaction? tr, Models.UserRoles.UserRole userRole)
        {
            await cn.ExecuteAsync($"insert into {TableName} (Id_user, Id_role) values (@Id_user, @Id_role)", userRole, tr);
            return userRole;
        }

        public static async Task<IEnumerable<Models.UserRoles.UserRole>> GetUserRoleAsync(IDbConnection cn, IDbTransaction? tr, string Id_user)
        {
            return await cn.QueryAsync<Models.UserRoles.UserRole>($"select * from {TableName} where Id_user=@Id_user", new { Id_user = Id_user}, tr);
        }

        public static async Task<bool> RemoveUserRoleAsync(IDbConnection cn, IDbTransaction? tr, string Id_user, int Id_role)
        {
            return (await cn.ExecuteAsync($"delete from {TableName} where Id_user=@Id_user AND Id_role=@Id_role", new { Id_user = Id_user, Id_role=Id_role }, tr))>0;
        }
    }
}
