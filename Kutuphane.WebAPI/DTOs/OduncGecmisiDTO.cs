namespace Kutuphane.WebAPI.DTOs
{
    public class OduncGecmisiDTO
    {
        public string KitapAdi { get; set; }
        public DateTime AlisTarihi { get; set; }
        public DateTime? IadeTarihi { get; set; } // Henüz iade edilmemiş olabilir (NULL)
        public string IslemDurumu { get; set; }
    }
}
