namespace Kutuphane.WebAPI.DTOs
{
    public class KitapEkleDTO
    {
        public string Ad { get; set; }
        public string ISBN { get; set; }
        public int Stok { get; set; }
        public int YayinEviId { get; set; } 
        public int TurId { get; set; }      
        public int YazarId { get; set; }

    }


}
