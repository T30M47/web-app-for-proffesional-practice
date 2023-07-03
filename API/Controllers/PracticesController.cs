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
   
    public class PracticesController : ControllerBase
    {
        [Authorize]
        [HttpGet]
        public async Task<IEnumerable<Models.Practices.Practice>> GetAll()
        {
            return await ML.Practices.GetPracticesAsync();
        }

        [Authorize]
        [HttpGet("{Id_practice}")]
        public async Task<Models.Practices.Responses.ResponsePractice> GetPractice(string Id_practice)
        {
            return await ML.Practices.GetPracticeAsync(Id_practice);
        }

        [Authorize]
        [HttpGet("AY")] 
        public async Task<IEnumerable<Models.Practices.Practice>> GetPracticeAY(string Academic_year)
        {
            return await ML.Practices.GetPracticesAYAsync(Academic_year);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Models.Practices.Responses.ResponsePractice>> AddPractice(Models.Practices.Requests.RequestPractice newEditPractice)
        {
            var validationErrors = Lib.ModelValidator.ValidateModel(newEditPractice);
            if (validationErrors != null)
            {
                return StatusCode(StatusCodes.Status422UnprocessableEntity, validationErrors);
            }
            return await ML.Practices.AddPracticeAsync(newEditPractice);
        }

        [Authorize]
        [HttpPut("{Id_practice}")]
        public async Task<ActionResult<Models.Practices.Responses.ResponsePractice>> UpdatePractice(Models.Practices.Requests.RequestPractice newEditPractice)
        {
            var user_id = User.Claims.FirstOrDefault(x => x.Type == "user_id")?.Value;

            var validationErrors = Lib.ModelValidator.ValidateModel(newEditPractice);

            if (User.IsInRole("Student"))
            {
                if (user_id != newEditPractice.Id_student)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, validationErrors);
                }
            }
            
            if (validationErrors != null)
            {
                return StatusCode(StatusCodes.Status422UnprocessableEntity, validationErrors);
            }
            return await ML.Practices.UpdatePracticeAsync(newEditPractice);
        }

        [Authorize(Roles = "Administrator, Profesor, Asistent, Student")]
        [HttpDelete("{Id_practice}")]
        public async Task<ActionResult> RemovePractice(string Id_practice)
        {
            var user_id = User.Claims.FirstOrDefault(x => x.Type == "user_id")?.Value;
            var user_practice = await ML.Practices.GetPracticeAsync(Id_practice);
            if (User.IsInRole("Student"))
            {
                if (user_id != user_practice.Id_student)
                {
                    return StatusCode(StatusCodes.Status403Forbidden);
                }
            }
            await ML.Practices.RemovePracticeAsync(Id_practice);
            return Ok();
        }

    }
}
