using API.Lib;
using API.Middlewares;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ML.Lib;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// read configuration
builder.Configuration.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName.ToLower()}.json");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ClockSkew = TimeSpan.Zero,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration.GetSection("Authentication").GetSection("JWT").GetSection("Issuer").Value,
            ValidAudience = builder.Configuration.GetSection("Authentication").GetSection("JWT").GetSection("Audience").Value,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("Authentication").GetSection("JWT").GetSection("SecretKey").Value!)),
        };
    });

// ne dozvoljavamo automatsku validaciju modela jer ne zelimo magiju :D
builder.Services.Configure<ApiBehaviorOptions>(options => options.SuppressModelStateInvalidFilter = true);

// cors policy
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("NasReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
        .AllowAnyHeader()
        .AllowCredentials()
        .AllowAnyMethod();
    });
});

ML.Sessions.Init(builder.Configuration.GetSection("Authentication").GetSection("JWT").GetSection("SecretKey").Value!, 
                 builder.Configuration.GetSection("Authentication").GetSection("JWT").GetSection("Issuer").Value!,
                 builder.Configuration.GetSection("Authentication").GetSection("JWT").GetSection("Audience").Value!,
                 Convert.ToInt32(builder.Configuration.GetSection("Authentication").GetSection("JWT").GetSection("ExpirationInSeconds").Value));

// Init sessions with token parameters

var app = builder.Build();

try
{
    //runnamo migracije
    await DAL.DB.Init(builder.Configuration.GetConnectionString("DefaultConnection")!);

    //dodajemo prvog admin usera ako ne posoji ni jedan user
    await ML.Users.AddAdminIfUsersEmptyAsync();
}
catch (Exception ex)
{
    var userForegroundColor = Console.ForegroundColor;
    Console.ForegroundColor = ConsoleColor.Yellow;
    Console.WriteLine($"Greška prilikom migracija: {ex.Message}");
    Console.ForegroundColor = userForegroundColor;
    Console.WriteLine($"\nStackTrace ---\n{ex.StackTrace}");
    Console.ReadLine();
    return;
}

// Configure the HTTP request pipeline.

app.UseCors("NasReactApp");


app.UseHttpsRedirection();

app.UseAuthorization();

app.UseMiddleware<GlobalExceptionHandlingMiddleware>();

app.MapControllers();

app.Run();
