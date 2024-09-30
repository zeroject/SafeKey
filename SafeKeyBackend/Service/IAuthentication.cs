using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public interface IAuthentication
    {
        string Register(string MasterPassowrd);
        bool Login(string MasterPassword, string Secret);
    }
}
