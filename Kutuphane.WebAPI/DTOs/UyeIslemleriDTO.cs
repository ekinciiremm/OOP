namespace Kutuphane.WebAPI.DTOs
{
    public class UyeIslemleriDTO
    {
        // Kimlik Bilgileri
        public int Id { get; set; }
        public string Ad { get; set; }
        public string Soyad { get; set; }

        public string TcNo { get; set; }
        public string BarkodNo { get; set; }

        // İletişim Bilgileri
        public string Eposta { get; set; }
        public string Telefon { get; set; }
        public string Adres { get; set; }
        public DateTime KayitTarihi { get; set; }
      
        public bool Durum { get; set; }
    }
}
