using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public interface IEncryption
    {
        string Encrypt(string content, string Key);
        string Decrypt(string Key);
    }
}
