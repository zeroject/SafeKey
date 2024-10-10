
namespace Repository
{
    public class FileHandler
    {
        private static readonly string folderpath = "./encrypted-logins";

        public static void SaveToFile(string content)
        {
            try
            {
                Directory.CreateDirectory(folderpath);
            }
            catch (Exception)
            {
                Console.WriteLine("Directory already exists.");
            }
            Guid guid = Guid.NewGuid();
            string filepath = $"{folderpath}/{guid}.txt";

            using (StreamWriter sw = new StreamWriter(filepath, true))
            {
                sw.WriteLine(content);
            }
        }

        public static string[] ReadAllFiles()
        {
            List<string> passwords = new List<string>();

            if (Directory.Exists(folderpath))
            {
                var files = Directory.GetFiles(folderpath, "*.txt");
                foreach (var file in files)
                {
                    using (StreamReader sr = new StreamReader(file))
                    {
                        string firstLine = sr.ReadLine()!;
                        if (firstLine != null)
                        {
                            passwords.Add(firstLine);
                        }
                    }
                }
            }

            return passwords.ToArray();
        }
    }
}
