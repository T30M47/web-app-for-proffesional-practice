using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class Parameters
    {
        private static string TableName = "parameters";

        public static Task<int> GetDBVersion(IDbConnection cn, IDbTransaction? tr = null)
        {
            return cn.ExecuteScalarAsync<int>(@$"SELECT DBVersion FROM {TableName}", tr);
        }

        public static Task<int> UpdateDBVersion(int version, IDbConnection cn, IDbTransaction? tr = null)
        {
            return cn.ExecuteScalarAsync<int>(@$"UPDATE {TableName} SET DBVersion = @DBVersion", new { DBVersion = version }, tr);
        }
    }
}
