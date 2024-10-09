using System.Security.Cryptography;
using System.Text;
using Repository;

namespace Service
{
    public class Encryption
    {
        public Encryption() { }
        public Encryption(string key) { }

        public string[] Decrypt(string Key)
        {
            string[] encryptedContent = FileHandler.ReadFromFile();
            List<string> decryptedContent = new List<string>();

            using (Aes aesAlg = Aes.Create())
            {
                var keyBytes = Encoding.UTF8.GetBytes(Key);
                Array.Resize(ref keyBytes, aesAlg.Key.Length);
                aesAlg.Key = keyBytes;

                foreach (var encryptedText in encryptedContent)
                {
                    var fullCipher = Convert.FromBase64String(encryptedText);
                    var iv = new byte[aesAlg.BlockSize / 8];
                    var cipherText = new byte[fullCipher.Length - iv.Length];

                    Array.Copy(fullCipher, iv, iv.Length);
                    Array.Copy(fullCipher, iv.Length, cipherText, 0, cipherText.Length);

                    aesAlg.IV = iv;

                    using (var decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV))
                    using (var msDecrypt = new MemoryStream(cipherText))
                    using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    using (var srDecrypt = new StreamReader(csDecrypt))
                    {
                        decryptedContent.Add(srDecrypt.ReadToEnd());
                    }
                }
            }

            return decryptedContent.ToArray();
        }

        public void Encrypt(string content, string Key)
        {
            using (Aes aesAlg = Aes.Create())
            {
                var keyBytes = Encoding.UTF8.GetBytes(Key);
                Array.Resize(ref keyBytes, aesAlg.Key.Length);
                aesAlg.Key = keyBytes;

                aesAlg.GenerateIV();
                var iv = aesAlg.IV;

                using (var encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV))
                using (var msEncrypt = new MemoryStream())
                {
                    msEncrypt.Write(iv, 0, iv.Length);
                    using (var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    using (var swEncrypt = new StreamWriter(csEncrypt))
                    {
                        swEncrypt.Write(content);
                    }

                    var encryptedContent = msEncrypt.ToArray();
                    FileHandler.SaveToFile(Convert.ToBase64String(encryptedContent));
                }
            }
        }
    }
}
