using Kutuphane.WebAPI.DTOs;
using Kutuphane.WebAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace Kutuphane.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenelBakisController : ControllerBase
    {

        private readonly IDbService _dbService;
        private readonly ILoggerService _logger;


        public GenelBakisController(IDbService dbService, ILoggerService logger)
        {
            _dbService = dbService;
            _logger = logger;
        }

        [HttpGet("istatistikler")]
        public IActionResult Istatistikler()
        {

            try
            {

                var istatistikler = new GenelBakisDTO();

                using (var reader = _dbService.ExecuteReader("select count(*) from Kitaplar"))
                {

                    if (reader.Read())
                    {
                        istatistikler.ToplamKitap = reader.GetInt32(0);
                    }
                }


                using (var reader = _dbService.ExecuteReader("select count(*) from Uyeler"))
                {
                    if (reader.Read())
                    {
                        istatistikler.KayitliUye = reader.GetInt32(0);
                    }
                }

                using (var reader = _dbService.ExecuteReader("select count(*) from dbo.KitapAlmaİslemleri where Islem_durumu = 'Aktif'"))
                {
                    if (reader.Read())
                    {
                        istatistikler.AktifOdunc = reader.GetInt32(0);
                    }
                }

                using (var reader = _dbService.ExecuteReader("select count(*) from dbo.KitapAlmaİslemleri where Islem_durumu = 'Gecikmiş'"))
                {
                    if (reader.Read())
                    {
                        istatistikler.GecikenKitap = reader.GetInt32(0);
                    }
                }

              

                    return Ok(istatistikler);
                
            }
            catch (SqlException ex)
            {
                _logger.LogError("Veritabanı Hatası: " + ex.Message);
                return StatusCode(500, "Veritabanı hatası oluştu.");

            }

        }
    }
}
