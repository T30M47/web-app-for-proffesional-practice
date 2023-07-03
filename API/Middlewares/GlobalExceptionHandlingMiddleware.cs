using API.Lib;
using Models.Errors;
using System.Data.Common;
using System.Net;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Xml.Linq;

namespace API.Middlewares
{
    public class GlobalExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;
        public GlobalExceptionHandlingMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                try
                {
                    if (ex is DbException)
                    {
                        // field exception
                        var fieldException = HandleSQLUniqueAndFieldException((DbException)ex, "id");
                        if (fieldException != null)
                        {
                            context.Response.StatusCode = StatusCodes.Status422UnprocessableEntity;
                            await Result(context, fieldException);
                            return;
                        }

                        var fkException = HandleSQLFKException((DbException)ex);
                        if (fkException != null)
                        {
                            context.Response.StatusCode = StatusCodes.Status400BadRequest;
                            await Result(context, fkException);
                            return;
                        }

                    }

                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                    await Result(context, new ErrorResponse() { ErrorMessage = "Došlo je do nepredviđene greške! Molimo prijavite problem." });
                    return;
                }
                catch (Exception)
            {
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                await Result(context, new ErrorResponse() { ErrorMessage = "Došlo je do nepredviđene greške! Molimo prijavite problem." });
                return;
            }
        }

    }

    private async Task Result(HttpContext context, object returnValue)
    {
        context.Response.ContentType = "application/json; charset=utf-8";
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };
        await context.Response.WriteAsync(JsonSerializer.Serialize(returnValue, options));
        }

        internal static ValidatonErrorsResponse? HandleSQLUniqueAndFieldException(DbException exSQL, string PKName)
        {
            Regex UniqueConstraintRegex = new Regex(@"unique constraint ""unique_([a-zA-Z0-9_]+)", RegexOptions.IgnoreCase);
            var match = UniqueConstraintRegex.Matches(exSQL.Message);
            if (match.Count > 0)
                return ValidationError(match[0].Groups[1].Value, "se već nalazi u bazi");

            var pgException = HandlePGDatabaseFieldException(exSQL, PKName);
            if (pgException != null)
            {
                return pgException;
            }
            return null;
        }

        internal static ErrorResponse? HandleSQLFKException(DbException exSQL)
        {
            Regex ForeignKeyRegex = new Regex(@"violates foreign key constraint ""([a-zA-Z0-9_]+)_fkey", RegexOptions.IgnoreCase);

            var match = ForeignKeyRegex.Matches(exSQL.Message);
            if (match.Count > 0)
                return new ErrorResponse() { ErrorMessage = $"Radnja nije dozvoljena jer postoje povezane stavke." };
            return null;
        }

        internal static ValidatonErrorsResponse? HandlePGDatabaseFieldException(DbException exSQL, string PKName)
        {
            // primary key
            Regex UniqueConstraintRegex = new Regex(@$"(.+)_pkey", RegexOptions.IgnoreCase);
            var matches = UniqueConstraintRegex.Matches(exSQL.Message);
            if (matches.Count > 0)
                return ValidationError(PKName, "se već nalazi u bazi");

            // izvuc ime tablice
            Regex tableNameRegex = new Regex(@"table \""(\w+)\""", RegexOptions.IgnoreCase);
            var match = tableNameRegex.Match(exSQL.Message);
            if (match.Success)
            {
                //foreign key
                Regex ForeignKeyRegex = new Regex(@$"{match.Groups[1]}_(.+)_fkey", RegexOptions.IgnoreCase);
                matches = ForeignKeyRegex.Matches(exSQL.Message);
                if (matches.Count > 0)
                    return ValidationError(matches[0].Groups[1].Value, "nije pronađen/a");

                // unique constraint
                UniqueConstraintRegex = new Regex(@$"{match.Groups[1]}_(.+)_key", RegexOptions.IgnoreCase);
                matches = UniqueConstraintRegex.Matches(exSQL.Message);
                if (matches.Count > 0)
                    return ValidationError(matches[0].Groups[2].Value, "se već nalazi u bazi");
            }

            return null;
        }

        internal static ValidatonErrorsResponse ValidationError(string fieldName, params string[] messages)
        {
            var res = new ValidatonErrorsResponse
            {
                Errors = new List<ValidatonErrorResponse>()
            };
            foreach (string message in messages)
            {
                res.Errors.Add(new ValidatonErrorResponse() { FieldName = fieldName, Message = message });
            }
            return res;
        }
    }
}
