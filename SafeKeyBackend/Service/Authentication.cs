﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class Authentication : IAuthentication
    {
        public bool Login(string MasterPassword, string Secret)
        {
            throw new NotImplementedException();
        }

        public string Register(string MasterPassowrd)
        {
            return GetSecret(MasterPassowrd);
        }

        private string GetSecret(string MasterPassword)
        {
            return "Secret for " + MasterPassword;
        }
    }
}
