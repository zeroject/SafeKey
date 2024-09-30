// See https://aka.ms/new-console-template for more information
using Repository;
using Service;

Console.WriteLine("Hello, World!");
string workingPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData));
Directory.CreateDirectory(workingPath + "/PasswordBucket");
string content = Console.ReadLine() ?? "NOTHING";
FileHandler.InitFileHandler(workingPath + "/PasswordBucket");
Encryption encryption = new Encryption();
string filename = encryption.Encrypt(content, "KEY");
Console.WriteLine(workingPath + "/PasswordBucket/" + filename);