using Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class Encryption : IEncryption
    {
        public Encryption() { }
        public Encryption(string key) { }

        public string Decrypt(string Key)
        {
            string content = FileHandler.ReadAFile();
            // Do the decyption here
            return content;
        }

        public string Encrypt(string content, string Key)
        {
            // Do the encryptio here
            return FileHandler.WriteAFile(content);
        }

        private string CalculateSecret()
        {
            throw new NotImplementedException();
        }
    }
}
