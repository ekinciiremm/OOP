using Microsoft.Extensions.Configuration;
using OOPDeneme.LoggerManager.Interfaces;
using Serilog;
using Serilog.Sinks.MSSqlServer;//kütüphane


namespace OOPDeneme.LoggerManager.Services
{
    public class LoggerManager : ILoggerServices
    {
       
        public LoggerManager()//private constructor ile dışarıdan yeni bir instance oluşturulması engelleniyor
{
            var configuration = new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json")
        .Build();

         string connString = configuration.GetConnectionString("DefaultConnection");

            Log.Logger = new LoggerConfiguration()//logger yapılandırması
                .MinimumLevel.Debug()//minimum log seviyesi debug olarak ayarlanır, bu sayede tüm log seviyeleri kaydedilir
                .WriteTo.Console()//loglar konsola yazdırılır
                .WriteTo.File("logs/log-.txt") 
                .WriteTo.MSSqlServer(connectionString: connString, sinkOptions: new MSSqlServerSinkOptions
                {
                    TableName = "Logs",
                    AutoCreateSqlTable = true
                })
                //appsettings.json dosyasından yapılandırma okunur
                .CreateLogger();//loglama işlemi için bir logger nesnesi oluşturulur




            Log.Information("Logger sistemi başlatıldı.");
        }
        public void LogInfo(string message)
        {
               Log.Information(message);//bilgilendirme mesajları için kullanılır
        }
        public void LogWarning(string message)
        {
            Log.Warning(message);//uyarı mesajları için kullanılır
        }

        public void LogError(string message) {

            Log.Error(message);//hata mesajları için kullanılır.
        }

        public void LogDebug(string message) {

            Log.Debug(message);//geliştirme ve hata ayıklama sürecinde kullanılan mesajlar için kullanılır.
        }

    }
}
