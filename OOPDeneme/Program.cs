using Microsoft.Data.SqlClient;
using OOPDeneme.DbManager;
using System;
using System.Collections.Generic;

namespace OOPDeneme
{
    class Program
    {
        static IDbServis servis = new DbManager.DbManager();

        static void Main(string[] args)
        {
            bool secimYap = true;
            Console.WriteLine("Kütüphane Yönetimine Hoşgeldiniz.");

            while (secimYap)
            {
                Console.WriteLine("\n1- Kitap Ekle");
                Console.WriteLine("2- Kitap Sil");
                Console.WriteLine("3- Kitap Ara");
                Console.WriteLine("4- Kitap Güncelle");
                Console.WriteLine("5- Kitap Listele");
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
                    case "0": secimYap = false; break;
                    default: Console.WriteLine("Geçersiz seçim!"); break;
                }
            }
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

                string sorgu = "insert into Kitaplar (Kitap_adi, Stok_adedi) values (@kAdi, @sAdedi)";

                var parametre = new List<SqlParameter>//kitap ekleme işlemi için gerekli parametreler oluşturuluyor
                {
                    new SqlParameter("@kAdi", ad),
                    new SqlParameter("@sAdedi", stok)
                };

                servis.ExecuteCommand(sorgu, parametre);//kitap ekleme işlemi gerçekleştiriliyor
                Console.WriteLine("Kitap  eklendi.");
            }
            catch (FormatException)
            {
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
            }
            catch (Exception ex)
            {
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

                using (SqlDataReader reader = servis.ExecuteReader(sorgu, parametre))//veritabanından veri okuma işlemi için kullanılan SqlDataReader nesnesini oluşturuyor. 
                    //using bloğu, reader nesnesinin iş bittiğinde otomatik olarak kapatılmasını sağlar.
                {
                    bool bulundu = false;
                    while (reader.Read())
                    {
                        bulundu = true;
                        Console.WriteLine($"Kitap Adı: {reader["Kitap_adi"]} | Stok: {reader["Stok_adedi"]}");
                    }

                    if (!bulundu)
                        Console.WriteLine("Kitap bulunamadı.");
                }
            }
            catch (Exception ex)
            {
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
            }
            catch (FormatException)
            {
                Console.WriteLine("Hata: Stok sayısı için sayı giriniz.");
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
                string sorgu="select * from Kitaplar";

                using (SqlDataReader reader = servis.ExecuteReader(sorgu, null)) //veritabanından veri okuma işlemi için kullanılan SqlDataReader nesnesini oluşturuyor.
                {
                    Console.WriteLine("Listelenecek Kİtaplar");
                    bool kitapVar = false;

                        while (reader.Read())//veritabanından okunan her bir satır için çalışır.
                    {
                        kitapVar = true;
                        Console.WriteLine($"Kitap Adı: {reader["Kitap_adi"]}   | Stok Sayısı: {reader ["Stok_adedi"]}");
                        //okunan satırdaki kitap adı ve stok sayısı bilgilerini ekrana yazdırır.
                    }
                    if (!kitapVar)
                        Console.WriteLine("Henüz hiç kitap eklenmemiş.");
                }
            }
            catch (Exception ex) {
                Console.WriteLine("Hata:" +ex.Message);
            }
        }
    }
}