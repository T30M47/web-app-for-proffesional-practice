using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public static class Sessions
    {
        private static string TableName = "sessions";

        public static async Task<Models.Sessions.Session> AddSessionAsync(IDbConnection cn, IDbTransaction? tr, Models.Sessions.Session session)
        {
            await cn.ExecuteAsync($"insert into {TableName} (RefreshToken, Id_user) values (@RefreshToken, @Id_user)", session, tr);
            return session;
        }

        public static async Task<Models.Sessions.Session> GetSessionRefreshToken(IDbConnection cn, IDbTransaction? tr, string RefreshToken)
        {
            return await cn.QueryFirstOrDefaultAsync<Models.Sessions.Session>($"select * from {TableName} where RefreshToken=@RefreshToken", new { RefreshToken = RefreshToken }, tr);
        }

        public static async Task<bool> UpdateSessionAsync(IDbConnection cn, IDbTransaction? tr, Models.Sessions.Session session)
        {
            return (await cn.ExecuteAsync($"update {TableName} set  RefreshToken=@RefreshToken, Id_user=@Id_user", session, tr)) > 0;
        }

        public static async Task<bool> RemoveSessionAsync(IDbConnection cn, IDbTransaction? tr, string RefreshToken)
        {
            return (await cn.ExecuteAsync($"delete from {TableName} where RefreshToken=@RefreshToken", new { RefreshToken = RefreshToken }, tr)) > 0;
        }
    }
}
