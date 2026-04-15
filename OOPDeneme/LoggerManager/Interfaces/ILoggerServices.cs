using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOPDeneme.LoggerManager
{
    public interface ILoggerServices
    {
        void LogInfo(string message); //bilgilendirme mesajları için kullanılır
        void LogWarning(string message); //uyarı mesajları için kullanılır.
        void LogError(string message); //hata mesajları için kullanılır.
        void LogDebug(string message); //geliştirme ve hata ayıklama sürecinde kullanılan mesajlar için kullanılır.
    }
}
