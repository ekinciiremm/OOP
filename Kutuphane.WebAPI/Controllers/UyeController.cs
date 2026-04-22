using Kutuphane.WebAPI.DTOs;
using Kutuphane.WebAPI.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Kutuphane.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UyeController : ControllerBase
    {
        private readonly IUyeRepository _repo;

        public UyeController(IUyeRepository repo)
        {
            _repo = repo;
        }

        [HttpPost("uye-ekle")]
        public IActionResult UyeEkle(UyeIslemleriDTO uye)
        {
            if (uye == null)
            {
                return BadRequest("Üye bilgileri eksik.");
            }
            bool sonuc = _repo.UyeEkle(uye);
            if (sonuc)
            {
                return Ok("Üye başarıyla eklendi.");
            }
            else
            {
                return StatusCode(500, "Üye eklenirken bir hata oluştu.");
            }
        }

        [HttpGet("kart-no-olustur")]
        public IActionResult KartNoOlustur()
        {
            var kartNo = _repo.BenzersizUyeKartNoUret();
            return Ok(new { kartNo });
        }


        [HttpDelete("uye-sil/{id}")]
        public IActionResult UyeSil(int id)
        {
            var (basari, mesaj) = _repo.UyeSilKontrollu(id);

            if (!basari)
            {
                // 400 Bad Request: "Hatalı istek, çünkü üyenin elinde kitap var"
                return BadRequest(new { mesaj });
            }

            return Ok(new { mesaj });
        }


            [HttpGet("tum-uyeler")]
            public IActionResult GetTumUyeler()
            {
                var uyeler = _repo.TumUyeleriGetir();
                return Ok(uyeler);
            }

        [HttpGet("getir/{id}")]
        public IActionResult Getir(int id)
        {
            var uye = _repo.UyeGetirById(id);
            if (uye == null) return NotFound("Üye bulunamadı.");
            return Ok(uye);
        }

        [HttpPut("guncelle/{id}")]
        public IActionResult Guncelle(int id, UyeIslemleriDTO uye)
        {
            if (uye == null) return BadRequest("Üye bilgileri eksik.");
            bool sonuc = _repo.UyeGuncelle(id, uye);
            if (sonuc)
            {
                return Ok("Üye başarıyla güncellendi.");
            }
            else
            {
                return StatusCode(500, "Üye güncellenirken bir hata oluştu.");
            }
        }

        [HttpGet("{id}/gecmis")]
        public IActionResult GecmisGetir(int id)
        {
            var gecmis = _repo.UyeOduncGecmisiGetir(id);
            return Ok(gecmis);
        }
    }
}
