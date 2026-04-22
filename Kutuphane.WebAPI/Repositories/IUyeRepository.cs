using Kutuphane.WebAPI.DTOs;

namespace Kutuphane.WebAPI.Repositories
{
    public interface IUyeRepository
    {

        bool UyeEkle(UyeIslemleriDTO uye);
        string BenzersizUyeKartNoUret();
        (bool basari, string mesaj) UyeSilKontrollu(int id);
        List<UyeIslemleriDTO> TumUyeleriGetir();
        bool UyeGuncelle(int id, UyeIslemleriDTO uye);
        UyeIslemleriDTO UyeGetirById(int id);

        List<OduncGecmisiDTO> UyeOduncGecmisiGetir(int uyeId);
    }
}
