
namespace Service
{
    public class Authentication
    {
        public string GetSecret(string MasterPassword, string Secret)
        {
            var argon2 = new Konscious.Security.Cryptography.Argon2id(System.Text.Encoding.UTF8.GetBytes(Secret));
            argon2.Salt = System.Text.Encoding.UTF8.GetBytes(MasterPassword);
            argon2.DegreeOfParallelism = 8; // number of threads to use
            argon2.MemorySize = 1024 * 1024; // 1 GB
            argon2.Iterations = 4; // number of iterations

            var hashBytes = argon2.GetBytes(32); // length of the hash in bytes
            return Convert.ToBase64String(hashBytes);
        }
    }
}
