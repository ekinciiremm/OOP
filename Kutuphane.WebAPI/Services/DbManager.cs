using Microsoft.Data.SqlClient;

namespace Kutuphane.WebAPI.Services
{
    public class DbManager: IDbService
    {
        private readonly string _baglantiCumlesi;
        private readonly ILoggerService _logger;


        public DbManager(string baglantiCumlesi, ILoggerService logger)
        {
            _baglantiCumlesi = baglantiCumlesi;
            _logger = logger;
        }


        public void ExecuteCommand(string query, List<SqlParameter> parameters)//insert, update, delete gibi ExecuteNonQuery ile çalışan komutları çalıştırmak için
        {
            using (SqlConnection connection = new SqlConnection(_baglantiCumlesi))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    if (parameters != null) command.Parameters.AddRange(parameters.ToArray());//addrange tüm parametreler sqlcommmand nesnesine tek seferde ekleniyor
                    command.ExecuteNonQuery();

                    _logger.LogInfo($"Komut başarıyla çalıştırıldı: {query}");

                }
            }
        }

        public SqlDataReader ExecuteReader(string query, List<SqlParameter> parameters = null)
        {
            SqlConnection connection = new SqlConnection(_baglantiCumlesi);// yeni veritabanı bağlantısı

            try
            {
                connection.Open();//bağlantı açıldı
                SqlCommand command = new SqlCommand(query, connection);//SQL sorgusunu çalıştıracak komut nesnesini oluşturuyor.
                                                                       //query → Çalıştırılacak SQL cümlesi connection → Bu komutun hangi bağlantı üzerinden çalışacağını belirtiyor.
                                                                       //Yani “bu sorguyu şu bağlantı ile çalıştır” diyor.

                if (parameters != null)
                    command.Parameters.AddRange(parameters.ToArray());//addrange tüm parametreler tek sefer ekleniyor

                _logger.LogInfo($"Veri okuma sorgusu başlatıldı.");

                return command.ExecuteReader(System.Data.CommandBehavior.CloseConnection);

            }
            catch(Exception ex)
            {
                connection.Close();//hata olursa bağlantıyı kapat
                _logger.LogError($"Veritabanı okuma hatası: {ex.Message}");
                throw;
               
            }
        }


    }
}
