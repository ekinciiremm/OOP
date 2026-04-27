// API bağlantı katmanı — backend entegrasyonu için


// API nesnesi, backend ile iletişim kurmak için kullanılacak fonksiyonları içerir
const API = {
    async istatistikGetir() {

        try {
            const response = await fetch('/api/GenelBakis/istatistikler');
            if (!response.ok) {
                throw new Error('İstatistikler alınamadı');
            }
            return await response.json();
        } catch (error) {
            console.error('API Hatası:', error);
            return null;
        }
    },

      async kitaplariGetir() {
        try {
            const response = await fetch('/api/GenelBakis/tum-kitaplar');
            if (!response.ok) {
                throw new Error('Kitaplar alınamadı');
            }
            return await response.json();
        } catch (error) {
            console.error('API Hatası:', error);
            return [];
        }
    }


};