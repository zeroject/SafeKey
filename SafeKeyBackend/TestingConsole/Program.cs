using System.IO.Pipes;
using System.Text;

class Program
{
    static async Task Main(string[] args)
    {
        var server = new NamedPipeServerStream("SafeKeyBackendPipe", PipeDirection.InOut, 1, PipeTransmissionMode.Byte, PipeOptions.Asynchronous);

        Console.WriteLine("Waiting for connection...");
        await server.WaitForConnectionAsync();
        Console.WriteLine("Connected!");

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