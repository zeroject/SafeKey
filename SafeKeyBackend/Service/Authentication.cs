
using System.Text;
using Konscious.Security.Cryptography;

namespace Service
{
    public class Authentication
    {
        public string GetKey(string MasterPassword, string Secret)
        {
            var argon2 = new Argon2id(Encoding.UTF8.GetBytes(Secret));
            argon2.Salt = Encoding.UTF8.GetBytes(MasterPassword);
            argon2.DegreeOfParallelism = 8; // number of threads to use
            argon2.MemorySize = 1024 * 1024; // 1 GB
            argon2.Iterations = 4; // number of iterations

            var hashBytes = argon2.GetBytes(32); // length of the hash in bytes
            return Convert.ToBase64String(hashBytes);
        }
    }
}
