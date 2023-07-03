using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ML.Lib
{
    public class TokenService
    {
        private int ExpirationInSeconds;
        private readonly string secretKey;
        private readonly string issuer;
        private readonly string audience;

        public TokenService(string secretKey, string Issuer, string Audience, int ExpirationInSeconds)
        {
            this.secretKey = secretKey;
            this.issuer = Issuer;
            this.audience = Audience;
            this.ExpirationInSeconds = ExpirationInSeconds;
        }

        public string CreateToken(Models.Users.User user)
        {
            var expiration = DateTime.UtcNow.AddSeconds(this.ExpirationInSeconds);
            var token = CreateJwtToken(
                CreateClaims(user),
                CreateSigningCredentials(),
                expiration
            );
            var tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.WriteToken(token);
        }

        private JwtSecurityToken CreateJwtToken(List<Claim> claims, SigningCredentials credentials, DateTime expiration) =>
            new JwtSecurityToken(this.issuer, this.audience, claims, expires: expiration, signingCredentials: credentials);

        private List<Claim> CreateClaims(Models.Users.User user)
        {
            try
            {
                var claims = new List<Claim>
                {
                     new Claim(JwtRegisteredClaimNames.Sub, this.issuer),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString(CultureInfo.InvariantCulture)),
                    new Claim("user_id", user.Id_user),
                    new Claim("username", user.Username),
                    new Claim("email", user.Email),
                };
                claims.AddRange(user.Role.Select(role => new Claim(ClaimTypes.Role, role)));
                return claims;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
        private SigningCredentials CreateSigningCredentials()
        {
            return new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.secretKey)), SecurityAlgorithms.HmacSha256);
        }
    }
}
