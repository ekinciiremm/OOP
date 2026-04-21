using Kutuphane.WebAPI.DTOs;

namespace Kutuphane.WebAPI.Repositories
{
    public interface IKitapDuzenleRepository
    {

        bool KitapEkle(KitapEkleDTO kitap);
        bool KitapGuncelle(int id, KitapEkleDTO kitap);

        bool KitapSil(int id);

        string BenzersizIsbnUret();
        bool IsbnVarMi(string isbn);
    }
}
