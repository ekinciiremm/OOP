using Kutuphane.WebAPI.DTOs;
using Kutuphane.WebAPI.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Kutuphane.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KitapDuzenleController : ControllerBase
    {
        private readonly IKitapDuzenleRepository _repo;
        private readonly IGenelBakisRepository _genelRepo;



        public KitapDuzenleController(IKitapDuzenleRepository repo, IGenelBakisRepository genelRepo)
        {
            _genelRepo = genelRepo;
            _repo = repo;
        }


        [HttpGet("yazarlar")]
        public IActionResult GetYazarlar()
        {
            var yazarlar = _genelRepo.ListeVeri("Yazarlar", "Yazar_id", "Yazar_ad");
            return Ok(yazarlar);
        }

        [HttpGet("turler")]
        public IActionResult GetTurler()
        {
            var turler = _genelRepo.ListeVeri("Turler", "Tur_id", "Tur_ad");
            return Ok(turler);
        }

        [HttpGet("yayinEvleri")]
        public IActionResult GetYayinEvleri()
        {
            var yayinEvleri = _genelRepo.ListeVeri("YayinEvleri", "YayinEvi_id", "YayinEvi_ad");
            return Ok(yayinEvleri);
        }


        [HttpGet("isbn-var-mi/{isbn}")]
        public IActionResult IsbnVarMi(string isbn)
        {
            bool varMi = _repo.IsbnVarMi(isbn);
            return Ok(new { varMi });
        }

        [HttpGet("isbn-olustur")]
        public IActionResult IsbnOlustur()
        {
            var isbn = _repo.BenzersizIsbnUret();
            return Ok(new { isbn });
        }



        [HttpPost("kitap-ekle")]
        public IActionResult KitapEkle(KitapEkleDTO kitap)
        {
            if (kitap == null)
            {
                return BadRequest("Kitap bilgileri eksik.");
            }
            bool sonuc = _repo.KitapEkle(kitap);
            if (sonuc)
            {
                return Ok("Kitap başarıyla eklendi.");
            }
            else
            {
                return StatusCode(500, "Kitap eklenirken bir hata oluştu.");//500 Internal Server Error
            }
        }




        [HttpPut("kitap-guncelle/{id}")]
        public IActionResult KitapGuncelle(int id, KitapEkleDTO kitap)
        {
            if (kitap == null)
            {
                return BadRequest("Kitap bilgileri eksik.");
            }
            bool sonuc = _repo.KitapGuncelle(id, kitap);
            if (sonuc)
            {
                return Ok("Kitap başarıyla güncellendi.");
            }
            else
            {
                return StatusCode(500, "Kitap güncellenirken bir hata oluştu.");
            }

        }



        [HttpDelete("kitap-sil/{id}")]
        public IActionResult KitapSil(int id)
        {
            bool sonuc = _repo.KitapSil(id);
            if (sonuc)
            {
                return Ok("Kitap başarıyla silindi.");
            }
            else
            {
                return StatusCode(500, "Kitap silinirken bir hata oluştu.");
            }
        }
    }
}
