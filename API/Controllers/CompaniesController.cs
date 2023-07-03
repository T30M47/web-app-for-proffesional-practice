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
    
   public class CompaniesController : ControllerBase
   {
        [Authorize]
        [HttpGet]
        public async Task<IEnumerable<Models.Companies.Company>> GetAll()
        {
            return await ML.Companies.GetCompaniesAsync();
        }

        [Authorize]
        [HttpGet("{Id_company}")]
        public async Task<Models.Companies.Company> GetCompany(string Id_company)
        {
            return await ML.Companies.GetCompanyAsync(Id_company);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Models.Companies.Company>> AddCompany(Models.Companies.Company company)
        {
            var validationErrors = Lib.ModelValidator.ValidateModel(company);
            if (validationErrors != null)
            {
                return StatusCode(StatusCodes.Status422UnprocessableEntity, validationErrors);
            }
            return await ML.Companies.AddCompanyAsync(company);
        }

        [Authorize]
        [HttpPut("{Id_company}")]
        public async Task<ActionResult<Models.Companies.Company>> UpdateCompany(Models.Companies.Company company)
        {
            var validationErrors = Lib.ModelValidator.ValidateModel(company);
            if (validationErrors != null)
            {
                return StatusCode(StatusCodes.Status422UnprocessableEntity, validationErrors);
            }
            return await ML.Companies.UpdateCompanyAsync(company);
        }

        [Authorize(Roles ="Profesor, Administrator, Asistent")]
        [HttpDelete("{Id_company}")]
        public async Task RemoveCompany(string Id_company)
        {
            await ML.Companies.RemoveCompanyAsync(Id_company);
        }


    }
}
