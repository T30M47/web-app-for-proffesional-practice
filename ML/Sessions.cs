using Mapster;
using ML.Lib;
using Models.Users;
using Models.Users.Requests;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;

namespace ML
{
    public static class Sessions
    {
        private static TokenService TokenService = null!;

        public static void Init(string secretKey, string Issuer, string Audience, int ExpirationInSeconds)
        {
            TokenService = new TokenService(secretKey, Issuer, Audience, ExpirationInSeconds);
        }

        public static async Task<Models.Sessions.Responses.ResponseSession> AddSessionAsync(Models.Users.Requests.SessionRequestUser sessionUser, Models.Users.User user)
        {
            using (DbConnection cn =await  DAL.DB.GetConnectionAsync())
            {
             
                    const string characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                    string StringGenerator(int minLen, int maxLen)
                    {
                        var random = new Random();
                        int len = random.Next(minLen, maxLen + 1);

                        char[] chars = new char[len];
                        for (int i = 0; i < len; i++)
                        {
                            chars[i] = characters[random.Next(characters.Length)];
                        }
                        return new string(chars);
                    }


                    string RefreshToken = StringGenerator(40, 100);
                    Models.Sessions.Session sesija = new Models.Sessions.Session()
                    {
                        RefreshToken = RefreshToken,
                        Id_user = user.Id_user,  
                    };
                    var AccessToken = TokenService.CreateToken(user);
                    Models.Sessions.Responses.ResponseSession ResponseSesija = new Models.Sessions.Responses.ResponseSession()
                    {
                        RefreshToken = RefreshToken,
                        AccessToken = AccessToken
                    };
                    await DAL.Sessions.AddSessionAsync(cn, null, sesija);
                    return ResponseSesija;
                
            }
        }

        public static async Task<Models.Sessions.Responses.ResponseSession> GetNewAccessTokenAsync(Models.Sessions.Session session)
        {
            using (DbConnection cn = await DAL.DB.GetConnectionAsync())
            {
                var user = await ML.Users.GetUserAsync(session.Id_user);
             
                var AccessToken = TokenService.CreateToken(user!);
                Models.Sessions.Responses.ResponseSession ResponseSesija = new Models.Sessions.Responses.ResponseSession()
                {
                    RefreshToken = session.RefreshToken,
                    AccessToken = AccessToken
                };
                return ResponseSesija;
                
            }

        }

        public static async Task<Models.Sessions.Session> GetSessionRefreshTokenAsync(string RefreshToken)
        {
            using (DbConnection cn = await DAL.DB.GetConnectionAsync())
            {
                return await DAL.Sessions.GetSessionRefreshToken(cn, null, RefreshToken);
            }
        }
        public static async Task RemoveSessionAsync(string RefreshToken)
        {
            using (DbConnection cn =await  DAL.DB.GetConnectionAsync())
            {
                await DAL.Sessions.RemoveSessionAsync(cn, null, RefreshToken);
            }
        }
    }
}
