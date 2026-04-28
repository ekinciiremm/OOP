using Kutuphane.WebAPI.DTOs;
using Kutuphane.WebAPI.Services;
using Microsoft.Data.SqlClient;

namespace Kutuphane.WebAPI.Repositories
{
    public class KitapDuzenleRepository: IKitapDuzenleRepository
    {

        private readonly IDbService _dbService;
        private readonly ILoggerService _loggerService;

        public KitapDuzenleRepository(IDbService dbService, ILoggerService loggerService)
        {
            _dbService = dbService;
            _loggerService = loggerService;
        }


        // Yeni bir kitap ekler
        public bool KitapEkle(KitapEkleDTO kitap)
        {
            if (string.IsNullOrWhiteSpace(kitap.ISBN))
            {
                kitap.ISBN = BenzersizIsbnUret(); 
                _loggerService.LogInfo($"ISBN boş geldi, otomatik üretildi: {kitap.ISBN}");
            }

            string sorgu = "insert into Kitaplar (Kitap_adi, ISBN, Stok_adedi, Yayin_evi_id, Tur_id, Yazar_id) " +
                           "values (@ad, @isbn, @stok, @yayinEviId, @turId, @yazarId)";

            
            var parametreler = new List<SqlParameter>
    {
        new SqlParameter("@ad", kitap.Ad),
        new SqlParameter("@isbn", kitap.ISBN),
        new SqlParameter("@stok", kitap.Stok),
        new SqlParameter("@yayinEviId", kitap.YayinEviId),
        new SqlParameter("@turId", kitap.TurId),
        new SqlParameter("@yazarId", kitap.YazarId)
    };

            try
            {
                
                _dbService.ExecuteCommand(sorgu, parametreler);
                _loggerService.LogInfo($"Kitap başarıyla eklendi: {kitap.Ad}");
                return true;
            }
            catch (Exception ex)
            {
                _loggerService.LogError($"Ekleme sırasında hata: {ex.Message}");
                throw;
               
            }
        }

        // ISBN'in veritabanında var olup olmadığını kontrol ediyor
        private bool IsbnVarMi(string isbn)
        {
            string sorgu = "select count(*) from Kitaplar where ISBN = @isbn";
            var parametreler = new List<SqlParameter> { new SqlParameter("@isbn", isbn) };

            try
            {
                using (var reader = _dbService.ExecuteReader(sorgu, parametreler))
                {
                    if (reader.Read())
                    {
                        return reader.GetInt32(0) > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                _loggerService.LogError("ISBN kontrolü sırasında hata: " + ex.Message);
            }
            return false;
        }

        // Benzersiz bir ISBN numarası üretir
        public string BenzersizIsbnUret()
        {
            string yeniIsbn;
            bool varMi;
            Random rastgele = new Random();

            do
            {
  
                long ortaKisim = (long)(rastgele.NextDouble() * 9000000000L) + 1000000000L;
                yeniIsbn = "978" + ortaKisim.ToString();

                // Veritabanında bu numara daha önce alınmış mı kontrol eder
                varMi = IsbnVarMi(yeniIsbn);

            } while (varMi); // Eğer varsa tekrar üret 

            return yeniIsbn;
        }


        // Verilen ID'ye sahip kitabın bilgilerini günceller
        public bool KitapGuncelle(int id, KitapEkleDTO kitap)
        {
            string sorgu = "update Kitaplar set Kitap_adi = @ad, ISBN = @isbn, Stok_adedi = @stok, Yayin_evi_id = @yayinEviId, Tur_id = @turId, Yazar_id = @yazarId where Kitap_id = @id";

            
                var parametreler = new List<SqlParameter>
    {
        new SqlParameter("@id", id),
        new SqlParameter("@ad", kitap.Ad),
        new SqlParameter("@isbn", kitap.ISBN),
        new SqlParameter("@stok", kitap.Stok),
        new SqlParameter("@yayinEviId", kitap.YayinEviId),
        new SqlParameter("@turId", kitap.TurId),
        new SqlParameter("@yazarId", kitap.YazarId)
    };

            try
            { 
                _dbService.ExecuteCommand(sorgu, parametreler);
                _loggerService.LogInfo($"Kitap başarıyla güncellendi: {kitap.Ad}");
                return true;
            }
            catch (Exception ex)
            {
                _loggerService.LogError($"Güncelleme sırasında hata: {ex.Message}");
                throw;
            }
        }


        // Verilen ID'ye sahip kitabı siler
        public bool KitapSil(int id)
        {
            string sorgu = "delete from Kitaplar where Kitap_id = @id";
            var parametreler = new List<SqlParameter>
            {
                new SqlParameter("@id", id)

            };

            try
            {
                _dbService.ExecuteCommand(sorgu, parametreler);
                _loggerService.LogInfo($"{id} ID'li kitap başarıyla silindi.");
                return true;
            }
            catch (Exception ex)
            {
               
                _loggerService.LogError($"Silme hatası (ID: {id}): {ex.Message}");
                return false;
            }



        }

    }
}
