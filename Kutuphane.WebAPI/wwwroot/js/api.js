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


    async kitaplariGetir(page = 1) {
        try {

            const response = await fetch(`/api/GenelBakis/tum-kitaplar?page=${page}`);
            if (!response.ok) throw new Error('Kitaplar alınamadı');

            const data = await response.json();
            console.log("API'den Gelen Veri:", data);
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
        console.log("API'ye giden ID:", id); 
        if (!id || id === 0) {
            console.error("Hata: Geçersiz ID gönderilmeye çalışıldı!");
            return false;
        }
        try {
            const response = await fetch(`/api/KitapDuzenle/kitap-sil/${id}`, {
                method: 'DELETE'
            });
            return response.ok;
        } catch (error) {
            console.error("Silme hatası:", error);
            return false;
        }
    },



  
    async tumUyeleriGetir() {
        try {
            const response = await fetch('/api/Uye/tum-uyeler');
            if (!response.ok) throw new Error('Üyeler çekilemedi');
            return await response.json();
        } catch (error) {
            console.error("Hata:", error);
            return [];
        }
    },


    async uyeEkle(uyeVerisi) {
        try {
            const response = await fetch('/api/Uye/uye-ekle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(uyeVerisi)
            });
            if (response.ok) {

                return { success: true };
            } else {

                const errorText = await response.text();
                return { success: false, message: errorText };
            }

        } catch (error) {
            console.error("Üye ekleme API hatası:", error);
            return { success: false, message: "Sunucuya bağlanılamadı." };
        }
    }


};