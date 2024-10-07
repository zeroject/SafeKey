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

        var loginThread = new Thread(() => RunPipe(loginPipe, "Login Pipe").GetAwaiter().GetResult());
        var registerThread = new Thread(() => RunPipe(registerPipe, "Register Pipe").GetAwaiter().GetResult());
        var encryptThread = new Thread(() => RunPipe(encryptPipe, "Encrypt Pipe").GetAwaiter().GetResult());
        var decryptThread = new Thread(() => RunPipe(decryptPipe, "Decrypt Pipe").GetAwaiter().GetResult());

        loginThread.Start();
        registerThread.Start();
        encryptThread.Start();
        decryptThread.Start();

        loginThread.Join();
        registerThread.Join();
        encryptThread.Join();
        decryptThread.Join();
    }

    static async Task RunPipe(NamedPipeServerStream server, string pipeName)
    {
        Console.WriteLine($"{pipeName} waiting for connection...");
        await server.WaitForConnectionAsync();
        Console.WriteLine($"{pipeName} connected.");

        byte[] buffer = new byte[1024];
        while (true)
        {
            int bytesRead = await server.ReadAsync(buffer, 0, buffer.Length);
            if (bytesRead == 0)
            {
                break; // Connection closed
            }

            string message = Encoding.UTF8.GetString(buffer, 0, bytesRead);
            Console.WriteLine($"{pipeName} received from frontend: {message}");

            // Optionally, you can send a response back to the frontend
            string response = $"{pipeName} received your message: {message}";
            byte[] responseBytes = Encoding.UTF8.GetBytes(response);
            await server.WriteAsync(responseBytes, 0, responseBytes.Length);
            await server.FlushAsync();
        }

        server.Close();

    }
}