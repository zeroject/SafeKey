using System.IO.Pipes;
using System.Text;
using Service;

class Program
{
    private static string? _CurrentKey;
    private static byte[]? _CurrentIV;
    private readonly Authentication _AuthenticationService;
    private readonly Encryption _EncryptionService;

    public Program()
    {
        _AuthenticationService = new Authentication();
        _EncryptionService = new Encryption();
    }

    static void Main(string[] args)
    {
        var programInstance = new Program();
        var loginThread = new Thread(() => programInstance.RunLoginPipe("LoginPipe").GetAwaiter().GetResult());
        var encryptThread = new Thread(() => programInstance.RunEncryptPipe("EncryptPipe").GetAwaiter().GetResult());
        var decryptThread = new Thread(() => programInstance.RunDecryptPipe("DecryptPipe").GetAwaiter().GetResult());
        var registarThread = new Thread(() => programInstance.RunRegistarPipe("RegistarPipe").GetAwaiter().GetResult());
        var logoutThread = new Thread(() => programInstance.RunLogoutPipe("LogoutPipe").GetAwaiter().GetResult());

        loginThread.Start();
        encryptThread.Start();
        decryptThread.Start();
        registarThread.Start();
        logoutThread.Start();

        loginThread.Join();
        encryptThread.Join();
        decryptThread.Join();
        registarThread.Join();
        logoutThread.Join();
    }

    private async Task RunLogoutPipe(string v)
    {
        while (true)
        {
            using (var server = new NamedPipeServerStream("LogoutPipe", PipeDirection.InOut, 1, PipeTransmissionMode.Byte, PipeOptions.CurrentUserOnly))
            {
                Console.WriteLine($"{v} waiting for connection...");
                await server.WaitForConnectionAsync();
                Console.WriteLine($"{v} connected.");
                _CurrentKey = null;
                _CurrentIV = null;
                await server.WriteAsync(Encoding.UTF8.GetBytes("Logout Success"));
            }
        }
    }

    private async Task RunRegistarPipe(string v)
    {
        while (true)
        {
            using (var server = new NamedPipeServerStream("RegistarPipe", PipeDirection.InOut, 1, PipeTransmissionMode.Byte, PipeOptions.CurrentUserOnly))
            {
                Console.WriteLine($"{v} waiting for connection...");
                await server.WaitForConnectionAsync();
                Console.WriteLine($"{v} connected.");
                byte[] iv = _EncryptionService.CreateIV();
                // Create false IV as it also sets it in ram
                _EncryptionService.CreateIV();
                await server.WriteAsync(iv);
            }
        }
    }

    public async Task RunLoginPipe(string pipeName)
    {
        while (true)
        {
            using (var server = new NamedPipeServerStream("LoginPipe", PipeDirection.InOut, 1, PipeTransmissionMode.Byte, PipeOptions.CurrentUserOnly))
            {
                Console.WriteLine($"{pipeName} waiting for connection...");
                await server.WaitForConnectionAsync();
                _CurrentKey = null;
                Console.WriteLine($"{pipeName} connected.");

                byte[] buffer = new byte[1024];
                while (true)
                {
                    try
                    {
                        int bytesRead = await server.ReadAsync(buffer, 0, buffer.Length);
                        string message = Encoding.UTF8.GetString(buffer, 0, bytesRead);

                        if (!string.IsNullOrWhiteSpace(message))
                        {
                            _CurrentKey = _AuthenticationService.GetKey(message.Split(";")[0], message.Split(";")[1]);
                            _CurrentIV = Encoding.ASCII.GetBytes(message.Split(";")[1]);
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"{pipeName} error: {ex.Message}");
                        break;
                    }

                    try
                    {
                        await server.WriteAsync(Encoding.UTF8.GetBytes("Login Success"));
                    }
                    catch (Exception)
                    {
                        break;
                    }

                }
            }
        }
    }

    public async Task RunEncryptPipe(string pipeName)
    {
        while (true)
        {
            using (var server = new NamedPipeServerStream("EncryptPipe", PipeDirection.In, 1, PipeTransmissionMode.Byte, PipeOptions.CurrentUserOnly))
            {
                Console.WriteLine($"{pipeName} waiting for connection...");
                await server.WaitForConnectionAsync();
                Console.WriteLine($"{pipeName} connected.");

                byte[] buffer = new byte[1024];
                try
                {
                    int bytesRead = await server.ReadAsync(buffer, 0, buffer.Length);
                    string message = Encoding.UTF8.GetString(buffer, 0, bytesRead);

                    if (!string.IsNullOrWhiteSpace(message))
                    {
                        _EncryptionService.Encrypt(message, _CurrentKey!, _CurrentIV!);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"{pipeName} error: {ex.Message}");
                    break;
                }

                Console.WriteLine($"{pipeName} ran and closed connection.");
            }
        }
    }

    public async Task RunDecryptPipe(string pipeName)
    {
        while (true)
        {
            using (var server = new NamedPipeServerStream("DecryptPipe", PipeDirection.Out, 1, PipeTransmissionMode.Byte, PipeOptions.CurrentUserOnly))
            {
                Console.WriteLine($"{pipeName} waiting for connection...");
                await server.WaitForConnectionAsync();
                Console.WriteLine($"{pipeName} connected.");

                byte[] buffer = new byte[1024];

                try
                {
                    if (!string.IsNullOrWhiteSpace(_CurrentKey))
                    {
                        string[] decryptedStringArray = _EncryptionService.Decrypt(_CurrentKey, _CurrentIV!);
                        string decryptedStrings = string.Join(":", decryptedStringArray);

                        await server.WriteAsync(Encoding.UTF8.GetBytes(decryptedStrings));
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"{pipeName} error: {ex.Message}");
                }
            }

            Console.WriteLine($"{pipeName} ran and closed connection. Waiting for new connection...");
        }
    }
}