using Kutuphane.WebAPI.DTOs;
using Kutuphane.WebAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Kutuphane.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoggController : ControllerBase
    {

        private readonly IDbService _dbService; 

       
        public LoggController(IDbService dbService)
        {
            _dbService = dbService;
        }

        [HttpGet("logs")]
        public IActionResult Get()
        {
            var logs = new List<LogDTO>();

            string query = "select Timestamp, Level, Message from Logs order by Timestamp desc";

            using (var reader = _dbService.ExecuteReader(query))
            {
                while (reader.Read())
                {
                    logs.Add(new LogDTO
                    {
                        // reader["X"] ?? "" ifadesi: Eğer veritabanından gelen değer null ise boş string koy demektir.
                        Timestamp = reader["Timestamp"] != DBNull.Value ? Convert.ToDateTime(reader["Timestamp"]) : DateTime.Now,
                        Level = reader["Level"]?.ToString() ?? "Bilgi Yok",
                        Message = reader["Message"]?.ToString() ?? "Mesaj Yok"
                    });
                }
            }
            return Ok(logs);
        }
    } }
