using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Repository
{
    public static class Randomizer
    {
        public static string RandomString(int length) 
        {
            if (length < 0) 
                throw new ArgumentOutOfRangeException("length");
            StringBuilder sb = new StringBuilder();
            byte[] bytes = new byte[length];

            Random random = new Random();
            for (int i = 0; i < length; i++)
            {
                bytes[i] = (byte)random.Next();
            }
            sb.Append(Convert.ToBase64String(bytes));
            string notscaped =  sb.ToString();
            return EscapeString(notscaped);
        }

        public static string EscapeString(string input)
        {
            return Regex.Replace(input, @"([.*+?^${}()|\[\]\\])", @"\$1");
        }
    }
}
