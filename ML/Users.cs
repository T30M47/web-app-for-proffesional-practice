using BCrypt.Net;
using DAL;
using Mapster;
using Mapster.Utils;
using Microsoft.AspNetCore.Http.HttpResults;
using ML.Lib;
using Models.Enum;
using Models.Users;
using Models.Users.Requests;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;

namespace ML
{
    public static class Users
    {
        public static async Task<Models.Users.User> AddUserAsync(Models.Users.Requests.RequestUser user)
        {
            using (DbConnection cn = await DAL.DB.GetConnectionAsync())
            {
                using (DbTransaction tr = cn.BeginTransaction())
                {
                    var userZaBazu = user.Adapt<User>();

                    // izracunaj hash
                    userZaBazu.Password_hash = BCrypt.Net.BCrypt.EnhancedHashPassword(user.Password);

                    await DAL.Users.AddUserAsync(cn, tr, userZaBazu);

                    // spremit role
                    foreach (string role_name in user.Role)
                    {
                        await DAL.UserRoles.AddUserRoleAsync(cn, tr, new Models.UserRoles.UserRole() { Id_role = Helpers.GetValueFromDescription<Rola>(role_name), Id_user = userZaBazu.Id_user });
                    };

                    await tr.CommitAsync();
                    return userZaBazu;
                }
            }
        }

        public static async Task AddAdminIfUsersEmptyAsync()
        {
            using (DbConnection cn = await DAL.DB.GetConnectionAsync())
            {
                if ((await DAL.Users.GetUsersAsync(cn, null)).Count() == 0)
                {
                    await AddUserAsync(new RequestUser()
                    {
                        Id_user = "73921d79-5e50-40e1-86cf-9b5cb09bdc52",
                        Email = "admin@admin.com",
                        Username = "admin",
                        Password = "admin",
                        JMBAG = "1234567894",
                        Name = "admin firstname",
                        Surname = "admin lastname",
                        Role = new List<string> { Helpers.GetEnumDescription(Rola.Administrator) }
                    });
                }
            }
        }

        public static async Task<Models.Users.User?> GetUserUsernameAsync(string Username)
        {
            using (DbConnection cn = await DAL.DB.GetConnectionAsync())
            {
                using (DbTransaction tr = cn.BeginTransaction()) 
                {
                    var user = await DAL.Users.GetUserUsernameAsync(cn, null, Username);
                    if (user == null) return null;

                    var user_roles = await DAL.UserRoles.GetUserRoleAsync(cn, tr, user.Id_user);
                    // po user roles izvadi iz tablice roles i to stavi na user.roles 
                    foreach (var role in user_roles)
                    {
                        user.Role.Add(Helpers.GetEnumDescription(role.Id_role));
                    }
                    await tr.CommitAsync();
                    return user;
                }
                
            }
        }

        public static async Task<Models.Users.User?> GetUserAsync(string Id_user)
        {
            using (DbConnection cn = await DAL.DB.GetConnectionAsync())
            {
                using (DbTransaction tr = cn.BeginTransaction())
                {
                    var user = await DAL.Users.GetUserAsync(cn, null, Id_user);
                    if (user == null) return null;
                    var user_roles = await DAL.UserRoles.GetUserRoleAsync(cn, tr, user.Id_user);

                    // po user roles izvadi iz tablice roles i to stavi na user.roles 
                    foreach (var role in user_roles)
                    {
                        user.Role.Add(Helpers.GetEnumDescription(role.Id_role));
                    }
                    await tr.CommitAsync();
                    return user;
                }
            }
        }

        public static async Task<IEnumerable<Models.Users.User>> GetUsersAsync()
        {
            using (DbConnection cn = await DAL.DB.GetConnectionAsync())
            {
                using (DbTransaction tr = cn.BeginTransaction())
                {
                    var users = await DAL.Users.GetUsersAsync(cn, null);
                    // for each user i stavi u user.role = njegove role
                    foreach (var User in users)
                    {
                        var User_Roles = await DAL.UserRoles.GetUserRoleAsync(cn, tr, User.Id_user);
                        foreach (var Role in User_Roles)
                        {
                            User.Role.Add(Helpers.GetEnumDescription(Role.Id_role));
                        }
                    }
                    await tr.CommitAsync();
                    return users;
                }


            }
        }

        public static async Task RemoveUserAsync(string Id_user)
        {
            using (DbConnection cn = await DAL.DB.GetConnectionAsync())
            {
                using (DbTransaction tr = cn.BeginTransaction())
                {
                    await UserRoles.RemoveUserRolesAsync(cn, tr, Id_user);
                    await DAL.Users.RemoveUserAsync(cn, tr, Id_user);
                    await tr.CommitAsync();
                }
            }
        }

        public static async Task<Models.Users.User?> UpdateUserAsync(Models.Users.Requests.RequestUpdateUser user)
        {
            using (DbConnection cn = await DAL.DB.GetConnectionAsync())
            {
                using (DbTransaction tr = cn.BeginTransaction())
                {
                    Models.Users.User UserZaBazu = await DAL.Users.GetUserAsync(cn, tr, user.Id_user);
                    if (UserZaBazu == null) return null;
                    UserZaBazu = user.Adapt<User>();
                    if (user.Password != null)
                    {
                        UserZaBazu.Password_hash = BCrypt.Net.BCrypt.EnhancedHashPassword(user.Password);
                        await DAL.Users.UpdateUserAsync(cn, tr, UserZaBazu);
                    }
                    else
                    {
                        await DAL.Users.UpdateUserWithoutPasswordAsync(cn, tr, UserZaBazu);
                    }


                    await DAL.UserRoles.RemoveUserRolesAsync(cn, tr, user.Id_user);

                    foreach (var Role_name in user.Role)
                    {
                        await DAL.UserRoles.AddUserRoleAsync(cn, tr, new Models.UserRoles.UserRole() { Id_role = Helpers.GetValueFromDescription<Rola>(Role_name), Id_user = UserZaBazu.Id_user });
                    };
                    await tr.CommitAsync();

                    return UserZaBazu;

                }
            }
        }
    }
}
