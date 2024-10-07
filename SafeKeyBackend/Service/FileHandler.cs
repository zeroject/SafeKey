
using Domain;

namespace Repository
{
    public static class FileHandler
    {
        private static readonly string folderPath = "../../Logins";

        public static string SaveToFile(string content)
        {
            string filename = Randomizer.RandomString(8);
            using (StreamWriter file = new StreamWriter(Path.Combine(folderPath, filename))) 
            {
                file.Write(content);
            }
            return filename;
        }
        public static string[] ReadFromFile() 
        {
            string[] files = Directory.GetFiles(folderPath);
            string[] contents = new string[files.Length];

            for (int i = 0; i < files.Length; i++)
            {
                contents[i] = File.ReadAllText(files[i]);
            }

            return contents;
        }
    }
}
