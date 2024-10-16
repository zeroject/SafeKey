﻿using System.Security.Cryptography;
using System.Text;
using Repository;

namespace Service
{
    public class Encryption
    {
        public Encryption() { }

        public byte[] CreateIV()
        {
            using (Aes aes = Aes.Create())
            {
                aes.GenerateIV();
                return aes.IV;
            }
        }

        public string[] Decrypt(string key, byte[] IV)
        {
            string[] encryptedStrings = FileHandler.ReadAllFiles();
            if (encryptedStrings.Length == 0)
            {
                Console.WriteLine("No encrypted strings found.");
                return [];
            }
            
            string[] decryptedStrings = new string[encryptedStrings.Length];

            using (Aes aes = Aes.Create())
            {
                aes.Key = Convert.FromBase64String(key);
                aes.IV = IV;

                if (aes.Key.Length != 16 && aes.Key.Length != 24 && aes.Key.Length != 32)
                {
                    throw new ArgumentException("Key must be 16, 24, or 32 bytes long.");
                }

                ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                for (int i = 0; i < encryptedStrings.Length; i++)
                {
                    byte[] encrypted = Convert.FromBase64String(encryptedStrings[i]);

                    try
                    {
                        using (MemoryStream ms = new MemoryStream(encrypted))
                        {
                            using (CryptoStream cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                            {
                                using (StreamReader sr = new StreamReader(cs))
                                {
                                    decryptedStrings[i] = sr.ReadToEnd();
                                }
                            }
                        }
                    }
                    catch (Exception)
                    {
                        Console.WriteLine("Decryption failed. Probably due to wrong key.");
                    }
                }
            }

            return decryptedStrings;
        }

        public void Encrypt(string content, string key, byte[] IV)
        {
            using (Aes aes = Aes.Create())
            {
                aes.Key = Convert.FromBase64String(key);
                aes.IV = IV;

                if (aes.Key.Length != 16 && aes.Key.Length != 24 && aes.Key.Length != 32)
                {
                    throw new ArgumentException("Key must be 16, 24, or 32 bytes long.");
                }

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                try
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        using (CryptoStream cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                        {
                            using (StreamWriter sw = new StreamWriter(cs))
                            {
                                sw.Write(content);
                            }
                        }
                        // Read the contents of the MemoryStream before it is disposed
                        string encryptedContent = Convert.ToBase64String(ms.ToArray());
                        FileHandler.SaveToFile(encryptedContent);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Encryption failed with exception: " + ex.Message);
                }
            }
        }
    }
}
