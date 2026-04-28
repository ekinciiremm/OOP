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

    // api.js içindeki kitaplariGetir fonksiyonunu bununla güncelle
    async kitaplariGetir(page = 1) {
        try {
            // Backend'in pagination destekleyip desteklemediğine göre URL değişebilir
            // Ama şimdilik en azından parametre göndermeyi hazır edelim
            const response = await fetch(`/api/GenelBakis/tum-kitaplar?page=${page}`);
            if (!response.ok) throw new Error('Kitaplar alınamadı');

            const data = await response.json();
            console.log("API'den Gelen Veri:", data); // Verinin yapısını görmemizi sağlar
            return data;
        } catch (error) {
            console.error('API Hatası:', error);
            return [];
        }
    },




    async yazarlariGetir() {
        try {
            const response = await fetch('/api/KitapDuzenle/yazarlar'); 
            if (!response.ok) throw new Error('Yazarlar alınamadı');
            return await response.json();
        } catch (error) {
            console.error("Yazar listesi çekilirken hata:", error);
            return [];
        }
    },


   
    async turleriGetir() {
        try {
            const response = await fetch('/api/KitapDuzenle/turler');
            if (!response.ok) throw new Error('Türler alınamadı');
            return await response.json();
        } catch (error) {
            console.error("Tür listesi hatası:", error);
            return [];
        }
    },

    async yayinEviGetir() {
        try {
            const response = await fetch('/api/KitapDuzenle/yayinEvleri');
            if (!response.ok) throw new Error('Yayın evleri alınamadı');
            return await response.json();
        } catch (error) {
            console.error("Yayın evi listesi hatası:", error);
            return [];
        }
    },
    async kitapEkle(kitapVerisi) {
        try {
            const response = await fetch('/api/KitapDuzenle/kitap-ekle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(kitapVerisi)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Kitap eklenemedi');
            }

            return true;
        } catch (error) {
            console.error("Kitap ekleme hatası:", error);
            return false;
        }
    },

    async kitapSil(id) {
        if (!confirm("Bu kitabı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) {
            return false;
        }
        try {
            const response = await fetch(`/api/KitapDuzenle/kitap-sil/${id}`, {
                method: 'DELETE'
            });
            return response.ok;
        } catch (error) {
            console.error("Kitap silinirken hata oluştu:", error);
            return false;
        }
    }



};