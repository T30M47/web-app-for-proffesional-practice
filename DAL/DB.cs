using Npgsql;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Reflection.Metadata;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.CompilerServices;

namespace DAL
{
    public class DB
    {
        const int VERSION = 1;
        public static string CNString = null!;

        public static async Task<NpgsqlConnection> GetConnectionAsync()
        {
            var conn = new NpgsqlConnection (CNString);
            await conn.OpenAsync();
            return conn;
        }

        public async static Task Init(string cnString)
        {
            CNString = cnString;

            using (NpgsqlConnection cn = await GetConnectionAsync())
            {
                int currentDBVersion = await Version(cn); // izvlacimo trenutnu verziju baze

                if (currentDBVersion < DB.VERSION)
                {
                    await RunMigrations(currentDBVersion, DB.VERSION, cn);
                }
            }
        }

        public static async Task<int> Version(NpgsqlConnection cn)
        {
            try
            {
                return await Parameters.GetDBVersion(cn);
            }
            catch (Exception)
            {
                //ne postoji
                return 0;
            }
        }

        public static async Task RunMigrations(int dbVersion, int latestDBVersion, NpgsqlConnection cn)
        {
            // dohvacamo sve funkcije koje pocinju sa UpdateTo 
            // i verzija je veca od verzije iz baze
            // i verzija je manja ili jednaka verziji za produkciju
            List<MethodInfo> methods = typeof(Migrations.Migrations).GetMethods(BindingFlags.Static | BindingFlags.NonPublic)
                                    .Where(item => item.Name.StartsWith("UpdateTo") &&
                                                    int.Parse(item.Name.Replace("UpdateTo", "")) > dbVersion &&
                                                    int.Parse(item.Name.Replace("UpdateTo", "")) <= latestDBVersion
                                            )
                                    .Reverse().ToList();

            // okidamo update-e
#pragma warning disable CS8600 // Converting null literal or possible null value to non-nullable type.
#pragma warning disable CS8602 // Dereference of a possibly null reference.
            foreach (MethodInfo method in methods) await (Task)method.Invoke(null, new object[] { cn, int.Parse(method.Name.Replace("UpdateTo", "")) });
#pragma warning restore CS8602 // Dereference of a possibly null reference.
#pragma warning restore CS8600 // Converting null literal or possible null value to non-nullable type.
        }
    }
}
