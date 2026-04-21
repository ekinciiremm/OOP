using Kutuphane.WebAPI.DTOs;
using Kutuphane.WebAPI.Services;

namespace Kutuphane.WebAPI.Repositories
{
    public class GenelBakisRepository : IGenelBakisRepository
    {
        private readonly IDbService _dbService;
        private readonly ILoggerService _loggerService;

        public GenelBakisRepository(IDbService dbService, ILoggerService loggerService)
        {
            _dbService = dbService;
            _loggerService = loggerService;
        }

        // Verilen sorguyu çalıştırır ve sonuç olarak tek bir sayı döner
        private int ExecuteCount(string query)
        {

            try
            {
                using (var reader = _dbService.ExecuteReader(query))
                {
                    if (reader.Read())
                    {
                        return reader.GetInt32(0);
                    }
                }
            }
            catch (Exception ex)
            {
                
                 _loggerService.LogError($"Hata: {ex.Message}. Sorgu: {query}");
            }
            return 0;
        }


        // Verilen tablo adı ve kolon adlarına göre liste verisi döner
       public List<ListeVeriDTO> ListeVeri(string tabloAdi, string idKolonAdi, string adKolonAdi)
        {
            var listeVeri = new List<ListeVeriDTO>();
            string query = $"select {idKolonAdi}, {adKolonAdi} from {tabloAdi}";

            try
            {
                using (var reader= _dbService.ExecuteReader(query))
                {
                    while (reader.Read())
                    {
                        var veri = new ListeVeriDTO
                        {
                            Id = reader.GetInt32(0),
                            Ad = reader.GetString(1),
                            
                        };
                        listeVeri.Add(veri);
                    }
                    
                }
               return listeVeri;
            } catch (Exception ex)
            {
                _loggerService.LogError($"Hata: {ex.Message}. Sorgu: {query}");
                return new List<ListeVeriDTO>();
            }
       
        }
        public int ToplamKitap()
        {
            int toplamKitap = ExecuteCount("select count(*) from Kitaplar");
            return toplamKitap;
        }

       
        public int KayitliUye()
        {
            int kayitliUye = ExecuteCount("select count(*) from Uyeler");
            return kayitliUye;
        }

        public int AktifOdunc()
        {
            int aktifOdunc = ExecuteCount("select count(*) from dbo.KitapAlmaİslemleri where Islem_durumu = 'Aktif'");
            return aktifOdunc;
        }
            
        

        public int GecikenKitap()
        {
            int gecikenKitap = ExecuteCount("select count(*) FROM dbo.KitapAlmaİslemleri where Islem_durumu = 'Gecikmiş'");
            return gecikenKitap;
       
        }


        //Son eklenen 5 kitabı listeler
        public List<DTOs.SonEklenenKitapDto> SonEklenenKitaplar()
        {
            try
            {
                var sonEklenenKitaplar = new List<DTOs.SonEklenenKitapDto>();

                using (var reader = _dbService.ExecuteReader("select top 5 Kitap_adi, Stok_adedi from Kitaplar order by Kitap_id desc"))
                {

                    while (reader.Read())
                    {
                        var kitap = new DTOs.SonEklenenKitapDto
                        {
                            Ad = reader.GetString(0),
                            Stok = reader.GetInt32(1),
                            Durum = reader.GetInt32(1) > 0 ? "Stokta" : "Stokta Yok"
                        };
                        sonEklenenKitaplar.Add(kitap);
                    }
                }
                return sonEklenenKitaplar;
            }
            catch (Exception ex)
            {
                _loggerService.LogError($"Hata: {ex.Message}. Sorgu: select top 5 Kitap_adi, Stok_adedi from Kitaplar order by Kitap_id desc");
                return new List<DTOs.SonEklenenKitapDto>();
            }

        }

        // Aktif ödünç alınan kitapları listeler
        public List<AktifOduncDto> AktifOduncKitaplar()
        {
            var oduncKitaplar = new List<AktifOduncDto>();
            string query = @"SELECT K.Kitap_adi,  (U.Uye_adi + ' ' + U.Uye_soyadi) AS UyeAd, 
            I.Alis_tarihi from KitapAlmaİslemleri I join Kitaplar K on I.Kitap_id = K.Kitap_id join Uyeler U on I.Uye_id = U.Uye_id  where I.Islem_durumu = 'Aktif'";


            try
            {
                using (var reader = _dbService.ExecuteReader(query))
                {
                    while (reader.Read())
                    {

                        DateTime alisTarihi = Convert.ToDateTime(reader["Alis_tarihi"]);
                        int gecenGun = (DateTime.Now - alisTarihi).Days;
                        string durumRengi;

                        if (gecenGun > 30)
                        {
                            durumRengi = "Kritik";
                        }
                        else if (gecenGun >= 25)
                        {
                            durumRengi = "Uyarı";
                        }
                        else
                        {
                            durumRengi = "Normal";
                        }

                        var odunc = new AktifOduncDto
                        {
                            KitapAd = reader["Kitap_adi"].ToString(),
                            UyeAd = reader["UyeAd"].ToString(),
                            Sure = $"{gecenGun} gün",
                            Durum = durumRengi
                        };
                        oduncKitaplar.Add(odunc);
                    }
                }
            }
            catch (Exception ex)
            {
                _loggerService.LogError("Hata: " + ex.Message);
                throw;
            }
            return oduncKitaplar;
        }


        // Kitap türlerinin dağılımını listeler
        public List<TurDto> TurDagilimi()
        {
            var turDagilimi = new List<TurDto>();

            string query = "select KT.TurAdi, count(K.Kitap_id) as KitapSayisi from Kitaplar K join KitapTurleri KT on K.Tur_id = KT.Tur_id group by KT.TurAdi order by KitapSayisi desc";

            try
            {
                using (var reader = _dbService.ExecuteReader(query))
                {
                    while (reader.Read())
                    {
                        var tur = new TurDto
                        {
                            TurAd = reader["TurAdi"].ToString(),
                            Adet = Convert.ToInt32(reader["KitapSayisi"])
                        };
                        turDagilimi.Add(tur);
                    }
                }


            }
            catch (Exception ex) { 
                _loggerService.LogError($"Hata: {ex.Message}. Sorgu: {query}");
            }

            return turDagilimi;
        }


        // Tüm kitapları listeler
        public List<TumKitaplarDto> TumKitaplar()
        {
            var tumKitaplar = new List<TumKitaplarDto>();
            string query = "select K.Kitap_adi, K.ISBN, K.Stok_adedi,Ye.Yayin_evi_adi, KT.TurAdi,  (Y.Yazar_ad + ' ' + Y.Yazar_soyad) AS Yazar" +
                " from Kitaplar K join Yazarlar Y on K.Yazar_id = Y.Yazar_id join KitapTurleri KT on " +
                "K.Tur_id = KT.Tur_id  join YayinEvleri Ye on K.Yayin_evi_id = Ye.Yayin_evi_id";

            try
            {
                using (var reader = _dbService.ExecuteReader(query))
                {
                    while (reader.Read())
                    {
                        var kitap = new TumKitaplarDto
                        {
                            Ad = reader["Kitap_adi"].ToString(),
                            ISBN = reader["ISBN"].ToString(),
                            Stok = Convert.ToInt32(reader["Stok_adedi"]),
                            YayinEvi = reader["Yayin_evi_adi"].ToString(),
                            Tur = reader["TurAdi"].ToString(),
                            Yazar = reader["Yazar"].ToString()
                        };
                        tumKitaplar.Add(kitap);
                    }

                }
            }
            catch (Exception ex)
            {

                _loggerService.LogError($"Hata: {ex.Message}. Sorgu: {query}");
                return new List<TumKitaplarDto>();
            }
            return tumKitaplar;
        }
    }
}
