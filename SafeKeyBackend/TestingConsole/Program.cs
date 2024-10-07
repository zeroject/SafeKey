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
                    catch (Exception ex)
                    {
                        Console.WriteLine($"{pipeName} error: {ex.Message}");
                        break; // Exit the inner loop on error
                    }
                }

                server.Close();
                Console.WriteLine($"{pipeName} connection closed. Waiting for new connection...");
            }
        }
    }
}