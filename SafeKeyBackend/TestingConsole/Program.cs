using System.IO.Pipes;
using System.Text;

class Program
{
    static void Main(string[] args)
    {
        var loginThread = new Thread(() => RunPipe("LoginPipe").GetAwaiter().GetResult());
        var registerThread = new Thread(() => RunPipe("RegisterPipe").GetAwaiter().GetResult());
        var encryptThread = new Thread(() => RunPipe("EncryptPipe").GetAwaiter().GetResult());
        var decryptThread = new Thread(() => RunPipe("DecryptPipe").GetAwaiter().GetResult());

        loginThread.Start();
        registerThread.Start();
        encryptThread.Start();
        decryptThread.Start();

        loginThread.Join();
        registerThread.Join();
        encryptThread.Join();
        decryptThread.Join();
    }

    static async Task RunPipe(string pipeName)
    {
        while (true)
        {
            using (var server = new NamedPipeServerStream(pipeName, PipeDirection.InOut, 1, PipeTransmissionMode.Byte, PipeOptions.Asynchronous))
            {
                Console.WriteLine($"{pipeName} waiting for connection...");
                await server.WaitForConnectionAsync();
                Console.WriteLine($"{pipeName} connected.");

                byte[] buffer = new byte[1024];
                while (true)
                {
                    try
                    {
                        switch (pipeName)
                        {
                            case "RegisterPipe":
                                Register(buffer, server);
                                break;
                            case "LoginPipe":
                                Login(buffer, server);
                                break;
                            case "EncryptPipe":
                                Encrypt(buffer, server);
                                break;
                            case "DecryptPipe":
                                Decrypt(buffer, server);
                                break;
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"{pipeName} error: {ex.Message}");
                        break;
                    }
                }

                server.Close();
                Console.WriteLine($"{pipeName} connection closed. Waiting for new connection...");
            }
        }
    }

    private static async void Register(byte[] buffer, NamedPipeServerStream server)
    {
        int bytesRead = await server.ReadAsync(buffer, 0, buffer.Length);
        string message = Encoding.UTF8.GetString(buffer, 0, bytesRead);
        Console.WriteLine($"Register received from frontend: {message}");
    }

    private static async void Login(byte[] buffer, NamedPipeServerStream server)
    {
        int bytesRead = await server.ReadAsync(buffer, 0, buffer.Length);
        string message = Encoding.UTF8.GetString(buffer, 0, bytesRead);
        Console.WriteLine($"Login received from frontend: {message}");
    }

    private static async void Encrypt(byte[] buffer, NamedPipeServerStream server)
    {
        int bytesRead = await server.ReadAsync(buffer, 0, buffer.Length);
        string message = Encoding.UTF8.GetString(buffer, 0, bytesRead);
        Console.WriteLine($"Encrypt received from frontend: {message}");
    }

    private static async void Decrypt(byte[] buffer, NamedPipeServerStream server)
    {
        int bytesRead = await server.ReadAsync(buffer, 0, buffer.Length);
        string message = Encoding.UTF8.GetString(buffer, 0, bytesRead);
        Console.WriteLine($"Decrypt received from frontend: {message}");
    }
}