using Kutuphane.WebAPI.DTOs;
using Kutuphane.WebAPI.Repositories;
using Microsoft.AspNetCore.Mvc;


namespace Kutuphane.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenelBakisController : ControllerBase
    {

      
        private readonly IGenelBakisRepository _repo;

        public GenelBakisController(IGenelBakisRepository repo)
        {
           
            _repo = repo;
        }

        [HttpGet("istatistikler")]
        public IActionResult GetIstatistikler()
        {
            var genelBakis = new GenelBakisDTO
            {
                ToplamKitap = _repo.ToplamKitap(),
                KayitliUye = _repo.KayitliUye(),
                AktifOdunc = _repo.AktifOdunc(),
                GecikenKitap = _repo.GecikenKitap()
            };
            return Ok(genelBakis);
        }

        [HttpGet("kitap-istatistik")]
        public IActionResult GetTumToplamKitap() {

            var kitapİstatistik = new KitapIstatistikDTO
            { 
                TumKitapToplam = _repo.TumToplamKitap(),
                MusaitKopya = _repo.MusaitKopya(),
                AktifOdunc = _repo.AktifOdunc(),
                KategoriSayisi = _repo.KategoriSayisi()

            };
            return Ok(kitapİstatistik);
        }

        [HttpGet("son-eklenenler")]
        public IActionResult GetSonEklenenler()
        {
            var sonEklenenler = _repo.SonEklenenKitaplar();
            return Ok(sonEklenenler);
        }

        [HttpGet("aktif-odunc")]
        public IActionResult GetAktifOdunc()
        {
            var aktifOdunc = _repo.AktifOduncKitaplar();
            return Ok(aktifOdunc);
        }

        [HttpGet("tur-dagilimi")]
        public IActionResult GetTurDagilimi()
        {
            var turDagilimi = _repo.TurDagilimi();
            return Ok(turDagilimi);
        }

        [HttpGet("tum-kitaplar")]
        public IActionResult GetTumKitaplar()
        {
            var tumKitaplar = _repo.TumKitaplar();
            return Ok(tumKitaplar);
        }



    }
}
