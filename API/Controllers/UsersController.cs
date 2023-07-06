using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models;
using Models.Users.Requests;
using System.Net;
using System.Runtime.Serialization;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]

    public class UsersController : ControllerBase
    {
        [Authorize]
        [HttpGet]
        public async Task<IEnumerable<Models.Users.Responses.ResponseUser>> GetAll()
        {
            var users = await ML.Users.GetUsersAsync();
            return users.Adapt<IEnumerable<Models.Users.Responses.ResponseUser>>();
        }

        [Authorize]
        [HttpGet("{Id_user}")]
        public async Task<Models.Users.Responses.ResponseUser?> GetUser(string Id_user)
        {
            var user = await ML.Users.GetUserAsync(Id_user);
            return user?.Adapt<Models.Users.Responses.ResponseUser>();
        }

        [Authorize(Roles = "Administrator")]
        [HttpPost]
        public async Task<ActionResult<Models.Users.Responses.ResponseUser>> AddUser(Models.Users.Requests.RequestUser user)
        {
            var validationErrors = Lib.ModelValidator.ValidateModel(user);
            if (validationErrors != null)
            {
                return StatusCode(StatusCodes.Status422UnprocessableEntity, validationErrors);
            }
            var User = await ML.Users.AddUserAsync(user);
            return User.Adapt<Models.Users.Responses.ResponseUser>();
        }

        [Authorize]
        [HttpPut("{Id_user}")]
        public async Task<ActionResult<Models.Users.Responses.ResponseUser?>> UpdateUser(Models.Users.Requests.RequestUpdateUser user)
        {
            var user_id = User.Claims.FirstOrDefault(x => x.Type == "user_id")?.Value;
            //var user_id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            

            var validationErrors = Lib.ModelValidator.ValidateModel(user);
            if (validationErrors != null)
            {
                return StatusCode(StatusCodes.Status422UnprocessableEntity, validationErrors);
            }

            if (User.IsInRole("Student"))
            {
                if (user_id != user.Id_user)
                {
                    return StatusCode(StatusCodes.Status403Forbidden);
                }
            }
            var trenutniKorisnik = await ML.Users.GetUserAsync(user.Id_user);
            if (!User.IsInRole("Administrator"))
            {
                if(trenutniKorisnik != null && !trenutniKorisnik.Role.SequenceEqual(user.Role)) 
                {
                    return StatusCode(StatusCodes.Status403Forbidden);
                }
            }
            // da li user smije updateati samo sebe?
            // ako da ..provjeri da li je user kojeg je poslao njegov user_id..
            // ako nije odfikari ga ca..

            if (user.Password != null)
            {
                var PasswordCheck = new Models.Users.UserPasswordValidation() { Password = user.Password };
                var validationPasswordErrors = Lib.ModelValidator.ValidateModel(PasswordCheck);
                if (validationPasswordErrors != null)
                {
                    return StatusCode(StatusCodes.Status422UnprocessableEntity, validationPasswordErrors);
                }
            }
            //  Lib.ModelValidator.ValidateModel(new PasswordValidationObject() {.Password = user.password})



            var UserZaBazu = await ML.Users.UpdateUserAsync(user);
            return UserZaBazu?.Adapt<Models.Users.Responses.ResponseUser>();
        }

        [Authorize(Roles = "Administrator, Profesor")]
        [HttpDelete("{Id_user}")]
        public async Task RemoveUser(string Id_user)
        {
            await ML.Users.RemoveUserAsync(Id_user);
        }

    }
}
