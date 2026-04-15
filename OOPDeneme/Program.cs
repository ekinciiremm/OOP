using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using OOPDeneme.DbManager;
using OOPDeneme.LoggerManager;
using Serilog;

namespace OOPDeneme
{
    
    class Program
    {
        static ILoggerServices logger;
        static IDbServis servis;

        static void Main(string[] args)
        {



            //Serilog yapılandırması
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .Build();

            string baglanti = configuration.GetConnectionString("DefaultConnection");//appsettings.json dosyasından veritabanı bağlantı cümlesi okunuyor

            
            logger = new OOPDeneme.LoggerManager.Services.LoggerManager(baglanti);//logger sınıfı oluşturuluyor ve bağlantı cümlesi parametre olarak veriliyor

            
            servis = new OOPDeneme.DbManager.DbManager(baglanti);//veritabanı servis sınıfı oluşturuluyor 


            logger.LogInfo("Program başladı.");


            bool secimYap = true;
            Console.WriteLine("Kütüphane Yönetimine Hoşgeldiniz.");

            while (secimYap)
            {
                try
                {

                    Console.WriteLine("\n1- Kitap Ekle");
                    Console.WriteLine("2- Kitap Sil");
                    Console.WriteLine("3- Kitap Ara");
                    Console.WriteLine("4- Kitap Güncelle");
                    Console.WriteLine("5- Kitap Listele");
                    Console.WriteLine("6- İstatistik");
                    Console.WriteLine("7- Stok Kontrol");
                    Console.WriteLine("0- Çıkış");
                    Console.Write("Seçiminiz: ");

                    string secim = Console.ReadLine();


                    switch (secim)
                    {
                        case "1": KitapEkle(); break;
                        case "2": KitapSil(); break;
                        case "3": KitapAra(); break;
                        case "4": KitapGuncelle(); break;
                        case "5": KitapListele(); break;
                        case "6": GenelIstatistikler(); break;
                        case "7": StokKontrol(); break;
                        case "0": secimYap = false; break;

                        default:
                            logger.LogWarning("Geçersiz seçim yapıldı: " + secim);
                            Console.WriteLine("Geçersiz seçim!"); break;
                    }
                }catch(SqlException ex) {
                    logger.LogError("Veritabanı bağlantı hatası! SQL Server kapalı olabilir: " + ex.Message);
                    Console.WriteLine("Sistem şu an veritabanına ulaşamıyor.");
                }
                catch (Exception ex)
                {
                    logger.LogError("Hata oluştu: " + ex.Message);
                    Console.WriteLine("Hata: " + ex.Message);
                }
            }

            Console.WriteLine("Program sonlandırıldı.");
            Log.CloseAndFlush();

        }
            //kitap ekle
            static void KitapEkle()
            {
                try
                {
                    Console.WriteLine("Kitap Adı: ");
                    string ad = Console.ReadLine();
                    Console.WriteLine("Stok Sayısı: ");
                    int stok = int.Parse(Console.ReadLine());
                     Console.WriteLine("ISBN: ");
                     string isbn = Console.ReadLine();

                string sorgu = "insert into Kitaplar (Kitap_adi, Stok_adedi,ISBN, Yayin_evi_id, Tur_id, Yazar_id) values (@kAdi, @sAdedi, @isbn,1,1,1)";

                    var parametre = new List<SqlParameter>//kitap ekleme işlemi için gerekli parametreler oluşturuluyor
                {
                    new SqlParameter("@kAdi", ad),
                    new SqlParameter("@sAdedi", stok),
                    new SqlParameter("@isbn", isbn)
                };

                    servis.ExecuteCommand(sorgu, parametre);//kitap ekleme işlemi gerçekleştiriliyor
                    logger.LogInfo($"Kitap eklendi: {ad} (Stok: {stok})");
                    Console.WriteLine("Kitap  eklendi.");
                }
                catch (FormatException)
                {
                    logger.LogWarning("Kitap ekeleme sırasında hata: ");
                    Console.WriteLine("Hata: Stok sayısı için sayı giriniz.");
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Hata: " + ex.Message);
                }
            }

            //kitap sil
            static void KitapSil()
            {
                try
                {
                    Console.WriteLine("Silinecek Kitap Adı: ");
                    string ad = Console.ReadLine();

                    string sorgu = "delete from Kitaplar where Kitap_adi = @kAdi";

                    var parametre = new List<SqlParameter>
                {
                    new SqlParameter("@kAdi", ad)
                };

                    servis.ExecuteCommand(sorgu, parametre);//kitap silme işlemi gerçekleştiriliyor
                    Console.WriteLine("Kitap silindi.");
                    logger.LogInfo($"Kitap silindi: {ad}");
                }
                catch (Exception ex)
                {
                    logger.LogError("Hata oluştu: " + ex.Message);
                    Console.WriteLine("Hata: " + ex.Message);
                }
            }

            //kitap ara
            static void KitapAra()
            {
                try
                {
                    Console.WriteLine("Aranacak Kitap Adı: ");
                    string ad = Console.ReadLine();

                    string sorgu = "select * from Kitaplar where Kitap_adi LIKE @kAdi";

                    var parametre = new List<SqlParameter>//like operatöründe % kullanarak arama yapılabilir. % herhangi bir karakter dizisini temsil eder.
                {
                    new SqlParameter("@kAdi", "%" + ad + "%")
                };

                    using (SqlDataReader reader = servis.ExecuteReader(sorgu, parametre))
                    {
                        bool bulundu = false;
                        while (reader.Read())
                        {
                            bulundu = true;
                            Console.Write($"Kitap Adı: {reader["Kitap_adi"]} | Stok: {reader["Stok_adedi"]}");
                            logger.LogInfo($"Kitap bulundu: {reader["Kitap_adi"]} (Stok: {reader["Stok_adedi"]})");
                        }

                        if (!bulundu)
                            Console.WriteLine("Kitap bulunamadı.");
                    }
                }
                catch (Exception ex)
                {
                    logger.LogError("Hata oluştu: " + ex.Message);
                    Console.WriteLine("Hata: " + ex.Message);
                }
            }

            static void KitapGuncelle()
            {
                try
                {
                    Console.WriteLine("Güncellenecek Kitap Adı: ");
                    string ad = Console.ReadLine();
                    Console.WriteLine("Yeni Stok Sayısı: ");
                    int stok = int.Parse(Console.ReadLine());

                    string sorgu = "update Kitaplar set Stok_adedi = @sAdedi where Kitap_adi = @kAdi";

                    var parametre = new List<SqlParameter>
                {
                    new SqlParameter("@kAdi", ad),
                    new SqlParameter("@sAdedi", stok)
                };

                    servis.ExecuteCommand(sorgu, parametre);//kitap güncelleme işlemi gerçekleştiriliyor
                    Console.WriteLine("Kitap başarıyla güncellendi.");
                    logger.LogInfo($"Kitap güncellendi: {ad} (Yeni Stok: {stok})");
                }
                catch (FormatException)
                {
                    Console.WriteLine("Hata: Stok sayısı için sayı giriniz.");
                    logger.LogWarning("Stok sayısı için geçersiz format.");
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Hata: " + ex.Message);
                }
            }

            static void KitapListele()
            {
                try
                {
                    string sorgu = "select * from Kitaplar";

                    using (SqlDataReader reader = servis.ExecuteReader(sorgu, null)) 
                    {
                        Console.WriteLine("Listelenecek Kİtaplar");
                        bool kitapVar = false;

                        while (reader.Read())//veritabanından okunan her bir satır için çalışır.
                        {
                            kitapVar = true;
                            Console.WriteLine($"Kitap Adı: {reader["Kitap_adi"]}   | Stok Sayısı: {reader["Stok_adedi"]}");
                            logger.LogInfo($"Kitap listelendi: {reader["Kitap_adi"]} (Stok: {reader["Stok_adedi"]})");
                            //okunan satırdaki kitap adı ve stok sayısı bilgilerini ekrana yazdırır.
                        }
                        if (!kitapVar)
                            Console.WriteLine("Henüz hiç kitap eklenmemiş.");
                    }
                }
                catch (Exception ex)
                {
                    logger.LogError("Hata oluştu: " + ex.Message);
                    Console.WriteLine("Hata:" + ex.Message);
                }
            }

        static void GenelIstatistikler()//sistemdeki kitap sayısı ve toplam stok adedini hesaplar
        {
            try
            {
                string sorgu = "select count(*), sum(Stok_adedi) from Kitaplar ";

                using (SqlDataReader reader= servis.ExecuteReader(sorgu, null))

                {
                    if (reader.Read())
                    {
                        int KitapSayisi = reader.GetInt32(0);
                        int ToplamStok = reader.GetInt32(1);


                        Console.WriteLine($"Sistemdeki Kitap Sayısı:{KitapSayisi} ");
                        Console.WriteLine($"Sistemdeki Kitapların Toplam Stok Adedi: {ToplamStok}");

                        logger.LogInfo($"İstatistik raporu çekildi. Kitap: {KitapSayisi}, Stok: {ToplamStok}");
                    }
                    
                }
            }
            catch (Exception ex) {

                logger.LogError("İstatistik çekilirken hata"+ ex.Message);
                Console.WriteLine("Hata: Bilgiler hesaplanamadı.");
            }
        }


        static void StokKontrol() {//stok adedi 20'nin altında olan kitapları kontrol eder
            try
            {
                string sorgu = "select Kitap_adi, Stok_adedi from Kitaplar where Stok_adedi<20";

                using (SqlDataReader reader = servis.ExecuteReader(sorgu, null))
                {
                    if (reader.Read())
                    {
                        Console.WriteLine($"Düşük stoklu kitap: {reader["Kitap_adi"]} (Stok: {reader["Stok_adedi"]})");
                        logger.LogWarning($"Düşük stok uyarısı: {reader["Kitap_adi"]} (Stok: {reader["Stok_adedi"]})");
                    }
                    else
                    {
                        Console.WriteLine("Tüm kitapların stok adedi yeterli.");
                    }
                    
                }
            }
            catch (Exception ex)
            {
                logger.LogError("Stok kontrolü sırasında hata: " + ex.Message);
                Console.WriteLine("Hata: Stok kontrolü yapılamadı.");
            }     
        }
    }
}