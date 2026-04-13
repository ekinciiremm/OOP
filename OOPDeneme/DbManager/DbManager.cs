using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace OOPDeneme.DbManager
{
    internal class DbManager : IDbServis
    {
        private readonly string baglantiCumlesi =string.Empty;
        public DbManager()
        {
            var yapilandir = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

            IConfiguration config = yapilandir.Build();

    
            baglantiCumlesi = config.GetConnectionString("DefaultConnection");
        }


        public void ExecuteCommand(string query, List<SqlParameter> parameters)//insert, update, delete gibi ExecuteNonQuery ile çalışan komutları çalıştırmak için
        {
            using (SqlConnection connection = new SqlConnection(baglantiCumlesi))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    if (parameters != null) command.Parameters.AddRange(parameters.ToArray());//addrange tüm parametreler sqlcommmand nesnesine tek seferde ekleniyor
                    command.ExecuteNonQuery();
                }
            }
        }

        public SqlDataReader ExecuteReader(string query, List<SqlParameter> parameters = null)
        {
            SqlConnection connection = new SqlConnection(baglantiCumlesi);// yeni veritabanı bağlantısı

            try { 
            connection.Open();//bağlantı açıldı
            SqlCommand command = new SqlCommand(query, connection);//SQL sorgusunu çalıştıracak komut nesnesini oluşturuyor.
            //query → Çalıştırılacak SQL cümlesi connection → Bu komutun hangi bağlantı üzerinden çalışacağını belirtiyor.
            //Yani “bu sorguyu şu bağlantı ile çalıştır” diyor.

            if (parameters != null)
                command.Parameters.AddRange(parameters.ToArray());//addrange tüm parametreler tek sefer ekleniyor

            return command.ExecuteReader(System.Data.CommandBehavior.CloseConnection);

            }
            catch
            {
                connection.Close();//hata olursa bağlantıyı kapat
                throw;
            }
        }













    }
}
