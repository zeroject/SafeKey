
using Domain;

namespace Repository
{
    public class FileHandler
    {
        private static readonly string filepath = "./logins.txt";

        public static void SaveToFile(string content)
        {
            using (StreamWriter sw = new StreamWriter(filepath, true))
            {
                sw.WriteLine(content);
            }
        }
        public static string[] ReadFromFile() 
        {
            return File.ReadAllLines(filepath);
        }
    }
}
