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
            var yazarlar = _genelRepo.ListeVeri("Yazarlar", "Yazar_id", "Yazar_ad + ' ' + Yazar_soyad");
            return Ok(yazarlar);
        }

        [HttpGet("turler")]
        public IActionResult GetTurler()
        {
            var turler = _genelRepo.ListeVeri("KitapTurleri", "Tur_id", "TurAdi");
            return Ok(turler);
        }

        [HttpGet("yayinEvleri")]
        public IActionResult GetYayinEvleri()
        {
            var yayinEvleri = _genelRepo.ListeVeri("YayinEvleri", "Yayin_evi_id", "Yayin_evi_adi");
            return Ok(yayinEvleri);
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
