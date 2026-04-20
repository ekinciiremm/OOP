namespace Kutuphane.WebAPI.Services
{
    public interface ILoggerService 
    {
        void LogInfo(string message); //bilgilendirme mesajları için kullanılır
        void LogWarning(string message); //uyarı mesajları için kullanılır.
        void LogError(string message); //hata mesajları için kullanılır.
        void LogDebug(string message); //geliştirme ve hata ayıklama sürecinde kullanılan mesajlar için kullanılır.
    }
}
