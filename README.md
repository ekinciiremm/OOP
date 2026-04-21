📚 Kütüphane Yönetim Sistemi (Web API)

   Bu proje, modern yazılım mimarileri ve katmanlı yapı prensipleri kullanılarak geliştirilmiş kapsamlı bir Kütüphane Yönetim Sistemi arka uç (backend) uygulamasıdır.

🚀 Öne Çıkan Özellikler

   Dashboard İstatistikleri: Toplam kitap, üye, aktif ödünç ve geciken kitap verilerinin gerçek zamanlı takibi.

   Gelişmiş Kitap Yönetimi: Kitap ekleme, silme, güncelleme ve benzersiz 13 haneli ISBN üretim mekanizması.

   Dinamik Listeleme: Yazar, Tür ve Yayınevi verileri için merkezi (generic) lookup metotları.

   Ödünç Takibi: Teslim tarihi yaklaşan veya geciken kitaplar için renk kodlu (Kritik/Uyarı/Normal) durum takibi.

🛠️ Kullanılan Teknolojiler & Mimari

   Dil: C# (.NET Core Web API)

   Veritabanı: SQL Server (ADO.NET ile optimize edilmiş sorgular)

   Mimari: Repository Pattern (Veri erişim katmanının iş mantığından ayrılması)

   Tasarım Prensipleri: Interface tabanlı geliştirme, DTO (Data Transfer Object) kullanımı.

   Güvenlik: SQL Injection saldırılarına karşı Parametreli Sorgu yapısı.

   Loglama: Merkezi Logger Service ile hata ve işlem takibi.

📂 Proje Yapısı

   Controllers: API uç noktalarının yönetimi.

   Repositories: Veritabanı CRUD operasyonlarının merkezi yönetimi.

   DTOs: Katmanlar arası veri taşıma nesneleri.

   Services: DbService ve LoggerService gibi ortak yardımcı servisler.

📖 Başlangıç

   Veritabanı bağlantı cümlesini (Connection String) appsettings.json içinde güncelleyin.

   dotnet run komutu ile projeyi ayağa kaldırın.

   /swagger adresine giderek API uç noktalarını test edin.
