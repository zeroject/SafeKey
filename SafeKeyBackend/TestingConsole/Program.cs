using System.IO.Pipes;
using System.Text;

class Program
{
    static async Task Main(string[] args)
    {
        var loginPipe = new NamedPipeServerStream("LoginPipe", PipeDirection.InOut, 1, PipeTransmissionMode.Byte, PipeOptions.Asynchronous);
        var registerPipe = new NamedPipeServerStream("RegisterPipe", PipeDirection.InOut, 1, PipeTransmissionMode.Byte, PipeOptions.Asynchronous);
        var encryptPipe = new NamedPipeServerStream("EncryptPipe", PipeDirection.InOut, 1, PipeTransmissionMode.Byte, PipeOptions.Asynchronous);
        var decryptPipe = new NamedPipeServerStream("DecryptPipe", PipeDirection.InOut, 1, PipeTransmissionMode.Byte, PipeOptions.Asynchronous);

        var loginThread = new Thread(() => RunLoginPipe(loginPipe).GetAwaiter().GetResult());
        var registerThread = new Thread(() => RunRegisterPipe(registerPipe).GetAwaiter().GetResult());
        var encryptThread = new Thread(() => RunEncryptPipe(encryptPipe).GetAwaiter().GetResult());
        var decryptThread = new Thread(() => RunDecryptPipe(decryptPipe).GetAwaiter().GetResult());

        loginThread.Start();
        registerThread.Start();
        encryptThread.Start();
        decryptThread.Start();

        loginThread.Join();
        registerThread.Join();
        encryptThread.Join();
        decryptThread.Join();
    }

    static async Task RunLoginPipe(NamedPipeServerStream server)
    {
        Console.WriteLine("Waiting for connection...");
        server.WaitForConnection();
        while (true)
        {
            await Task.Run(async () =>
            {
                byte[] buffer = new byte[1024];
                while (true)
                {
                    int bytesRead = await server.ReadAsync(buffer, 0, buffer.Length);
                    if (bytesRead == 0)
                    {
                        break;
                    }

                    string message = Encoding.UTF8.GetString(buffer, 0, bytesRead);
                    Console.WriteLine("Received from frontend: " + message);
                }
            });
        }
    }

    static async Task RunRegisterPipe(NamedPipeServerStream server)
    {
        Console.WriteLine("Waiting for connection...");
        server.WaitForConnection();
        while (true)
        {
            await Task.Run(async () =>
            {
                byte[] buffer = new byte[1024];
                while (true)
                {
                    int bytesRead = await server.ReadAsync(buffer, 0, buffer.Length);
                    if (bytesRead == 0)
                    {
                        break;
                    }

                    string message = Encoding.UTF8.GetString(buffer, 0, bytesRead);
                    Console.WriteLine("Received from frontend: " + message);
                }
            });
        }
    }

    static async Task RunEncryptPipe(NamedPipeServerStream server)
    {
        Console.WriteLine("Waiting for connection...");
        server.WaitForConnection();
        while (true)
        {
            await Task.Run(async () =>
            {
                byte[] buffer = new byte[1024];
                while (true)
                {
                    int bytesRead = await server.ReadAsync(buffer, 0, buffer.Length);
                    if (bytesRead == 0)
                    {
                        break;
                    }

                    string message = Encoding.UTF8.GetString(buffer, 0, bytesRead);
                    Console.WriteLine("Received from frontend: " + message);
                }
            });
        }
    }

    static async Task RunDecryptPipe(NamedPipeServerStream server)
    {
        Console.WriteLine("Waiting for connection...");
        server.WaitForConnection();
        while (true)
        {
            await Task.Run(async () =>
            {
                byte[] buffer = new byte[1024];
                while (true)
                {
                    int bytesRead = await server.ReadAsync(buffer, 0, buffer.Length);
                    if (bytesRead == 0)
                    {
                        break;
                    }

                    string message = Encoding.UTF8.GetString(buffer, 0, bytesRead);
                    Console.WriteLine("Received from frontend: " + message);
                }
            });
        }
    }
}