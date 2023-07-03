using API.Lib;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Models;
using Models.Errors;
using Models.Users;
using System.Data.Common;
using System.Net;
using System.Runtime.Serialization;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class SessionsController : ControllerBase
    {
        

        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<ActionResult<Models.Sessions.Responses.ResponseSession>> AddSessionAsync(Models.Users.Requests.SessionRequestUser sessionRequestUser)
        {
            
            var user = await ML.Users.GetUserUsernameAsync(sessionRequestUser.Username);



            if (user == null) return StatusCode(StatusCodes.Status400BadRequest, new ErrorResponse { ErrorMessage = "Nije pronađen korisnik sa ovim podacima. Molimo pokušajte ponovo." });

            bool PasswordValid = BCrypt.Net.BCrypt.EnhancedVerify(sessionRequestUser.Password, user.Password_hash);
            if(!PasswordValid) return StatusCode(StatusCodes.Status400BadRequest, new ErrorResponse { ErrorMessage = "Nije pronađen korisnik sa ovim podacima. Molimo pokušajte ponovo." });

            return await ML.Sessions.AddSessionAsync(sessionRequestUser, user);
        }

        // jos jedan login /refresh-token - prima refresh token
        // provjerava u tablici session da taj token i dalje postoji tamo..i ako da
        // vraca nazad isto kao i ovo gore...
        // ako ne..netko je poslao token koji ne postoji!
        [AllowAnonymous]
        [HttpPost("refresh-token")]
        public async Task<ActionResult<Models.Sessions.Responses.ResponseSession>> CheckRTAsync(Models.Sessions.Requests.RequestSession session)
        {
            var CheckRTSession=await ML.Sessions.GetSessionRefreshTokenAsync(session.RefreshToken);
            if (CheckRTSession != null)
            {
                return await ML.Sessions.GetNewAccessTokenAsync(CheckRTSession);
            }
            else
            {
                return StatusCode(StatusCodes.Status400BadRequest, new ErrorResponse { ErrorMessage = "Nije pronađen korisnik sa ovim podacima. Molimo pokušajte ponovo." });
            }
        }

        [AllowAnonymous]
        [HttpPost("Logout")]
        public async Task RemoveSessionAsync(Models.Sessions.Requests.RequestSession session)
        {
            // prima refresh token samo (u objektu..jer smo rekli da secure stvari ne idu u URL-ove)
            // delete taj refresh token iz tablice sessions
            await ML.Sessions.RemoveSessionAsync(session.RefreshToken);
        }
    }
}
