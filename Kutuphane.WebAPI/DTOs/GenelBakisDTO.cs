namespace Kutuphane.WebAPI.DTOs
{
    public class GenelBakisDTO
    {
        public int ToplamKitap { get; set; }
        public int KayitliUye { get; set; }
        public int AktifOdunc { get; set; }
        public int GecikenKitap { get; set; }

        public List<SonEklenenKitapDto> SonEklenenKitaplar { get; set; }
        public List<AktifOduncDto> AktifOduncListesi { get; set; }

        public List<TumKitaplarDto> TumKitaplar { get; set; }

        public List<TurDto> TumTurler { get; set; }

        public List<YazarDto> TumYazarlar { get; set; }
    }


    public class YazarDto
    {
        public string YazarAd { get; set; }
    }

    public class TurDto
    {
        public string TurAd { get; set; }
        public int Adet { get; set; }
    }
    public class TumKitaplarDto
    {
        public string Ad { get; set; }
        public string ISBN { get; set; }
        public int Stok { get; set; }
        public string YayinEvi { get; set; }
        public string Tur { get; set; }
        public string Yazar { get; set; }
    }
    public class SonEklenenKitapDto
    {
        public string Ad { get; set; }
        public int Stok { get; set; }
     
        public string Durum { get; set; }
     
    }

    public class AktifOduncDto
    {
        public string KitapAd { get; set; }
        public string UyeAd { get; set; }
        public string Sure { get; set; }

        public string Durum { get; set; }
    }
}
