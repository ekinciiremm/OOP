using Kutuphane.WebAPI.DTOs;
using Kutuphane.WebAPI.Services;
using Microsoft.Data.SqlClient;

namespace Kutuphane.WebAPI.Repositories
{
    public class UyeRepository : IUyeRepository
    {
        private readonly IDbService _dbService;
        private readonly ILoggerService _loggerService;

        public UyeRepository(IDbService dbService, ILoggerService loggerService)
        {
            _dbService = dbService;
            _loggerService = loggerService;
        }

        // Yeni bir üye ekler
        public bool UyeEkle(UyeIslemleriDTO uye)
        {
            // SADECE DTO'da olan alanları sorguya ekle
            string query = "INSERT INTO Uyeler (Uye_adi, Uye_soyadi, Uye_eposta, Kayit_tarihi, Uye_tc_no, Uye_barkod_no, Uye_tel, Uye_adres, Uye_durumu) " +
                           "VALUES (@ad, @soyad, @ePosta, @kayitTrh, @tcNo, @barkodNo, @telNo, @adres, @uyeDrm)";

            var parametreler = new List<SqlParameter>
    {
        new SqlParameter("@ad", uye.Ad),
        new SqlParameter("@soyad", uye.Soyad),
        new SqlParameter("@ePosta", (object)uye.Eposta ?? DBNull.Value),
        new SqlParameter("@kayitTrh", DateTime.Now),
        new SqlParameter("@tcNo", (object)uye.TcNo ?? DBNull.Value),
        new SqlParameter("@barkodNo", uye.BarkodNo),
        new SqlParameter("@telNo", (object)uye.Telefon ?? DBNull.Value),
        new SqlParameter("@adres", (object)uye.Adres ?? DBNull.Value),
        new SqlParameter("@uyeDrm", uye.Durum)
    };

            try
            {
                _dbService.ExecuteCommand(query, parametreler);
                return true;
            }
            catch (Exception ex)
            {
                _loggerService.LogError($"Hata: {ex.Message}");
                return false;
            }
        }

        // Üyeyi silmeden önce kontrol eder, eğer elinde teslim edilmemiş kitap varsa silme işlemini durdurur ve mesaj döner
        public (bool basari, string mesaj) UyeSilKontrollu(int id)
        {
            //  Üyenin üzerinde iade edilmemiş kitap var mı
            string kontrolSorgusu = "select count(*) from KitapAlmaIslemleri where Uye_id = @id and Iade_tarihi IS NULL";
            var p = new List<SqlParameter> { new SqlParameter("@id", id) };

            int emanetKitapSayisi = 0;

           
            using (var reader = _dbService.ExecuteReader(kontrolSorgusu, p))
            {
                if (reader.Read())
                {
                    emanetKitapSayisi = Convert.ToInt32(reader[0]);
                }
            }

            // Eğer elinde kitap varsa işlemi durdur ve mesaj dön
            if (emanetKitapSayisi > 0)
            {
                return (false, $"Üye silinemez! Elinde teslim edilmemiş {emanetKitapSayisi} adet kitap bulunmaktadır.");
            }

            
            string silSorgu = "update Uyeler set Uye_durumu = 0 where Uye_id = @id";

            try
            {
                _dbService.ExecuteCommand(silSorgu, p);
                return (true, "Üye başarıyla pasif duruma getirildi.");
            }
            catch (Exception ex)
            {
                _loggerService.LogError($"Üye pasifize edilirken hata: {ex.Message}");
                return (false, "Veritabanı işlemi sırasında bir hata oluştu.");
            }
        }

        public string BenzersizUyeKartNoUret()
        {
            string yeniKartNo;
            bool varMi;
            Random rastgele = new Random();
           
            const string karakterler = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

            do
            {
                // 6 haneli rastgele harf/rakam dizisi oluşturuluyor
                var rastgeleKisim = new string(Enumerable.Repeat(karakterler, 6)
                    .Select(s => s[rastgele.Next(s.Length)]).ToArray());

                yeniKartNo = "LIBO-" + rastgeleKisim;

                // Veritabanında bu kart numarası başkasında var mı kontrolü
                varMi = UyeKartNoVarMi(yeniKartNo);

            } while (varMi); // Eğer varsa döngü başa döner, yeni bir tane üretir

            return yeniKartNo;
        }

        // Kart numarasının veritabanında olup olmadığını kontrol eden yardımcı metot
        private bool UyeKartNoVarMi(string kartNo)
        {
            string sorgu = "SELECT COUNT(*) FROM Uyeler WHERE Uye_barkod_no = @no";
            var parametreler = new List<SqlParameter> { new SqlParameter("@no", kartNo) };

            
            using (var reader = _dbService.ExecuteReader(sorgu, parametreler))
            {
                if (reader.Read())
                {
                    return reader.GetInt32(0) > 0;
                }
            }
            return false;
        }


        public List<UyeIslemleriDTO> TumUyeleriGetir()
        {
            var liste = new List<UyeIslemleriDTO>();
            // WHERE SilindiMi = 0 (Eğer üyelere de soft delete yaptıysan eklemelisin)
            string query = "SELECT * FROM Uyeler";

            using (var reader = _dbService.ExecuteReader(query, null))
            {
                while (reader.Read())
                {
                    liste.Add(new UyeIslemleriDTO
                    {
                        Id = Convert.ToInt32(reader["Uye_id"]),
                        BarkodNo = reader["Uye_barkod_no"]?.ToString() ?? "—",
                        Ad = reader["Uye_adi"].ToString(),
                        Soyad = reader["Uye_soyadi"].ToString(),
                        // TC No maskeleme işlemini frontend'de veya burada yapabilirsin
                        TcNo = reader["Uye_tc_no"]?.ToString() ?? "",
                        Telefon = reader["Uye_tel"]?.ToString() ?? "",
                        Eposta = reader["Uye_eposta"]?.ToString() ?? "",
                        KayitTarihi = Convert.ToDateTime(reader["Kayit_tarihi"]),
                        Durum = Convert.ToBoolean(reader["Uye_durumu"])
                    });
                }
            }
            return liste;
        }

        public void UyeDurumGuncelle(int id, string durum)
        {
            // "Aktif" → 1, "Pasif" → 0
            int durumInt = durum == "Aktif" ? 1 : 0;
            string query = "UPDATE Uyeler SET Uye_durumu = @durum WHERE Uye_id = @id";
            var p = new List<SqlParameter>
    {
        new SqlParameter("@durum", durumInt),
        new SqlParameter("@id", id)
    };
            _dbService.ExecuteCommand(query, p);
        }


        // 1. Bilgileri Getirme Metodu
        public UyeIslemleriDTO UyeGetirById(int id)
        {
            string query = "SELECT * FROM Uyeler WHERE Uye_id = @id";
            var p = new List<SqlParameter> { new SqlParameter("@id", id) };

            using (var reader = _dbService.ExecuteReader(query, p))
            {
                if (reader.Read())
                {
                    return new UyeIslemleriDTO

                    {
                       
                        Ad = reader["Uye_adi"].ToString(),
                       Soyad = reader["Uye_soyadi"].ToString(),
                        Eposta = reader["Uye_eposta"].ToString(),
                        TcNo = reader["Uye_tc_no"].ToString(),
                        BarkodNo = reader["Uye_barkod_no"].ToString(),
                        Telefon = reader["Uye_tel"].ToString(),
                        Adres = reader["Uye_adres"].ToString(),
                        
                        
                      
                        Durum = Convert.ToBoolean(reader["Uye_durumu"])
                    };
                }
            }
            return null;
        }

        // 2. Bilgileri Güncelleme Metodu
        public bool UyeGuncelle(int id, UyeIslemleriDTO uye)
        {
            string query = @"UPDATE Uyeler SET 
                        Uye_adi = @ad, Uye_soyadi = @soyad, Uye_eposta = @eposta, 
                        Uye_tc_no = @tc, Uye_tel = @tel, Uye_adres = @adres, 
                        Odunc_limit = @limit, Kara_liste_durumu = @kara 
                    WHERE Uye_id = @id";

            var p = new List<SqlParameter>
    {
        new SqlParameter("@id", id),
        new SqlParameter("@ad", uye.Ad),
        new SqlParameter("@soyad", uye.Soyad),
        new SqlParameter("@eposta", uye.Eposta),
        new SqlParameter("@tc", uye.TcNo),
        new SqlParameter("@tel", uye.Telefon),
        new SqlParameter("@adres", uye.Adres),
        
    };

            try
            {
                _dbService.ExecuteCommand(query, p);
                return true;
            }
            catch { return false; }
        }

        public List<OduncGecmisiDTO> UyeOduncGecmisiGetir(int uyeId)
        {
            var liste = new List<OduncGecmisiDTO>();

            // Kitaplar tablosuyla birleştiriyoruz ki kitabın adını alalım
            string query = @"SELECT k.Kitap_adi, a.Alis_tarihi, a.Iade_tarihi, a.Islem_durumu 
                     FROM KitapAlmaIslemleri a
                     JOIN Kitaplar k ON a.Kitap_id = k.Kitap_id
                     WHERE a.Uye_id = @uyeId 
                     ORDER BY a.Alis_tarihi DESC"; // En son aldığını en üstte gör

            var p = new List<SqlParameter> { new SqlParameter("@uyeId", uyeId) };

            using (var reader = _dbService.ExecuteReader(query, p))
            {
                while (reader.Read())
                {
                    liste.Add(new OduncGecmisiDTO
                    {
                        KitapAdi = reader["Kitap_adi"].ToString(),
                        AlisTarihi = Convert.ToDateTime(reader["Alis_tarihi"]),
                        IadeTarihi = reader["Iade_tarihi"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["Iade_tarihi"]),
                        IslemDurumu = reader["Islem_durumu"].ToString()
                    });
                }
            }
            return liste;
        }
    }
}
