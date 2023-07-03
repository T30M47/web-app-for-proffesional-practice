using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public static class Users
    {
        private static string TableName = "users";

        public static async Task<Models.Users.User> GetUserUsernameAsync(IDbConnection cn, IDbTransaction? tr, string Username)
        {
            return await cn.QueryFirstOrDefaultAsync<Models.Users.User>($"select * from {TableName} where Username = @Username", new { Username = Username }, tr);
        }

        public static async Task<Models.Users.User> AddUserAsync(IDbConnection cn, IDbTransaction? tr, Models.Users.User user)
        {
            await cn.ExecuteAsync($"insert into {TableName} (Id_user, Username, Email, Password_hash, Name, Surname, JMBAG) values (@Id_user, @Username, @Email, @Password_hash, @Name, @Surname, @JMBAG)", user, tr);
            return user;     
        }

        public static async Task<Models.Users.User> GetUserAsync(IDbConnection cn, IDbTransaction? tr, string Id_user)
        {
            return await cn.QueryFirstOrDefaultAsync<Models.Users.User>($"select * from {TableName} where Id_user=@Id_user", new { Id_user = Id_user }, tr);
        }

        public static async Task<IEnumerable<Models.Users.User>> GetUsersAsync(IDbConnection cn, IDbTransaction? tr)
        {
            return await cn.QueryAsync<Models.Users.User>($"select * from {TableName}", null, tr); 
        }

        public static async Task<bool> RemoveUserAsync(IDbConnection cn, IDbTransaction? tr, string Id_user)
        {
            return (await cn.ExecuteAsync($"delete from {TableName} where Id_user=@Id_user", new { Id_user = Id_user }, tr)) > 0;
        }

        public static async Task<bool> UpdateUserAsync(IDbConnection cn, IDbTransaction? tr, Models.Users.User user)
        {
            return (await cn.ExecuteAsync($"update {TableName} set Id_user=@Id_user, Username=@Username, Email=@Email, Password_hash=@Password_hash, Name=@Name, Surname=@Surname, JMBAG=@JMBAG where Id_user=@Id_user", user, tr)) > 0;
        }

        public static async Task<bool> UpdateUserWithoutPasswordAsync(IDbConnection cn, IDbTransaction? tr, Models.Users.User user)
        {
            return (await cn.ExecuteAsync($"update {TableName} set Id_user=@Id_user, Username=@Username, Email=@Email, Name=@Name, Surname=@Surname, JMBAG=@JMBAG where Id_user=@Id_user", user, tr)) > 0;
        }
    }
}
