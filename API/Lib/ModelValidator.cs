using Models.Errors;
using System.ComponentModel.DataAnnotations;

namespace API.Lib
{
    public class ModelValidator
    {
        public static ValidatonErrorsResponse? ValidateModel<T>(T obj)
        {
            ValidatonErrorsResponse? res = null;

            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            var context = new ValidationContext(obj, serviceProvider: null, items: null);
            List<ValidationResult> validationResults = new List<ValidationResult>();

            if (!Validator.TryValidateObject(obj, context, validationResults, true))
            {
                if (validationResults.Count > 0)
                {
                    res = new ValidatonErrorsResponse();
                    foreach (ValidationResult item in validationResults)
                    {
                        res.Errors.Add(new ValidatonErrorResponse() { FieldName = item.MemberNames.ToList()[0], Message = item.ErrorMessage });
                    }
                }
            }
            return res;
        }
    }
}
