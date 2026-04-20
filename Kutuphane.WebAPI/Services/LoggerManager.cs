using Serilog;
using Serilog.Sinks.MSSqlServer;

namespace Kutuphane.WebAPI.Services
{
    public class LoggerManager: ILoggerService
    {
        private string connectionString;

        public LoggerManager(string connectionString)
        {
            this.connectionString = connectionString;
        }

        public void LogInfo(string message)
        {
            Log.Information(message);//bilgilendirme mesajları için kullanılır
        }
        public void LogWarning(string message)
        {
            Log.Warning(message);//uyarı mesajları için kullanılır
        }

        public void LogError(string message)
        {

            Log.Error(message);//hata mesajları için kullanılır.
        }

        public void LogDebug(string message)
        {

            Log.Debug(message);//geliştirme ve hata ayıklama sürecinde kullanılan mesajlar için kullanılır
        }
    }
}
