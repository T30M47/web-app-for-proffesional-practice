using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models;
using Models.Users;
using System.Net;
using System.Runtime.Serialization;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]

    public class RolesController : ControllerBase
    {
        [Authorize]
        [HttpGet]
        public async Task<IEnumerable<Models.Roles.Role>> GetAll()
        {
            return await ML.Roles.GetRolesAsync();
        }

        [Authorize]
        [HttpGet("{Id_role}")]
        public async Task<Models.Roles.Role> GetRole(string Id_role)
        {
            return await ML.Roles.GetRoleAsync(Id_role);
        }

        [Authorize(Roles = "Administrator")]
        [HttpPost]
        public async Task<ActionResult<Models.Roles.Role>> AddRole(Models.Roles.Role role)
        {
            var validationErrors = Lib.ModelValidator.ValidateModel(role);
            if (validationErrors != null)
            {
                return StatusCode(StatusCodes.Status422UnprocessableEntity, validationErrors);
            }
            return await ML.Roles.AddRoleAsync(role);
        }

        [Authorize(Roles = "Administrator")]
        [HttpPut("{Id_role}")]
        public async Task<ActionResult<Models.Roles.Role>> UpdateRole(Models.Roles.Role role)
        {
            var validationErrors = Lib.ModelValidator.ValidateModel(role);
            if (validationErrors != null)
            {
                return StatusCode(StatusCodes.Status422UnprocessableEntity, validationErrors);
            }
            return await ML.Roles.UpdateRoleAsync(role);
        }

        [Authorize(Roles = "Administrator")]
        [HttpDelete("{Id_role}")]
        public async Task RemoveRole(string Id_role)
        {
            await ML.Roles.RemoveRoleAsync(Id_role);
        }

    }
}
