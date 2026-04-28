using Kutuphane.WebAPI.DTOs;

namespace Kutuphane.WebAPI.Repositories
{
    public interface IGenelBakisRepository
    {
        int ToplamKitap();
        int KayitliUye();
        int AktifOdunc();
        int GecikenKitap();
        int TumToplamKitap();
        int KategoriSayisi();
        int MusaitKopya();

        List<DTOs.SonEklenenKitapDto> SonEklenenKitaplar();

        List<AktifOduncDto> AktifOduncKitaplar();

        List<TurDto> TurDagilimi();

        List<TumKitaplarDto> TumKitaplar();


        List<ListeVeriDTO> ListeVeri(string tabloAdi, string idKolonAdi, string adKolonAdi);

    }
}
