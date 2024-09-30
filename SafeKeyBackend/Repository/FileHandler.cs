using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public static class FileHandler
    {
        internal static string folderPath = "";

        public static string WriteAFile(string content)
        {
            string filename = Randomizer.RandomString(12);
            using (StreamWriter file = new StreamWriter(Path.Combine(folderPath, filename))) 
            {
                file.Write(content);
            }
            return filename;
        }
        public static string ReadAFile() 
        {
            return "";
        }
        public static void InitFileHandler(string path)
        {
            folderPath = path;
        }
    }
}
