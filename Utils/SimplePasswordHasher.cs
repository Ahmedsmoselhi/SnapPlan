using System.Security.Cryptography;
using System.Text;

namespace SnapPlan.Utils
{
    public static class SimplePasswordHasher
    {
        public static string ComputeSha256(string input)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = Encoding.UTF8.GetBytes(input);
                var hash = sha256.ComputeHash(bytes);
                return Convert.ToBase64String(hash);
            }
        }
    }
}
