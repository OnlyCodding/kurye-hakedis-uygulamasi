document.addEventListener('DOMContentLoaded', async () => {
    let AppData = (typeof window !== 'undefined' && window.AppData) ? window.AppData : (typeof AppData !== 'undefined' ? AppData : {});
    window._cleanPayrollTemplate = JSON.parse(JSON.stringify(AppData.fullPayrollBlocks || {}));
    try {
        const res = await fetch('/api/data');
        if (res.ok) {
            const fetched = await res.json();
            if (fetched && Object.keys(fetched).length > 0) {
                AppData = fetched;
                if (fetched.monthly_payroll_data) localStorage.setItem('monthly_payroll_data', JSON.stringify(fetched.monthly_payroll_data));
                if (fetched.courierShiftDetails) localStorage.setItem('courierShiftDetails', JSON.stringify(fetched.courierShiftDetails));
                if (fetched.hakedis_monthly_resets) localStorage.setItem('hakedis_monthly_resets', JSON.stringify(fetched.hakedis_monthly_resets));
                if (fetched.ekstra_hakedis_requests) localStorage.setItem('ekstra_hakedis_requests', JSON.stringify(fetched.ekstra_hakedis_requests));
                if (fetched.kuryeDeliveryList) localStorage.setItem('kuryeDeliveryList', JSON.stringify(fetched.kuryeDeliveryList));
                if (fetched.activeCouriers?.active_couriers) localStorage.setItem('activeCouriers', JSON.stringify(fetched.activeCouriers.active_couriers));
                if (fetched.activeShops?.active_shops) localStorage.setItem('activeShops', JSON.stringify(fetched.activeShops.active_shops));
            }
        }
    } catch (e) {
        console.log('Static mode - using embedded AppData fallback');
    }
    window.AppData = AppData;

    if (localStorage.getItem('monthIsolatedReset_v2') !== 'true') {
        Object.keys(localStorage).forEach(k => {
            if (k.startsWith('fullPayrollBlocks_')) {
                localStorage.removeItem(k);
            }
        });
        localStorage.setItem('monthIsolatedReset_v2', 'true');
    }

    if (localStorage.getItem('activeCouriersReset_v3') !== 'true') {
        localStorage.removeItem('activeCouriers');
        localStorage.setItem('activeCouriersReset_v3', 'true');
    }
    if (localStorage.getItem('manualDataReset_20260817') !== 'true') {
        localStorage.setItem('courierShiftDetails', JSON.stringify({}));
        localStorage.setItem('monthly_payroll_data', JSON.stringify({}));
        localStorage.setItem('kuryeDeliveryList', JSON.stringify([]));
        localStorage.setItem('ekstra_hakedis_requests', JSON.stringify([]));
        localStorage.setItem('hakedis_displayed_months', JSON.stringify(['2026_08']));
        localStorage.setItem('hakedis_monthly_resets', JSON.stringify({}));
        localStorage.setItem('manualDataReset_20260817', 'true');
    }

    if (localStorage.getItem('kuryeDeliveryReset_v2') !== 'true') {
        localStorage.setItem('kuryeDeliveryList', JSON.stringify([]));
        localStorage.setItem('kuryeDeliveryReset_v2', 'true');
    }
    if (localStorage.getItem('fullPayrollReset_v7') !== 'true') {
        localStorage.removeItem('fullPayrollBlocks');
        localStorage.setItem('fullPayrollReset_v7', 'true');
    }
    if (localStorage.getItem('isyeriPacketListReset_v2') !== 'true') {
        localStorage.setItem('isyeriPacketList', JSON.stringify([]));
        localStorage.setItem('isyeriPacketListReset_v2', 'true');
    }
    if (localStorage.getItem('giderListReset_v5') !== 'true') {
        localStorage.setItem('giderList', JSON.stringify([]));
        localStorage.setItem('giderCariMovements', JSON.stringify([]));
        localStorage.setItem('faturaList', JSON.stringify([]));
        localStorage.setItem('giderListReset_v5', 'true');
    }

    // Sync localStorage with AppData if empty
    if (AppData.activeCouriers && (!localStorage.getItem('activeCouriers') || localStorage.getItem('activeCouriers') === '[]')) {
        localStorage.setItem('activeCouriers', JSON.stringify(AppData.activeCouriers.active_couriers || []));
    }
    if (AppData.activeShops && (!localStorage.getItem('activeShops') || localStorage.getItem('activeShops') === '[]')) {
        localStorage.setItem('activeShops', JSON.stringify(AppData.activeShops.active_shops || []));
    }
    if (AppData.fullPayrollBlocks && !localStorage.getItem('fullPayrollBlocks')) {
        localStorage.setItem('fullPayrollBlocks', JSON.stringify(AppData.fullPayrollBlocks));
    }
    if (AppData.courierShiftDetails && !localStorage.getItem('courierShiftDetails')) {
        localStorage.setItem('courierShiftDetails', JSON.stringify(AppData.courierShiftDetails));
    }
    if (AppData.monthly_payroll_data && !localStorage.getItem('monthly_payroll_data')) {
        localStorage.setItem('monthly_payroll_data', JSON.stringify(AppData.monthly_payroll_data));
    }
    if (AppData.hakedis_monthly_resets && !localStorage.getItem('hakedis_monthly_resets')) {
        localStorage.setItem('hakedis_monthly_resets', JSON.stringify(AppData.hakedis_monthly_resets));
    }
    if (AppData.passiveUsers && !localStorage.getItem('passiveUsers')) {
        localStorage.setItem('passiveUsers', JSON.stringify(AppData.passiveUsers));
    }

    // Global document delegation for "Yeni Paket Girişi" buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('#btn-yeni-paket-girisi, #btn-yeni-isyeri-paket-girisi, .btn-yeni-paket-trigger');
        if (btn) {
            if (typeof window.showAddKuryePaketModal === 'function') {
                window.showAddKuryePaketModal();
            }
        }
    });

    // Filter out Ahmet Akgün
    let listGider = JSON.parse(localStorage.getItem('giderList') || '[]');
    let initialGiderLen = listGider.length;
    listGider = listGider.filter(item => {
        const pName = (item.personel || '').toString().toLowerCase();
        const desc = (item.aciklama || '').toString().toLowerCase();
        return !pName.includes('ahmet akgün') && !pName.includes('ahmet akgun') &&
               !desc.includes('ahmet akgün') && !desc.includes('ahmet akgun');
    });
    if (listGider.length !== initialGiderLen) {
        localStorage.setItem('giderList', JSON.stringify(listGider));
    }

    let movementsCari = JSON.parse(localStorage.getItem('giderCariMovements') || '[]');
    let initialCariLen = movementsCari.length;
    movementsCari = movementsCari.filter(item => {
        const mType = (item.masraf || '').toString().toLowerCase();
        const mTur = (item.tur || '').toString().toLowerCase();
        return !mType.includes('ahmet akgün') && !mType.includes('ahmet akgun') &&
               !mTur.includes('ahmet akgün') && !mTur.includes('ahmet akgun');
    });
    if (movementsCari.length !== initialCariLen) {
        let tempBakiye = 1349629.61;
        movementsCari.forEach(m => {
            const val = parseFloat((m.borc || '').toString().replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            const alacakVal = parseFloat((m.alacak || '').toString().replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            tempBakiye = tempBakiye - val + alacakVal;
            m.bakiye = '₺' + tempBakiye.toLocaleString('tr-TR', { minimumFractionDigits: 2 });
        });
        localStorage.setItem('giderCariMovements', JSON.stringify(movementsCari));
    }

    window.saveToServer = async function() {
        try {
            const payload = {
                activeCouriers: { active_couriers: JSON.parse(localStorage.getItem('activeCouriers') || '[]') },
                activeShops: { active_shops: JSON.parse(localStorage.getItem('activeShops') || '[]'), totals: AppData.activeShops?.totals },
                passiveUsers: JSON.parse(localStorage.getItem('passiveUsers') || 'null') || AppData.passiveUsers,
                shifts: AppData.shifts,
                fullPayrollBlocks: JSON.parse(localStorage.getItem('fullPayrollBlocks') || 'null') || AppData.fullPayrollBlocks,
                courierShiftDetails: JSON.parse(localStorage.getItem('courierShiftDetails') || '{}'),
                monthly_payroll_data: JSON.parse(localStorage.getItem('monthly_payroll_data') || '{}'),
                hakedis_monthly_resets: JSON.parse(localStorage.getItem('hakedis_monthly_resets') || '{}'),
                ekstra_hakedis_requests: JSON.parse(localStorage.getItem('ekstra_hakedis_requests') || '[]'),
                kuryeDeliveryList: JSON.parse(localStorage.getItem('kuryeDeliveryList') || '[]'),
                zimmetList: JSON.parse(localStorage.getItem('zimmetList') || '[]'),
                giderList: JSON.parse(localStorage.getItem('giderList') || '[]'),
                faturaList: JSON.parse(localStorage.getItem('faturaList') || '[]')
            };
            await fetch('/api/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        } catch(e) { console.error('Kaydetme hatası', e); }
    };

    // Auto-save on every localStorage change
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);
        if (window.saveToServer) {
            window.saveToServer();
        }
    };

    // --- Global Modal Helper Functions ---
    window.showCariBilgileriModal = function(shopName) {
        const shopDataMap = {
            'SARAY MUHALLEBİCİSİ FATİH': {
                vergiDairesi: 'FATİH VERGİ DAİRESİ',
                vergiNo: '7890123456',
                unvan: 'SARAY MUHALLEBİCİSİ GIDA VE TATLI SANAYİ TİCARET A.Ş.',
                adres: 'FEWZİPAŞA CAD. NO: 42 FATİH / İSTANBUL',
                aciklama: '1 aylık hizmet bedelidir',
                eposta: 'muhasebe@saraymuhallebicisi.com',
                kullanici: 'Mahmut Arslan',
                tarih: '11.08.2026 12:21:11'
            },
            'ERCAN BURGER YENİBOSNA': {
                vergiDairesi: 'BAHÇELİEVLER VERGİ DAİRESİ',
                vergiNo: '3313098765',
                unvan: 'ERCAN BURGER GIDA DANIŞMANLIK SANAYİ VE TİCARET LİMİTED ŞİRKETİ',
                adres: 'YENİBOSNA MERK. MAH. SANAYİ CAD. NO: 15 BAHÇELİEVLER / İSTANBUL',
                aciklama: '1 aylık hizmet bedelidir',
                eposta: 'fatura@ercanburger.com',
                kullanici: 'Mahmut Arslan',
                tarih: '10.08.2026 14:15:30'
            },
            'HATAY MEDENİYETLER SOFRASI': {
                vergiDairesi: 'ZEYTİNBURNU VERGİ DAİRESİ',
                vergiNo: '9185432109',
                unvan: 'HATAY MEDENİYETLER SOFRASI RESTORAN İŞLETMELERİ A.Ş.',
                adres: 'KAZLIÇEŞME MAH. ABAY KUNANBAY CAD. NO: 88 ZEYTİNBURNU / İSTANBUL',
                aciklama: '1 aylık hizmet bedelidir',
                eposta: 'muhasebe@hataysofrasi.com.tr',
                kullanici: 'Mahmut Arslan',
                tarih: '09.08.2026 16:40:22'
            },
            'PASTA SANATI FATİH': {
                vergiDairesi: 'FATİH VERGİ DAİRESİ',
                vergiNo: '6156789012',
                unvan: 'PASTA SANATI UNLU MAMULLER GIDA VE TİCARET LİMİTED ŞİRKETİ',
                adres: 'AKDENİZ CAD. NO: 23 FATİH / İSTANBUL',
                aciklama: '1 aylık hizmet bedelidir',
                eposta: 'muhasebe@pastasanati.com',
                kullanici: 'Mahmut Arslan',
                tarih: '08.08.2026 11:10:05'
            }
        };

        const details = shopDataMap[shopName] || {
            vergiDairesi: shopName.toUpperCase() + ' VERGİ DAİRESİ',
            vergiNo: '6170015056',
            unvan: shopName.toUpperCase() + ' GIDA TİCARET VE SANAYİ LİMİTED ŞİRKETİ',
            adres: shopName + ' MERKEZ MAH. İSTANBUL',
            aciklama: '1 aylık hizmet bedelidir',
            eposta: 'muhasebe@' + shopName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com.tr',
            kullanici: 'Mahmut Arslan',
            tarih: '11.08.2026 12:21:11'
        };

        let existingModal = document.getElementById('cari-bilgileri-modal-overlay');
        if (existingModal) existingModal.remove();

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'cari-bilgileri-modal-overlay';
        modalOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px;';

        modalOverlay.innerHTML = `
            <div style="background: white; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); padding: 25px; position: relative; font-family: 'Inter', sans-serif;">
                <h3 style="text-align: center; font-size: 18px; font-weight: 700; color: #4b5563; margin-top: 0; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px;">${shopName}</h3>
                
                <div style="display: flex; flex-direction: column; gap: 14px;">
                    <div>
                        <label style="font-size: 13px; font-weight: 700; color: #374151; display: block; margin-bottom: 5px;">Vergi Dairesi</label>
                        <input type="text" class="form-control" value="${details.vergiDairesi}" readonly style="width: 100%; height: 38px; padding: 6px 12px; font-size: 13px; border: 1px solid #d1d5db; border-radius: 4px; background: white; color: #1f2937;">
                    </div>

                    <div>
                        <label style="font-size: 13px; font-weight: 700; color: #374151; display: block; margin-bottom: 5px;">Vergi Numarası</label>
                        <input type="text" class="form-control" value="${details.vergiNo}" readonly style="width: 100%; height: 38px; padding: 6px 12px; font-size: 13px; border: 1px solid #d1d5db; border-radius: 4px; background: white; color: #1f2937;">
                    </div>

                    <div>
                        <label style="font-size: 13px; font-weight: 700; color: #374151; display: block; margin-bottom: 5px;">Resmi Ünvanı</label>
                        <input type="text" class="form-control" value="${details.unvan}" readonly style="width: 100%; height: 38px; padding: 6px 12px; font-size: 13px; border: 1px solid #d1d5db; border-radius: 4px; background: white; color: #1f2937;">
                    </div>

                    <div>
                        <label style="font-size: 13px; font-weight: 700; color: #374151; display: block; margin-bottom: 5px;">Resmi Adresi</label>
                        <textarea class="form-control" readonly style="width: 100%; height: 60px; padding: 6px 12px; font-size: 13px; border: 1px solid #d1d5db; border-radius: 4px; background: white; color: #1f2937; resize: none;">${details.adres}</textarea>
                    </div>

                    <div>
                        <label style="font-size: 13px; font-weight: 700; color: #374151; display: block; margin-bottom: 5px;">Fatura Açıklaması</label>
                        <textarea class="form-control" readonly style="width: 100%; height: 50px; padding: 6px 12px; font-size: 13px; border: 1px solid #d1d5db; border-radius: 4px; background: white; color: #1f2937; resize: none;">${details.aciklama}</textarea>
                    </div>

                    <div>
                        <label style="font-size: 13px; font-weight: 700; color: #374151; display: block; margin-bottom: 5px;">İletilecek E-postalar</label>
                        <input type="text" class="form-control" value="${details.eposta}" readonly style="width: 100%; height: 38px; padding: 6px 12px; font-size: 13px; border: 1px solid #d1d5db; border-radius: 4px; background: white; color: #1f2937;">
                    </div>

                    <div>
                        <label style="font-size: 13px; font-weight: 700; color: #374151; display: block; margin-bottom: 5px;">Oluşturan Kullanıcı</label>
                        <input type="text" class="form-control" value="${details.kullanici}" readonly style="width: 100%; height: 38px; padding: 6px 12px; font-size: 13px; border: 1px solid #d1d5db; border-radius: 4px; background: white; color: #1f2937;">
                    </div>

                    <div>
                        <label style="font-size: 13px; font-weight: 700; color: #374151; display: block; margin-bottom: 5px;">Oluşturma Tarihi</label>
                        <input type="text" class="form-control" value="${details.tarih}" readonly style="width: 100%; height: 38px; font-size: 13px; border: 1px solid #d1d5db; border-radius: 4px; background: white; color: #1f2937;">
                    </div>
                </div>

                <div style="text-align: center; margin-top: 20px;">
                    <button type="button" class="btn" style="background: #007bff; color: white; border: none; padding: 8px 36px; font-size: 14px; font-weight: 700; border-radius: 4px; cursor: pointer;" onclick="document.getElementById('cari-bilgileri-modal-overlay').remove()">KAPAT</button>
                </div>
            </div>
        `;

        document.body.appendChild(modalOverlay);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) modalOverlay.remove();
        });
    };

    window.showCariHareketleriModal = function(shopName) {
        const details = { bakiye: '0,00 ₺', finalBorc: '0,00 ₺' };

        let existing = document.getElementById('cari-hareketleri-modal-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'cari-hareketleri-modal-overlay';
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px;';

        overlay.innerHTML = `
            <div style="background: #f8fafc; width: 100%; max-width: 960px; max-height: 92vh; overflow-y: auto; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.25); padding: 25px; position: relative; font-family: 'Inter', sans-serif;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h3 style="font-size: 20px; font-weight: 700; color: #2d3748; margin: 0;">${shopName} Cari Hareketler</h3>
                    <button type="button" style="background: transparent; border: none; font-size: 24px; color: #a0aec0; cursor: pointer; line-height: 1;" onclick="document.getElementById('cari-hareketleri-modal-overlay').remove()">✕</button>
                </div>

                <!-- Card 1: ÖDEME EKLE -->
                <div style="background: white; border-top: 3px solid #38b2ac; border-radius: 8px; padding: 18px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span style="font-size: 14px; font-weight: 700; color: #4a5568;">ÖDEME EKLE</span>
                        <span style="font-weight: bold; color: #a0aec0; cursor: pointer;">−</span>
                    </div>
                    <div style="display: flex; gap: 15px; align-items: flex-end; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 160px;">
                            <label style="font-size: 12px; font-weight: 600; color: #718096; display: block; margin-bottom: 4px;">Ödemenin Tarihi:</label>
                            <input type="date" value="2026-08-13" style="width: 100%; height: 38px; padding: 6px 10px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13px; background: white;">
                        </div>
                        <div style="flex: 1; min-width: 160px;">
                            <label style="font-size: 12px; font-weight: 600; color: #718096; display: block; margin-bottom: 4px;">Tutarı:</label>
                            <input type="text" placeholder="" style="width: 100%; height: 38px; padding: 6px 10px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13px; background: white;">
                        </div>
                        <div>
                            <button type="button" style="background: #38b2ac; color: white; border: none; height: 38px; padding: 0 24px; font-weight: 600; font-size: 14px; border-radius: 6px; cursor: pointer;" onclick="alert('Ödeme eklendi.')">Ödeme Ekle</button>
                        </div>
                    </div>
                </div>

                <!-- Card 2: İADE FATURASI EKLE -->
                <div style="background: white; border-top: 3px solid #38b2ac; border-radius: 8px; padding: 14px 18px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 14px; font-weight: 700; color: #4a5568;">İADE FATURASI EKLE</span>
                    <span style="font-size: 18px; font-weight: bold; color: #a0aec0; cursor: pointer;">+</span>
                </div>

                <!-- Card 3: Main Section with ONLY Cari Hareketleri Tab -->
                <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <!-- Tab Menu: ONLY Cari Hareketleri tab as requested -->
                    <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px;">
                        <button type="button" style="background: #007bff; color: white; border: none; padding: 8px 22px; font-size: 13px; font-weight: 600; border-radius: 6px; cursor: default;">Cari Hareketleri</button>
                    </div>

                    <!-- Bakiye Card -->
                    <div style="display: flex; justify-content: center; margin-bottom: 25px;">
                        <div style="border: 2px solid #e53e3e; border-radius: 8px; padding: 12px 30px; display: flex; align-items: center; gap: 15px; background: white; min-width: 290px;">
                            <div style="background: #e53e3e; color: white; width: 48px; height: 38px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 20px;">💵</div>
                            <div>
                                <div style="font-size: 11px; font-weight: 700; color: #718096; letter-spacing: 0.5px;">BAKİYE</div>
                                <div style="font-size: 19px; font-weight: 800; color: #1a202c;">0,00 ₺</div>
                            </div>
                        </div>
                    </div>

                    <!-- Table -->
                    <div style="overflow-x: auto; margin-bottom: 15px;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: left;">
                            <thead>
                                <tr style="border-bottom: 2px solid #edf2f7;">
                                    <th style="padding: 10px 8px; font-weight: 700; color: #2d3748;">TARİH</th>
                                    <th style="padding: 10px 8px; font-weight: 700; color: #2d3748;">TÜR</th>
                                    <th style="padding: 10px 8px; font-weight: 700; color: #2d3748;">BORÇ</th>
                                    <th style="padding: 10px 8px; font-weight: 700; color: #2d3748;">ALACAK</th>
                                    <th style="padding: 10px 8px; font-weight: 700; color: #2d3748;">BAKİYE</th>
                                    <th style="padding: 10px 8px; font-weight: 700; color: #2d3748; text-align: right;">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="border-bottom: 1px solid #edf2f7;">
                                    <td style="padding: 10px 8px;">04.12.2024</td>
                                    <td style="padding: 10px 8px;">FATURA</td>
                                    <td style="padding: 10px 8px; color: #e53e3e; font-weight: 600;">0,00 ₺</td>
                                    <td style="padding: 10px 8px;"></td>
                                    <td style="padding: 10px 8px; font-weight: 500;">0,00 ₺</td>
                                    <td style="padding: 10px 8px; text-align: right;"><span style="background: #3182ce; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">3516</span></td>
                                </tr>
                                <tr style="border-bottom: 1px solid #edf2f7;">
                                    <td style="padding: 10px 8px;">05.12.2024</td>
                                    <td style="padding: 10px 8px;">ÖDEME</td>
                                    <td style="padding: 10px 8px;"></td>
                                    <td style="padding: 10px 8px; color: #38a169; font-weight: 600;">0,00 ₺</td>
                                    <td style="padding: 10px 8px; font-weight: 500;">0,00 ₺</td>
                                    <td style="padding: 10px 8px;"></td>
                                </tr>
                                <tr style="border-bottom: 1px solid #edf2f7;">
                                    <td style="padding: 10px 8px;">02.01.2025</td>
                                    <td style="padding: 10px 8px;">FATURA</td>
                                    <td style="padding: 10px 8px; color: #e53e3e; font-weight: 600;">0,00 ₺</td>
                                    <td style="padding: 10px 8px;"></td>
                                    <td style="padding: 10px 8px; font-weight: 500;">0,00 ₺</td>
                                    <td style="padding: 10px 8px; text-align: right;"><span style="background: #3182ce; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">3523</span></td>
                                </tr>
                                <tr style="border-bottom: 1px solid #edf2f7;">
                                    <td style="padding: 10px 8px;">03.01.2025</td>
                                    <td style="padding: 10px 8px;">FATURA</td>
                                    <td style="padding: 10px 8px; color: #e53e3e; font-weight: 600;">0,00 ₺</td>
                                    <td style="padding: 10px 8px;"></td>
                                    <td style="padding: 10px 8px; font-weight: 500;">0,00 ₺</td>
                                    <td style="padding: 10px 8px; text-align: right;"><span style="background: #3182ce; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">3524</span></td>
                                </tr>
                                <tr style="border-bottom: 1px solid #edf2f7;">
                                    <td style="padding: 10px 8px;">07.01.2025</td>
                                    <td style="padding: 10px 8px;">ÖDEME</td>
                                    <td style="padding: 10px 8px;"></td>
                                    <td style="padding: 10px 8px; color: #38a169; font-weight: 600;">0,00 ₺</td>
                                    <td style="padding: 10px 8px; font-weight: 500;">0,00 ₺</td>
                                    <td style="padding: 10px 8px;"></td>
                                </tr>
                                <tr style="border-bottom: 1px solid #edf2f7;">
                                    <td style="padding: 10px 8px;">02.02.2025</td>
                                    <td style="padding: 10px 8px;">FATURA</td>
                                    <td style="padding: 10px 8px; color: #e53e3e; font-weight: 600;">0,00 ₺</td>
                                    <td style="padding: 10px 8px;"></td>
                                    <td style="padding: 10px 8px; font-weight: 500;">0,00 ₺</td>
                                    <td style="padding: 10px 8px; text-align: right;"><span style="background: #3182ce; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">3552</span></td>
                                </tr>
                                <tr style="border-bottom: 1px solid #edf2f7;">
                                    <td style="padding: 10px 8px;">02.02.2025</td>
                                    <td style="padding: 10px 8px;">FATURA</td>
                                    <td style="padding: 10px 8px; color: #e53e3e; font-weight: 600;">0,00 ₺</td>
                                    <td style="padding: 10px 8px;"></td>
                                    <td style="padding: 10px 8px; font-weight: 500;">0,00 ₺</td>
                                    <td style="padding: 10px 8px; text-align: right;"><span style="background: #3182ce; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">3548</span></td>
                                </tr>
                                <tr style="border-bottom: 1px solid #edf2f7;">
                                    <td style="padding: 10px 8px;">05.02.2025</td>
                                    <td style="padding: 10px 8px;">ÖDEME</td>
                                    <td style="padding: 10px 8px;"></td>
                                    <td style="padding: 10px 8px; color: #38a169; font-weight: 600;">0,00 ₺</td>
                                    <td style="padding: 10px 8px; font-weight: 500;">0,00 ₺</td>
                                    <td style="padding: 10px 8px;"></td>
                                </tr>
                                <tr style="border-bottom: 1px solid #edf2f7;">
                                    <td style="padding: 10px 8px;">01.03.2025</td>
                                    <td style="padding: 10px 8px;">FATURA</td>
                                    <td style="padding: 10px 8px; color: #e53e3e; font-weight: 600;">0,00 ₺</td>
                                    <td style="padding: 10px 8px;"></td>
                                    <td style="padding: 10px 8px; font-weight: 500;">0,00 ₺</td>
                                    <td style="padding: 10px 8px; text-align: right;"><span style="background: #3182ce; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">3569</span></td>
                                </tr>
                                <tr style="border-bottom: 1px solid #edf2f7;">
                                    <td style="padding: 10px 8px;">10.03.2025</td>
                                    <td style="padding: 10px 8px;">ÖDEME</td>
                                    <td style="padding: 10px 8px;"></td>
                                    <td style="padding: 10px 8px; color: #38a169; font-weight: 600;">0,00 ₺</td>
                                    <td style="padding: 10px 8px; font-weight: 500;">0,00 ₺</td>
                                    <td style="padding: 10px 8px;"></td>
                                </tr>
                                <tr style="border-bottom: 1px solid #edf2f7; background: #fff5f5;">
                                    <td style="padding: 10px 8px; font-weight: 600;">11.08.2026</td>
                                    <td style="padding: 10px 8px; font-weight: 600;">FATURA</td>
                                    <td style="padding: 10px 8px; color: #e53e3e; font-weight: 700;">0,00 ₺</td>
                                    <td style="padding: 10px 8px;"></td>
                                    <td style="padding: 10px 8px; font-weight: 700; color: #1a202c;">0,00 ₺</td>
                                    <td style="padding: 10px 8px; text-align: right;"><span style="background: #3182ce; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">4100</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Footer Pagination -->
                    <div class="d-flex justify-content-between align-items-center" style="font-size: 13px; color: #718096;">
                        <div>Sayfada <select style="padding: 2px 6px; border: 1px solid #e2e8f0; border-radius: 4px;"><option>50</option></select> Kayıt Göster</div>
                        <div style="display: flex; gap: 4px;">
                            <button style="background: white; border: 1px solid #e2e8f0; padding: 4px 10px; border-radius: 4px; color: #718096; font-size: 12px;">Önceki</button>
                            <button style="background: #3182ce; color: white; border: none; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">1</button>
                            <button style="background: white; border: 1px solid #e2e8f0; padding: 4px 10px; border-radius: 4px; color: #718096; font-size: 12px;">Sonraki</button>
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 20px;">
                        <button type="button" style="background: #007bff; color: white; border: none; padding: 8px 36px; font-size: 14px; font-weight: 700; border-radius: 6px; cursor: pointer;" onclick="document.getElementById('cari-hareketleri-modal-overlay').remove()">KAPAT</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    }

    // --- Global Modal Helper Functions ---
    window.showShopUserCardModal = function(idx) {
        const data = JSON.parse(localStorage.getItem('activeShops')) || 
                     (AppData.activeShops ? AppData.activeShops.active_shops : []);
        const raw = data[idx] || {};
        const tabelaName = raw.tabela || 'İşyeri';

        const restaurantCardData = {
            'ERCAN BURGER YENİBOSNA': {
                no: '3313',
                muhasebeNo: 'MUH-3313',
                tabela: 'ERCAN BURGER YENİBOSNA',
                telefon: '0 (534) 973 25 05',
                kullanici_adi: 'ercanburgeryenibosna',
                sifre: '123456',
                engelle: 'AKTİF',
                bolge: 'BAHÇELİEVLER',
                onlineOdeme: 'AÇIK',
                kuryeAdedi: '2',
                sorumlu: 'Serhat Yılmaz',
                restoranTuru: 'ÖN ÖDEMESİZ NORMAL RESTORAN'
            },
            'Diver Fevzipaşa': {
                no: '6719',
                muhasebeNo: 'MUH-6719',
                tabela: 'Diver Fevzipaşa',
                telefon: '0 (535) 444 67 19',
                kullanici_adi: 'diverfevzipasa',
                sifre: '123456',
                engelle: 'AKTİF',
                bolge: 'ZEYTİNBURNU',
                onlineOdeme: 'AÇIK',
                kuryeAdedi: '3',
                sorumlu: 'Serkan Bilgin',
                restoranTuru: '400 KONTÖR RESTORAN'
            },
            'DİVER FEVZİPAŞA': {
                no: '6719',
                muhasebeNo: 'MUH-6719',
                tabela: 'Diver Fevzipaşa',
                telefon: '0 (535) 444 67 19',
                kullanici_adi: 'diverfevzipasa',
                sifre: '123456',
                engelle: 'AKTİF',
                bolge: 'ZEYTİNBURNU',
                onlineOdeme: 'AÇIK',
                kuryeAdedi: '3',
                sorumlu: 'Serkan Bilgin',
                restoranTuru: '400 KONTÖR RESTORAN'
            },
            'Diver Akdeniz Caddesi': {
                no: '6790',
                muhasebeNo: 'MUH-6790',
                tabela: 'Diver Akdeniz Caddesi',
                telefon: '0 (536) 888 67 90',
                kullanici_adi: 'diversakdeniz',
                sifre: '123456',
                engelle: 'AKTİF',
                bolge: 'ZEYTİNBURNU',
                onlineOdeme: 'AÇIK',
                kuryeAdedi: '2',
                sorumlu: 'Hakan Soylu',
                restoranTuru: '300 KONTÖR RESTORAN'
            },
            'SARAY MUHALLEBİCİSİ FATİH': {
                no: '4075',
                muhasebeNo: 'MUH-4075',
                tabela: 'SARAY MUHALLEBİCİSİ FATİH',
                telefon: '0 (212) 534 11 22',
                kullanici_adi: 'saraymuhallebicisifatih',
                sifre: '789012',
                engelle: 'AKTİF',
                bolge: 'FATİH',
                onlineOdeme: 'AÇIK',
                kuryeAdedi: '3',
                sorumlu: 'Serkan Bilgin',
                restoranTuru: 'ÖN ÖDEMESİZ NORMAL RESTORAN'
            },
            'HATAY MEDENİYETLER SOFRASI': {
                no: '4073',
                muhasebeNo: 'MUH-4073',
                tabela: 'HATAY MEDENİYETLER SOFRASI',
                telefon: '0 (212) 665 44 33',
                kullanici_adi: 'hataymedeniyetler',
                sifre: '345678',
                engelle: 'AKTİF',
                bolge: 'ZEYTİNBURNU',
                onlineOdeme: 'AÇIK',
                kuryeAdedi: '4',
                sorumlu: 'Hakan Soylu',
                restoranTuru: 'ÖN ÖDEMESİZ NORMAL RESTORAN'
            },
            'PASTA SANATI FATİH': {
                no: '4072',
                muhasebeNo: 'MUH-4072',
                tabela: 'PASTA SANATI FATİH',
                telefon: '0 (212) 521 88 99',
                kullanici_adi: 'pastasanatifatih',
                sifre: '901234',
                engelle: 'AKTİF',
                bolge: 'FATİH',
                onlineOdeme: 'AÇIK',
                kuryeAdedi: '1',
                sorumlu: 'Serhat Yılmaz',
                restoranTuru: 'ÖN ÖDEMESİZ NORMAL RESTORAN'
            },
            'PASTA SANATI - FATİH': {
                no: '6156',
                muhasebeNo: 'MUH-6156',
                tabela: 'PASTA SANATI - FATİH',
                telefon: '0 (212) 521 88 99',
                kullanici_adi: 'pastasanatifatih',
                sifre: '123456',
                engelle: 'AKTİF',
                bolge: 'ZEYTİNBURNU',
                onlineOdeme: 'AÇIK',
                kuryeAdedi: '2',
                sorumlu: 'Serhat Yılmaz',
                restoranTuru: 'ÖN ÖDEMESİZ NORMAL RESTORAN'
            },
            'Pilav Evi': {
                no: '3985',
                muhasebeNo: 'MUH-3985',
                tabela: 'Pilav Evi',
                telefon: '0 (532) 111 22 33',
                kullanici_adi: 'pilavevi',
                sifre: '123456',
                engelle: 'AKTİF',
                bolge: 'ZEYTİNBURNU',
                onlineOdeme: 'KAPALI',
                kuryeAdedi: '1',
                sorumlu: 'Serkan Bilgin',
                restoranTuru: '50 KONTÖR RESTORAN'
            },
            'MERHABA PASTANESİ HALKALI': {
                no: '4154',
                muhasebeNo: 'MUH-4154',
                tabela: 'MERHABA PASTANESİ HALKALI',
                telefon: '0 (212) 471 55 66',
                kullanici_adi: 'merhabahalkali',
                sifre: '123456',
                engelle: 'AKTİF',
                bolge: 'BAHÇELİEVLER',
                onlineOdeme: 'AÇIK',
                kuryeAdedi: '2',
                sorumlu: 'Hakan Soylu',
                restoranTuru: 'ÖN ÖDEMESİZ NORMAL RESTORAN'
            }
        };

        const mapped = restaurantCardData[tabelaName] || {};
        const s = {
            no: raw.no || mapped.no || (idx + 3300).toString(),
            muhasebeNo: mapped.muhasebeNo || ('MUH-' + (raw.no || (idx + 3300))),
            tabela: raw.tabela || mapped.tabela || ('İşyeri ' + (idx + 1)),
            telefon: mapped.telefon || raw.telefon || ('0 (53' + (idx % 5 + 3) + ') ' + (200 + idx*17) + ' 44 55'),
            kullanici_adi: raw.kullanici_adi || mapped.kullanici_adi || (tabelaName.toLowerCase().replace(/[^a-z0-9]/g, '')),
            sifre: raw.sifre || mapped.sifre || '123456',
            engelle: mapped.engelle || 'AKTİF',
            bolge: raw.bolge || mapped.bolge || 'BAHÇELİEVLER',
            onlineOdeme: mapped.onlineOdeme || 'AÇIK',
            kuryeAdedi: mapped.kuryeAdedi || ((idx % 3) + 1).toString(),
            sorumlu: mapped.sorumlu || ['Serhat Yılmaz', 'Serkan Bilgin', 'Hakan Soylu'][idx % 3],
            restoranTuru: mapped.restoranTuru || raw.hizmet_turu || 'ÖN ÖDEMESİZ NORMAL RESTORAN'
        };

        let existing = document.getElementById('shop-user-card-modal-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'shop-user-card-modal-overlay';
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px;';

        overlay.innerHTML = `
            <div style="background: #f8fafc; width: 100%; max-width: 920px; max-height: 92vh; overflow-y: auto; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.25); padding: 25px; position: relative; font-family: 'Inter', sans-serif;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h3 style="font-size: 20px; font-weight: 700; color: #2d3748; margin: 0;">${s.tabela} Kullanıcı Kartı</h3>
                    <button type="button" style="background: transparent; border: none; font-size: 24px; color: #a0aec0; cursor: pointer; line-height: 1;" onclick="document.getElementById('shop-user-card-modal-overlay').remove()">✕</button>
                </div>

                <div style="background: white; border: 1px solid #e2e8f0; border-top: 3px solid #38b2ac; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <!-- Tabs -->
                    <div style="display: flex; gap: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 25px; flex-wrap: wrap; font-size: 12px;">
                        <button type="button" style="background: #007bff; color: white; border: none; padding: 6px 16px; border-radius: 4px; font-weight: 600; cursor: default;">Düzenle</button>
                        <button type="button" style="background: transparent; color: #718096; border: none; padding: 6px 14px; border-radius: 4px; cursor: pointer;" onclick="alert('Paket Ücretleri')">Paket Ücretleri</button>
                        <button type="button" style="background: transparent; color: #718096; border: none; padding: 6px 14px; border-radius: 4px; cursor: pointer;" onclick="alert('Hizmetler')">Hizmetler</button>
                        <button type="button" style="background: transparent; color: #718096; border: none; padding: 6px 14px; border-radius: 4px; cursor: pointer;" onclick="alert('Fatura ve Banka Bil.')">Fatura ve Banka Bil.</button>
                        <button type="button" style="background: transparent; color: #718096; border: none; padding: 6px 14px; border-radius: 4px; cursor: pointer;" onclick="alert('İletmenPos')">İletmenPos</button>
                        <button type="button" style="background: transparent; color: #718096; border: none; padding: 6px 14px; border-radius: 4px; cursor: pointer;" onclick="alert('Evraklar')">Evraklar</button>
                        <button type="button" style="background: transparent; color: #718096; border: none; padding: 6px 14px; border-radius: 4px; cursor: pointer;" onclick="document.getElementById('shop-user-card-modal-overlay').remove(); window.showCariHareketleriModal('${s.tabela.replace(/'/g, "\\'")}');">Cari Hareketleri</button>
                        <button type="button" style="background: transparent; color: #718096; border: none; padding: 6px 14px; border-radius: 4px; cursor: pointer;" onclick="alert('Sözleşme Oluştur')">Sözleşme Oluştur</button>
                    </div>

                    <!-- Form Fields Grid matching User Screenshots -->
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <div style="display: grid; grid-template-columns: 180px 1fr; align-items: center; gap: 10px;">
                            <label style="font-size: 13px; font-weight: 600; color: #4a5568;">Müşteri Numarası:</label>
                            <input type="text" value="${s.no}" readonly style="height: 38px; padding: 6px 12px; border: 1px solid #cbd5e0; border-radius: 6px; background: #edf2f7; color: #4a5568; font-size: 13px;">
                        </div>

                        <div style="display: grid; grid-template-columns: 180px 1fr; align-items: center; gap: 10px;">
                            <label style="font-size: 13px; font-weight: 600; color: #4a5568;"><i class="fa-solid fa-circle-info" style="color: #3182ce; margin-right: 4px;"></i> Muhasebe Numarası:</label>
                            <input type="text" value="${s.muhasebeNo}" placeholder="" style="height: 38px; padding: 6px 12px; border: 1px solid #cbd5e0; border-radius: 6px; background: white; font-size: 13px;">
                        </div>

                        <div style="display: grid; grid-template-columns: 180px 1fr; align-items: center; gap: 10px;">
                            <label style="font-size: 13px; font-weight: 600; color: #4a5568;">Tabela Adı:</label>
                            <input type="text" id="modal-edit-tabela" value="${s.tabela}" style="height: 38px; padding: 6px 12px; border: 1px solid #cbd5e0; border-radius: 6px; background: white; font-size: 13px;">
                        </div>

                        <div style="display: grid; grid-template-columns: 180px 1fr; align-items: center; gap: 10px;">
                            <label style="font-size: 13px; font-weight: 600; color: #4a5568;">Telefon:</label>
                            <input type="text" id="modal-edit-telefon" value="${s.telefon}" style="height: 38px; padding: 6px 12px; border: 1px solid #cbd5e0; border-radius: 6px; background: white; font-size: 13px;">
                        </div>

                        <div style="display: grid; grid-template-columns: 180px 1fr; align-items: center; gap: 10px;">
                            <label style="font-size: 13px; font-weight: 600; color: #4a5568;">Kullanıcı Adı:</label>
                            <input type="text" id="modal-edit-kullanici" value="${s.kullanici_adi}" style="height: 38px; padding: 6px 12px; border: 1px solid #cbd5e0; border-radius: 6px; background: white; font-size: 13px;">
                        </div>

                        <div style="display: grid; grid-template-columns: 180px 1fr; align-items: center; gap: 10px;">
                            <label style="font-size: 13px; font-weight: 600; color: #4a5568;">Şifre:</label>
                            <input type="text" id="modal-edit-sifre" value="${s.sifre}" style="height: 38px; padding: 6px 12px; border: 1px solid #cbd5e0; border-radius: 6px; background: white; font-size: 13px;">
                        </div>

                        <div style="display: grid; grid-template-columns: 180px 1fr; align-items: center; gap: 10px;">
                            <label style="font-size: 13px; font-weight: 600; color: #4a5568;"><i class="fa-solid fa-circle-info" style="color: #3182ce; margin-right: 4px;"></i> Engelle:</label>
                            <select style="height: 38px; padding: 6px 12px; border: 1px solid #cbd5e0; border-radius: 6px; background: white; font-size: 13px;">
                                <option value="AKTİF" ${s.engelle === 'AKTİF' ? 'selected' : ''}>AKTİF</option>
                                <option value="PASİF" ${s.engelle === 'PASİF' ? 'selected' : ''}>PASİF</option>
                            </select>
                        </div>

                        <div style="display: grid; grid-template-columns: 180px 1fr; align-items: center; gap: 10px;">
                            <label style="font-size: 13px; font-weight: 600; color: #4a5568;">Bölge:</label>
                            <select id="modal-edit-bolge" style="height: 38px; padding: 6px 12px; border: 1px solid #cbd5e0; border-radius: 6px; background: white; font-size: 13px;">
                                <option value="BAHÇELİEVLER" ${s.bolge === 'BAHÇELİEVLER' ? 'selected' : ''}>BAHÇELİEVLER</option>
                                <option value="ZEYTİNBURNU" ${s.bolge === 'ZEYTİNBURNU' ? 'selected' : ''}>ZEYTİNBURNU</option>
                                <option value="FATİH" ${s.bolge === 'FATİH' ? 'selected' : ''}>FATİH</option>
                            </select>
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 25px;">
                        <button type="button" style="background: #38b2ac; color: white; border: none; padding: 10px 40px; font-size: 15px; font-weight: 700; border-radius: 6px; cursor: pointer; letter-spacing: 0.5px;" onclick="
                            if (AppData.shops && AppData.shops.active_shops && AppData.shops.active_shops[${idx}]) {
                                AppData.shops.active_shops[${idx}].tabela = document.getElementById('modal-edit-tabela').value;
                                AppData.shops.active_shops[${idx}].kullanici_adi = document.getElementById('modal-edit-kullanici').value;
                                AppData.shops.active_shops[${idx}].bolge = document.getElementById('modal-edit-bolge').value;
                            }
                            alert('İşyeri bilgileri başarıyla güncellendi.');
                            document.getElementById('shop-user-card-modal-overlay').remove();
                            if (window.renderUyeIsyerleri) window.renderUyeIsyerleri();
                        ">GÜNCELLE</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    };

    // --- Global Table Export Helper Functions ---
    window.copyTableToClipboard = function(el) {
        const container = el ? (el.closest('.card') || el.closest('#page-container') || document.body) : document.body;
        const table = container.querySelector('table');
        if (!table) return alert('Kopyalanacak tablo bulunamadı!');
        
        let text = '';
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const cols = row.querySelectorAll('th, td');
            const rowText = Array.from(cols).map(c => c.innerText.replace(/\n/g, ' ').trim()).join('\t');
            if (rowText) text += rowText + '\n';
        });
        
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Tablo verileri panoya kopyalandı!');
            }).catch(() => {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    };

    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            alert('Tablo verileri panoya kopyalandı!');
        } catch(e) {
            alert('Kopyalama başarısız oldu.');
        }
        document.body.removeChild(ta);
    }

    window.exportTableToCSV = function(el, filename = 'tablo_verileri.csv') {
        const container = el ? (el.closest('.card') || el.closest('#page-container') || document.body) : document.body;
        const table = container.querySelector('table');
        if (!table) return alert('İndirilecek tablo bulunamadı!');
        
        let csv = '\uFEFF';
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const cols = row.querySelectorAll('th, td');
            const rowText = Array.from(cols).map(c => `"${c.innerText.replace(/"/g, '""').replace(/\n/g, ' ').trim()}"`).join(';');
            if (rowText) csv += rowText + '\r\n';
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    window.exportTableToExcel = function(el, filename = 'tablo_verileri.xls') {
        const container = el ? (el.closest('.card') || el.closest('#page-container') || document.body) : document.body;
        const table = container.querySelector('table');
        if (!table) return alert('İndirilecek tablo bulunamadı!');
        
        const html = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head><meta charset="utf-8" /></head>
            <body>${table.outerHTML}</body>
            </html>
        `;
        
        const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    window.exportTableToPDF = function(el) {
        const container = el ? (el.closest('.card') || el.closest('#page-container') || document.body) : document.body;
        const table = container.querySelector('table');
        if (!table) return alert('Yazdırılacak tablo bulunamadı!');
        
        const win = window.open('', '_blank', 'width=900,height=700');
        win.document.write(`
            <html>
                <head>
                    <title>Rapor Çıktısı / PDF</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
                        h2 { color: #0284c7; }
                        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f0f9ff; color: #0284c7; }
                        tr:nth-child(even) { background-color: #f9f9f9; }
                    </style>
                </head>
                <body>
                    <h2>Rapor Çıktısı</h2>
                    ${table.outerHTML}
                    <script>
                        window.onload = function() {
                            window.print();
                            window.close();
                        };
                    <\/script>
                </body>
            </html>
        `);
        win.document.close();
    };

    window.printTable = function(el) {
        window.exportTableToPDF(el);
    };

    // --- State and UI Setup ---
    const pageTitle = document.getElementById('page-title');
    const pageContainer = document.getElementById('page-container');
    const navItems = document.querySelectorAll('.nav-item');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const fullscreenToggle = document.getElementById('fullscreen-toggle');
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileCloseBtn = document.getElementById('mobile-close-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    function toggleMobileSidebar(open) {
        if (open === undefined) {
            sidebar.classList.toggle('collapsed');
        } else if (open) {
            sidebar.classList.remove('collapsed');
        } else {
            sidebar.classList.add('collapsed');
        }
        
        if (window.innerWidth <= 768) {
            if (!sidebar.classList.contains('collapsed')) {
                sidebarOverlay?.classList.add('active');
            } else {
                sidebarOverlay?.classList.remove('active');
            }
        }
    }

    // Auto-open sidebar on desktop
    if (window.innerWidth > 768) {
        sidebar.classList.remove('collapsed');
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', () => toggleMobileSidebar());
    }

    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', () => toggleMobileSidebar(false));
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => toggleMobileSidebar(false));
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const icon = darkModeToggle.querySelector('i');
            if (document.body.classList.contains('dark-mode')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    }

    if (fullscreenToggle) {
        fullscreenToggle.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log(`Error attempting to enable full-screen mode: ${err.message}`);
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });
    }
    
    // --- Submenu Accordion Handlers ---
    const kullanicilarMenu = document.getElementById('menu-kullanicilar');
    const kullanicilarSubmenu = document.getElementById('submenu-kullanicilar');

    if (kullanicilarMenu && kullanicilarSubmenu) {
        kullanicilarMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            kullanicilarMenu.classList.toggle('open');
            kullanicilarSubmenu.classList.toggle('open');
        });
    }

    const demirbasMenu = document.getElementById('menu-demirbas');
    const demirbasSubmenu = document.getElementById('submenu-demirbas');

    if (demirbasMenu && demirbasSubmenu) {
        demirbasMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            demirbasMenu.classList.toggle('open');
            demirbasSubmenu.classList.toggle('open');
        });
    }

    const giderlerMenu = document.getElementById('menu-giderler');
    const giderlerSubmenu = document.getElementById('submenu-giderler');

    if (giderlerMenu && giderlerSubmenu) {
        giderlerMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            giderlerMenu.classList.toggle('open');
            giderlerSubmenu.classList.toggle('open');
        });
    }

    const paketTakipMenu = document.getElementById('menu-paket-takip');
    const paketTakipSubmenu = document.getElementById('submenu-paket-takip');

    if (paketTakipMenu && paketTakipSubmenu) {
        paketTakipMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            paketTakipMenu.classList.toggle('open');
            paketTakipSubmenu.classList.toggle('open');
        });
    }

    // --- Routing ---
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const page = item.getAttribute('data-page');
            if (!page) return;

            // Remove active class from all
            navItems.forEach(n => n.classList.remove('active'));
            // Add active class
            item.classList.add('active');
            
            const title = item.querySelector('span').innerText;
            if (pageTitle) pageTitle.innerText = title;
            
            loadPage(page);

            if (window.innerWidth <= 768) {
                toggleMobileSidebar(false);
            }
        });
    });

    // Persistent Page Loading on Refresh
    const savedPage = localStorage.getItem('activePage') || 'hakedis';
    const targetNavItem = document.querySelector(`.nav-item[data-page="${savedPage}"]`);

    if (targetNavItem) {
        navItems.forEach(n => n.classList.remove('active'));
        targetNavItem.classList.add('active');
        
        const title = targetNavItem.querySelector('span')?.innerText || 'Kurye Hakediş';
        if (pageTitle) pageTitle.innerText = title;

        // Auto expand parent submenu accordion if inside one
        if (['kullanici-ekle', 'kurye-listesi', 'isyeri-listesi'].includes(savedPage)) {
            kullanicilarMenu?.classList.add('open');
            kullanicilarSubmenu?.classList.add('open');
        }
        if (['kurye-paket-takip', 'isyeri-paket-takip'].includes(savedPage)) {
            paketTakipMenu?.classList.add('open');
            paketTakipSubmenu?.classList.add('open');
        }
        if (['demirbas-stok', 'demirbas-zimmetle'].includes(savedPage)) {
            demirbasMenu?.classList.add('open');
            demirbasSubmenu?.classList.add('open');
        }
        if (['gider-virman-ekle', 'gider-listesi', 'gider-carisi'].includes(savedPage)) {
            giderlerMenu?.classList.add('open');
            giderlerSubmenu?.classList.add('open');
        }
    }

    loadPage(savedPage);

    function loadPage(page) {
        // Store current active page in localStorage
        localStorage.setItem('activePage', page);

        // Clear container
        pageContainer.innerHTML = '';
        pageContainer.classList.remove('fade-in');
        // Trigger reflow
        void pageContainer.offsetWidth;
        pageContainer.classList.add('fade-in');

        switch(page) {
            case 'hakedis':
                renderHakedis();
                break;
            case 'kurye-listesi':
                renderKuryeListesi();
                break;
            case 'isyeri-listesi':
                renderIsyeriListesi();
                break;
            case 'shift-takip':
                renderShiftTakip();
                break;
            case 'kurye-paket-takip':
                renderKuryePaketTakip();
                break;
            case 'isyeri-paket-takip':
                renderIsyeriPaketTakip();
                break;
            case 'hizmet-takip':
                renderHizmetTakip();
                break;
            case 'demirbas-stok':
                renderDemirbasStok();
                break;
            case 'demirbas-zimmetle':
                renderDemirbasZimmetle();
                break;
            case 'gider-virman-ekle':
                renderGiderVirmanEkle();
                break;
            case 'gider-listesi':
                renderGiderListesi();
                break;
            case 'gider-carisi':
                renderGiderCarisi();
                break;
            case 'gelir-gider':
                renderGelirGider();
                break;
            case 'fatura-yukle-olustur':
                renderFaturaYukleVeyaOlustur();
                break;
            case 'pasif-kullanicilar':
                renderPasifKullanicilar();
                break;
            case 'kullanici-ekle':
                renderKullaniciEkle();
                break;
            default:
                pageContainer.innerHTML = '<h2>Yapım Aşamasında</h2>';
        }
    }

    function renderDemirbasStok() {
        // Initial sample data if empty
        let stokList = JSON.parse(localStorage.getItem('demirbasStokList') || 'null');
        const defaultStokList = [
            { id: 1, bolge: 'BAHÇELİEVLER', stokAdı: 'MOTOR', zimmetliMiktar: 1, zimmetsizMiktar: 2, toplamMiktar: 3 },
            { id: 2, bolge: 'BAHÇELİEVLER', stokAdı: 'YELEK', zimmetliMiktar: 2, zimmetsizMiktar: 2, toplamMiktar: 4 },
            { id: 3, bolge: 'BAHÇELİEVLER', stokAdı: 'SEPET', zimmetliMiktar: 1, zimmetsizMiktar: 3, toplamMiktar: 4 },
            { id: 4, bolge: 'BAHÇELİEVLER', stokAdı: 'KASK', zimmetliMiktar: 2, zimmetsizMiktar: 1, toplamMiktar: 3 },
            { id: 5, bolge: 'BAHÇELİEVLER', stokAdı: 'BİLGİSAYAR', zimmetliMiktar: 1, zimmetsizMiktar: 1, toplamMiktar: 2 },

            { id: 6, bolge: 'FATİH', stokAdı: 'YELEK', zimmetliMiktar: 3, zimmetsizMiktar: 1, toplamMiktar: 4 },
            { id: 7, bolge: 'FATİH', stokAdı: 'MOTOR', zimmetliMiktar: 1, zimmetsizMiktar: 2, toplamMiktar: 3 },
            { id: 8, bolge: 'FATİH', stokAdı: 'SEPET', zimmetliMiktar: 2, zimmetsizMiktar: 2, toplamMiktar: 4 },
            { id: 9, bolge: 'FATİH', stokAdı: 'YAZLIK MONT', zimmetliMiktar: 1, zimmetsizMiktar: 2, toplamMiktar: 3 },
            { id: 10, bolge: 'FATİH', stokAdı: 'KASK', zimmetliMiktar: 2, zimmetsizMiktar: 1, toplamMiktar: 3 },

            { id: 11, bolge: 'ZEYTİNBURNU', stokAdı: 'CEP TELEFONU', zimmetliMiktar: 0, zimmetsizMiktar: 1, toplamMiktar: 1 },
            { id: 12, bolge: 'ZEYTİNBURNU', stokAdı: 'SEPET', zimmetliMiktar: 1, zimmetsizMiktar: 2, toplamMiktar: 3 },
            { id: 13, bolge: 'ZEYTİNBURNU', stokAdı: 'YELEK', zimmetliMiktar: 2, zimmetsizMiktar: 1, toplamMiktar: 3 },
            { id: 14, bolge: 'ZEYTİNBURNU', stokAdı: 'KASK', zimmetliMiktar: 1, zimmetsizMiktar: 1, toplamMiktar: 2 },
            { id: 15, bolge: 'ZEYTİNBURNU', stokAdı: 'YAZLIK MONT', zimmetliMiktar: 1, zimmetsizMiktar: 0, toplamMiktar: 1 }
        ];

        if (!localStorage.getItem('demirbasStokList')) {
            stokList = defaultStokList;
            localStorage.setItem('demirbasStokList', JSON.stringify(stokList));
        }

        // Always sync real-time assigned quantities from active zimmets
        if (window.syncStokFromZimmet) window.syncStokFromZimmet();

        pageContainer.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4" style="flex-wrap: wrap; gap: 10px;">
                <h2 style="font-size: 22px; font-weight: 700; color: var(--text-main); margin: 0;">Stok Ekle-Çıkar</h2>
                <div style="font-size: 13px; color: var(--text-muted);">
                    <span>Anasayfa</span> / <span style="color: var(--primary-color); font-weight: 500;">Stok Ekle-Çıkar</span>
                </div>
            </div>

            <!-- Card 1: Stok Ekle - Çıkar Formu -->
            <div class="card mb-4" style="border-top: 3px solid var(--primary-color);">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 style="font-size: 16px; font-weight: 600; color: var(--text-main); margin: 0;">Stok Ekle - Çıkar</h4>
                    <button class="icon-btn" style="font-size: 14px;" onclick="this.closest('.card').querySelector('.form-body').classList.toggle('d-none')">
                        <i class="fa-solid fa-minus"></i>
                    </button>
                </div>
                
                <div class="form-body">
                    <form id="stok-form" onsubmit="event.preventDefault(); window.processStokAction();">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 15px;">
                            <div class="form-group mb-0">
                                <label class="form-label" style="font-weight: 600; font-size: 13px;">Bölge:</label>
                                <select id="stok-bolge" class="form-control" required>
                                    <option value="">Bölge Seçiniz..</option>
                                    <option value="BAHÇELİEVLER">BAHÇELİEVLER</option>
                                    <option value="FATİH">FATİH</option>
                                    <option value="ZEYTİNBURNU">ZEYTİNBURNU</option>
                                    <option value="KADIKÖY">KADIKÖY</option>
                                    <option value="BEŞİKTAŞ">BEŞİKTAŞ</option>
                                </select>
                            </div>
                            
                            <div class="form-group mb-0">
                                <label class="form-label" style="font-weight: 600; font-size: 13px;">Demirbaş Türü:</label>
                                <select id="stok-turu" class="form-control" required>
                                    <option value="">Demirbaş Seçiniz...</option>
                                    <option value="MOTOR">MOTOR</option>
                                    <option value="YELEK">YELEK</option>
                                    <option value="SEPET">SEPET</option>
                                    <option value="KASK">KASK</option>
                                    <option value="YAZLIK MONT">YAZLIK MONT</option>
                                    <option value="BİLGİSAYAR">BİLGİSAYAR</option>
                                    <option value="CEP TELEFONU">CEP TELEFONU</option>
                                </select>
                            </div>

                            <div class="form-group mb-0">
                                <label class="form-label" style="font-weight: 600; font-size: 13px;">Ekle Çıkar:</label>
                                <select id="stok-islem" class="form-control" required onchange="document.getElementById('stok-submit-btn').innerText = this.value === 'ÇIKAR' ? 'STOK ÇIKAR' : 'STOK EKLE'">
                                    <option value="EKLE">EKLE</option>
                                    <option value="ÇIKAR">ÇIKAR</option>
                                </select>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 15px; align-items: start;">
                            <div class="form-group mb-0">
                                <label class="form-label" style="font-weight: 600; font-size: 13px;">Adet:</label>
                                <input type="number" id="stok-adet" class="form-control" min="1" placeholder="" required>
                            </div>

                            <div class="form-group mb-0">
                                <label class="form-label" style="font-weight: 600; font-size: 13px;">Açıklama:</label>
                                <input type="text" id="stok-aciklama" class="form-control" placeholder="">
                                <small style="color: var(--text-muted); font-size: 11px; display: block; margin-top: 4px;">Buyara ekleme veya çıkarma nedeninizi yazınız.</small>
                            </div>

                            <div style="margin-top: 24px;">
                                <button type="submit" id="stok-submit-btn" class="btn btn-primary" style="width: 100%; height: 42px; font-weight: 700;">STOK EKLE</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Card 2: Stok Listesi -->
            <div class="card" style="border-top: 3px solid var(--primary-color);">
                <h4 style="font-size: 16px; font-weight: 600; color: var(--text-main); margin-bottom: 20px;">Stok Listesi</h4>

                <!-- Filter Bar -->
                <div style="background: #f8f9fa; padding: 15px; border-radius: var(--radius); margin-bottom: 20px; display: flex; gap: 15px; align-items: center; justify-content: center; flex-wrap: wrap;">
                    <select id="filter-stok-bolge" class="form-control" style="width: 180px; background: white;">
                        <option value="HEPSİ">HEPSİ (Bölge)</option>
                        <option value="BAHÇELİEVLER">BAHÇELİEVLER</option>
                        <option value="FATİH">FATİH</option>
                        <option value="ZEYTİNBURNU">ZEYTİNBURNU</option>
                    </select>
                    <select id="filter-stok-turu" class="form-control" style="width: 180px; background: white;">
                        <option value="HEPSİ">HEPSİ (Demirbaş Türü)</option>
                        <option value="MOTOR">MOTOR</option>
                        <option value="YELEK">YELEK</option>
                        <option value="SEPET">SEPET</option>
                        <option value="KASK">KASK</option>
                        <option value="YAZLIK MONT">YAZLIK MONT</option>
                        <option value="BİLGİSAYAR">BİLGİSAYAR</option>
                        <option value="CEP TELEFONU">CEP TELEFONU</option>
                    </select>
                    <button class="btn btn-primary" style="padding: 8px 25px;" onclick="window.renderStokTable()">Filtrele</button>
                </div>

                <!-- Table Controls -->
                <div class="d-flex justify-content-between align-items-center mb-3" style="flex-wrap: wrap; gap: 10px;">
                    <div style="font-size: 13px; color: var(--text-muted);">
                        Sayfada 
                        <select id="stok-page-length" class="form-control" style="display: inline-block; width: 70px; padding: 4px 8px; height: 32px;" onchange="window.renderStokTable()">
                            <option value="50">50</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="100">100</option>
                        </select> 
                        Kayıt Göster
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted);">
                        Ara: 
                        <input type="text" id="search-stok" class="form-control" style="width: 180px; height: 32px; padding: 4px 8px;" oninput="window.renderStokTable()">
                    </div>
                </div>

                <!-- Table -->
                <div class="table-responsive">
                    <table class="table table-hover" id="stok-table">
                        <thead>
                            <tr>
                                <th>BÖLGE</th>
                                <th>STOK ADI</th>
                                <th>ZİMMETLİ MİKTAR</th>
                                <th>ZİMMETSİZ MİKTAR</th>
                                <th>TOPLAM MİKTAR</th>
                            </tr>
                        </thead>
                        <tbody id="stok-tbody">
                            <!-- Populated via JS -->
                        </tbody>
                    </table>
                </div>

                <!-- Table Footer & Toolbar -->
                <div class="d-flex justify-content-between align-items-center mt-3" style="flex-wrap: wrap; gap: 15px;">
                    <div id="stok-table-info" style="font-size: 13px; color: var(--text-muted);">
                        - Kayıttan - ile - Arası Gösteriliyor
                    </div>
                    <div class="d-flex align-items-center gap-3" style="flex-wrap: wrap;">
                        <div class="d-flex" style="border: 1px solid var(--border-color); border-radius: var(--radius); overflow: hidden;">
                            <button class="btn btn-sm" style="background: white; color: var(--text-muted); padding: 5px 12px; border-right: 1px solid var(--border-color); font-size: 13px;">Önceki</button>
                            <button class="btn btn-sm" style="background: var(--primary-color); color: white; padding: 5px 12px; border-right: 1px solid var(--border-color); font-size: 13px; font-weight: 600;">1</button>
                            <button class="btn btn-sm" style="background: white; color: var(--text-muted); padding: 5px 12px; font-size: 13px;">Sonraki</button>
                        </div>
                        <div class="d-flex" style="background: #495057; color: white; border-radius: 6px; padding: 4px; gap: 2px; font-size: 12px; font-weight: 500;">
                            <button class="btn" style="background: transparent; color: white; padding: 4px 10px; font-size: 12px;" onclick="window.exportTableToExcel(this, 'demirbas_stok.xls')">Excel</button>
                            <button class="btn" style="background: transparent; color: white; padding: 4px 10px; font-size: 12px;" onclick="window.print()">Yazdır</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        window.renderStokTable();
    }

    // Helper functions for Stok Ekle-Çıkar page
    window.renderStokTable = function() {
        const tbody = document.getElementById('stok-tbody');
        if (!tbody) return;

        const stokList = JSON.parse(localStorage.getItem('demirbasStokList') || '[]');
        const filterBolge = document.getElementById('filter-stok-bolge')?.value || 'HEPSİ';
        const filterTuru = document.getElementById('filter-stok-turu')?.value || 'HEPSİ';
        const query = (document.getElementById('search-stok')?.value || '').toLowerCase();
        const limit = parseInt(document.getElementById('stok-page-length')?.value || '50');

        let filtered = stokList.filter(item => {
            if (filterBolge !== 'HEPSİ' && item.bolge !== filterBolge) return false;
            if (filterTuru !== 'HEPSİ' && item.stokAdı !== filterTuru) return false;
            if (query) {
                const text = `${item.bolge} ${item.stokAdı} ${item.zimmetliMiktar} ${item.zimmetsizMiktar} ${item.toplamMiktar}`.toLowerCase();
                if (!text.includes(query)) return false;
            }
            return true;
        });

        const infoElem = document.getElementById('stok-table-info');
        if (infoElem) {
            infoElem.innerText = `${filtered.length} Kayıttan 1 ile ${Math.min(limit, filtered.length)} Arası Gösteriliyor`;
        }

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted" style="padding: 20px;">Kayıt bulunamadı.</td></tr>`;
            return;
        }

        const itemsToShow = filtered.slice(0, limit);
        let html = '';
        itemsToShow.forEach(item => {
            html += `
                <tr>
                    <td style="font-weight: 500;">${item.bolge}</td>
                    <td>${item.stokAdı}</td>
                    <td>${item.zimmetliMiktar}</td>
                    <td>${item.zimmetsizMiktar}</td>
                    <td style="font-weight: 700; color: var(--primary-dark);">${item.toplamMiktar}</td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    };

    window.processStokAction = function() {
        const bolge = document.getElementById('stok-bolge').value;
        const turu = document.getElementById('stok-turu').value;
        const islem = document.getElementById('stok-islem').value;
        const adet = parseInt(document.getElementById('stok-adet').value || '0');
        const aciklama = document.getElementById('stok-aciklama').value;

        if (!bolge || !turu || !adet || adet <= 0) {
            alert('Lütfen tüm gerekli alanları ve geçerli bir adet giriniz.');
            return;
        }

        let stokList = JSON.parse(localStorage.getItem('demirbasStokList') || '[]');
        let item = stokList.find(s => s.bolge === bolge && s.stokAdı === turu);

        if (!item) {
            item = {
                id: Date.now(),
                bolge: bolge,
                stokAdı: turu,
                zimmetliMiktar: 0,
                zimmetsizMiktar: 0,
                toplamMiktar: 0
            };
            stokList.push(item);
        }

        if (islem === 'EKLE') {
            item.zimmetsizMiktar += adet;
            item.toplamMiktar = item.zimmetliMiktar + item.zimmetsizMiktar;
        } else if (islem === 'ÇIKAR') {
            if (item.zimmetsizMiktar < adet) {
                alert(`Yetersiz zimmetsiz stok! Mevcut zimmetsiz adet: ${item.zimmetsizMiktar}`);
                return;
            }
            item.zimmetsizMiktar -= adet;
            item.toplamMiktar = item.zimmetliMiktar + item.zimmetsizMiktar;
        }

        localStorage.setItem('demirbasStokList', JSON.stringify(stokList));
        if (window.saveToServer) window.saveToServer();

        document.getElementById('stok-form').reset();
        document.getElementById('stok-submit-btn').innerText = 'STOK EKLE';

        window.renderStokTable();
    };

    function renderDemirbasZimmetle() {
        // Initial sample data only if empty
        let zimmetList = JSON.parse(localStorage.getItem('demirbasZimmetList') || 'null');
        if (!zimmetList) {
            const defaultRandomList = [
                { id: 4819, turu: 'YELEK', aciklama: 'XL', belge: 'Yok', zimmetlenen: 'Ahmet Akgün', bolge: 'BAHÇELİEVLER' },
                { id: 7204, turu: 'YELEK', aciklama: 'M', belge: 'Yok', zimmetlenen: 'Bilal Ademoğlu', bolge: 'BAHÇELİEVLER' },
                { id: 3195, turu: 'YELEK', aciklama: 'XL', belge: 'Yok', zimmetlenen: 'Şeref Ziya Ulutaş', bolge: 'BAHÇELİEVLER' },
                { id: 8462, turu: 'YELEK', aciklama: 'L', belge: 'Yok', zimmetlenen: 'Mustafa Öztürk', bolge: 'BAHÇELİEVLER' },
                { id: 1937, turu: 'YELEK', aciklama: 'XL', belge: 'Yok', zimmetlenen: 'Hasan Basri Kara', bolge: 'BAHÇELİEVLER' },
                { id: 5620, turu: 'SEPET', aciklama: 'REKA SEPETİ', belge: 'Yok', zimmetlenen: 'Selin Doğan', bolge: 'BAHÇELİEVLER' },
                { id: 9481, turu: 'BİLGİSAYAR', aciklama: '9639ZB2', belge: 'Yok', zimmetlenen: 'Murat Yıldırım', bolge: 'BAHÇELİEVLER' },
                { id: 2741, turu: 'YELEK', aciklama: 'M', belge: 'Yok', zimmetlenen: 'Zafer Kayaoğlu', bolge: 'FATİH' },
                { id: 5903, turu: 'YELEK', aciklama: 'XL', belge: 'Yok', zimmetlenen: 'Volkan Demir', bolge: 'FATİH' },
                { id: 8326, turu: 'YELEK', aciklama: 'XL', belge: 'Yok', zimmetlenen: 'Tarkan Çetin', bolge: 'FATİH' },
                { id: 1458, turu: 'YELEK', aciklama: 'XL', belge: 'Yok', zimmetlenen: 'Cemil Coşkun', bolge: 'ZEYTİNBURNU' },
                { id: 6092, turu: 'YELEK', aciklama: 'XL', belge: 'Yok', zimmetlenen: 'Kadir Şahin', bolge: 'ZEYTİNBURNU' },
                { id: 3714, turu: 'KASK', aciklama: 'XL', belge: 'Yok', zimmetlenen: 'Oğuz Kaan Aksoy', bolge: 'ZEYTİNBURNU' },
                { id: 3715, turu: 'YAZLIK MONT', aciklama: 'XXL', belge: 'Yok', zimmetlenen: 'Gökhan Polat', bolge: 'ZEYTİNBURNU' },
                { id: 9230, turu: 'MOTOR', aciklama: '34CBR582', belge: 'Yok', zimmetlenen: 'Turgut Bayraktar', bolge: 'ZEYTİNBURNU' }
            ];

            zimmetList = defaultRandomList;
            localStorage.setItem('demirbasZimmetList', JSON.stringify(zimmetList));
        }

        // Build grouped courier options by region (optgroup)
        const groupedCouriers = {
            'BAHÇELİEVLER': ['Ahmet Akgün', 'Bilal Ademoğlu', 'Şeref Ziya Ulutaş', 'Mustafa Öztürk', 'Hasan Basri Kara', 'Selin Doğan', 'Murat Yıldırım'],
            'FATİH': ['Zafer Kayaoğlu', 'Volkan Demir', 'Tarkan Çetin'],
            'ZEYTİNBURNU': ['Cemil Coşkun', 'Kadir Şahin', 'Oğuz Kaan Aksoy', 'Gökhan Polat', 'Turgut Bayraktar']
        };

        let courierOptions = '<option value="">Seçiniz...</option>';
        for (const [bolgeName, names] of Object.entries(groupedCouriers)) {
            courierOptions += `<optgroup label="📍 ${bolgeName}" style="font-weight: 700; color: var(--primary-dark);">`;
            names.forEach(name => {
                courierOptions += `<option value="${name}" style="padding-left: 15px; font-weight: normal; color: var(--text-main);">${name}</option>`;
            });
            courierOptions += `</optgroup>`;
        }

        pageContainer.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4" style="flex-wrap: wrap; gap: 10px;">
                <h2 style="font-size: 22px; font-weight: 700; color: var(--text-main); margin: 0;">Demirbaş Zimmetle</h2>
                <div style="font-size: 13px; color: var(--text-muted);">
                    <span>Anasayfa</span> / <span style="color: var(--primary-color); font-weight: 500;">Demirbaş Zimmetle</span>
                </div>
            </div>

            <!-- Card 1: Zimmet Ekle Formu -->
            <div class="card mb-4" style="border-top: 3px solid var(--primary-color);">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 style="font-size: 16px; font-weight: 600; color: var(--text-main); margin: 0;">Demirbaş Zimmetle</h4>
                    <button class="icon-btn" style="font-size: 14px;" onclick="this.closest('.card').querySelector('.form-body').classList.toggle('d-none')">
                        <i class="fa-solid fa-minus"></i>
                    </button>
                </div>
                
                <div class="form-body">
                    <form id="zimmetle-form" onsubmit="event.preventDefault(); window.addDemirbasZimmet();">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; align-items: end;">
                            <div class="form-group mb-0">
                                <label class="form-label" style="font-weight: 600; font-size: 13px;">Bölge:</label>
                                <select id="zimmet-bolge" class="form-control" required>
                                    <option value="">Bölge Seçiniz.</option>
                                    <option value="BAHÇELİEVLER">BAHÇELİEVLER</option>
                                    <option value="FATİH">FATİH</option>
                                    <option value="ZEYTİNBURNU">ZEYTİNBURNU</option>
                                    <option value="KADIKÖY">KADIKÖY</option>
                                    <option value="BEŞİKTAŞ">BEŞİKTAŞ</option>
                                </select>
                            </div>
                            
                            <div class="form-group mb-0">
                                <label class="form-label" style="font-weight: 600; font-size: 13px;">Demirbaş Türü:</label>
                                <select id="zimmet-turu" class="form-control" required>
                                    <option value="">Demirbaş Seçiniz.</option>
                                    <option value="YELEK">YELEK</option>
                                    <option value="KASK">KASK</option>
                                    <option value="YAZLIK MONT">YAZLIK MONT</option>
                                    <option value="MOTOR">MOTOR</option>
                                    <option value="SEPET">SEPET</option>
                                    <option value="BİLGİSAYAR">BİLGİSAYAR</option>
                                </select>
                            </div>

                            <div class="form-group mb-0">
                                <label class="form-label" style="font-weight: 600; font-size: 13px;">Zimmetlenecek Kişi:</label>
                                <select id="zimmet-kisi" class="form-control" required>
                                    ${courierOptions}
                                </select>
                            </div>

                            <div class="form-group mb-0">
                                <label class="form-label" style="font-weight: 600; font-size: 13px;">Belge:</label>
                                <div style="display: flex; gap: 5px;">
                                    <input type="text" id="zimmet-belge-text" class="form-control" placeholder="Belge" readonly style="background: #f8f9fa;">
                                    <label for="zimmet-belge-file" class="btn btn-secondary" style="margin: 0; padding: 8px 15px; background: #e9ecef; color: #495057; border: 1px solid #ced4da; cursor: pointer; white-space: nowrap; font-size: 13px;">
                                        Browse
                                    </label>
                                    <input type="file" id="zimmet-belge-file" style="display: none;" onchange="document.getElementById('zimmet-belge-text').value = this.files[0] ? this.files[0].name : ''">
                                </div>
                            </div>

                            <div>
                                <button type="submit" class="btn btn-primary" style="width: 100%; height: 42px;">Zimmetle</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Card 2: Zimmet Listesi -->
            <div class="card" style="border-top: 3px solid var(--primary-color);">
                <h4 style="font-size: 16px; font-weight: 600; color: var(--text-main); margin-bottom: 20px;">Demirbaş Zimmet Listesi</h4>

                <!-- Filter Bar -->
                <div style="background: #f8f9fa; padding: 15px; border-radius: var(--radius); margin-bottom: 20px; display: flex; gap: 15px; align-items: center; justify-content: center; flex-wrap: wrap;">
                    <select id="filter-zimmet-bolge" class="form-control" style="width: 180px; background: white;">
                        <option value="HEPSİ">HEPSİ (Bölge)</option>
                        <option value="BAHÇELİEVLER">BAHÇELİEVLER</option>
                        <option value="FATİH">FATİH</option>
                        <option value="ZEYTİNBURNU">ZEYTİNBURNU</option>
                        <option value="KADIKÖY">KADIKÖY</option>
                    </select>
                    <select id="filter-zimmet-turu" class="form-control" style="width: 180px; background: white;">
                        <option value="HEPSİ">HEPSİ (Tür)</option>
                        <option value="YELEK">YELEK</option>
                        <option value="KASK">KASK</option>
                        <option value="YAZLIK MONT">YAZLIK MONT</option>
                        <option value="MOTOR">MOTOR</option>
                        <option value="SEPET">SEPET</option>
                        <option value="BİLGİSAYAR">BİLGİSAYAR</option>
                    </select>
                    <button class="btn btn-primary" style="padding: 8px 25px;" onclick="window.renderZimmetTable()">Filtrele</button>
                </div>

                <!-- Table Controls -->
                <div class="d-flex justify-content-between align-items-center mb-3" style="flex-wrap: wrap; gap: 10px;">
                    <div style="font-size: 13px; color: var(--text-muted);">
                        Sayfada 
                        <select id="zimmet-page-length" class="form-control" style="display: inline-block; width: 70px; padding: 4px 8px; height: 32px;" onchange="window.renderZimmetTable()">
                            <option value="50">50</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="100">100</option>
                        </select> 
                        Kayıt Göster
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted);">
                        Ara: 
                        <input type="text" id="search-zimmet" class="form-control" style="width: 180px; height: 32px; padding: 4px 8px;" oninput="window.renderZimmetTable()">
                    </div>
                </div>

                <!-- Table -->
                <div class="table-responsive">
                    <table class="table table-hover" id="zimmet-table">
                        <thead>
                            <tr>
                                <th>ZİMMET NO</th>
                                <th>TÜRÜ</th>
                                <th>AÇIKLAMA</th>
                                <th>BELGE</th>
                                <th>ZİMMETLENEN</th>
                                <th>BÖLGE</th>

                            </tr>
                        </thead>
                        <tbody id="zimmet-tbody">
                            <!-- Populated via JS -->
                        </tbody>
                    </table>
                </div>

                <!-- Table Footer & Pagination & Export Toolbar -->
                <div class="d-flex justify-content-between align-items-center mt-3" style="flex-wrap: wrap; gap: 15px;">
                    <div id="zimmet-table-info" style="font-size: 13px; color: var(--text-muted);">
                        15 Kayıttan 1 ile 15 Arası Gösteriliyor
                    </div>
                    <div class="d-flex align-items-center gap-3" style="flex-wrap: wrap;">
                        <!-- Pagination -->
                        <div class="d-flex" style="border: 1px solid var(--border-color); border-radius: var(--radius); overflow: hidden;">
                            <button class="btn btn-sm" style="background: white; color: var(--text-muted); padding: 5px 12px; border-right: 1px solid var(--border-color); font-size: 13px;">Önceki</button>
                            <button class="btn btn-sm" style="background: var(--primary-color); color: white; padding: 5px 12px; border-right: 1px solid var(--border-color); font-size: 13px; font-weight: 600;">1</button>
                            <button class="btn btn-sm" style="background: white; color: var(--text-muted); padding: 5px 12px; font-size: 13px;">Sonraki</button>
                        </div>
                        <!-- Export Toolbar -->
                        <div class="d-flex" style="background: #495057; color: white; border-radius: 6px; padding: 4px; gap: 2px; font-size: 12px; font-weight: 500;">
                            <button class="btn" style="background: transparent; color: white; padding: 4px 10px; font-size: 12px;" onclick="window.exportTableToExcel(this, 'demirbas_zimmet.xls')">Excel</button>
                            <button class="btn" style="background: transparent; color: white; padding: 4px 10px; font-size: 12px;" onclick="window.print()">Yazdır</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Dynamic Bölge change listener to filter personnel
        const bolgeSelect = document.getElementById('zimmet-bolge');
        const kisiSelect = document.getElementById('zimmet-kisi');

        if (bolgeSelect && kisiSelect) {
            bolgeSelect.addEventListener('change', () => {
                const selectedBolge = bolgeSelect.value;
                let filteredOptions = '<option value="">Seçiniz...</option>';

                if (!selectedBolge) {
                    for (const [bName, names] of Object.entries(groupedCouriers)) {
                        filteredOptions += `<optgroup label="📍 ${bName}" style="font-weight: 700; color: var(--primary-dark);">`;
                        names.forEach(name => {
                            filteredOptions += `<option value="${name}">${name}</option>`;
                        });
                        filteredOptions += `</optgroup>`;
                    }
                } else if (groupedCouriers[selectedBolge]) {
                    filteredOptions += `<optgroup label="📍 ${selectedBolge}" style="font-weight: 700; color: var(--primary-dark);">`;
                    groupedCouriers[selectedBolge].forEach(name => {
                        filteredOptions += `<option value="${name}">${name}</option>`;
                    });
                    filteredOptions += `</optgroup>`;
                } else {
                    filteredOptions += `<option value="" disabled>Bu bölgede kayıtlı personel yok</option>`;
                }
                
                kisiSelect.innerHTML = filteredOptions;
            });
        }

        // Render table rows
        window.renderZimmetTable();
    }

    // Helper functions for Zimmetle page
    window.renderZimmetTable = function() {
        const tbody = document.getElementById('zimmet-tbody');
        if (!tbody) return;

        const zimmetList = JSON.parse(localStorage.getItem('demirbasZimmetList') || '[]');
        const filterBolge = document.getElementById('filter-zimmet-bolge')?.value || 'HEPSİ';
        const filterTuru = document.getElementById('filter-zimmet-turu')?.value || 'HEPSİ';
        const query = (document.getElementById('search-zimmet')?.value || '').toLowerCase();
        const limit = parseInt(document.getElementById('zimmet-page-length')?.value || '50');

        let filtered = zimmetList.filter(item => {
            if (filterBolge !== 'HEPSİ' && item.bolge !== filterBolge) return false;
            if (filterTuru !== 'HEPSİ' && item.turu !== filterTuru) return false;
            if (query) {
                const text = `${item.id} ${item.turu} ${item.aciklama} ${item.belge} ${item.zimmetlenen} ${item.bolge}`.toLowerCase();
                if (!text.includes(query)) return false;
            }
            return true;
        });

        const infoElem = document.getElementById('zimmet-table-info');
        if (infoElem) {
            infoElem.innerText = `${filtered.length} Kayıttan 1 ile ${Math.min(limit, filtered.length)} Arası Gösteriliyor`;
        }

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding: 20px;">Kayıt bulunamadı.</td></tr>`;
            return;
        }

        const itemsToShow = filtered.slice(0, limit);
        let html = '';
        itemsToShow.forEach(item => {
            html += `
                <tr>
                    <td style="font-weight: 500;">${item.id}</td>
                    <td>${item.turu}</td>
                    <td>${item.aciklama || '-'}</td>
                    <td>${item.belge || 'Yok'}</td>
                    <td style="color: var(--secondary-dark); font-weight: 600;">${item.zimmetlenen}</td>
                    <td>${item.bolge}</td>

                </tr>
            `;
        });
        tbody.innerHTML = html;
    };

    // Helper function to sync stok Zimmetli Miktar from active Zimmet records
    window.syncStokFromZimmet = function() {
        const zimmetList = JSON.parse(localStorage.getItem('demirbasZimmetList') || '[]');
        let stokList = JSON.parse(localStorage.getItem('demirbasStokList') || '[]');

        // Count active zimmet items per (bolge, turu)
        const counts = {};
        zimmetList.forEach(z => {
            const key = `${z.bolge}___${z.turu}`;
            counts[key] = (counts[key] || 0) + 1;
        });

        // Track changes to update stokList
        stokList.forEach(s => {
            const key = `${s.bolge}___${s.stokAdı}`;
            const currentZimmetliCount = counts[key] || 0;
            s.zimmetliMiktar = currentZimmetliCount;
            s.toplamMiktar = s.zimmetliMiktar + s.zimmetsizMiktar;
        });

        localStorage.setItem('demirbasStokList', JSON.stringify(stokList));
    };

    window.addDemirbasZimmet = function() {
        const bolge = document.getElementById('zimmet-bolge').value;
        const turu = document.getElementById('zimmet-turu').value;
        const kisi = document.getElementById('zimmet-kisi').value;
        const belge = document.getElementById('zimmet-belge-text').value || 'Yok';

        if (!bolge || !turu || !kisi) {
            alert('Lütfen gerekli alanları doldurunuz.');
            return;
        }

        const zimmetList = JSON.parse(localStorage.getItem('demirbasZimmetList') || '[]');
        const newId = Math.floor(1000 + Math.random() * 9000);
        const newItem = {
            id: newId,
            turu: turu,
            aciklama: `${turu} - ${kisi}`,
            belge: belge,
            zimmetlenen: kisi,
            bolge: bolge
        };

        zimmetList.unshift(newItem);
        localStorage.setItem('demirbasZimmetList', JSON.stringify(zimmetList));

        // Ensure stock entry exists and update stok
        let stokList = JSON.parse(localStorage.getItem('demirbasStokList') || '[]');
        let stokItem = stokList.find(s => s.bolge === bolge && s.stokAdı === turu);
        if (!stokItem) {
            stokItem = {
                id: Date.now(),
                bolge: bolge,
                stokAdı: turu,
                zimmetliMiktar: 0,
                zimmetsizMiktar: 0,
                toplamMiktar: 0
            };
            stokList.push(stokItem);
            localStorage.setItem('demirbasStokList', JSON.stringify(stokList));
        }

        // Sync stock zimmetli amounts
        window.syncStokFromZimmet();

        // Auto save to server
        if (window.saveToServer) window.saveToServer();

        // Reset form
        document.getElementById('zimmetle-form').reset();
        document.getElementById('zimmet-belge-text').value = '';

        // Re-render table
        window.renderZimmetTable();
    };

    window.deleteDemirbasZimmet = function(id) {
        if (!confirm('Bu zimmet kaydını silmek istediğinize emin misiniz?')) return;

        let zimmetList = JSON.parse(localStorage.getItem('demirbasZimmetList') || '[]');
        zimmetList = zimmetList.filter(item => item.id !== id);
        localStorage.setItem('demirbasZimmetList', JSON.stringify(zimmetList));

        // Sync stock zimmetli amounts after deletion
        window.syncStokFromZimmet();

        if (window.saveToServer) window.saveToServer();
        window.renderZimmetTable();
    };

    // --- Pages Rendering ---

    function renderHakedis(selectedMonthIdx = null, selectedYear = null) {
        const now = new Date();
        const monthNames = ['OCAK','ŞUBAT','MART','NİSAN','MAYIS','HAZİRAN','TEMMUZ','AĞUSTOS','EYLÜL','EKİM','KASIM','ARALIK'];
        
        if (selectedMonthIdx === null || selectedMonthIdx === undefined) {
            selectedMonthIdx = now.getMonth();
        }
        if (selectedYear === null || selectedYear === undefined) {
            selectedYear = now.getFullYear();
        }
        selectedMonthIdx = parseInt(selectedMonthIdx);
        selectedYear = parseInt(selectedYear);
        
        const monthStr = String(selectedMonthIdx + 1).padStart(2, '0');
        const monthKey = `${selectedYear}_${monthStr}`;
        const isCurrentRealMonth = (selectedMonthIdx === now.getMonth() && selectedYear === now.getFullYear());

        let baseTemplate = (window._cleanPayrollTemplate && window._cleanPayrollTemplate.ozet_truva)
            ? window._cleanPayrollTemplate
            : ((window.AppData && window.AppData.fullPayrollBlocks)
                ? window.AppData.fullPayrollBlocks
                : (typeof AppData !== 'undefined' && AppData.fullPayrollBlocks ? AppData.fullPayrollBlocks : {}));
        let blocks = JSON.parse(JSON.stringify(baseTemplate));

        const normalizeTr = s => (s || '')
            .toString()
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/i̇/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .trim();

        window.isCourierMatch = function(excelName, activeName) {
            if (!excelName || !activeName) return false;
            let n1 = excelName.toString().replace(/\(.*?\)/g, '').trim();
            let n2 = activeName.toString().replace(/\(.*?\)/g, '').trim();
            
            n1 = n1.replace(/^m\.\s*/i, 'muhammet ');
            n2 = n2.replace(/^m\.\s*/i, 'muhammet ');
            
            let s1 = normalizeTr(n1);
            let s2 = normalizeTr(n2);
            
            if (s1 === s2) return true;
            if (s1.includes('tagi ilbey') && s2.includes('tagi ilbey')) return true;

            const parts1 = s1.split(/\s+/).filter(p => p.length >= 2);
            const parts2 = s2.split(/\s+/).filter(p => p.length >= 2);
            
            let exactMatches = 0;
            for (let p1 of parts1) {
                if (parts2.includes(p1)) exactMatches++;
            }
            
            if (exactMatches >= 2) return true;
            if (exactMatches === 1 && (parts1.length === 1 || parts2.length === 1)) return true;
            
            return false;
        };

        const activeCouriersList = (typeof getActiveCouriersList === 'function' ? getActiveCouriersList() : []).map(c => c.adi || c.kurye).filter(Boolean);
        if (blocks && blocks.ozet_truva && blocks.ozet_truva.length > 0) {
            const headerRow = blocks.ozet_truva[0];
            let existingNames = [];
            let toplamRowIndex = -1;
            
            for (let i = 1; i < blocks.ozet_truva.length; i++) {
                const row = blocks.ozet_truva[i];
                if (row[0] && row[0].value) {
                    const val = row[0].value.toString().trim();
                    if (val.toUpperCase() === 'TOPLAM') {
                        toplamRowIndex = i;
                    } else {
                        existingNames.push(val);
                    }
                }
            }
            if (toplamRowIndex === -1) toplamRowIndex = blocks.ozet_truva.length;

            activeCouriersList.forEach(activeName => {
                let found = false;
                for (let existName of existingNames) {
                    if (window.isCourierMatch(existName, activeName)) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    let newRow = [];
                    for(let c = 0; c < headerRow.length; c++) {
                        newRow.push({
                            value: c === 0 ? activeName : 0,
                            col: headerRow[c].col,
                            row: blocks.ozet_truva.length + 1,
                            is_formula: false
                        });
                    }
                    blocks.ozet_truva.splice(toplamRowIndex, 0, newRow);
                    toplamRowIndex++;
                }
            });
        }
        
        window.deleteExcelRow = function(blockKey, rowIndex) {
            if(confirm('Bu satırı silmek istediğinize emin misiniz?')) {
                blocks[blockKey].splice(rowIndex, 1);
                renderHakedis(selectedMonthIdx, selectedYear);
            }
        };

        // Helper to render hakedis block with pure per-month dynamic computation
        const renderHakedisBlock = (blockKey, blockData, targetMonthIdx = selectedMonthIdx, targetYear = selectedYear) => {
            if (!blockData || !blockData.length) return '';
            
            const requests = JSON.parse(localStorage.getItem('ekstra_hakedis_requests') || '[]');
            const targetMonthStr = String(targetMonthIdx + 1).padStart(2, '0');
            const targetMonthKey = `${targetYear}_${targetMonthStr}`;
            const targetIsRealMonth = (targetMonthIdx === now.getMonth() && targetYear === now.getFullYear());

            // Identify column indices from header row
            let yemekColIndex = -1;
            let avansColIndex = -1;
            let ekstraColIndex = -1;
            let toplamHakedisColIndex = -1;
            let odenenecekColIndex = -1;
            let saatToplamColIndex = -1;
            let paketToplamColIndex = -1;
            
            let paketSayisiColIndex = -1;
            let paketUcretiColIndex = -1;
            let saatColIndex = -1;
            let saatUcretiColIndex = -1;

            const headerRow = blockData[0];
            if (headerRow) {
                headerRow.forEach((cell, idx) => {
                    const v = normalizeTr(cell.value || '');
                    if (v.includes('yemek')) yemekColIndex = idx;
                    if (v.includes('avans')) avansColIndex = idx;
                    if (v.includes('ektra') || v.includes('ekstra')) ekstraColIndex = idx;
                    if (v.includes('toplam') && v.includes('hakedis')) toplamHakedisColIndex = idx;
                    if (v.includes('odenecek')) odenenecekColIndex = idx;
                    if (v.includes('saat') && v.includes('toplam')) saatToplamColIndex = idx;
                    if (v.includes('paket') && v.includes('toplam')) paketToplamColIndex = idx;
                    
                    if (v === 'paket' || v === 'paket sayisi') paketSayisiColIndex = idx;
                    if (v.includes('paket') && (v.includes('ucret') || v.includes('fiyat')) && !v.includes('toplam') && !v.includes('extra')) paketUcretiColIndex = idx;
                    if (v === 'saat') saatColIndex = idx;
                    if (v.includes('saat') && (v.includes('ucret') || v.includes('fiyat')) && !v.includes('toplam')) saatUcretiColIndex = idx;
                });
            }

            // Data aggregations
            const kuryeDeliveryList = JSON.parse(localStorage.getItem('kuryeDeliveryList') || '[]');
            const courierShiftDetails = JSON.parse(localStorage.getItem('courierShiftDetails') || '{}');
            const monthlyResets = JSON.parse(localStorage.getItem('hakedis_monthly_resets') || '{}');
            const isMonthReset = (monthlyResets[targetMonthKey] === true);

            const activeCourierNames = (typeof getActiveCouriersList === 'function' ? getActiveCouriersList() : []).map(c => c.adi || c.kurye).filter(Boolean);
            const shiftCourierNames = Object.keys(courierShiftDetails);
            const deliveryCourierNames = kuryeDeliveryList.map(p => p.kurye).filter(Boolean);

            let colSums = {};
            let html = '<div class="table-responsive"><table class="table table-bordered table-sm table-striped" style="font-size: 13px; text-align: right; vertical-align: middle;">';
            html += '<tbody>';
            
            blockData.forEach((row, rowIndex) => {
                const isHeader = rowIndex === 0;
                const isTotalRow = !isHeader && row[0] && row[0].value && row[0].value.toString().toUpperCase() === 'TOPLAM';
                const isKuryeRow = !isHeader && !isTotalRow;
                
                let kuryeName = (row[0] && row[0].value) ? row[0].value.toString().trim() : '';
                let matchedKuryeName = kuryeName;

                if (isKuryeRow && kuryeName) {
                    const allActiveNames = [...new Set([...activeCourierNames, ...shiftCourierNames, ...deliveryCourierNames])];
                    for (const activeName of allActiveNames) {
                        if (window.isCourierMatch(kuryeName, activeName)) {
                            matchedKuryeName = activeName;
                            break;
                        }
                    }
                }

                let netEkstra = 0;
                let kuryePaketSayisi = 0;
                let kuryePaketUcreti = 0;
                let kuryePaketToplam = 0;
                
                let kuryeSaat = 0;
                let kuryeSaatUcreti = 0;
                let kuryeSaatToplam = 0;

                if (isKuryeRow && !isMonthReset) {
                    requests.forEach(req => {
                        const reqKurye = (req.kuryeName || '').trim();
                        const isMatch = (reqKurye === matchedKuryeName.trim() || window.isCourierMatch(kuryeName, reqKurye) || window.isCourierMatch(matchedKuryeName, reqKurye));
                        
                        let inMonth = false;
                        if (req.month !== undefined && req.year !== undefined) {
                            inMonth = (parseInt(req.month) === targetMonthIdx && parseInt(req.year) === targetYear);
                        } else if (targetIsRealMonth) {
                            inMonth = true;
                        }

                        if (isMatch && inMonth) {
                            const tutar = parseFloat(req.tutar) || 0;
                            if (req.islem === 'TOPLAM HAKEDİŞE EKLENECEK') {
                                netEkstra += tutar;
                            } else if (req.islem === 'TOPLAM HAKEDİŞTEN ÇIKARILACAK') {
                                netEkstra -= tutar;
                            }
                        }
                    });

                    kuryeDeliveryList.forEach(p => {
                        const pKurye = (p.kurye || '').trim();
                        const isMatch = (pKurye && (window.isCourierMatch(matchedKuryeName, pKurye) || window.isCourierMatch(kuryeName, pKurye)));
                        const pDurum = (p.durum || '').toString().toUpperCase().trim();
                        const isCancelled = pDurum.includes('İPTAL') || pDurum.includes('IPTAL');
                        
                        let inMonth = false;
                        if (p.tarih) {
                            let parts = p.tarih.split(/[-./\s]/);
                            if (parts.length >= 3) {
                                let dYear = parts[0].length === 4 ? parseInt(parts[0]) : parseInt(parts[2]);
                                let dMonth = parseInt(parts[1]) - 1;
                                inMonth = (dMonth === targetMonthIdx && dYear === targetYear);
                            }
                        } else if (targetIsRealMonth) {
                            inMonth = true;
                        }

                        if (isMatch && !isCancelled && inMonth) {
                            const pCount = parseInt(p.paketSayisi) || 1;
                            let rawHakedis = (p.hakedis || '').toString().replace('₺', '').trim();
                            rawHakedis = rawHakedis.replace(/\./g, '').replace(',', '.');
                            const pHakedis = parseFloat(rawHakedis) || 0;
                            kuryePaketSayisi += pCount;
                            kuryePaketToplam += (pCount * pHakedis);
                            if (pHakedis > 0 && kuryePaketUcreti === 0) kuryePaketUcreti = pHakedis;
                        }
                    });

                    const courierMonthKey1 = `${matchedKuryeName}_${targetYear}_${targetMonthStr}`;
                    const courierMonthKey2 = `${kuryeName}_${targetYear}_${targetMonthStr}`;
                    
                    let foundShift = null;
                    if (courierShiftDetails[courierMonthKey1]) {
                        foundShift = courierShiftDetails[courierMonthKey1];
                    } else if (courierShiftDetails[courierMonthKey2]) {
                        foundShift = courierShiftDetails[courierMonthKey2];
                    } else {
                        for (const key of Object.keys(courierShiftDetails)) {
                            if (key.endsWith(`_${targetYear}_${targetMonthStr}`)) {
                                const cleanKeyName = key.replace(/_\d{4}_\d{2}$/, '');
                                if (cleanKeyName.trim().toLowerCase() === kuryeName.trim().toLowerCase() || window.isCourierMatch(kuryeName, cleanKeyName) || window.isCourierMatch(matchedKuryeName, cleanKeyName)) {
                                    foundShift = courierShiftDetails[key];
                                    break;
                                }
                            }
                        }
                    }

                    const pStore = JSON.parse(localStorage.getItem('monthly_payroll_data') || '{}');
                    const savedMonthData = pStore[String(targetYear)]?.[String(targetMonthIdx + 1)]?.[matchedKuryeName] 
                                        || pStore[String(targetYear)]?.[String(targetMonthIdx + 1)]?.[kuryeName];
                    if (savedMonthData) {
                        if (savedMonthData.saat !== undefined) kuryeSaat = parseFloat(savedMonthData.saat) || 0;
                        if (savedMonthData.saatUcreti !== undefined) kuryeSaatUcreti = parseFloat(savedMonthData.saatUcreti) || 0;
                        if (savedMonthData.paketSayisi !== undefined) kuryePaketSayisi = parseFloat(savedMonthData.paketSayisi) || 0;
                        if (savedMonthData.paketUcreti !== undefined) kuryePaketUcreti = parseFloat(savedMonthData.paketUcreti) || 0;
                        if (savedMonthData.paketToplam !== undefined) kuryePaketToplam = parseFloat(savedMonthData.paketToplam) || 0;
                        if (savedMonthData.netEkstra !== undefined) netEkstra = parseFloat(savedMonthData.netEkstra) || 0;
                    }

                    if (foundShift) {
                        if (foundShift.totalHours !== undefined) kuryeSaat = parseFloat(foundShift.totalHours) || 0;
                        if (foundShift.saatUcreti && !kuryeSaatUcreti) kuryeSaatUcreti = parseFloat(foundShift.saatUcreti) || 0;
                    }
                    kuryeSaatToplam = kuryeSaat * kuryeSaatUcreti;
                }

                html += `<tr>`;
                row.forEach((cell, cellIdx) => {
                    if (cellIdx === yemekColIndex || cellIdx === avansColIndex) return;
                    
                    let val = '';
                    if (isHeader) {
                        val = cell.value || '';
                        if (cellIdx === ekstraColIndex) val = 'EKSTRA';
                    } else if (isKuryeRow) {
                        if (cellIdx === 0) val = kuryeName;
                        else if (cellIdx === saatColIndex) val = kuryeSaat;
                        else if (cellIdx === paketSayisiColIndex) val = kuryePaketSayisi;
                        else if (cellIdx === saatUcretiColIndex) val = kuryeSaatUcreti;
                        else if (cellIdx === paketUcretiColIndex) val = kuryePaketUcreti;
                        else if (cellIdx === saatToplamColIndex) val = kuryeSaatToplam;
                        else if (cellIdx === paketToplamColIndex) val = kuryePaketToplam;
                        else if (cellIdx === ekstraColIndex) val = netEkstra;
                        else if (cellIdx === toplamHakedisColIndex) val = kuryeSaatToplam + kuryePaketToplam + netEkstra;
                        else if (cellIdx === odenenecekColIndex) val = kuryeSaatToplam + kuryePaketToplam + netEkstra;
                        
                        if (cellIdx > 0 && typeof val === 'number') {
                            colSums[cellIdx] = (colSums[cellIdx] || 0) + val;
                        }
                    } else if (isTotalRow) {
                        if (cellIdx === 0) val = 'TOPLAM';
                        else if (cellIdx === saatUcretiColIndex || cellIdx === paketUcretiColIndex) val = '';
                        else val = colSums[cellIdx] || 0;
                    }

                    let displayVal = val;
                    if (typeof val === 'number') {
                        if ([saatUcretiColIndex, paketUcretiColIndex, saatToplamColIndex, paketToplamColIndex, ekstraColIndex, toplamHakedisColIndex, odenenecekColIndex].includes(cellIdx)) {
                            displayVal = val.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
                            if (val !== 0 && cellIdx !== saatColIndex && cellIdx !== paketSayisiColIndex) displayVal += ' ₺';
                        }
                    }

                    let align = (cellIdx === 0) ? 'left' : 'right';
                    html += `<td style="padding: 4px 8px; text-align: ${align};">${displayVal}</td>`;

                    if (cellIdx === odenenecekColIndex && isKuryeRow) {
                        html += `
                            <td style="padding: 4px 8px; text-align:center; position: relative;">
                                <div class="dropdown" style="display:inline-block;">
                                    <button class="btn btn-sm btn-outline-secondary hakedis-islemler-btn" style="padding: 2px 8px; font-size: 11px;">
                                        İşlemler <i class="fa-solid fa-caret-down"></i>
                                    </button>
                                    <div class="hakedis-dropdown-menu" style="display:none; position:absolute; right:0; top:100%; z-index:1050; min-width:175px; padding:5px 0; margin:2px 0 0; font-size:12px; text-align:left; background-color:#fff; border:1px solid rgba(0,0,0,.15); border-radius:6px; box-shadow:0 6px 12px rgba(0,0,0,.175);">
                                        <a href="javascript:void(0)" class="dropdown-item hakedis-saat-ucreti-btn" data-encoded="${encodeURIComponent(matchedKuryeName)}" data-month="${targetMonthIdx}" data-year="${targetYear}" style="display:block; padding:6px 15px; clear:both; font-weight:500; color:#333; text-decoration:none;">
                                            <i class="fa-solid fa-clock text-primary me-1"></i> Saat Birim Ücreti Ekle
                                        </a>
                                        <a href="javascript:void(0)" class="dropdown-item hakedis-ekstra-btn" data-encoded="${encodeURIComponent(matchedKuryeName)}" data-month="${targetMonthIdx}" data-year="${targetYear}" style="display:block; padding:6px 15px; clear:both; font-weight:500; color:#333; text-decoration:none;">
                                            <i class="fa-solid fa-plus-circle text-success me-1"></i> Ekstra Hakediş
                                        </a>
                                        <a href="javascript:void(0)" class="dropdown-item hakedis-ekstra-sil-btn" data-encoded="${encodeURIComponent(matchedKuryeName)}" data-month="${targetMonthIdx}" data-year="${targetYear}" style="display:block; padding:6px 15px; clear:both; font-weight:500; color:#dc3545; text-decoration:none;">
                                            <i class="fa-solid fa-trash-can text-danger me-1"></i> Ekstra Hakediş Sil
                                        </a>
                                    </div>
                                </div>
                            </td>
                        `;
                    } else if (cellIdx === odenenecekColIndex && isTotalRow) {
                        html += `<td></td>`;
                    }
                });
                html += '</tr>';
            });
            html += '</tbody></table></div>';
            return html;
        };

        window.stepHakedisMonth = function(delta) {
            let m = parseInt(document.getElementById('hakedis-month-select')?.value ?? selectedMonthIdx) + delta;
            let y = parseInt(document.getElementById('hakedis-year-select')?.value ?? selectedYear);
            if (m < 0) { m = 11; y--; }
            else if (m > 11) { m = 0; y++; }
            window.renderHakedis(m, y);
        };

        // Persistent active month tables management
        const realMonthKey = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}`;
        let displayedMonths = JSON.parse(localStorage.getItem('hakedis_displayed_months') || '[]');
        if (!Array.isArray(displayedMonths)) displayedMonths = [];
        if (!displayedMonths.includes(realMonthKey)) {
            displayedMonths.unshift(realMonthKey);
        }
        if (!displayedMonths.includes(monthKey)) {
            displayedMonths.push(monthKey);
        }
        localStorage.setItem('hakedis_displayed_months', JSON.stringify(displayedMonths));

        window.closeHakedisMonthCard = function(dKey) {
            // Never close August if it's the only month left
            let list = JSON.parse(localStorage.getItem('hakedis_displayed_months') || '[]');
            if (dKey === realMonthKey && list.length <= 1) {
                return;
            }
            list = list.filter(k => k !== dKey);
            if (!list.includes(realMonthKey)) list.unshift(realMonthKey);
            localStorage.setItem('hakedis_displayed_months', JSON.stringify(list));
            
            const [cYear, cMonth] = dKey.split('_');
            if (parseInt(cYear) === selectedYear && (parseInt(cMonth) - 1) === selectedMonthIdx) {
                renderHakedis(now.getMonth(), now.getFullYear());
            } else {
                renderHakedis(selectedMonthIdx, selectedYear);
            }
        };

        const allTablesHtml = displayedMonths.map(dKey => {
            const [dYearStr, dMonthStr] = dKey.split('_');
            const dYear = parseInt(dYearStr);
            const dMonthIdx = parseInt(dMonthStr) - 1;
            const isBase = (dKey === realMonthKey);
            const isOnlyOne = (displayedMonths.length === 1);

            return `
                <div class="card mb-4" style="border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.04); overflow: hidden;">
                    <div class="d-flex align-items-center justify-content-between p-3" style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                        <div class="d-flex align-items-center gap-2">
                            <i class="fa-solid fa-table-list text-primary" style="font-size: 16px;"></i>
                            <h4 style="color: #1e293b; font-weight: 700; font-size: 15px; margin: 0;">
                                ${monthNames[dMonthIdx]} ${dYear} Hakediş Tablosu
                            </h4>
                            ${isBase ? '<span class="badge ms-2" style="background: #e0f2fe; color: #0284c7; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 6px;">Mevcut Dönem</span>' : ''}
                        </div>
                        ${(!isBase || !isOnlyOne) ? `
                            <button type="button" class="btn btn-sm btn-outline-danger" onclick="window.closeHakedisMonthCard('${dKey}')" style="padding: 2px 8px; font-size: 11px; border-radius: 6px;" title="Bu Tabloyu Kapat">
                                <i class="fa-solid fa-xmark"></i> Kapat
                            </button>
                        ` : ''}
                    </div>
                    ${renderHakedisBlock('ozet_truva', blocks.ozet_truva, dMonthIdx, dYear)}
                </div>
            `;
        }).join('');

        pageContainer.innerHTML = `
            <div class="card mb-3" style="border: none; border-top: 4px solid #0d9488; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); padding: 16px 20px; display: flex; flex-direction: row; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap; background: #ffffff;">
                <div class="d-flex align-items-center gap-3">
                    <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #0d9488, #14b8a6); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);">
                        <i class="fa-solid fa-file-invoice-dollar" style="font-size: 18px;"></i>
                    </div>
                    <div>
                        <h3 style="color: #0f766e; font-weight: 800; font-size: 19px; margin: 0; letter-spacing: -0.3px;">Maaş Hesaplama</h3>
                    </div>
                </div>
                <div style="display: inline-flex; align-items: center; background: #f0fdfa; border: 1.5px solid #99f6e4; border-radius: 30px; padding: 4px 8px; gap: 4px;">
                    <button type="button" class="btn btn-sm btn-light" onclick="window.stepHakedisMonth(-1)" style="width: 28px; height: 28px; border-radius: 50%; padding: 0; background: white; border: 1px solid #ccfbf1; color: #0d9488;">
                        <i class="fa-solid fa-chevron-left" style="font-size: 10px;"></i>
                    </button>
                    <div class="d-flex align-items-center gap-2 px-2">
                        <select id="hakedis-month-select" class="form-select form-select-sm" style="border: none; background: transparent; color: #0f766e; font-weight: 800; cursor: pointer;" onchange="window.renderHakedis(this.value, document.getElementById('hakedis-year-select').value)">
                            ${monthNames.map((m, idx) => `<option value="${idx}" ${idx === selectedMonthIdx ? 'selected' : ''}>${m}</option>`).join('')}
                        </select>
                        <select id="hakedis-year-select" class="form-select form-select-sm" style="border: none; background: transparent; color: #0f766e; font-weight: 800; cursor: pointer;" onchange="window.renderHakedis(document.getElementById('hakedis-month-select').value, this.value)">
                            ${[2026, 2025, 2024, 2023, 2022, 2021, 2020].map(yr => `<option value="${yr}" ${yr === selectedYear ? 'selected' : ''}>${yr}</option>`).join('')}
                        </select>
                    </div>
                    <button type="button" class="btn btn-sm btn-light" onclick="window.stepHakedisMonth(1)" style="width: 28px; height: 28px; border-radius: 50%; padding: 0; background: white; border: 1px solid #ccfbf1; color: #0d9488;">
                        <i class="fa-solid fa-chevron-right" style="font-size: 10px;"></i>
                    </button>
                </div>
            </div>
            
            <div id="h-ozet" class="h-tab-content" style="display:block; margin-bottom: 25px;">
                ${allTablesHtml}
            </div>
        `;

        // Global event delegation for hakedis dropdowns (bound only once)
        if (!window._hakedisGlobalEventsBound) {
            window._hakedisGlobalEventsBound = true;
            document.addEventListener('click', function(e) {
                const islemBtn = e.target.closest('.hakedis-islemler-btn');
                if (islemBtn) {
                    e.stopPropagation();
                    const menu = islemBtn.parentElement.querySelector('.hakedis-dropdown-menu');
                    const isOpen = menu && menu.style.display === 'block';
                    document.querySelectorAll('.hakedis-dropdown-menu').forEach(m => m.style.display = 'none');
                    if (menu) menu.style.display = isOpen ? 'none' : 'block';
                    return;
                }

                const saatUcretiBtn = e.target.closest('.hakedis-saat-ucreti-btn');
                if (saatUcretiBtn) {
                    document.querySelectorAll('.hakedis-dropdown-menu').forEach(m => m.style.display = 'none');
                    if (window.openSaatUcretiModal) {
                        const m = parseInt(saatUcretiBtn.getAttribute('data-month')) ?? selectedMonthIdx;
                        const y = parseInt(saatUcretiBtn.getAttribute('data-year')) ?? selectedYear;
                        window.openSaatUcretiModal(saatUcretiBtn.getAttribute('data-encoded'), m, y);
                    }
                    return;
                }

                const ekstraBtn = e.target.closest('.hakedis-ekstra-btn');
                if (ekstraBtn) {
                    document.querySelectorAll('.hakedis-dropdown-menu').forEach(m => m.style.display = 'none');
                    if (window.openEkstraHakedisModal) {
                        const m = parseInt(ekstraBtn.getAttribute('data-month')) ?? selectedMonthIdx;
                        const y = parseInt(ekstraBtn.getAttribute('data-year')) ?? selectedYear;
                        window.openEkstraHakedisModal(ekstraBtn.getAttribute('data-encoded'), m, y);
                    }
                    return;
                }

                const ekstraSilBtn = e.target.closest('.hakedis-ekstra-sil-btn');
                if (ekstraSilBtn) {
                    document.querySelectorAll('.hakedis-dropdown-menu').forEach(m => m.style.display = 'none');
                    if (window.deleteEkstraHakedis) {
                        const m = parseInt(ekstraSilBtn.getAttribute('data-month')) ?? selectedMonthIdx;
                        const y = parseInt(ekstraSilBtn.getAttribute('data-year')) ?? selectedYear;
                        window.deleteEkstraHakedis(ekstraSilBtn.getAttribute('data-encoded'), m, y);
                    }
                    return;
                }

                if (!e.target.closest('.hakedis-dropdown-menu')) {
                    document.querySelectorAll('.hakedis-dropdown-menu').forEach(m => m.style.display = 'none');
                }
            });
        }

        // Saat Birim Ücreti Modal
        window.openSaatUcretiModal = function(encodedName, mIdx = selectedMonthIdx, y = selectedYear) {
            document.querySelectorAll('.hakedis-dropdown-menu').forEach(m => m.style.display = 'none');
            const kuryeName = decodeURIComponent(encodedName);
            const mStr = String(mIdx + 1).padStart(2, '0');
            const yStr = String(y);
            const storageKey = `${kuryeName}_${yStr}_${mStr}`;

            const savedDetails = JSON.parse(localStorage.getItem('courierShiftDetails') || '{}');
            const pStore = JSON.parse(localStorage.getItem('monthly_payroll_data') || '{}');
            const currentWage = pStore[yStr]?.[String(mIdx + 1)]?.[kuryeName]?.saatUcreti
                             || savedDetails[storageKey]?.saatUcreti
                             || savedDetails[kuryeName]?.saatUcreti
                             || '';

            const ex = document.getElementById('saat-ucreti-modal-overlay');
            if (ex) ex.remove();
            const overlay = document.createElement('div');
            overlay.id = 'saat-ucreti-modal-overlay';
            overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;';
            overlay.innerHTML = `
                <div style="background:white;border-radius:12px;padding:28px;width:100%;max-width:440px;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="fa-solid fa-clock text-primary" style="font-size: 20px;"></i>
                        <h3 style="margin:0;font-size:18px;font-weight:700;color:#1e293b;">${kuryeName}</h3>
                    </div>
                    <div style="font-size:13px; color:#64748b; margin-bottom:18px; font-weight:600;">
                        Saat Birim Ücreti Tanımla (${monthNames[mIdx]} ${y})
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;font-size:11px;font-weight:700;color:#555;letter-spacing:0.5px;margin-bottom:6px;">SAAT BİRİM ÜCRETİ (₺)</label>
                        <input id="saat-ucreti-input" type="number" step="0.01" min="0" value="${currentWage}" placeholder="Örn: 50.00" style="width:100%;padding:10px 14px;border:2px solid #0d9488;border-radius:8px;font-size:16px;font-weight:700;color:#0f766e;outline:none;box-sizing:border-box;">
                    </div>
                    <div class="d-flex gap-2 mt-4">
                        <button id="saat-ucreti-kaydet-btn" style="flex:1;padding:12px;background:#0d9488;color:white;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;">KAYDET</button>
                        <button onclick="document.getElementById('saat-ucreti-modal-overlay').remove()" style="padding:12px 20px;background:#94a3b8;color:white;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;">VAZGEÇ</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            setTimeout(() => document.getElementById('saat-ucreti-input')?.focus(), 50);

            document.getElementById('saat-ucreti-kaydet-btn').onclick = function() {
                const val = parseFloat(document.getElementById('saat-ucreti-input').value) || 0;
                
                // 1. Save to courierShiftDetails for this month
                const sDetails = JSON.parse(localStorage.getItem('courierShiftDetails') || '{}');
                if (!sDetails[storageKey]) {
                    sDetails[storageKey] = { totalHours: 0, days: {}, month: mIdx, year: y, saatUcreti: val };
                } else {
                    sDetails[storageKey].saatUcreti = val;
                }
                localStorage.setItem('courierShiftDetails', JSON.stringify(sDetails));

                // 2. Save to monthly_payroll_data
                const pData = JSON.parse(localStorage.getItem('monthly_payroll_data') || '{}');
                const mNum = String(mIdx + 1);
                if (!pData[yStr]) pData[yStr] = {};
                if (!pData[yStr][mNum]) pData[yStr][mNum] = {};
                const old = pData[yStr][mNum][kuryeName] || {};
                const hours = parseFloat(old.saat) || parseFloat(sDetails[storageKey]?.totalHours) || 0;
                pData[yStr][mNum][kuryeName] = {
                    ...old,
                    saat: hours,
                    saatUcreti: val,
                    saatToplam: hours * val,
                    toplamHakedis: (hours * val) + (old.paketToplam || 0) + (old.netEkstra || 0),
                    odenecek: (hours * val) + (old.paketToplam || 0) + (old.netEkstra || 0)
                };
                localStorage.setItem('monthly_payroll_data', JSON.stringify(pData));

                if (window.saveToServer) window.saveToServer();
                document.getElementById('saat-ucreti-modal-overlay').remove();
                renderHakedis(mIdx, y);
            };
        };

        // Ekstra Hakediş Sil Helper
        window.deleteEkstraHakedis = function(encodedName, mIdx = selectedMonthIdx, y = selectedYear) {
            document.querySelectorAll('.hakedis-dropdown-menu').forEach(m => m.style.display = 'none');
            const kuryeName = decodeURIComponent(encodedName);
            if (confirm(`${kuryeName} kuryesine ait ${monthNames[mIdx]} ${y} ekstra hakediş kaydını silmek istediğinize emin misiniz?`)) {
                let requests = JSON.parse(localStorage.getItem('ekstra_hakedis_requests') || '[]');
                requests = requests.filter(req => !((req.kuryeName || '').trim() === kuryeName.trim() && parseInt(req.month) === mIdx && parseInt(req.year) === y));
                localStorage.setItem('ekstra_hakedis_requests', JSON.stringify(requests));
                if (window.saveToServer) window.saveToServer();
                renderHakedis(mIdx, y);
            }
        };

        // Ekstra Hakediş Modal
        window.openEkstraHakedisModal = function(encodedName, mIdx = selectedMonthIdx, y = selectedYear) {
            document.querySelectorAll('.hakedis-dropdown-menu').forEach(m => m.style.display = 'none');
            const kuryeName = decodeURIComponent(encodedName);
            const ex = document.getElementById('ekstra-hakedis-modal-overlay');
            if (ex) ex.remove();
            const overlay = document.createElement('div');
            overlay.id = 'ekstra-hakedis-modal-overlay';
            overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;';
            overlay.innerHTML = `
                <div style="background:white;border-radius:12px;padding:32px 28px;width:100%;max-width:520px;box-shadow:0 20px 60px rgba(0,0,0,0.3);max-height:90vh;overflow-y:auto;">
                    <h3 style="text-align:center;margin:0 0 24px;font-size:18px;font-weight:600;color:#222;">${kuryeName} extra ödeme talep et</h3>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;font-size:11px;font-weight:700;color:#555;letter-spacing:0.5px;margin-bottom:6px;">İLGİLİ AY</label>
                        <input type="text" value="${monthNames[mIdx]}" readonly style="width:100%;padding:10px 14px;border:2px solid #38b2ac;border-radius:6px;font-size:14px;background:#f9f9f9;box-sizing:border-box;color:#333;">
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;font-size:11px;font-weight:700;color:#555;letter-spacing:0.5px;margin-bottom:6px;">İLGİLİ YIL</label>
                        <input type="text" value="${y}" readonly style="width:100%;padding:10px 14px;border:1px solid #e0e0e0;border-radius:6px;font-size:14px;background:#f9f9f9;box-sizing:border-box;color:#333;">
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;font-size:11px;font-weight:700;color:#555;letter-spacing:0.5px;margin-bottom:6px;">İŞLEM</label>
                        <select id="ekstra-islem" style="width:100%;padding:10px 14px;border:1px solid #e0e0e0;border-radius:6px;font-size:14px;background:white;box-sizing:border-box;color:#333;">
                            <option value="TOPLAM HAKEDİŞE EKLENECEK">TOPLAM HAKEDİŞE EKLENECEK</option>
                            <option value="TOPLAM HAKEDİŞTEN ÇIKARILACAK">TOPLAM HAKEDİŞTEN ÇIKARILACAK</option>
                        </select>
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;font-size:11px;font-weight:700;color:#555;letter-spacing:0.5px;margin-bottom:6px;">KATEGORİ</label>
                        <select id="ekstra-kategori" style="width:100%;padding:10px 14px;border:1px solid #e0e0e0;border-radius:6px;font-size:14px;background:white;box-sizing:border-box;color:#333;">
                            <option value="">KATEGORİ SEÇİNİZ</option>
                            <option value="MOTOR KİRA BEDELİ">MOTOR KİRA BEDELİ</option>
                            <option value="MOTOR BAKIM ONARIM">MOTOR BAKIM ONARIM</option>
                            <option value="PRİM">PRİM</option>
                            <option value="EK ÜCRET">EK ÜCRET</option>
                            <option value="TRAFİK CEZASI">TRAFİK CEZASI</option>
                            <option value="HGS">HGS</option>
                            <option value="ZİMMET KESİNTİSİ">ZİMMET KESİNTİSİ</option>
                            <option value="DİĞER">DİĞER</option>
                        </select>
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;font-size:11px;font-weight:700;color:#555;letter-spacing:0.5px;margin-bottom:6px;">TUTAR</label>
                        <input id="ekstra-tutar" type="number" min="0" step="0.01" style="width:100%;padding:10px 14px;border:1px solid #e0e0e0;border-radius:6px;font-size:14px;background:#f9f9f9;box-sizing:border-box;">
                    </div>
                    <div style="margin-bottom:24px;">
                        <label style="display:block;font-size:11px;font-weight:700;color:#555;letter-spacing:0.5px;margin-bottom:6px;">AYRINTILI AÇIKLAMA</label>
                        <textarea id="ekstra-aciklama" rows="3" style="width:100%;padding:10px 14px;border:1px solid #e0e0e0;border-radius:6px;font-size:14px;background:#f9f9f9;resize:vertical;box-sizing:border-box;"></textarea>
                    </div>
                    <button id="ekstra-kaydet-btn" style="width:100%;padding:14px;background:#38b2ac;color:white;border:none;border-radius:8px;font-size:14px;font-weight:700;letter-spacing:1px;cursor:pointer;margin-bottom:10px;">TALEP ET</button>
                    <button onclick="document.getElementById('ekstra-hakedis-modal-overlay').remove()" style="width:100%;padding:14px;background:#6c757d;color:white;border:none;border-radius:8px;font-size:14px;font-weight:700;letter-spacing:1px;cursor:pointer;">VAZGEÇ</button>
                </div>
            `;
            document.body.appendChild(overlay);
            document.getElementById('ekstra-kaydet-btn').onclick = function() {
                const islem = document.getElementById('ekstra-islem').value;
                const kategori = document.getElementById('ekstra-kategori').value;
                const tutar = parseFloat(document.getElementById('ekstra-tutar').value) || 0;
                const aciklama = document.getElementById('ekstra-aciklama').value.trim();

                if (!kategori) {
                    alert('Lütfen bir kategori seçiniz.');
                    return;
                }
                if (tutar <= 0) {
                    alert('Lütfen geçerli bir tutar giriniz.');
                    return;
                }

                const requests = JSON.parse(localStorage.getItem('ekstra_hakedis_requests') || '[]');
                requests.push({
                    kuryeName: kuryeName,
                    islem: islem,
                    kategori: kategori,
                    tutar: tutar,
                    aciklama: aciklama,
                    month: mIdx,
                    year: y,
                    ay: monthNames[mIdx],
                    yil: y,
                    createdAt: new Date().toISOString()
                });
                localStorage.setItem('ekstra_hakedis_requests', JSON.stringify(requests));
                if (window.saveToServer) window.saveToServer();

                document.getElementById('ekstra-hakedis-modal-overlay').remove();
                alert(`${kuryeName} için ${monthNames[mIdx]} ${y} ekstra hakediş talebi başarıyla kaydedildi!`);
                renderHakedis(mIdx, y);
            };
        };
    }
    window.renderHakedis = renderHakedis;

    function renderKuryeListesi() {
        if (!localStorage.getItem('activeCouriers') && AppData.activeCouriers) {
            localStorage.setItem('activeCouriers', JSON.stringify(AppData.activeCouriers.active_couriers || []));
        }
        const data = JSON.parse(localStorage.getItem('activeCouriers')) || [];
        
        window.deleteCourier = function(index) {
            if(confirm('Kuryeyi silmek istediğinize emin misiniz?')) {
                data.splice(index, 1);
                localStorage.setItem('activeCouriers', JSON.stringify(data));
                renderKuryeListesi();
            }
        };

        window.toggleCourierStatus = function(index) {
            let current = data[index].durum || 'Çevrimdışı';
            data[index].durum = current === 'Çevrimiçi' ? 'Çevrimdışı' : 'Çevrimiçi';
            localStorage.setItem('activeCouriers', JSON.stringify(data));
            renderKuryeListesi();
        };

        window.editCourierRow = function(index) {
            window.editingCourierIndex = index;
            renderKuryeListesi();
        };

        window.saveCourierRow = function(index) {
            data[index].bolge = document.getElementById(`edit-c-bolge-${index}`).value;
            data[index].adi = document.getElementById(`edit-c-adi-${index}`).value;
            data[index].kullanici_adi = document.getElementById(`edit-c-kullanici-${index}`).value;
            data[index].plaka = document.getElementById(`edit-c-plaka-${index}`).value;
            data[index].tel = document.getElementById(`edit-c-tel-${index}`).value;
            
            localStorage.setItem('activeCouriers', JSON.stringify(data));
            window.editingCourierIndex = -1;
            renderKuryeListesi();
        };

        window.cancelCourierEdit = function() {
            window.editingCourierIndex = -1;
            renderKuryeListesi();
        };

        pageContainer.innerHTML = `
            <div class="card">
                <div class="filter-section">
                    <div class="filter-group">
                        <label class="form-label">BÖLGE:</label>
                        <select class="form-control" id="kurye-bolge-filter">
                            <option>HEPSİ</option>
                            <option>BAHÇELİEVLER</option>
                            <option>FATİH</option>
                            <option>ZEYTİNBURNU</option>
                        </select>
                    </div>
                    <div class="filter-group text-right">
                        <label class="form-label">&nbsp;</label>
                        <button class="btn btn-primary"><i class="fa-solid fa-sync"></i> YENİLE</button>
                    </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <select class="form-control" style="width: auto; display: inline-block;">
                            <option>50</option>
                            <option>100</option>
                        </select>
                        <span class="text-muted ml-2">Kayıt Göster</span>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <label class="mb-0">Ara:</label>
                        <input type="text" class="form-control" style="width: 200px;">
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>KURYE NO</th>
                                <th>BÖLGE</th>
                                <th>ADI</th>
                                <th>KULLANICI ADI</th>
                                <th>PLAKA</th>
                                <th>TELEFON</th>
                                <th>KAYIT TARİHİ</th>
                                <th>#</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map((k, idx) => {
                                if (window.editingCourierIndex === idx) {
                                    return `
                                        <tr style="background-color:#f8f9fa;">
                                            <td>${k.id || (idx+1)}</td>
                                            <td><input type="text" class="form-control form-control-sm" id="edit-c-bolge-${idx}" value="${k.bolge}"></td>
                                            <td><input type="text" class="form-control form-control-sm" id="edit-c-adi-${idx}" value="${k.adi}"></td>
                                            <td><input type="text" class="form-control form-control-sm" id="edit-c-kullanici-${idx}" value="${k.kullanici_adi}"></td>
                                            <td><input type="text" class="form-control form-control-sm" id="edit-c-plaka-${idx}" value="${k.plaka || ''}"></td>
                                            <td><input type="text" class="form-control form-control-sm" id="edit-c-tel-${idx}" value="${k.tel || ''}"></td>
                                            <td>${k.kayit_tarihi}</td>
                                            <td>
                                                <button class="btn btn-success btn-sm p-1 px-2" onclick="saveCourierRow(${idx})"><i class="fa-solid fa-save"></i> Kaydet</button>
                                                <button class="btn btn-secondary btn-sm p-1 px-2" onclick="cancelCourierEdit()"><i class="fa-solid fa-times"></i> İptal</button>
                                            </td>
                                        </tr>
                                    `;
                                } else {
                                    return `
                                        <tr>
                                            <td>${k.id || (idx+1)}</td>
                                            <td>${k.bolge}</td>
                                            <td><strong>${k.adi}</strong></td>
                                            <td>${k.kullanici_adi}</td>
                                            <td>${k.plaka || '-'}</td>
                                            <td>${k.tel || '-'}</td>
                                            <td>${k.kayit_tarihi}</td>
                                            <td>
                                                <div class="d-flex align-items-center">

                                                     <div class="dropdown">
                                                         <button class="btn btn-info" style="background-color: #38b2ac; padding: 4px 8px; font-size: 12px;" onclick="event.stopPropagation(); this.nextElementSibling.classList.toggle('show')">İşlemler <i class="fa-solid fa-caret-down"></i></button>
                                                         <div class="dropdown-content">
                                                             <a href="#" class="dropdown-item" onclick="editCourierRow(${idx})"><i class="fa-solid fa-pen" style="color: #339af0;"></i> Düzenle</a>
                                                             <a href="#" class="dropdown-item" onclick="event.preventDefault(); window.toggleCourierStatus('${k.id || k.no}', true)"><i class="fa-solid fa-ban" style="color: #e63946;"></i> Pasife Al</a>
                                                         </div>
                                                     </div>
                                                </div>
                                            </td>
                                        </tr>
                                    `;
                                }
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function renderIsyeriListesi() {
        if (!localStorage.getItem('activeShops') && AppData.activeShops) {
            localStorage.setItem('activeShops', JSON.stringify(AppData.activeShops.active_shops || []));
        }
        const data = JSON.parse(localStorage.getItem('activeShops')) || [];
        
        const totalBakiye = data.reduce((sum, s) => {
            const val = parseFloat(s.bakiye ? s.bakiye.toString().replace(/[^\d.-]/g, '').replace(',', '.') : 0) || 0;
            return sum + val;
        }, 0);
        const totalBakiyeFmt = totalBakiye.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺';
        
        window.deleteShop = function(index) {
            if(confirm('Üye İşyerini silmek istediğinize emin misiniz?')) {
                data.splice(index, 1);
                localStorage.setItem('activeShops', JSON.stringify(data));
                renderIsyeriListesi();
            }
        };

        window.editShopRow = function(index) {
            window.editingShopIndex = index;
            renderIsyeriListesi();
        };

        window.saveShopRow = function(index) {
            data[index].bolge = document.getElementById(`edit-s-bolge-${index}`).value;
            data[index].tabela = document.getElementById(`edit-s-tabela-${index}`).value;
            data[index].kullanici_adi = document.getElementById(`edit-s-kullanici-${index}`).value;
            data[index].sifre = document.getElementById(`edit-s-sifre-${index}`).value;
            data[index].bakiye = document.getElementById(`edit-s-bakiye-${index}`).value;
            
            localStorage.setItem('activeShops', JSON.stringify(data));
            window.editingShopIndex = -1;
            renderIsyeriListesi();
        };

        window.cancelShopEdit = function() {
            window.editingShopIndex = -1;
            renderIsyeriListesi();
        };

        pageContainer.innerHTML = `
            <div class="card">
                <div class="filter-section">
                    <div class="filter-group">
                        <label class="form-label">BÖLGE:</label>
                        <select class="form-control">
                            <option>HEPSİ</option>
                            <option>BAHÇELİEVLER</option>
                            <option>FATİH</option>
                            <option>ZEYTİNBURNU</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label class="form-label">SORUMLU:</label>
                        <select class="form-control">
                            <option>HEPSİ</option>
                            <option>KENDİM</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label class="form-label">FATURA:</label>
                        <select class="form-control">
                            <option>HEPSİ</option>
                            <option>BU AY FATURA KESMEYEN</option>
                            <option>BU AY FATURA KESEN</option>
                            <option>GEÇEN AY FATURA KESMEYEN</option>
                            <option>GEÇEN AY FATURA KESEN</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label class="form-label">HİZMET TÜRÜ:</label>
                        <select class="form-control">
                            <option>HEPSİ</option>
                            <option>TAM ZAMANLI 30/9</option>
                            <option>PAKET</option>
                            <option>50 KONTÖR</option>
                        </select>
                    </div>
                    <div class="filter-group text-right">
                        <button class="btn btn-info" style="background-color: #38b2ac; margin-top:28px;"><i class="fa-solid fa-sync"></i> YENİLE</button>
                    </div>
                </div>
                
                <!-- Tabs -->
                <div class="tabs">
                    <div class="tab active">Liste</div>
                    <div class="tab">Harita</div>
                </div>

                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ÜYE İŞYERİ NO</th>
                                <th>BÖLGE</th>
                                <th>ÜYE İŞYERİ ADI</th>
                                <th>KULLANICI ADI</th>
                                <th>BAKİYE</th>
                                <th>KAYIT TARİHİ</th>
                                <th>LİSANS SÜRESİ</th>
                                <th>#</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map((s, idx) => {
                                if (window.editingShopIndex === idx) {
                                    return `
                                        <tr style="background-color:#f8f9fa;">
                                            <td>${s.no || (idx+1)}</td>
                                            <td><input type="text" class="form-control form-control-sm" id="edit-s-bolge-${idx}" value="${s.bolge}"></td>
                                            <td><input type="text" class="form-control form-control-sm" id="edit-s-tabela-${idx}" value="${s.tabela}"></td>
                                            <td><input type="text" class="form-control form-control-sm" id="edit-s-kullanici-${idx}" value="${s.kullanici_adi}"></td>
                                            <td><input type="text" class="form-control form-control-sm" id="edit-s-bakiye-${idx}" value="${s.bakiye || '0'}"></td>
                                            <td>${s.kayit_tarihi}</td>
                                            <td><span class="text-success">${s.lisans_suresi || '30 Gün'}</span></td>
                                            <td>
                                                <button class="btn btn-success btn-sm p-1 px-2" onclick="saveShopRow(${idx})"><i class="fa-solid fa-save"></i> Kaydet</button>
                                                <button class="btn btn-secondary btn-sm p-1 px-2" onclick="cancelShopEdit()"><i class="fa-solid fa-times"></i> İptal</button>
                                            </td>
                                        </tr>
                                    `;
                                } else {
                                    return `
                                        <tr>
                                            <td>${s.no || (idx+1)}</td>
                                            <td>${s.bolge}</td>
                                            <td><strong>${s.tabela}</strong></td>
                                            <td>${s.kullanici_adi}</td>
                                            <td><span style="color: ${(s.bakiye && s.bakiye.toString().includes('-')) ? '#fa5252' : '#d99a00'};">${s.bakiye || '0'}</span></td>
                                            <td>${s.kayit_tarihi}</td>
                                            <td><span class="text-success">${s.lisans_suresi || '30 Gün'}</span></td>
                                            <td>
                                                <div class="d-flex align-items-center">

                                                     <div class="dropdown">
                                                         <button class="btn btn-info" style="background-color: #38b2ac; padding: 4px 8px; font-size: 12px;" onclick="event.stopPropagation(); this.nextElementSibling.classList.toggle('show')">İşlemler <i class="fa-solid fa-caret-down"></i></button>
                                                         <div class="dropdown-content">
                                                             <a href="#" class="dropdown-item" onclick="editShopRow(${idx})"><i class="fa-solid fa-pen" style="color: #339af0;"></i> Düzenle</a>
                                                             <a href="#" class="dropdown-item" onclick="event.preventDefault(); window.toggleShopStatus('${s.id || s.no}', true)"><i class="fa-solid fa-ban" style="color: #e63946;"></i> Pasife Al</a>
                                                         </div>
                                                     </div>
                                                </div>
                                            </td>
                                        </tr>
                                    `;
                                }
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="total-card">
                    <i class="fa-solid fa-money-bill-wave"></i>
                    <div class="total-card-info">
                        <h4>TOPLAM BAKİYE</h4>
                        <h2>${totalBakiyeFmt}</h2>
                    </div>
                </div>
            </div>
        `;
    }

    function renderShiftTakip() {
        const rawShifts = AppData.shifts?.shift_couriers || [];
        const shops = AppData.shifts?.shift_shops || [];
        
        // Ensure activeCouriers are automatically included in shift list
        const activeCouriers = JSON.parse(localStorage.getItem('activeCouriers')) || (AppData.activeCouriers ? AppData.activeCouriers.active_couriers : []);
        let shifts = [...rawShifts];
        
        activeCouriers.forEach(ac => {
            if (ac.adi && !shifts.some(s => s.kurye && s.kurye.toLowerCase() === ac.adi.toLowerCase())) {
                shifts.push({ bolge: ac.bolge || 'BAHÇELİEVLER', kurye: ac.adi });
            }
        });

        window.deleteShiftCourier = function(courierName) {
            if (confirm(courierName + ' kuryesini shift takip listesinden ve kayıtlı sistemden silmek istediğinize emin misiniz?')) {
                if (AppData.shifts && AppData.shifts.shift_couriers) {
                    AppData.shifts.shift_couriers = AppData.shifts.shift_couriers.filter(s => s.kurye && s.kurye.toLowerCase() !== courierName.toLowerCase());
                }

                let activeCouriers = JSON.parse(localStorage.getItem('activeCouriers')) || [];
                activeCouriers = activeCouriers.filter(c => c.adi && c.adi.toLowerCase() !== courierName.toLowerCase());
                localStorage.setItem('activeCouriers', JSON.stringify(activeCouriers));

                if (window.saveToServer) window.saveToServer();
                renderShiftTakip();
            }
        };

        const savedDetails = JSON.parse(localStorage.getItem('courierShiftDetails') || '{}');
        
        pageContainer.innerHTML = `
            <div class="card">
                <h3 class="card-title mb-4">Kurye Shift Takip</h3>
                
                <div class="table-responsive mb-4">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Bölge</th>
                                <th>Kurye</th>
                                <th>İşbaşı <span class="text-muted" style="font-size:10px;text-transform:none;">Örnek: 10:00</span></th>
                                <th>İşsonu <span class="text-muted" style="font-size:10px;text-transform:none;">Örnek: 21:00</span></th>
                                <th>Üye İşyeri <i class="fa-solid fa-info-circle text-muted"></i></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${shifts.map(s => {
                                const todayShift = savedDetails[s.kurye]?.todayShift || {};
                                return `
                                    <tr class="shift-main-row" data-kurye="${s.kurye}">
                                        <td>${s.bolge}</td>
                                        <td style="white-space: nowrap;">
                                            <div style="display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;">
                                                <strong><a href="javascript:void(0)" style="color: #0284c7; text-decoration: none; cursor: pointer;" onclick="window.openShiftDetail('${s.kurye.replace(/'/g, "\\'")}')">${s.kurye} <i class="fa-solid fa-caret-right" style="margin-left: 4px;"></i></a></strong>
                                                ${savedDetails[s.kurye] && savedDetails[s.kurye].totalHours ? `<span class="badge" style="background:#0ca678; color:white; font-size:11px; padding:3px 8px; border-radius:4px; white-space:nowrap; display:inline-block;">${savedDetails[s.kurye].totalHours} Saat</span>` : ''}
                                            </div>
                                        </td>
                                        <td><input type="time" class="form-control form-control-sm shift-main-start" style="border: 1px solid #ced4da; background: white;" value="${todayShift.start || ''}"></td>
                                        <td><input type="time" class="form-control form-control-sm shift-main-end" style="border: 1px solid #ced4da; background: white;" value="${todayShift.end || ''}"></td>
                                        <td>
                                            <select class="form-control form-control-sm shift-main-shop" style="padding: 4px 6px; font-size:13px; border: 1px solid #ced4da;">
                                                <option value="Yok">Yok</option>
                                                ${shops.map(shop => `<option ${todayShift.shop === shop ? 'selected' : ''}>${shop}</option>`).join('')}
                                            </select>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">*Belirlediğiniz saatler kuryeye bildirim olarak gönderilecektir</small>
                    <div class="d-flex align-items-center gap-3">
                        <label class="d-flex align-items-center gap-2 mb-0">
                            <input type="checkbox"> Sonraki 
                            <input type="number" class="form-control" style="width: 60px; padding: 4px;" value="7"> gün için de uygula
                        </label>
                        <button class="btn btn-outline-primary" style="border: 1px solid #339af0; color: #339af0; background: white;" onclick="window.saveMainShiftList(true)">DÜZENLE VE KAYDET</button>
                    </div>
                </div>
            </div>
        `;

        window.saveMainShiftList = function(showAlert = false) {
            const savedDetails = JSON.parse(localStorage.getItem('courierShiftDetails') || '{}');
            const rows = document.querySelectorAll('.shift-main-row');
            rows.forEach(tr => {
                const courier = tr.getAttribute('data-kurye');
                if (!courier) return;
                const start = tr.querySelector('.shift-main-start')?.value.trim() || '';
                const end = tr.querySelector('.shift-main-end')?.value.trim() || '';
                const shop = tr.querySelector('.shift-main-shop')?.value || 'Yok';
                
                let currentMonth = new Date().getMonth();
                let currentYear = new Date().getFullYear();
                const yStr = String(currentYear);
                const mNum = String(currentMonth + 1);
                const mStr = mNum.padStart(2, '0');
                const mKey = `${courier}_${yStr}_${mStr}`;
                const wage = savedDetails[mKey]?.saatUcreti || savedDetails[courier]?.saatUcreti || 0;

                let hours = 0;
                if (start && end) {
                    let [sH, sM] = start.split(':').map(Number);
                    let [eH, eM] = end.split(':').map(Number);
                    if (!isNaN(sH) && !isNaN(eH)) {
                        sM = sM || 0;
                        eM = eM || 0;
                        let sTime = sH + (sM / 60);
                        let eTime = eH + (eM / 60);
                        if (eTime >= sTime) {
                            hours = eTime - sTime;
                        } else {
                            hours = (24 - sTime) + eTime;
                        }
                    }
                }

                if (!savedDetails[courier]) {
                    savedDetails[courier] = { totalHours: 0, days: {}, month: currentMonth, year: currentYear };
                }
                
                savedDetails[courier].month = currentMonth;
                savedDetails[courier].year = currentYear;
                savedDetails[courier].todayShift = { start, end, shop };
                savedDetails[courier].saatUcreti = wage;

                if (!savedDetails[courier].days) savedDetails[courier].days = {};
                let currentDay = new Date().getDate();
                if (start || end) {
                    savedDetails[courier].days[currentDay] = { start, end, shop, hours };
                } else if (!savedDetails[courier].days[currentDay]) {
                    savedDetails[courier].days[currentDay] = { start: '', end: '', shop: 'Yok', hours: 0 };
                }
                
                let total = 0;
                let dayEntries = Object.values(savedDetails[courier].days || {});
                if (dayEntries.length > 0) {
                    dayEntries.forEach(d => {
                        total += (d.hours || 0);
                    });
                }
                if (total > 0 || start || end) {
                    savedDetails[courier].totalHours = Math.round(total * 100) / 100;
                }

                // Also save with exact month key for this month
                savedDetails[mKey] = {
                    totalHours: savedDetails[courier].totalHours || 0,
                    days: savedDetails[courier].days || {},
                    month: currentMonth,
                    year: currentYear,
                    saatUcreti: wage,
                    updatedAt: new Date().toISOString()
                };

                // Sync to monthly_payroll_data
                const pStore = JSON.parse(localStorage.getItem('monthly_payroll_data') || '{}');
                if (!pStore[yStr]) pStore[yStr] = {};
                if (!pStore[yStr][mNum]) pStore[yStr][mNum] = {};
                const oldEntry = pStore[yStr][mNum][courier] || {};
                const hoursVal = savedDetails[courier].totalHours || 0;
                pStore[yStr][mNum][courier] = {
                    ...oldEntry,
                    saat: hoursVal,
                    saatUcreti: wage,
                    saatToplam: hoursVal * wage,
                    toplamHakedis: (hoursVal * wage) + (oldEntry.paketToplam || 0) + (oldEntry.netEkstra || 0),
                    odenecek: (hoursVal * wage) + (oldEntry.paketToplam || 0) + (oldEntry.netEkstra || 0)
                };
                localStorage.setItem('monthly_payroll_data', JSON.stringify(pStore));
            });

            localStorage.setItem('courierShiftDetails', JSON.stringify(savedDetails));
            if (window.saveToServer) window.saveToServer();
            if (showAlert) {
                alert('Shift verileri başarıyla kaydedildi!');
                renderShiftTakip();
            }
        };
    }
    window.renderShiftTakip = renderShiftTakip;

    
    window.copyShiftRowToNext = function(btn) {
        const tr = btn.closest('tr');
        const day = parseInt(tr.getAttribute('data-day'));
        const nextTr = tr.parentElement.querySelector(`tr[data-day="${day + 1}"]`);
        if (tr && nextTr) {
            const start = tr.querySelector('.shift-start')?.value || '';
            const end = tr.querySelector('.shift-end')?.value || '';
            const shop = tr.querySelector('.shift-shop')?.value || 'Yok';
            
            const nextStart = nextTr.querySelector('.shift-start');
            const nextEnd = nextTr.querySelector('.shift-end');
            const nextShop = nextTr.querySelector('.shift-shop');
            
            if (nextStart) nextStart.value = start;
            if (nextEnd) nextEnd.value = end;
            if (nextShop) nextShop.value = shop;
        }
    };

    window.resetShiftRow = function(btn) {
        const tr = btn.closest('tr');
        if (tr) {
            tr.querySelectorAll('input').forEach(inp => inp.value = '');
            const select = tr.querySelector('select');
            if (select) select.value = 'Yok';
        }
    };

    window.openShiftDetail = function(courierName, selectedMonthIdx, selectedYear) {
        const now = new Date();
        if (selectedMonthIdx === undefined || selectedMonthIdx === null) {
            selectedMonthIdx = now.getMonth();
        }
        if (selectedYear === undefined || selectedYear === null) {
            selectedYear = now.getFullYear();
        }
        selectedMonthIdx = parseInt(selectedMonthIdx);
        selectedYear = parseInt(selectedYear);
        
        const months = ['OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN', 'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK'];
        const monthStr = String(selectedMonthIdx + 1).padStart(2, '0');
        const storageKey = `${courierName}_${selectedYear}_${monthStr}`;

        const shops = AppData.shifts?.shift_shops || [];
        const savedDetails = JSON.parse(localStorage.getItem('courierShiftDetails') || '{}');
        
        let courierData = {};
        if (savedDetails[storageKey] && savedDetails[storageKey].days) {
            courierData = savedDetails[storageKey].days;
        } else {
            // Strict match for this courier and selected month
            for (const key of Object.keys(savedDetails)) {
                if (key.endsWith(`_${selectedYear}_${monthStr}`)) {
                    const cleanKeyName = key.replace(/_\d{4}_\d{2}$/, '');
                    if (cleanKeyName.trim().toLowerCase() === courierName.trim().toLowerCase() || window.isCourierMatch(courierName, cleanKeyName)) {
                        if (savedDetails[key] && savedDetails[key].days) {
                            courierData = savedDetails[key].days;
                            break;
                        }
                    }
                }
            }
        }
        
        let html = `
            <div class="card mb-3" style="border-top: 3px solid #38b2ac;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h3 class="mb-0" style="color: #38b2ac; font-size: 20px; font-weight: 700;">${courierName} - Shift Takip Detayı</h3>
                    <div style="font-size: 13px;">
                        <button type="button" class="btn btn-sm btn-outline-secondary" onclick="window.renderShiftTakip()" style="font-weight: 600;">
                            <i class="fa-solid fa-arrow-left"></i> Kurye Shift Takip'e Dön
                        </button>
                    </div>
                </div>
                
                <div class="d-flex gap-3 mb-4 mt-3">
                    <select id="detail-month-select" class="form-control" style="max-width: 200px; font-weight: bold; border: 2px solid #38b2ac;">
                        ${months.map((m, idx) => `<option value="${idx}" ${idx === selectedMonthIdx ? 'selected' : ''}>${m}</option>`).join('')}
                    </select>
                    <select id="detail-year-select" class="form-control" style="max-width: 150px; font-weight: bold; border: 2px solid #38b2ac;">
                        ${[2026, 2025, 2024, 2023, 2022, 2021, 2020].map(y => `<option value="${y}" ${y === selectedYear ? 'selected' : ''}>${y}</option>`).join('')}
                    </select>
                    <button class="btn btn-primary" style="flex: 1;" onclick="window.openShiftDetail('${courierName.replace(/'/g, "\\'")}', document.getElementById('detail-month-select').value, document.getElementById('detail-year-select').value)"><i class="fa-solid fa-sync"></i> YENİLE</button>
                </div>
                
                <div class="table-responsive">
                    <table class="table table-bordered table-sm" style="font-size: 12px; white-space: nowrap;">
                        <thead>
                            <tr style="background-color: #f8f9fa;">
                                <th>Tarih</th>
                                <th>İşbaşı <span class="text-muted" style="font-size:10px;text-transform:none;">Örnek: 10:00</span></th>
                                <th>İşsonu <span class="text-muted" style="font-size:10px;text-transform:none;">Örnek: 21:00</span></th>
                                <th>Üye İşyeri <i class="fa-solid fa-info-circle text-muted"></i></th>
                                <th style="width: 70px; text-align: center;">Sıfırla</th>
                            </tr>
                        </thead>
                        <tbody id="shift-detail-tbody">
        `;
        
        const daysInMonth = new Date(selectedYear, selectedMonthIdx + 1, 0).getDate();
        const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
        
        for (let i = 1; i <= daysInMonth; i++) {
            let dateObj = new Date(selectedYear, selectedMonthIdx, i);
            let dayName = dayNames[dateObj.getDay()];
            let dateStr = `${String(i).padStart(2, '0')}-${monthStr}-${selectedYear} (${dayName})`;
            let isWeekend = (dayName === 'Cumartesi' || dayName === 'Pazar');
            let color = isWeekend ? '#d99a00' : '#38b2ac';
            let savedDay = courierData[i] || {};
            
            html += `
                <tr data-day="${i}">
                    <td style="color: ${color}; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                        <span><i class="fa-solid fa-thumbtack text-muted" style="font-size:10px;"></i> ${dateStr}</span>
                        ${i < daysInMonth ? `<button type="button" class="btn btn-sm btn-light p-0 px-1" onclick="window.copyShiftRowToNext(this)" style="border: 1px solid #ced4da; font-size: 10px;" title="Alt Satıra Kopyala"><i class="fa-solid fa-arrow-down"></i></button>` : ''}
                    </td>
                    <td><input type="time" class="form-control form-control-sm shift-start" style="border: 1px solid #ced4da; background: white;" value="${savedDay.start || ''}"></td>
                    <td><input type="time" class="form-control form-control-sm shift-end" style="border: 1px solid #ced4da; background: white;" value="${savedDay.end || ''}"></td>
                    <td>
                        <select class="form-control form-control-sm shift-shop" style="border: 1px solid #ced4da;">
                            <option value="Yok">Yok</option>
                            ${shops.map(shop => `<option ${savedDay.shop === shop ? 'selected' : ''}>${shop}</option>`).join('')}
                        </select>
                    </td>
                    <td style="text-align: center;">
                        <button type="button" class="btn btn-sm btn-outline-secondary p-1" onclick="window.resetShiftRow(this)" style="font-size: 11px; padding: 2px 6px !important;">Sıfırla</button>
                    </td>
                </tr>
            `;
        }
        
        html += `
                        </tbody>
                    </table>
                </div>
                
                <div class="d-flex justify-content-between align-items-center mt-4 pt-3" style="border-top: 1px solid #eee;">
                    <small class="text-muted">*Belirlediğiniz saatler kuryeye bildirim olarak gönderilecektir</small>
                    <button class="btn btn-outline-primary px-4" style="border: 1px solid #339af0; color: #339af0; background: white; font-weight: bold;" onclick="window.saveShiftDetail('${courierName.replace(/'/g, "\\'")}', ${selectedMonthIdx}, ${selectedYear})">DÜZENLE VE KAYDET</button>
                </div>
            </div>
        `;
        
        pageContainer.innerHTML = html;

        // Instant change listeners for Month & Year select
        document.getElementById('detail-month-select')?.addEventListener('change', (e) => {
            window.openShiftDetail(courierName, parseInt(e.target.value), parseInt(document.getElementById('detail-year-select').value));
        });
        document.getElementById('detail-year-select')?.addEventListener('change', (e) => {
            window.openShiftDetail(courierName, parseInt(document.getElementById('detail-month-select').value), parseInt(e.target.value));
        });
    };

    window.saveShiftDetail = function(courierName, selectedMonthIdx = null, selectedYear = null) {
        const now = new Date();
        if (selectedMonthIdx === null || selectedMonthIdx === undefined) selectedMonthIdx = now.getMonth();
        if (selectedYear === null || selectedYear === undefined) selectedYear = now.getFullYear();
        selectedMonthIdx = parseInt(selectedMonthIdx);
        selectedYear = parseInt(selectedYear);
        const monthStr = String(selectedMonthIdx + 1).padStart(2, '0');
        const storageKey = `${courierName}_${selectedYear}_${monthStr}`;

        const savedDetails = JSON.parse(localStorage.getItem('courierShiftDetails') || '{}');
        let daysData = {};
        let totalWorkedHours = 0;

        const rows = document.querySelectorAll('#shift-detail-tbody tr');
        rows.forEach((tr) => {
            const dayNum = tr.getAttribute('data-day');
            const start = tr.querySelector('.shift-start')?.value.trim() || '';
            const end = tr.querySelector('.shift-end')?.value.trim() || '';
            const shop = tr.querySelector('.shift-shop')?.value || 'Yok';

            let hours = 0;
            if (start && end) {
                let [sH, sM] = start.split(':').map(Number);
                let [eH, eM] = end.split(':').map(Number);
                if (!isNaN(sH) && !isNaN(eH)) {
                    sM = sM || 0;
                    eM = eM || 0;
                    let sTime = sH + (sM / 60);
                    let eTime = eH + (eM / 60);
                    if (eTime >= sTime) {
                        hours = eTime - sTime;
                    } else {
                        hours = (24 - sTime) + eTime;
                    }
                }
            } else if (!isNaN(parseFloat(start)) && isNaN(parseFloat(end))) {
                hours = parseFloat(start);
            }

            totalWorkedHours += hours;
            daysData[dayNum] = { start, end, shop, hours };
        });

        const wage = (savedDetails[storageKey] && savedDetails[storageKey].saatUcreti) 
                  || (savedDetails[courierName] && savedDetails[courierName].saatUcreti) 
                  || 0;

        // Save STRICTLY for this courier and this specific month
        savedDetails[storageKey] = {
            totalHours: Math.round(totalWorkedHours * 100) / 100,
            days: daysData,
            month: selectedMonthIdx,
            year: selectedYear,
            saatUcreti: wage,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem('courierShiftDetails', JSON.stringify(savedDetails));

        // Save to monthly_payroll_data for STRICTLY this courier and this selected month
        const pStore = JSON.parse(localStorage.getItem('monthly_payroll_data') || '{}');
        const yStr = String(selectedYear);
        const mNum = String(selectedMonthIdx + 1);
        if (!pStore[yStr]) pStore[yStr] = {};
        if (!pStore[yStr][mNum]) pStore[yStr][mNum] = {};
        const oldEntry = pStore[yStr][mNum][courierName] || {};
        const workedHours = Math.round(totalWorkedHours * 100) / 100;
        const currentWage = wage || oldEntry.saatUcreti || 0;
        pStore[yStr][mNum][courierName] = {
            ...oldEntry,
            saat: workedHours,
            saatUcreti: currentWage,
            saatToplam: workedHours * currentWage,
            toplamHakedis: (workedHours * currentWage) + (oldEntry.paketToplam || 0) + (oldEntry.netEkstra || 0),
            odenecek: (workedHours * currentWage) + (oldEntry.paketToplam || 0) + (oldEntry.netEkstra || 0)
        };
        localStorage.setItem('monthly_payroll_data', JSON.stringify(pStore));

        const resets = JSON.parse(localStorage.getItem('hakedis_monthly_resets') || '{}');
        delete resets[`${selectedYear}_${monthStr}`];
        localStorage.setItem('hakedis_monthly_resets', JSON.stringify(resets));

        if (window.saveToServer) window.saveToServer();

        const months = ['OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN', 'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK'];
        alert(`${courierName} için ${months[selectedMonthIdx]} ${selectedYear} shift verileri kaydedildi!\nHesaplanan Toplam Çalışılan Saat: ${Math.round(totalWorkedHours * 100) / 100} saat`);
        if (window.renderShiftTakip) window.renderShiftTakip();
    };

    function renderPasifKullanicilar() {
        const passiveUsers = JSON.parse(localStorage.getItem('passiveUsers')) || (AppData.passiveUsers || { passive_shops: [], passive_couriers: [] });
        const passiveShops = passiveUsers.passive_shops || [];
        const passiveCouriers = passiveUsers.passive_couriers || [];
        
        pageContainer.innerHTML = `
            <div class="card">
                <div class="tabs">
                    <div class="tab active" onclick="document.getElementById('p-shops').style.display='block'; document.getElementById('p-couriers').style.display='none'; this.classList.add('active'); this.nextElementSibling.classList.remove('active');">Üye İşyeri</div>
                    <div class="tab" onclick="document.getElementById('p-shops').style.display='none'; document.getElementById('p-couriers').style.display='block'; this.classList.add('active'); this.previousElementSibling.classList.remove('active');">Kuryeler</div>
                </div>
                
                <div id="p-shops">
                    <h3 class="mb-4">Pasif Üye İşyerleri (${passiveShops.length})</h3>
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <span class="text-muted mr-2">Sayfada</span>
                            <select id="shops-per-page" class="form-control" style="width: auto; display: inline-block;">
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="200">200</option>
                            </select>
                            <span class="text-muted ml-2">Kayıt Göster</span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <label class="mb-0">Ara:</label>
                            <input type="text" id="shops-search" class="form-control" style="width: 200px;" placeholder="İşyeri Ara...">
                        </div>
                    </div>
                    
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>ÜYE İŞYERİ NO</th>
                                    <th>TABELA ADI</th>
                                    <th>RESMİ ÜNVAN</th>
                                    <th>TELEFON</th>
                                    <th>BÖLGE</th>
                                    <th>SON BAKİYE</th>
                                    <th>#</th>
                                </tr>
                            </thead>
                            <tbody id="shops-tbody">
                                <!-- JS Populated -->
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-end mt-3">
                        <span class="text-muted" style="font-size: 13px;" id="shops-info"></span>
                        <div class="d-flex flex-column align-items-end gap-2">
                            <div class="btn-group" id="shops-pagination" style="display: flex; border: 1px solid #dee2e6; border-radius: 4px; overflow: hidden; background: white;">
                                <!-- JS Populated -->
                            </div>
                            <button class="btn" style="background-color: #4bc0c0; color: white; border-radius: 4px; padding: 8px 24px; font-weight: 500; font-size: 16px;"><i class="fa-solid fa-file-excel"></i> Excel'e Aktar</button>
                        </div>
                    </div>
                </div>

                <div id="p-couriers" style="display:none;">
                    <h3 class="mb-4">Pasif Kuryeler (${passiveCouriers.length})</h3>
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <span class="text-muted mr-2">Sayfada</span>
                            <select id="couriers-per-page" class="form-control" style="width: auto; display: inline-block;">
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="200">200</option>
                            </select>
                            <span class="text-muted ml-2">Kayıt Göster</span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <label class="mb-0">Ara:</label>
                            <input type="text" id="couriers-search" class="form-control" style="width: 200px;" placeholder="Kurye Ara...">
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>KURYE NO</th>
                                    <th>ADI SOYADI</th>
                                    <th>KULLANICI ADI</th>
                                    <th>ŞİFRE</th>
                                    <th>TELEFON</th>
                                    <th>BÖLGE</th>
                                    <th>#</th>
                                </tr>
                            </thead>
                            <tbody id="couriers-tbody">
                                <!-- JS Populated -->
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-end mt-3">
                        <span class="text-muted" style="font-size: 13px;" id="couriers-info"></span>
                        <div class="d-flex flex-column align-items-end gap-2">
                            <div class="btn-group" id="couriers-pagination" style="display: flex; border: 1px solid #dee2e6; border-radius: 4px; overflow: hidden; background: white;">
                                <!-- JS Populated -->
                            </div>
                            <button class="btn" style="background-color: #4bc0c0; color: white; border-radius: 4px; padding: 8px 24px; font-weight: 500; font-size: 16px;"><i class="fa-solid fa-file-excel"></i> Excel'e Aktar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Dynamic Pagination and Search Logic for Shops
        const shopsTbody = document.getElementById('shops-tbody');
        const shopsPagination = document.getElementById('shops-pagination');
        const shopsInfo = document.getElementById('shops-info');
        const shopsSearchInput = document.getElementById('shops-search');
        
        let currentShopsPage = 1;
        let shopsItemsPerPage = 50;
        let filteredShops = [...passiveShops];
        
        function renderShopsPage(page) {
            currentShopsPage = page;
            const start = (page - 1) * shopsItemsPerPage;
            const end = start + shopsItemsPerPage;
            const pageData = filteredShops.slice(start, end);
            
            if (filteredShops.length === 0) {
                shopsTbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Kayıt bulunamadı.</td></tr>';
                shopsInfo.innerText = '0 Kayıttan 0 ile 0 Arası Gösteriliyor';
                shopsPagination.innerHTML = '';
                return;
            }

            shopsTbody.innerHTML = pageData.map(s => `
                <tr>
                    <td>${s.no}</td>
                    <td>${s.tabela}</td>
                    <td>${s.unvan}</td>
                    <td>${s.tel === 'YOK' ? '<i class="fa-solid fa-exclamation-triangle text-danger"></i> YOK' : s.tel}</td>
                    <td>${s.bolge}</td>
                    <td><span style="color: ${parseFloat(s.bakiye) < 0 ? '#fa5252' : parseFloat(s.bakiye) > 0 ? '#fa5252' : '#20c997'};">${Number(s.bakiye).toFixed(2)}</span></td>
                    <td>
                        <div class="dropdown">
                            <button class="btn btn-info" style="background-color: #38b2ac; padding: 4px 8px; font-size: 12px;" onclick="event.stopPropagation(); this.nextElementSibling.classList.toggle('show')">İşlemler <i class="fa-solid fa-caret-down"></i></button>
                            <div class="dropdown-content">
                                <a href="#" class="dropdown-item" onclick="event.preventDefault(); window.toggleShopStatus('${s.id || s.no}', false)"><i class="fa-solid fa-check" style="color: #2b8a3e;"></i> Aktife Al</a>
                            </div>
                        </div>
                    </td>
                </tr>
            `).join('');
            
            shopsInfo.innerText = `${filteredShops.length} Kayıttan ${start + 1} ile ${Math.min(end, filteredShops.length)} Arası Gösteriliyor`;
            
            const totalPages = Math.ceil(filteredShops.length / shopsItemsPerPage);
            let pagesHtml = `<button class="btn btn-sm page-btn" data-page="${Math.max(1, page - 1)}" style="background: white; border-right: 1px solid #dee2e6; color: #007bff; padding: 6px 12px;">Önceki</button>`;
            
            for(let i=1; i<=totalPages; i++) {
                if (i === page) {
                    pagesHtml += `<button class="btn btn-sm page-btn" data-page="${i}" style="background: #007bff; color: white; border-right: 1px solid #dee2e6; padding: 6px 12px;">${i}</button>`;
                } else {
                    pagesHtml += `<button class="btn btn-sm page-btn" data-page="${i}" style="background: white; color: #007bff; border-right: 1px solid #dee2e6; padding: 6px 12px;">${i}</button>`;
                }
            }
            
            pagesHtml += `<button class="btn btn-sm page-btn" data-page="${Math.min(totalPages, page + 1)}" style="background: white; color: #007bff; padding: 6px 12px;">Sonraki</button>`;
            
            shopsPagination.innerHTML = pagesHtml;
            
            shopsPagination.querySelectorAll('.page-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const targetPage = parseInt(e.target.getAttribute('data-page'));
                    renderShopsPage(targetPage);
                });
            });
        }
        
        shopsSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            filteredShops = passiveShops.filter(s => 
                (s.tabela && s.tabela.toLowerCase().includes(query)) ||
                (s.unvan && s.unvan.toLowerCase().includes(query)) ||
                (s.no && s.no.toString().includes(query))
            );
            renderShopsPage(1);
        });

        renderShopsPage(1);
        
        document.getElementById('shops-per-page').addEventListener('change', (e) => {
            shopsItemsPerPage = parseInt(e.target.value);
            renderShopsPage(1);
        });

        // Dynamic Pagination and Search Logic for Couriers
        const tbody = document.getElementById('couriers-tbody');
        const pagination = document.getElementById('couriers-pagination');
        const info = document.getElementById('couriers-info');
        const searchInput = document.getElementById('couriers-search');
        
        let currentPage = 1;
        let itemsPerPage = 50;
        let filteredCouriers = [...passiveCouriers];
        
        function renderCouriersPage(page) {
            currentPage = page;
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const pageData = filteredCouriers.slice(start, end);
            
            if (filteredCouriers.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Kayıt bulunamadı.</td></tr>';
                info.innerText = '0 Kayıttan 0 ile 0 Arası Gösteriliyor';
                pagination.innerHTML = '';
                return;
            }

            tbody.innerHTML = pageData.map(c => `
                <tr>
                    <td>${c.no}</td>
                    <td>${c.adi}</td>
                    <td>${c.kullanici_adi}</td>
                    <td>${c.sifre}</td>
                    <td>${c.tel || '-'}</td>
                    <td>${c.bolge}</td>
                    <td>
                        <div class="dropdown">
                            <button class="btn btn-info" style="background-color: #38b2ac; padding: 4px 8px; font-size: 12px;" onclick="event.stopPropagation(); this.nextElementSibling.classList.toggle('show')">İşlemler <i class="fa-solid fa-caret-down"></i></button>
                            <div class="dropdown-content">
                                <a href="#" class="dropdown-item" onclick="event.preventDefault(); window.toggleCourierStatus('${c.id || c.no}', false)"><i class="fa-solid fa-check" style="color: #2b8a3e;"></i> Aktife Al</a>
                            </div>
                        </div>
                    </td>
                </tr>
            `).join('');
            
            info.innerText = `${filteredCouriers.length} Kayıttan ${start + 1} ile ${Math.min(end, filteredCouriers.length)} Arası Gösteriliyor`;
            
            const totalPages = Math.ceil(filteredCouriers.length / itemsPerPage);
            let pagesHtml = `<button class="btn btn-sm page-btn" data-page="${Math.max(1, page - 1)}" style="background: white; border-right: 1px solid #dee2e6; color: #007bff; padding: 6px 12px;">Önceki</button>`;
            
            for(let i=1; i<=totalPages; i++) {
                if (i === page) {
                    pagesHtml += `<button class="btn btn-sm page-btn" data-page="${i}" style="background: #007bff; color: white; border-right: 1px solid #dee2e6; padding: 6px 12px;">${i}</button>`;
                } else {
                    // Sadece sayfa numarası çoksa ilk 3, son 3 gibi mantık kurmuyoruz çünkü maks 5-6 sayfa olacak.
                    pagesHtml += `<button class="btn btn-sm page-btn" data-page="${i}" style="background: white; color: #007bff; border-right: 1px solid #dee2e6; padding: 6px 12px;">${i}</button>`;
                }
            }
            
            pagesHtml += `<button class="btn btn-sm page-btn" data-page="${Math.min(totalPages, page + 1)}" style="background: white; color: #007bff; padding: 6px 12px;">Sonraki</button>`;
            
            pagination.innerHTML = pagesHtml;
            
            pagination.querySelectorAll('.page-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const targetPage = parseInt(e.target.getAttribute('data-page'));
                    renderCouriersPage(targetPage);
                });
            });
        }
        
        // Initialize Search
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            filteredCouriers = passiveCouriers.filter(c => 
                (c.adi && c.adi.toLowerCase().includes(query)) ||
                (c.kullanici_adi && c.kullanici_adi.toLowerCase().includes(query)) ||
                (c.no && c.no.toString().includes(query))
            );
            renderCouriersPage(1);
        });

        // Initialize
        renderCouriersPage(1);
        
        document.getElementById('couriers-per-page').addEventListener('change', (e) => {
            itemsPerPage = parseInt(e.target.value);
            renderCouriersPage(1);
        });
    }

    window.toggleCourierStatus = function(courierId, isCurrentlyActive) {
        let activeCouriers = JSON.parse(localStorage.getItem('activeCouriers')) || (AppData.activeCouriers ? AppData.activeCouriers.active_couriers : []);
        let passiveUsers = JSON.parse(localStorage.getItem('passiveUsers')) || (AppData.passiveUsers || { passive_shops: [], passive_couriers: [] });

        if (isCurrentlyActive) {
            const index = activeCouriers.findIndex(c => (c.id || c.no) == courierId);
            if (index > -1) {
                const [moved] = activeCouriers.splice(index, 1);
                if (!passiveUsers.passive_couriers) passiveUsers.passive_couriers = [];
                passiveUsers.passive_couriers.unshift(moved);
                localStorage.setItem('activeCouriers', JSON.stringify(activeCouriers));
                localStorage.setItem('passiveUsers', JSON.stringify(passiveUsers));
                if (window.saveToServer) window.saveToServer();
                renderKuryeListesi();
            }
        } else {
            const index = (passiveUsers.passive_couriers || []).findIndex(c => (c.id || c.no) == courierId);
            if (index > -1) {
                const [moved] = passiveUsers.passive_couriers.splice(index, 1);
                activeCouriers.unshift(moved);
                localStorage.setItem('activeCouriers', JSON.stringify(activeCouriers));
                localStorage.setItem('passiveUsers', JSON.stringify(passiveUsers));
                if (window.saveToServer) window.saveToServer();
                renderPasifKullanicilar();
            }
        }
    };

    window.toggleShopStatus = function(shopId, isCurrentlyActive) {
        let activeShops = JSON.parse(localStorage.getItem('activeShops')) || (AppData.activeShops ? AppData.activeShops.active_shops : []);
        let passiveUsers = JSON.parse(localStorage.getItem('passiveUsers')) || (AppData.passiveUsers || { passive_shops: [], passive_couriers: [] });

        if (isCurrentlyActive) {
            const index = activeShops.findIndex(s => (s.id || s.no) == shopId);
            if (index > -1) {
                const [moved] = activeShops.splice(index, 1);
                if (!passiveUsers.passive_shops) passiveUsers.passive_shops = [];
                passiveUsers.passive_shops.unshift(moved);
                localStorage.setItem('activeShops', JSON.stringify(activeShops));
                localStorage.setItem('passiveUsers', JSON.stringify(passiveUsers));
                if (window.saveToServer) window.saveToServer();
                renderIsyeriListesi();
            }
        } else {
            const index = (passiveUsers.passive_shops || []).findIndex(s => (s.id || s.no) == shopId);
            if (index > -1) {
                const [moved] = passiveUsers.passive_shops.splice(index, 1);
                activeShops.unshift(moved);
                localStorage.setItem('activeShops', JSON.stringify(activeShops));
                localStorage.setItem('passiveUsers', JSON.stringify(passiveUsers));
                if (window.saveToServer) window.saveToServer();
                renderPasifKullanicilar();
            }
        }
    };

    function renderKullaniciEkle() {
        pageContainer.innerHTML = `
            <div class="card" style="max-width: 600px; margin: 0 auto;">
                <h3 class="card-title"><i class="fa-solid fa-user-plus"></i> Kullanıcı Ekle</h3>
                
                <form id="addUserForm">
                    <div class="form-group">
                        <label class="form-label">Bölge</label>
                        <select id="addUserBolge" class="form-control" required>
                            <option value="">Bölge Seçiniz...</option>
                            <option value="BAHÇELİEVLER">BAHÇELİEVLER</option>
                            <option value="FATİH">FATİH</option>
                            <option value="ZEYTİNBURNU">ZEYTİNBURNU</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Kullanıcı Türü</label>
                        <select id="addUserType" class="form-control" required>
                            <option value="">Yetki Türü Seçiniz</option>
                            <option value="Üye İş Yeri">Üye İş Yeri</option>
                            <option value="Kurye">Kurye</option>
                            <option value="Yönetici">Yönetici</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">İsim</label>
                        <input type="text" id="addUserName" class="form-control" placeholder="Üye iş yeri ise Tabela Adını Yazınız." required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Telefon</label>
                        <input type="text" id="addUserPhone" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Kullanıcı Adı</label>
                        <input type="text" id="addUserUsername" class="form-control" required>
                    </div>
                    
                    <div class="form-group mt-4 text-right">
                        <button type="submit" class="btn btn-primary" style="width: 100%;">
                            <i class="fa-solid fa-check"></i> OLUŞTUR
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.getElementById('addUserForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const type = document.getElementById('addUserType').value;
            const bolge = document.getElementById('addUserBolge').value;
            const isim = document.getElementById('addUserName').value.trim();
            const kullaniciAdi = document.getElementById('addUserUsername').value.trim();
            const tel = document.getElementById('addUserPhone').value.trim();
            
            const tarih = new Date().toLocaleDateString('tr-TR');

            if (type === 'Kurye') {
                if (!localStorage.getItem('activeCouriers') && AppData.activeCouriers) {
                    localStorage.setItem('activeCouriers', JSON.stringify(AppData.activeCouriers.active_couriers || []));
                }
                let kuryeler = JSON.parse(localStorage.getItem('activeCouriers')) || [];
                kuryeler.push({
                    id: Math.floor(Math.random() * 1000) + 9000,
                    bolge: bolge,
                    adi: isim,
                    kullanici_adi: kullaniciAdi,
                    plaka: "-",
                    tel: tel,
                    durum: "Çevrimdışı",
                    kayit_tarihi: tarih
                });
                localStorage.setItem('activeCouriers', JSON.stringify(kuryeler));

                // Also add to Shift Takip data structure
                if (!AppData.shifts) AppData.shifts = { shift_couriers: [], shift_shops: [] };
                if (!AppData.shifts.shift_couriers) AppData.shifts.shift_couriers = [];
                if (!AppData.shifts.shift_couriers.some(sc => sc.kurye && sc.kurye.toLowerCase() === isim.toLowerCase())) {
                    AppData.shifts.shift_couriers.push({
                        bolge: bolge,
                        kurye: isim
                    });
                }
                
                if (window.saveToServer) window.saveToServer();

                alert('Kurye başarıyla eklendi! Kurye listesi ve Shift Takip ekranına yansıtıldı.');
                document.getElementById('addUserForm').reset();
            } else if (type === 'Üye İş Yeri') {
                if (!localStorage.getItem('activeShops') && AppData.activeShops) {
                    localStorage.setItem('activeShops', JSON.stringify(AppData.activeShops.active_shops || []));
                }
                let isyerleri = JSON.parse(localStorage.getItem('activeShops')) || [];
                isyerleri.push({
                    no: Math.floor(Math.random() * 1000) + 5000,
                    bolge: bolge,
                    tabela: isim,
                    kullanici_adi: kullaniciAdi,
                    sifre: sifre,
                    bakiye: "0,00",
                    kayit_tarihi: tarih,
                    lisans_suresi: "30 Gün"
                });
                localStorage.setItem('activeShops', JSON.stringify(isyerleri));
                alert('Üye iş yeri başarıyla eklendi! İşyeri listesinden görebilirsiniz.');
                document.getElementById('addUserForm').reset();
            } else {
                alert(type + ' türünde ekleme şu anda sistemsel olarak yapım aşamasındadır.');
            }
        });
    }

    // --- Giderler Module Functions ---

    function renderGiderCarisi() {
        const serhatMovements = [
            { tarih: '17.03.2026', masraf: 'PERSONEL', tur: 'MAAŞ', borc: '₺0,00', alacak: '', bakiye: '₺2.824.600,00' },
            { tarih: '17.03.2026', masraf: 'PERSONEL', tur: 'MAAŞ', borc: '₺0,00', alacak: '', bakiye: '₺2.796.100,00' },
            { tarih: '19.03.2026', masraf: 'DİĞER', tur: 'YAKIT', borc: '₺0,00', alacak: '', bakiye: '₺2.753.950,00' },
            { tarih: '19.03.2026', masraf: 'DİĞER', tur: 'SİGORTA KASKO', borc: '₺0,00', alacak: '', bakiye: '₺2.717.150,00' },
            { tarih: '25.03.2026', masraf: 'DİĞER', tur: 'HAKEDİŞ TAHSİLAT', borc: '', alacak: '₺0,00', bakiye: '₺3.067.150,00' },
            { tarih: '30.03.2026', masraf: 'PERSONEL', tur: 'PRİM ÖDEMESİ', borc: '₺0,00', alacak: '', bakiye: '₺3.052.150,00' },
            { tarih: '30.03.2026', masraf: 'PERSONEL', tur: 'PRİM ÖDEMESİ', borc: '₺0,00', alacak: '', bakiye: '₺3.037.150,00' },
            { tarih: '30.03.2026', masraf: 'PERSONEL', tur: 'PRİM ÖDEMESİ', borc: '₺0,00', alacak: '', bakiye: '₺3.022.150,00' },
            { tarih: '02.04.2026', masraf: 'DİĞER', tur: 'YELEK - KASK', borc: '₺0,00', alacak: '', bakiye: '₺3.017.650,00' },
            { tarih: '02.04.2026', masraf: 'DİĞER', tur: 'YOL YEMEK', borc: '₺0,00', alacak: '', bakiye: '₺3.011.450,00' },
            { tarih: '03.04.2026', masraf: 'DİĞER', tur: 'OFİS GİDERİ', borc: '₺0,00', alacak: '', bakiye: '₺3.002.700,00' },
            { tarih: '17.04.2026', masraf: 'PERSONEL', tur: 'MAAŞ', borc: '₺0,00', alacak: '', bakiye: '₺2.950.700,00' },
            { tarih: '20.04.2026', masraf: 'PERSONEL', tur: 'MAAŞ', borc: '₺0,00', alacak: '', bakiye: '₺2.906.500,00' },
            { tarih: '20.04.2026', masraf: 'PERSONEL', tur: 'MAAŞ', borc: '₺0,00', alacak: '', bakiye: '₺2.858.150,00' },
            { tarih: '30.04.2026', masraf: 'PERSONEL', tur: 'AVANS ÖDEMESİ', borc: '₺0,00', alacak: '', bakiye: '₺2.850.150,00' },
            { tarih: '06.05.2026', masraf: 'PERSONEL', tur: 'AVANS ÖDEMESİ', borc: '₺0,00', alacak: '', bakiye: '₺2.842.150,00' },
            { tarih: '20.05.2026', masraf: 'PERSONEL', tur: 'MAAŞ', borc: '₺0,00', alacak: '', bakiye: '₺2.795.650,00' }
        ];

        pageContainer.innerHTML = `
            <div class="card" style="border-top: 3px solid var(--primary-color);">
                <!-- Top Header Row -->
                <div class="d-flex justify-content-between align-items-center mb-4" style="flex-wrap: wrap; gap: 15px;">
                    <h3 style="font-size: 20px; font-weight: 700; color: var(--text-main); margin: 0;">Yönetici Cari Hareketleri</h3>
                    <div style="width: 220px;">
                        <select id="gider-cari-yonetici" class="form-control" style="background: white; font-weight: 600;">
                            <option value="Serhat Yılmaz">Serhat Yılmaz</option>
                            <option value="Serkan Bilgin">Serkan Bilgin</option>
                            <option value="Hakan Soylu">Hakan Soylu</option>
                            <option value="Çapa Admin">Çapa Admin</option>
                        </select>
                    </div>
                </div>

                <!-- Bakiye Summary Card (Vibrant Light Blue / Indigo styling with Coins Icon) -->
                <div class="d-flex justify-content-center mb-4">
                    <div style="border: 2px solid #0284c7; border-radius: 10px; padding: 15px 30px; display: flex; align-items: center; gap: 20px; background: #f0f9ff; min-width: 320px; box-shadow: 0 4px 12px rgba(2,132,199,0.15);">
                        <div style="background: #0284c7; color: white; border-radius: 10px; width: 55px; height: 48px; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 2px 6px rgba(2,132,199,0.3);">
                            <i class="fa-solid fa-coins"></i>
                        </div>
                        <div>
                            <div style="font-size: 12px; font-weight: 700; color: #0369a1; letter-spacing: 0.5px; text-transform: uppercase;">BAKİYE</div>
                            <div id="cari-bakiye-val" style="font-size: 22px; font-weight: 800; color: #0f172a; font-family: monospace;">2.795.650,00 ₺</div>
                        </div>
                    </div>
                </div>

                <!-- Table Controls -->
                <div class="d-flex justify-content-between align-items-center mb-3" style="flex-wrap: wrap; gap: 10px;">
                    <div style="font-size: 13px; color: var(--text-muted);">
                        Sayfada 
                        <select class="form-control" style="display: inline-block; width: 70px; padding: 4px 8px; height: 32px;">
                            <option value="50">50</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="100">100</option>
                        </select> 
                        Kayıt Göster
                    </div>
                </div>

                <!-- Table -->
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>TARİH</th>
                                <th>MASRAF</th>
                                <th>TÜR</th>
                                <th>BORÇ</th>
                                <th>ALACAK</th>
                                <th>BAKİYE</th>
                            </tr>
                        </thead>
                        <tbody id="cari-tbody">
                            <!-- Rendered dynamically -->
                        </tbody>
                    </table>
                </div>

                <!-- Table Footer & Toolbar -->
                <div class="d-flex justify-content-between align-items-center mt-3" style="flex-wrap: wrap; gap: 15px;">
                    <div id="cari-table-info" style="font-size: 13px; color: var(--text-muted);">
                        17 Kayıttan 1 ile 17 Arası Gösteriliyor
                    </div>
                    <div class="d-flex align-items-center gap-3" style="flex-wrap: wrap;">
                        <div class="d-flex" style="border: 1px solid var(--border-color); border-radius: var(--radius); overflow: hidden;">
                            <button class="btn btn-sm" style="background: white; color: var(--text-muted); padding: 5px 12px; border-right: 1px solid var(--border-color); font-size: 13px;">Önceki</button>
                            <button class="btn btn-sm" style="background: var(--primary-color); color: white; padding: 5px 12px; font-size: 13px; font-weight: 600;">1</button>
                            <button class="btn btn-sm" style="background: white; color: var(--text-muted); padding: 5px 12px; border-left: 1px solid var(--border-color); font-size: 13px;">Sonraki</button>
                        </div>
                        <div class="d-flex" style="background: #495057; color: white; border-radius: 6px; padding: 4px; gap: 2px; font-size: 12px; font-weight: 500;">
                            <button class="btn" style="background: transparent; color: white; padding: 4px 10px; font-size: 12px;" onclick="window.exportTableToExcel(this, 'gider_carisi.xls')">Excel</button>
                            <button class="btn" style="background: transparent; color: white; padding: 4px 10px; font-size: 12px;" onclick="window.print()">Yazdır</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        function updateCariView() {
            const selectedManager = document.getElementById('gider-cari-yonetici')?.value || 'Serhat Yılmaz';
            const tbody = document.getElementById('cari-tbody');
            const bakiyeVal = document.getElementById('cari-bakiye-val');
            const infoElem = document.getElementById('cari-table-info');

            let movements = [];
            if (selectedManager === 'Serhat Yılmaz') {
                movements = JSON.parse(localStorage.getItem('giderCariMovements') || '[]');
                
                let bakiyeSum = 1349629.61;
                movements.forEach(m => {
                    const val = parseFloat((m.borc || '').toString().replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                    const alacakVal = parseFloat((m.alacak || '').toString().replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                    bakiyeSum = bakiyeSum - val + alacakVal;
                });
                
                if (bakiyeVal) bakiyeVal.innerText = bakiyeSum.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺';
            } else {
                if (bakiyeVal) bakiyeVal.innerText = '0,00 ₺';
            }

            if (movements.length > 0) {
                if (infoElem) infoElem.innerText = `${movements.length} Kayıttan 1 ile ${movements.length} Arası Gösteriliyor`;
                if (tbody) {
                    tbody.innerHTML = movements.map(m => `
                        <tr>
                            <td style="font-weight: 500; color: var(--text-muted);">${m.tarih}</td>
                            <td>${m.masraf}</td>
                            <td>${m.tur}</td>
                            <td style="color: #d97706; font-weight: 600;">${m.borc || ''}</td>
                            <td style="color: #2563eb; font-weight: 600;">${m.alacak || ''}</td>
                            <td style="font-weight: 700; color: var(--text-main); font-family: monospace;">${m.bakiye}</td>
                        </tr>
                    `).join('');
                }
            } else {
                if (infoElem) infoElem.innerText = '0 Kayıttan 0 ile 0 Arası Gösteriliyor';
                if (tbody) {
                    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 25px;">0 Kayıt Bulundu</td></tr>`;
                }
            }
        }

        // Initial render
        updateCariView();

        // Change event listener
        document.getElementById('gider-cari-yonetici')?.addEventListener('change', updateCariView);
    }

    function renderGiderVirmanEkle() {
        const giderCariMovements = JSON.parse(localStorage.getItem('giderCariMovements') || '[]');
        let bakiyeSum = 1349629.61;
        giderCariMovements.forEach(m => {
            const val = parseFloat((m.borc || '').toString().replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            const alacakVal = parseFloat((m.alacak || '').toString().replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            bakiyeSum = bakiyeSum - val + alacakVal;
        });

        const managers = ['Serhat Yılmaz', 'Serkan Bilgin', 'Hakan Soylu'];

        let personnelOptionsHtml = `<option value="">Yönetici Seçiniz..</option>`;
        managers.forEach(name => {
            personnelOptionsHtml += `<option value="${name}">${name}</option>`;
        });

        pageContainer.innerHTML = `
            <!-- Top Header & Breadcrumb -->
            <div class="d-flex justify-content-between align-items-center mb-4" style="flex-wrap: wrap; gap: 10px;">
                <h2 style="font-size: 22px; font-weight: 700; color: var(--text-main); margin: 0;">Gider & Virman Ekle</h2>
                <div style="font-size: 13px; color: var(--text-muted);">
                    <span>Anasayfa</span> / <span>Giderler</span> / <span style="color: var(--primary-color); font-weight: 500;">Gider & Virman Ekle</span>
                </div>
            </div>

            <!-- Bakiyeniz Card -->
            <div class="card mb-4" style="max-width: 320px; text-align: center; padding: 18px; border: 1px solid var(--border-color); border-radius: 8px;">
                <div style="font-size: 11px; font-weight: 700; color: #6c757d; letter-spacing: 0.5px; margin-bottom: 5px;">BAKİYENİZ</div>
                <div style="font-size: 20px; font-weight: 700; color: #212529; font-family: monospace;">${bakiyeSum.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</div>
            </div>

            <!-- Two Main Forms Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 25px; align-items: start;">
                
                <!-- Left Form: Gider Ekle -->
                <div class="card" style="border-top: 3px solid #38bdf8; border-radius: 8px; padding: 25px;">
                    <h4 style="font-size: 17px; font-weight: 700; color: var(--text-main); margin-bottom: 25px;">Gider Ekle</h4>
                    <form id="gider-add-form" onsubmit="window.addGiderRecord(event)">
                        
                        <div style="display: grid; grid-template-columns: 140px 1fr; align-items: center; gap: 15px; margin-bottom: 18px;">
                            <label style="font-size: 13px; font-weight: 500; color: var(--text-main); margin: 0;">Gider Türü:</label>
                            <select id="gider-turu" class="form-control" style="background: white;" required>
                                <option value="">Gider Türü Seçiniz..</option>
                                <option value="PERSONEL">PERSONEL</option>
                                <option value="DİĞER">DİĞER</option>
                            </select>
                        </div>

                        <div id="gider-bolge-row" style="display: none; grid-template-columns: 140px 1fr; align-items: center; gap: 15px; margin-bottom: 18px;">
                            <label style="font-size: 13px; font-weight: 500; color: var(--text-main); margin: 0;">Bölge:</label>
                            <select id="gider-bolge" class="form-control" style="background: white;">
                                <option value="">Bölge Seçiniz..</option>
                                <option value="BAHÇELİEVLER">BAHÇELİEVLER</option>
                                <option value="FATİH">FATİH</option>
                                <option value="ZEYTİNBURNU">ZEYTİNBURNU</option>
                            </select>
                        </div>

                        <div id="gider-personel-row" style="display: none; grid-template-columns: 140px 1fr; align-items: center; gap: 15px; margin-bottom: 18px;">
                            <label style="font-size: 13px; font-weight: 500; color: var(--text-main); margin: 0;">Kurye / Personel:</label>
                            <select id="gider-personel" class="form-control" style="background: white;">
                                <option value="">Kurye Seçiniz..</option>
                            </select>
                        </div>

                        <div style="display: grid; grid-template-columns: 140px 1fr; align-items: center; gap: 15px; margin-bottom: 18px;">
                            <label style="font-size: 13px; font-weight: 500; color: var(--text-main); margin: 0;">Tarih:</label>
                            <input type="date" id="gider-tarih" class="form-control" value="2026-08-14" required>
                        </div>

                        <div style="display: grid; grid-template-columns: 140px 1fr; align-items: center; gap: 15px; margin-bottom: 18px;">
                            <label style="font-size: 13px; font-weight: 500; color: var(--text-main); margin: 0;">Tutar:</label>
                            <input type="number" step="0.01" id="gider-tutar" class="form-control" placeholder="Örn : 4000" required>
                        </div>

                        <div style="display: grid; grid-template-columns: 140px 1fr; align-items: center; gap: 15px; margin-bottom: 18px;">
                            <label style="font-size: 13px; font-weight: 500; color: var(--text-main); margin: 0;">Gider Dönem Ayı:</label>
                            <select id="gider-ay" class="form-control" style="background: white;" required>
                                <option value="OCAK">OCAK</option>
                                <option value="ŞUBAT">ŞUBAT</option>
                                <option value="MART">MART</option>
                                <option value="NİSAN">NİSAN</option>
                                <option value="MAYIS">MAYIS</option>
                                <option value="HAZİRAN">HAZİRAN</option>
                                <option value="TEMMUZ">TEMMUZ</option>
                                <option value="AĞUSTOS" selected>AĞUSTOS</option>
                                <option value="EYLÜL">EYLÜL</option>
                                <option value="EKİM">EKİM</option>
                                <option value="KASIM">KASIM</option>
                                <option value="ARALIK">ARALIK</option>
                            </select>
                        </div>

                        <div style="display: grid; grid-template-columns: 140px 1fr; align-items: center; gap: 15px; margin-bottom: 18px;">
                            <label style="font-size: 13px; font-weight: 500; color: var(--text-main); margin: 0;">Gider Dönem Yılı:</label>
                            <select id="gider-yil" class="form-control" style="background: white;" required>
                                <option value="2026" selected>2026</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                                <option value="2020">2020</option>
                            </select>
                        </div>

                        <div style="display: grid; grid-template-columns: 140px 1fr; align-items: center; gap: 15px; margin-bottom: 25px;">
                            <label style="font-size: 13px; font-weight: 500; color: var(--text-main); margin: 0;">Açıklama:</label>
                            <input type="text" id="gider-aciklama" class="form-control" placeholder="Açıklama giriniz...">
                        </div>

                        <button type="submit" class="btn" style="width: 100%; background: #38bdf8; color: white; border: none; padding: 12px; font-weight: 700; font-size: 14px; border-radius: 6px; letter-spacing: 0.5px;">EKLE</button>
                    </form>
                </div>

                <!-- Right Form: Virman Ekle -->
                <div class="card" style="border-top: 3px solid #38bdf8; border-radius: 8px; padding: 25px;">
                    <h4 style="font-size: 17px; font-weight: 700; color: var(--text-main); margin-bottom: 25px;">Virman Ekle</h4>
                    <form onsubmit="event.preventDefault(); alert('Virman kaydı başarıyla eklendi.'); this.reset();">
                        
                        <div style="display: grid; grid-template-columns: 120px 1fr; align-items: start; gap: 15px; margin-bottom: 18px;">
                            <label style="font-size: 13px; font-weight: 500; color: var(--text-main); margin-top: 8px;">Yönetici:</label>
                            <div>
                                <select class="form-control" style="background: white;" required>
                                    ${personnelOptionsHtml}
                                </select>
                                <div style="font-size: 11px; color: #888; margin-top: 5px; line-height: 1.3;">
                                    Virmanlaşacağınız yöneticiyi seçiniz. Sizden eksilecek tutar seçtiğiniz yöneticiye eklenecektir.
                                </div>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 120px 1fr; align-items: start; gap: 15px; margin-bottom: 18px;">
                            <label style="font-size: 13px; font-weight: 500; color: var(--text-main); margin-top: 8px;">Tarih:</label>
                            <div>
                                <input type="date" class="form-control" value="2026-08-14" required>
                                <div style="font-size: 11px; color: #888; margin-top: 5px; line-height: 1.3;">
                                    Virmanı en geç 3 gün içinde sisteme işlemeniz gerekmektedir. 3 Gün dışında tarihler seçilemez.
                                </div>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 120px 1fr; align-items: center; gap: 15px; margin-bottom: 18px;">
                            <label style="font-size: 13px; font-weight: 500; color: var(--text-main); margin: 0;">Açıklama:</label>
                            <input type="text" class="form-control" placeholder="Virman açıklaması...">
                        </div>

                        <div style="display: grid; grid-template-columns: 120px 1fr; align-items: center; gap: 15px; margin-bottom: 25px;">
                            <label style="font-size: 13px; font-weight: 500; color: var(--text-main); margin: 0;">Tutar:</label>
                            <input type="number" step="0.01" class="form-control" placeholder="Örn : 4000" required>
                        </div>

                        <button type="submit" class="btn" style="width: 100%; background: #38bdf8; color: white; border: none; padding: 12px; font-weight: 700; font-size: 14px; border-radius: 6px; letter-spacing: 0.5px;">EKLE</button>
                    </form>
                </div>

            </div>
        `;

        // Dynamic Personnel & Region listeners
        const giderTuruSelect = document.getElementById('gider-turu');
        const bolgeRow = document.getElementById('gider-bolge-row');
        const bolgeSelect = document.getElementById('gider-bolge');
        const personelRow = document.getElementById('gider-personel-row');
        const personelSelect = document.getElementById('gider-personel');

        const updatePersonnelOptions = () => {
            const selectedBolge = bolgeSelect?.value;
            if (!selectedBolge) {
                if (personelRow) personelRow.style.display = 'none';
                if (personelSelect) personelSelect.innerHTML = '<option value="">Kurye Seçiniz..</option>';
                return;
            }

            const activeCouriers = JSON.parse(localStorage.getItem('activeCouriers')) || (AppData.activeCouriers ? AppData.activeCouriers.active_couriers : []) || [];
            const shiftCouriers = (AppData.shifts && AppData.shifts.shift_couriers) || [];
            const defaultPersonnel = {
                'BAHÇELİEVLER': ['Ahmet Akgün', 'Bilal Ademoğlu', 'Şeref Ziya Ulutaş', 'Mustafa Öztürk', 'Hasan Basri Kara', 'Selin Doğan', 'Murat Yıldırım'],
                'FATİH': ['Turgut Bayraktar', 'Ali Yıldız', 'Cemil Demir', 'Burak Akın'],
                'ZEYTİNBURNU': ['Cemil Coşkun', 'Kadir Şahin', 'Oğuz Kaan Aksoy', 'Gökhan Polat', 'Turgut Bayraktar', 'Mert Ali Erzincan', 'ADEM GÜNEŞ', 'Muhammet Tagi İlbeyli', 'Ezel Nadar', 'Mevlüt Demirtaş']
            };

            const courierSet = new Set(defaultPersonnel[selectedBolge] || []);
            activeCouriers.forEach(c => {
                if (c.bolge === selectedBolge && c.adi) courierSet.add(c.adi);
            });
            shiftCouriers.forEach(s => {
                if (s.bolge === selectedBolge && s.kurye) courierSet.add(s.kurye);
            });

            const courierList = Array.from(courierSet);
            let optionsHtml = '<option value="">Kurye Seçiniz..</option>';
            courierList.forEach(name => {
                optionsHtml += `<option value="${name}">${name}</option>`;
            });

            if (personelSelect) {
                personelSelect.innerHTML = optionsHtml;
            }
            if (personelRow) {
                personelRow.style.display = 'grid';
            }
        };

        giderTuruSelect?.addEventListener('change', (e) => {
            if (e.target.value === 'PERSONEL') {
                if (bolgeRow) bolgeRow.style.display = 'grid';
                if (bolgeSelect?.value) {
                    updatePersonnelOptions();
                } else {
                    if (personelRow) personelRow.style.display = 'none';
                }
            } else {
                if (bolgeRow) bolgeRow.style.display = 'none';
                if (personelRow) personelRow.style.display = 'none';
            }
        });

        bolgeSelect?.addEventListener('change', () => {
            if (giderTuruSelect?.value === 'PERSONEL') {
                updatePersonnelOptions();
            }
        });

        window.addGiderRecord = function(e) {
            e.preventDefault();
            const tur = document.getElementById('gider-turu')?.value;
            const bolge = document.getElementById('gider-bolge')?.value || 'GENEL';
            const personel = document.getElementById('gider-personel')?.value || '';
            const tarih = document.getElementById('gider-tarih')?.value || '2026-08-14';
            const tutar = parseFloat(document.getElementById('gider-tutar')?.value) || 0;
            const ay = document.getElementById('gider-ay')?.value || 'AĞUSTOS';
            const yil = document.getElementById('gider-yil')?.value || '2026';
            let aciklama = document.getElementById('gider-aciklama')?.value.trim();

            if (!tur) {
                alert('Lütfen gider türü seçiniz.');
                return;
            }

            if (tur === 'PERSONEL') {
                if (!bolge) {
                    alert('Lütfen bölge seçiniz.');
                    return;
                }
                if (!personel) {
                    alert('Lütfen kurye / personel seçiniz.');
                    return;
                }
                if (!aciklama) {
                    aciklama = `${personel} (${bolge}) - Personel Gideri`;
                }
            } else {
                if (!aciklama) {
                    aciklama = 'Diğer Gider';
                }
            }

            if (!tutar || tutar <= 0) {
                alert('Lütfen geçerli bir tutar giriniz.');
                return;
            }

            let giderList = JSON.parse(localStorage.getItem('giderList') || '[]');

            const newItem = {
                id: Date.now(),
                tur,
                aciklama,
                tarih,
                tutar,
                odeme: 'Banka',
                personel: personel || 'Yönetim',
                bolge: bolge || 'GENEL',
                ay,
                yil
            };

            giderList.unshift(newItem);
            localStorage.setItem('giderList', JSON.stringify(giderList));

            // Add to Gider Carisi (Serhat Yılmaz)
            let giderCariMovements = JSON.parse(localStorage.getItem('giderCariMovements') || '[]');
            let bakiyeSum = 1349629.61;
            giderCariMovements.forEach(m => {
                const val = parseFloat((m.borc || '').toString().replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                const alacakVal = parseFloat((m.alacak || '').toString().replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                bakiyeSum = bakiyeSum - val + alacakVal;
            });
            bakiyeSum -= tutar;

            const formatTarih = (dateStr) => {
                if (!dateStr) return '';
                const parts = dateStr.split('-');
                if (parts.length === 3) {
                    return `${parts[2]}.${parts[1]}.${parts[0]}`;
                }
                return dateStr;
            };

            giderCariMovements.push({
                tarih: formatTarih(tarih),
                masraf: tur,
                tur: aciklama.toUpperCase(),
                borc: '₺' + tutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 }),
                alacak: '',
                bakiye: '₺' + bakiyeSum.toLocaleString('tr-TR', { minimumFractionDigits: 2 })
            });
            localStorage.setItem('giderCariMovements', JSON.stringify(giderCariMovements));

            if (window.saveToServer) window.saveToServer();

            alert('Gider kaydı başarıyla eklendi ve Gelir Gider raporuna yansıtıldı!');
            document.getElementById('gider-add-form')?.reset();
            if (bolgeRow) bolgeRow.style.display = 'none';
            if (personelRow) personelRow.style.display = 'none';
        };
    }

    function renderGiderListesi() {
        const giderList = JSON.parse(localStorage.getItem('giderList') || '[]');
        const totalGiderSum = giderList.reduce((sum, item) => sum + (parseFloat(item.tutar) || 0), 0);
        
        const formatTarih = (dateStr) => {
            if (!dateStr) return '';
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                return `${parts[2]}.${parts[1]}.${parts[0]}`;
            }
            return dateStr;
        };

        const rowsHtml = giderList.length > 0 ? giderList.map((item, idx) => `
            <tr>
                <td>${idx + 1}</td>
                <td>${formatTarih(item.tarih)}</td>
                <td>YÖNETİM</td>
                <td>${item.bolge}</td>
                <td>${formatTarih(item.tarih)}</td>
                <td>${item.ay} ${item.yil}</td>
                <td>${item.tur}</td>
                <td>${item.personel}</td>
                <td>${item.aciklama}</td>
                <td style="font-weight: 700;">${item.tutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</td>
                <td>-</td>
                <td></td>
            </tr>
        `).join('') : `<tr><td colspan="12" style="text-align: center; color: var(--text-muted); padding: 25px;">0 Kayıt Bulundu</td></tr>`;

        const infoText = giderList.length > 0 
            ? `${giderList.length} Kayıttan 1 ile ${giderList.length} Arası Gösteriliyor` 
            : '0 Kayıttan 0 ile 0 Arası Gösteriliyor';

        pageContainer.innerHTML = `
            <!-- Top Header & Breadcrumb -->
            <div class="d-flex justify-content-between align-items-center mb-4" style="flex-wrap: wrap; gap: 10px;">
                <h2 style="font-size: 22px; font-weight: 700; color: var(--text-main); margin: 0;">Giderler</h2>
                <div style="font-size: 13px; color: var(--text-muted);">
                    <span>Anasayfa</span> / <span style="color: var(--primary-color); font-weight: 500;">Giderler</span>
                </div>
            </div>

            <!-- Card 1: Filtre Kartı -->
            <div class="card mb-4" style="border-top: 3px solid var(--primary-color);">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 style="font-size: 15px; font-weight: 700; color: var(--text-main); margin: 0;">Filtre</h4>
                    <button class="icon-btn" style="font-size: 14px;" onclick="this.closest('.card').querySelector('.filter-body').classList.toggle('d-none')">
                        <i class="fa-solid fa-minus"></i>
                    </button>
                </div>

                <div class="filter-body">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 12px;">
                        <div class="form-group mb-0">
                            <label class="form-label" style="font-weight: 600; font-size: 12px;">Bölge:</label>
                            <select id="filter-gider-bolge" class="form-control">
                                <option value="HEPSİ">HEPSİ</option>
                                <option value="BAHÇELİEVLER">BAHÇELİEVLER</option>
                                <option value="FATİH">FATİH</option>
                                <option value="ZEYTİNBURNU">ZEYTİNBURNU</option>
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label class="form-label" style="font-weight: 600; font-size: 12px;">Ay:</label>
                            <select id="filter-gider-ay" class="form-control">
                                <option value="HEPSİ">HEPSİ</option>
                                <option value="OCAK">OCAK</option>
                                <option value="ŞUBAT">ŞUBAT</option>
                                <option value="MART">MART</option>
                                <option value="NİSAN">NİSAN</option>
                                <option value="MAYIS">MAYIS</option>
                                <option value="HAZİRAN">HAZİRAN</option>
                                <option value="TEMMUZ">TEMMUZ</option>
                                <option value="AĞUSTOS">AĞUSTOS</option>
                                <option value="EYLÜL">EYLÜL</option>
                                <option value="EKİM">EKİM</option>
                                <option value="KASIM">KASIM</option>
                                <option value="ARALIK">ARALIK</option>
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label class="form-label" style="font-weight: 600; font-size: 12px;">Yıl:</label>
                            <select id="filter-gider-yil" class="form-control">
                                <option value="2026">2026</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                                <option value="2020">2020</option>
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label class="form-label" style="font-weight: 600; font-size: 12px;">Masraf Türü:</label>
                            <select id="filter-gider-turu" class="form-control">
                                <option value="HEPSİ">HEPSİ</option>
                                <option value="PERSONEL">PERSONEL</option>
                                <option value="OPERASYON">OPERASYON</option>
                            </select>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 15px;">
                        <div class="form-group mb-0">
                            <label class="form-label" style="font-weight: 600; font-size: 12px;">Personel:</label>
                            <select id="filter-gider-personel" class="form-control">
                                <option value="HEPSİ">HEPSİ</option>
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label class="form-label" style="font-weight: 600; font-size: 12px;">Başlangıç Tarihi:</label>
                            <input type="date" class="form-control">
                        </div>
                        <div class="form-group mb-0">
                            <label class="form-label" style="font-weight: 600; font-size: 12px;">Bitiş Tarihi:</label>
                            <input type="date" class="form-control">
                        </div>
                    </div>

                    <div class="text-center" style="margin-top: 10px;">
                        <button class="btn btn-primary" style="padding: 8px 35px; font-weight: 700; border-radius: 6px; background: #38bdf8; border-color: #38bdf8;">YENİLE</button>
                    </div>
                </div>
            </div>

            <!-- Card 2: Giderler Tablo Kartı (Görseldeki Birebir Yapı) -->
            <div class="card" style="border-top: 3px solid var(--primary-color);">
                <div class="d-flex justify-content-between align-items-center mb-3" style="flex-wrap: wrap; gap: 10px;">
                    <h4 style="font-size: 16px; font-weight: 700; color: var(--text-main); margin: 0;">Giderler</h4>
                </div>

                <!-- Table Controls -->
                <div class="d-flex justify-content-between align-items-center mb-3" style="flex-wrap: wrap; gap: 10px;">
                    <div style="font-size: 13px; color: var(--text-muted);">
                        Sayfada 
                        <select class="form-control" style="display: inline-block; width: 70px; padding: 4px 8px; height: 32px;">
                            <option value="50">50</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="100">100</option>
                        </select> 
                        Kayıt Göster
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted);">
                        Ara: 
                        <input type="text" class="form-control" style="width: 180px; height: 32px; padding: 4px 8px;">
                    </div>
                </div>

                <!-- Table -->
                <div class="table-responsive">
                    <table class="table table-bordered" style="font-size: 12px;">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>SİSTEME GİRİŞ TARİHİ</th>
                                <th>KAYIT SAHİBİ</th>
                                <th>BÖLGE</th>
                                <th>TARİH</th>
                                <th>MASRAFIN DÖNEMİ</th>
                                <th>MASRAF BAŞLIĞI</th>
                                <th>MASRAF EDİLEN</th>
                                <th>MASRAF SEBEBİ</th>
                                <th>TUTAR</th>
                                <th>AÇIKLAMA</th>
                                <th style="text-align: center;">#</th>
                            </tr>
                            <tr style="background: #38bdf8; color: white; font-weight: 700;">
                                <th style="background: #38bdf8; border: none;"></th>
                                <th style="background: #38bdf8; border: none;"></th>
                                <th style="background: #38bdf8; border: none;"></th>
                                <th style="background: #38bdf8; border: none;"></th>
                                <th style="background: #38bdf8; border: none;"></th>
                                <th style="background: #38bdf8; border: none;"></th>
                                <th style="background: #38bdf8; border: none;"></th>
                                <th style="background: #38bdf8; border: none;"></th>
                                <th style="background: #38bdf8; color: white; font-weight: 700; text-align: right; border: none; padding: 10px;">TOPLAM:</th>
                                <th style="background: #38bdf8; color: white; font-weight: 800; font-family: monospace; font-size: 13px; border: none; padding: 10px;">₺${totalGiderSum.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</th>
                                <th style="background: #38bdf8; border: none;"></th>
                                <th style="background: #38bdf8; border: none;"></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                </div>

                <!-- Table Footer & Toolbar matching screenshot exactly -->
                <div class="d-flex justify-content-between align-items-start mt-3" style="flex-wrap: wrap; gap: 15px;">
                    <div style="font-size: 13px; color: var(--text-muted); padding-top: 5px;">
                        ${infoText}
                    </div>
                    <div class="d-flex flex-column align-items-end" style="gap: 8px;">
                        <!-- Pagination -->
                        <div class="d-flex" style="border: 1px solid #ced4da; border-radius: 4px; overflow: hidden;">
                            <button class="btn btn-sm" style="background: white; color: #6c757d; padding: 6px 14px; border-right: 1px solid #ced4da; font-size: 13px;">Önceki</button>
                            <button class="btn btn-sm" style="background: #007bff; color: white; padding: 6px 14px; font-size: 13px; font-weight: 600; border: none;">1</button>
                            <button class="btn btn-sm" style="background: white; color: #6c757d; padding: 6px 14px; border-left: 1px solid #ced4da; font-size: 13px;">Sonraki</button>
                        </div>

                        <!-- Dark Toolbar Bar -->
                        <div class="d-flex align-items-center" style="background: #495057; color: white; border-radius: 6px; padding: 7px 16px; gap: 16px; font-size: 13px; font-weight: 500; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
                            <span style="cursor: pointer;" onclick="window.exportTableToExcel(this, 'gider_listesi.xls')">Excel</span>
                            <span style="cursor: pointer;" onclick="window.print()">Yazdır</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderFaturaYukleVeyaOlustur() {
        const activeShops = JSON.parse(localStorage.getItem('activeShops') || '[]');
        const baseShops = [
            'ANADOLU EV YEMEKLERİ',
            'SARAY MUHALLEBİCİSİ',
            'GÖZDE DÜRÜM SALONU',
            'HATAY MEDENİYETLER SOFRASI',
            'TADIM KEBAP SALONU',
            'ŞAMPİYON KOKOREÇ',
            'BEYOĞLU DÖNERCİSİ',
            'BURGER HOUSE',
            'ERCAN BURGER YENİBOSNA'
        ];

        let shopOptionsHtml = `<option value="">Kurum Seçiniz...</option>`;
        baseShops.forEach(s => {
            shopOptionsHtml += `<option value="${s}">${s}</option>`;
        });

        pageContainer.innerHTML = `
            <!-- Top Header & Breadcrumb -->
            <div class="d-flex justify-content-between align-items-center mb-4" style="flex-wrap: wrap; gap: 10px;">
                <h2 style="font-size: 22px; font-weight: 700; color: var(--text-main); margin: 0;">Faturalar</h2>
                <div style="font-size: 13px; color: var(--text-muted);">
                    <span>Anasayfa</span> / <span style="color: var(--primary-color); font-weight: 500;">Faturalar</span>
                </div>
            </div>



            <!-- Card 2: Fatura Oluştur -->
            <div class="card mb-4" style="border-top: 3px solid #38bdf8; border-radius: 8px; padding: 25px;">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div class="d-flex align-items-center gap-2">
                        <h4 style="font-size: 16px; font-weight: 700; color: var(--text-main); margin: 0;">Fatura Oluştur</h4>
                    </div>
                    <button class="icon-btn" style="font-size: 14px;" onclick="this.closest('.card').querySelector('.form-body-2').classList.toggle('d-none')">
                        <i class="fa-solid fa-minus"></i>
                    </button>
                </div>

                <div class="form-body-2">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-bottom: 20px; align-items: flex-end;">
                        <div class="form-group mb-0">
                            <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">Fatura Ayı:</label>
                            <select id="fatura-olustur-ay" class="form-control" style="height: 38px; font-size: 13px; background: white;">
                                <option value="">Ay Seç...</option>
                                <option value="OCAK">OCAK</option>
                                <option value="ŞUBAT">ŞUBAT</option>
                                <option value="MART">MART</option>
                                <option value="NİSAN">NİSAN</option>
                                <option value="MAYIS">MAYIS</option>
                                <option value="HAZİRAN">HAZİRAN</option>
                                <option value="TEMMUZ">TEMMUZ</option>
                                <option value="AĞUSTOS">AĞUSTOS</option>
                                <option value="EYLÜL">EYLÜL</option>
                                <option value="EKİM">EKİM</option>
                                <option value="KASIM">KASIM</option>
                                <option value="ARALIK">ARALIK</option>
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">Fatura Yılı:</label>
                            <select id="fatura-olustur-yil" class="form-control" style="height: 38px; font-size: 13px; background: white;">
                                <option value="">Yıl Seç...</option>
                                <option value="2026">2026</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                                <option value="2020">2020</option>
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">Üye işyeri:</label>
                            <select id="fatura-olustur-isyeri" class="form-control" style="height: 38px; font-size: 13px; background: white;">
                                ${shopOptionsHtml}
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">Açıklama:</label>
                            <input type="text" id="fatura-olustur-aciklama" class="form-control" style="height: 38px; font-size: 13px;">
                        </div>
                        <div class="form-group mb-0">
                            <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">Kdv Hariç Tutarı:</label>
                            <input type="number" id="fatura-olustur-tutar" class="form-control" style="height: 38px; font-size: 13px;">
                        </div>
                        <div>
                            <button type="button" class="btn" style="background: #38bdf8; color: white; border: none; padding: 9px 25px; font-weight: 700; font-size: 13px; border-radius: 6px; width: 100%;" onclick="window.addFaturaOlusturRow()">Ekle</button>
                        </div>
                    </div>

                    <!-- Table of items to be generated -->
                    <div class="table-responsive mb-3">
                        <table class="table table-hover" style="font-size: 12px;">
                            <thead>
                                <tr style="background: #f8fafc;">
                                    <th>ÜYE İŞYERİ</th>
                                    <th>DÖNEM</th>
                                    <th>AÇIKLAMA</th>
                                    <th>KDV HARİÇ TUTAR</th>
                                    <th>DAHİL TUTAR</th>

                                </tr>
                            </thead>
                            <tbody id="fatura-olustur-tbody">
                                <!-- Populated dynamically -->
                            </tbody>
                        </table>
                    </div>

                    <div style="text-align: right;">
                        <button type="button" class="btn" style="background: #38bdf8; color: white; border: none; padding: 10px 40px; font-weight: 700; font-size: 14px; border-radius: 6px;" onclick="window.confirmAndSendFatura()">Onayla İlet</button>
                    </div>
                </div>
            </div>

            <!-- Card 3: Oluşturulmuş Faturalar -->
            <div class="card" style="border-top: 3px solid #38bdf8; border-radius: 8px; padding: 25px;">
                <h4 style="font-size: 16px; font-weight: 700; color: var(--text-main); margin-bottom: 20px;">Oluşturulmuş Faturalar</h4>

                <!-- Filter Bar -->
                <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; align-items: center;">
                    <select class="form-control" style="height: 36px; font-size: 13px; background: white;">
                        <option value="OCAK">OCAK</option>
                        <option value="ŞUBAT">ŞUBAT</option>
                        <option value="MART">MART</option>
                        <option value="NİSAN">NİSAN</option>
                        <option value="MAYIS">MAYIS</option>
                        <option value="HAZİRAN">HAZİRAN</option>
                        <option value="TEMMUZ">TEMMUZ</option>
                        <option value="AĞUSTOS" selected>AĞUSTOS</option>
                        <option value="EYLÜL">EYLÜL</option>
                        <option value="EKİM">EKİM</option>
                        <option value="KASIM">KASIM</option>
                        <option value="ARALIK">ARALIK</option>
                    </select>
                    <select class="form-control" style="height: 36px; font-size: 13px; background: white;">
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                    </select>
                    <select class="form-control" style="height: 36px; font-size: 13px; background: white;">
                        <option value="">Durum Seçiniz...</option>
                        <option value="GÖNDERİLDİ">GÖNDERİLDİ</option>
                        <option value="KESİLMİŞ">KESİLMİŞ</option>
                    </select>
                    <select class="form-control" style="height: 36px; font-size: 13px; background: white;">
                        <option value="HEPSİ">HEPSİ</option>
                        <option value="ZEYTİNBURNU">ZEYTİNBURNU</option>
                        <option value="BAHÇELİEVLER">BAHÇELİEVLER</option>
                        <option value="FATİH">FATİH</option>
                    </select>
                    <button type="button" class="btn" style="background: #38bdf8; color: white; border: none; height: 36px; font-weight: 700; font-size: 13px; border-radius: 6px;">Filtrele</button>
                </div>

                <!-- Table Controls -->
                <div class="d-flex justify-content-between align-items-center mb-3" style="flex-wrap: wrap; gap: 10px;">
                    <div style="font-size: 13px; color: var(--text-muted);">
                        Sayfada 
                        <select class="form-control" style="display: inline-block; width: 70px; padding: 4px 8px; height: 32px;">
                            <option value="50">50</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="100">100</option>
                        </select> 
                        Kayıt Göster
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted);">
                        Ara: 
                        <input type="text" class="form-control" style="width: 180px; height: 32px; padding: 4px 8px;">
                    </div>
                </div>

                <!-- Table -->
                <div class="table-responsive">
                    <table class="table table-hover" style="font-size: 12px;">
                        <thead>
                            <tr>
                                <th>FATURA NO</th>
                                <th>YÜKLEYEN</th>
                                <th>ÜYE İŞYERİ</th>
                                <th>BÖLGE</th>
                                <th>DÖNEM</th>
                                <th>TUTAR</th>
                                <th>OTO MAİL</th>
                                <th>FATURA</th>
                                <th style="text-align: center;">#</th>
                            </tr>
                        </thead>
                        <tbody id="olusturulmus-faturalar-tbody">
                        </tbody>
                    </table>
                </div>

                <!-- Table Footer & Toolbar -->
                <div class="d-flex justify-content-between align-items-start mt-3" style="flex-wrap: wrap; gap: 15px;">
                    <div style="font-size: 13px; color: var(--text-muted); padding-top: 5px;">
                        3 Kayıttan 1 ile 3 Arası Gösteriliyor
                    </div>
                    <div class="d-flex flex-column align-items-end" style="gap: 8px;">
                        <!-- Pagination -->
                        <div class="d-flex" style="border: 1px solid #ced4da; border-radius: 4px; overflow: hidden;">
                            <button class="btn btn-sm" style="background: white; color: #6c757d; padding: 6px 14px; border-right: 1px solid #ced4da; font-size: 13px;">Önceki</button>
                            <button class="btn btn-sm" style="background: #007bff; color: white; padding: 6px 14px; font-size: 13px; font-weight: 600; border: none;">1</button>
                            <button class="btn btn-sm" style="background: white; color: #6c757d; padding: 6px 14px; border-left: 1px solid #ced4da; font-size: 13px;">Sonraki</button>
                        </div>

                        <!-- Dark Toolbar Bar -->
                        <div class="d-flex align-items-center" style="background: #495057; color: white; border-radius: 6px; padding: 7px 16px; gap: 16px; font-size: 13px; font-weight: 500; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
                            <span style="cursor: pointer;" onclick="window.exportTableToExcel(this, 'fatura_listesi.xls')">Excel</span>
                            <span style="cursor: pointer;" onclick="window.print()">Yazdır</span>
                        </div>
                    </div>
                </div>
            </div>
        `;



        window.applyFaturaStatuses = function() {
            let saved = JSON.parse(localStorage.getItem('olusturulmus_fatura_statuses') || '{}');
            document.querySelectorAll('tr[data-fatura-no]').forEach(tr => {
                const fNo = tr.getAttribute('data-fatura-no');
                const st = saved[fNo] || { mail: null, fatura: null };

                const mailTd = tr.querySelector('.td-oto-mail');
                if (mailTd) {
                    if (st.mail === 'GÖNDERİLDİ') {
                        mailTd.innerHTML = '<span class="badge" style="background: #dcfce7; color: #16a34a; font-weight: 700; font-size: 10px;">GÖNDERİLDİ</span>';
                    } else if (st.mail === 'GÖNDERİLEMEDİ') {
                        mailTd.innerHTML = '<span class="badge" style="background: #fee2e2; color: #dc2626; font-weight: 700; font-size: 10px;">GÖNDERİLEMEDİ</span>';
                    } else {
                        mailTd.innerHTML = '';
                    }
                }

                const faturaTd = tr.querySelector('.td-fatura');
                if (faturaTd) {
                    if (st.fatura === 'KESİLMİŞ') {
                        faturaTd.innerHTML = '<span class="badge" style="background: #dcfce7; color: #16a34a; font-weight: 700; font-size: 10px;">KESİLMİŞ</span>';
                    } else {
                        faturaTd.innerHTML = '';
                    }
                }
            });
        };

        window.updateFaturaStatus = function(faturaNo, type, value) {
            let saved = JSON.parse(localStorage.getItem('olusturulmus_fatura_statuses') || '{}');
            if (!saved[faturaNo]) saved[faturaNo] = { mail: null, fatura: null };

            if (type === 'mail') {
                if (saved[faturaNo].mail === value) {
                    saved[faturaNo].mail = null;
                } else {
                    saved[faturaNo].mail = value;
                }
            } else if (type === 'fatura') {
                if (saved[faturaNo].fatura === value) {
                    saved[faturaNo].fatura = null;
                } else {
                    saved[faturaNo].fatura = value;
                }
            } else if (type === 'all' || type === 'clear') {
                saved[faturaNo] = { mail: null, fatura: null };
            }

            localStorage.setItem('olusturulmus_fatura_statuses', JSON.stringify(saved));
            window.applyFaturaStatuses();
        };

        window.renderFaturaListRows = function() {
            const tbody = document.getElementById('olusturulmus-faturalar-tbody');
            if (!tbody) return;
            const faturaList = JSON.parse(localStorage.getItem('faturaList') || '[]');
            
            let html = '';
            faturaList.forEach(f => {
                const haricFormatted = f.haricVal.toLocaleString('tr-TR', { minimumFractionDigits: 2 });
                const dahilFormatted = f.dahilVal.toLocaleString('tr-TR', { minimumFractionDigits: 2 });
                
                html += `
                    <tr data-fatura-no="${f.faturaNo}" style="border-bottom: 1px solid #edf2f7;">
                        <td style="padding: 10px 8px; font-weight: 600;">${f.faturaNo}</td>
                        <td style="padding: 10px 8px; color: #718096;">${f.yukleyen}</td>
                        <td style="padding: 10px 8px; font-weight: 500;">${f.isyeri}</td>
                        <td style="padding: 10px 8px;">${f.bolge}</td>
                        <td style="padding: 10px 8px;">${f.donem}</td>
                        <td style="padding: 10px 8px;">
                            <div style="font-size: 11px;">Hariç: ${haricFormatted} ₺</div>
                            <div style="font-size: 11px; font-weight: 600; color: #4a5568;">Dahil: ${dahilFormatted} ₺</div>
                        </td>
                        <td class="td-oto-mail" style="padding: 10px 8px; vertical-align: middle;"></td>
                        <td class="td-fatura" style="padding: 10px 8px; vertical-align: middle;"></td>
                        <td style="padding: 10px 8px; text-align: center; vertical-align: middle;">
                            <div class="dropdown" style="display: inline-block; position: relative;">
                                <button type="button" class="btn btn-sm" style="background: #38bdf8; color: white; padding: 2px 8px; border-radius: 4px; border: none; font-size: 11px; cursor: pointer;" onclick="event.stopPropagation(); document.querySelectorAll('.dropdown-content').forEach(d => d !== this.nextElementSibling ? d.classList.remove('show') : null); this.nextElementSibling.classList.toggle('show')">
                                    <i class="fa-solid fa-caret-down"></i>
                                </button>
                                <div class="dropdown-content" style="min-width: 190px; padding: 6px 0; font-size: 12px; right: 0; left: auto; text-align: left; background: white; border: 1px solid #e2e8f0; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 100;">
                                    <a href="#" class="dropdown-item" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; color: #2d3748; text-decoration: none; font-size: 13px;" onclick="event.preventDefault(); this.closest('.dropdown-content').classList.remove('show'); window.showCariBilgileriModal('${f.isyeri.replace(/'/g, "\\\\'")}');">
                                        <span style="width: 12px; height: 12px; border-radius: 50%; background: #007bff; display: inline-block; flex-shrink: 0;"></span> Cari Bilgileri
                                    </a>
                                    <a href="#" class="dropdown-item" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; color: #2d3748; text-decoration: none; font-size: 13px;" onclick="event.preventDefault(); this.closest('.dropdown-content').classList.remove('show'); window.showCariHareketleriModal('${f.isyeri.replace(/'/g, "\\\\'")}');">
                                        <span style="width: 12px; height: 12px; border-radius: 50%; background: #ffb700; display: inline-block; flex-shrink: 0;"></span> Cari Hareketleri
                                    </a>
                                    <hr style="margin: 4px 0; border: none; border-top: 1px solid #e2e8f0;">
                                    <a href="#" class="dropdown-item" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; color: #2d3748; text-decoration: none; font-size: 13px;" onclick="event.preventDefault(); this.closest('.dropdown-content').classList.remove('show'); window.updateFaturaStatus('${f.faturaNo}', 'mail', 'GÖNDERİLDİ');">
                                        <span style="width: 12px; height: 12px; border-radius: 50%; background: #38b2ac; display: inline-block; flex-shrink: 0;"></span> Gönderildi
                                    </a>
                                    <a href="#" class="dropdown-item" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; color: #2d3748; text-decoration: none; font-size: 13px;" onclick="event.preventDefault(); this.closest('.dropdown-content').classList.remove('show'); window.updateFaturaStatus('${f.faturaNo}', 'mail', 'GÖNDERİLEMEDİ');">
                                        <span style="width: 12px; height: 12px; border-radius: 50%; background: #e53e3e; display: inline-block; flex-shrink: 0;"></span> Gönderilemedi
                                    </a>
                                    <a href="#" class="dropdown-item" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; color: #2d3748; text-decoration: none; font-size: 13px;" onclick="event.preventDefault(); this.closest('.dropdown-content').classList.remove('show'); window.updateFaturaStatus('${f.faturaNo}', 'fatura', 'KESİLMİŞ');">
                                        <span style="width: 12px; height: 12px; border-radius: 50%; background: #f6ad55; display: inline-block; flex-shrink: 0;"></span> Kesilmiş
                                    </a>
                                    <hr style="margin: 4px 0; border: none; border-top: 1px solid #e2e8f0;">
                                    <a href="#" class="dropdown-item" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; color: #e53e3e; text-decoration: none; font-size: 13px;" onclick="event.preventDefault(); this.closest('.dropdown-content').classList.remove('show'); window.updateFaturaStatus('${f.faturaNo}', 'all', null);">
                                        <i class="fa-solid fa-rotate-left" style="font-size: 12px; color: #e53e3e; width: 12px; text-align: center;"></i> Durumları Geri Al / Temizle
                                    </a>
                                </div>
                            </div>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
            window.applyFaturaStatuses();
        };

        window.renderFaturaListRows();

        // Helper function to show Cari Bilgileri Modal
        window.showCariBilgileriModal = function(shopName) {
            const details = {
                vergiDairesi: '',
                vergiNo: '',
                unvan: '',
                adres: '',
                aciklama: '',
                eposta: '',
                kullanici: '',
                tarih: ''
            };

            let existingModal = document.getElementById('cari-bilgileri-modal-overlay');
            if (existingModal) existingModal.remove();

            const modalOverlay = document.createElement('div');
            modalOverlay.id = 'cari-bilgileri-modal-overlay';
            modalOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px;';

            modalOverlay.innerHTML = `
                <div style="background: white; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); padding: 25px; position: relative; font-family: 'Inter', sans-serif;">
                    <h3 style="text-align: center; font-size: 18px; font-weight: 700; color: #4b5563; margin-top: 0; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px;">${shopName}</h3>
                    
                    <div style="display: flex; flex-direction: column; gap: 14px;">
                        <div>
                            <label style="font-size: 13px; font-weight: 700; color: #374151; display: block; margin-bottom: 5px;">Vergi Dairesi</label>
                            <input type="text" class="form-control" value="${details.vergiDairesi}" readonly style="width: 100%; height: 38px; padding: 6px 12px; font-size: 13px; border: 1px solid #d1d5db; border-radius: 4px; background: white; color: #1f2937;">
                        </div>

                        <div>
                            <label style="font-size: 13px; font-weight: 700; color: #374151; display: block; margin-bottom: 5px;">Vergi Numarası</label>
                            <input type="text" class="form-control" value="${details.vergiNo}" readonly style="width: 100%; height: 38px; padding: 6px 12px; font-size: 13px; border: 1px solid #d1d5db; border-radius: 4px; background: white; color: #1f2937;">
                        </div>

                        <div>
                            <label style="font-size: 13px; font-weight: 700; color: #374151; display: block; margin-bottom: 5px;">Resmi Ünvanı</label>
                            <input type="text" class="form-control" value="${details.unvan}" readonly style="width: 100%; height: 38px; padding: 6px 12px; font-size: 13px; border: 1px solid #d1d5db; border-radius: 4px; background: white; color: #1f2937;">
                        </div>

                        <div>
                            <label style="font-size: 13px; font-weight: 700; color: #374151; display: block; margin-bottom: 5px;">Resmi Adresi</label>
                            <textarea class="form-control" readonly style="width: 100%; height: 60px; padding: 6px 12px; font-size: 13px; border: 1px solid #d1d5db; border-radius: 4px; background: white; color: #1f2937; resize: none;">${details.adres}</textarea>
                        </div>

                        <div>
                            <label style="font-size: 13px; font-weight: 700; color: #374151; display: block; margin-bottom: 5px;">Fatura Açıklaması</label>
                            <textarea class="form-control" readonly style="width: 100%; height: 50px; padding: 6px 12px; font-size: 13px; border: 1px solid #d1d5db; border-radius: 4px; background: white; color: #1f2937; resize: none;">${details.aciklama}</textarea>
                        </div>

                        <div>
                            <label style="font-size: 13px; font-weight: 700; color: #374151; display: block; margin-bottom: 5px;">İletilecek E-postalar</label>
                            <input type="text" class="form-control" value="${details.eposta}" readonly style="width: 100%; height: 38px; padding: 6px 12px; font-size: 13px; border: 1px solid #d1d5db; border-radius: 4px; background: white; color: #1f2937;">
                        </div>

                        <div>
                            <label style="font-size: 13px; font-weight: 700; color: #374151; display: block; margin-bottom: 5px;">Oluşturan Kullanıcı</label>
                            <input type="text" class="form-control" value="${details.kullanici}" readonly style="width: 100%; height: 38px; padding: 6px 12px; font-size: 13px; border: 1px solid #d1d5db; border-radius: 4px; background: white; color: #1f2937;">
                        </div>

                        <div>
                            <label style="font-size: 13px; font-weight: 700; color: #374151; display: block; margin-bottom: 5px;">Oluşturma Tarihi</label>
                            <input type="text" class="form-control" value="${details.tarih}" readonly style="width: 100%; height: 38px; padding: 6px 12px; font-size: 13px; border: 1px solid #d1d5db; border-radius: 4px; background: white; color: #1f2937;">
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 20px;">
                        <button type="button" class="btn" style="background: #007bff; color: white; border: none; padding: 8px 36px; font-size: 14px; font-weight: 700; border-radius: 4px; cursor: pointer;" onclick="document.getElementById('cari-bilgileri-modal-overlay').remove()">KAPAT</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modalOverlay);
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) modalOverlay.remove();
            });
        };

        // Helper function to show Cari Hareketleri Modal
        

        // Helper function to auto-fill fatura items
        
    window.confirmAndSendFatura = function() {
        const tempRows = document.querySelectorAll('#fatura-olustur-tbody tr');
        if (tempRows.length === 0) {
            alert('Lütfen önce "Ekle" butonu ile fatura satırları ekleyiniz.');
            return;
        }

        const getShopRegion = (shopName) => {
            const activeShops = JSON.parse(localStorage.getItem('activeShops')) || (AppData.activeShops ? AppData.activeShops.active_shops : []) || [];
            const shop = activeShops.find(s => s.tabela === shopName);
            return shop ? shop.bolge : 'BAHÇELİEVLER';
        };

        let faturaList = JSON.parse(localStorage.getItem('faturaList') || '[]');

        tempRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 5) {
                const isyeri = cells[0].innerText.trim();
                const donem = cells[1].innerText.trim().replace(' ', '-');
                const aciklama = cells[2].innerText.trim();
                const haricVal = parseFloat(cells[3].innerText.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                const dahilVal = parseFloat(cells[4].innerText.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                
                const faturaNo = Math.floor(Math.random() * 1000) + 4200;
                const bolge = getShopRegion(isyeri);
                
                faturaList.unshift({
                    faturaNo,
                    yukleyen: 'YÖNETİM',
                    isyeri,
                    bolge,
                    donem,
                    haricVal,
                    dahilVal
                });
            }
        });

        localStorage.setItem('faturaList', JSON.stringify(faturaList));
        document.getElementById('fatura-olustur-tbody').innerHTML = '';
        window.renderFaturaListRows();

        alert('Fatura başarıyla onaylandı, iletildi ve alttaki listeye eklendi.');
    };


    window.autoFillFaturaList = function() {
            const tbody = document.getElementById('fatura-olustur-tbody');
            if (!tbody) return;
            tbody.innerHTML = `
                <tr>
                    <td style="font-weight: 600;">Diver Fevzipaşa</td>
                    <td>AĞUSTOS 2026</td>
                    <td>Kurye Hizmet Bedeli Hakediş</td>
                    <td style="font-weight: 600;">83.333,33 ₺</td>
                    <td style="font-weight: 700; color: #0284c7;">100.000,00 ₺</td>

                </tr>
                <tr>
                    <td style="font-weight: 600;">KUZEY BÜFE</td>
                    <td>AĞUSTOS 2026</td>
                    <td>Kurye Hizmet Bedeli Hakediş</td>
                    <td style="font-weight: 600;">75.000,00 ₺</td>
                    <td style="font-weight: 700; color: #0284c7;">90.000,00 ₺</td>

                </tr>
                <tr>
                    <td style="font-weight: 600;">Pilav Evi</td>
                    <td>AĞUSTOS 2026</td>
                    <td>Kurye Hizmet Bedeli Hakediş</td>
                    <td style="font-weight: 600;">58.333,33 ₺</td>
                    <td style="font-weight: 700; color: #0284c7;">70.000,00 ₺</td>

                </tr>
            `;
        };

        window.addFaturaOlusturRow = function() {
            const isyeri = document.getElementById('fatura-olustur-isyeri')?.value;
            const ay = document.getElementById('fatura-olustur-ay')?.value;
            const yil = document.getElementById('fatura-olustur-yil')?.value;
            const aciklama = document.getElementById('fatura-olustur-aciklama')?.value.trim();
            const tutarRaw = document.getElementById('fatura-olustur-tutar')?.value;

            if (!ay || !yil || !isyeri || !aciklama || !tutarRaw) {
                alert('Lütfen fatura oluşturma formundaki tüm boşlukları doldurunuz.');
                return;
            }

            const haric = parseFloat(tutarRaw);
            if (isNaN(haric) || haric <= 0) {
                alert('Lütfen geçerli bir Kdv Hariç Tutarı giriniz.');
                return;
            }

            const dahil = haric * 1.20;

            const tbody = document.getElementById('fatura-olustur-tbody');
            if (!tbody) return;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight: 600;">${isyeri}</td>
                <td>${ay} ${yil}</td>
                <td>${aciklama}</td>
                <td style="font-weight: 600;">${haric.toLocaleString('tr-TR', {minimumFractionDigits:2})} ₺</td>
                <td style="font-weight: 700; color: #0284c7;">${dahil.toLocaleString('tr-TR', {minimumFractionDigits:2})} ₺</td>

            `;
            tbody.appendChild(tr);

            // Clear inputs
            document.getElementById('fatura-olustur-aciklama').value = '';
            document.getElementById('fatura-olustur-tutar').value = '';
        };

        window.toggleFaturaStatus = function(elem, type) {
            if (type === 'mail') {
                if (elem.innerText === 'GÖNDERİLDİ') {
                    elem.innerText = 'GÖNDERİLMEDİ';
                    elem.style.background = '#fee2e2';
                    elem.style.color = '#dc2626';
                } else {
                    elem.innerText = 'GÖNDERİLDİ';
                    elem.style.background = '#dcfce7';
                    elem.style.color = '#16a34a';
                }
            } else if (type === 'fatura') {
                if (elem.innerText === 'KESİLMİŞ') {
                    elem.innerText = 'KESİLMEDİ';
                    elem.style.background = '#fee2e2';
                    elem.style.color = '#dc2626';
                } else {
                    elem.innerText = 'KESİLMİŞ';
                    elem.style.background = '#dcfce7';
                    elem.style.color = '#16a34a';
                }
            }
        };
    }

    function renderGelirGider() {
        const activeShops = JSON.parse(localStorage.getItem('activeShops')) || (AppData.activeShops ? AppData.activeShops.active_shops : []) || [];
        const activeCouriers = JSON.parse(localStorage.getItem('activeCouriers')) || (AppData.activeCouriers ? AppData.activeCouriers.active_couriers : []) || [];
        const shopCount = activeShops.length;
        const courierCount = activeCouriers.length;

        const giderList = JSON.parse(localStorage.getItem('giderList') || '[]');
        const personelTotal = giderList.filter(g => g.tur === 'PERSONEL').reduce((s, g) => s + (parseFloat(g.tutar) || 0), 0);
        const digerTotal = giderList.filter(g => g.tur !== 'PERSONEL').reduce((s, g) => s + (parseFloat(g.tutar) || 0), 0);
        const giderToplamVal = personelTotal + digerTotal;
        const fmtTR = (v) => v.toLocaleString('tr-TR', { minimumFractionDigits: 2 });

        pageContainer.innerHTML = `
            <!-- Top Header & Breadcrumb -->
            <div class="d-flex justify-content-between align-items-center mb-4" style="flex-wrap: wrap; gap: 10px;">
                <h2 style="font-size: 22px; font-weight: 700; color: var(--text-main); margin: 0;">Gelir Gider Raporu</h2>
                <div style="font-size: 13px; color: var(--text-muted);">
                    <span>Anasayfa</span> / <span style="color: var(--primary-color); font-weight: 500;">Gelir Gider Raporu</span>
                </div>
            </div>

            <!-- Card 1: Filtre -->
            <div class="card mb-4" style="border-top: 3px solid #38bdf8; border-radius: 8px; padding: 20px;">
                <h4 style="font-size: 15px; font-weight: 600; color: var(--text-main); margin-bottom: 18px;">Filtre</h4>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 15px; align-items: flex-end;">
                    <div class="form-group mb-0">
                        <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">AY:</label>
                        <select id="gg-filter-ay" class="form-control" style="height: 38px; font-size: 13px; background: white;">
                            <option value="OCAK">OCAK</option>
                            <option value="ŞUBAT">ŞUBAT</option>
                            <option value="MART">MART</option>
                            <option value="NİSAN">NİSAN</option>
                            <option value="MAYIS">MAYIS</option>
                            <option value="HAZİRAN">HAZİRAN</option>
                            <option value="TEMMUZ">TEMMUZ</option>
                            <option value="AĞUSTOS" selected>AĞUSTOS</option>
                            <option value="EYLÜL">EYLÜL</option>
                            <option value="EKİM">EKİM</option>
                            <option value="KASIM">KASIM</option>
                            <option value="ARALIK">ARALIK</option>
                        </select>
                    </div>

                    <div class="form-group mb-0">
                        <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">YIL:</label>
                        <select id="gg-filter-yil" class="form-control" style="height: 38px; font-size: 13px; background: white;">
                            <option value="2026" selected>2026</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                            <option value="2020">2020</option>
                        </select>
                    </div>

                    <div>
                        <button type="button" class="btn" style="background: #38bdf8; color: white; border: none; height: 38px; padding: 0 25px; font-weight: 700; font-size: 13px; border-radius: 6px; width: 100%;" onclick="alert('Rapor yenilendi.')">YENİLE</button>
                    </div>
                </div>
            </div>

            <!-- Card 2: Gelir Gider Raporu -->
            <div class="card mb-4" style="border-top: 3px solid #38bdf8; border-radius: 8px; padding: 25px;">
                <h4 style="font-size: 16px; font-weight: 600; color: var(--text-main); margin-bottom: 20px;">Gelir Gider Raporu</h4>

                <!-- 2 Column: GİDERLER vs GELİRLER -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 25px;">
                    <!-- Left: GİDERLER -->
                    <div>
                        <h3 style="text-align: center; font-size: 20px; font-weight: 700; color: #334155; margin-bottom: 15px;">GİDERLER</h3>
                        <div class="table-responsive">
                            <table class="table" style="font-size: 12px; border: 1px solid #e2e8f0;">
                                <thead>
                                    <tr style="background: white;">
                                        <th style="font-weight: 700; color: #334155; border-bottom: 2px solid #e2e8f0; width: 50%;">TÜR</th>
                                        <th style="font-weight: 700; color: #334155; border-bottom: 2px solid #e2e8f0; width: 50%;">TUTAR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="font-weight: 600; color: #334155;">PERSONEL MAAŞLARI</td>
                                        <td style="font-weight: 500;">${fmtTR(personelTotal)} ₺</td>
                                    </tr>
                                    <tr>
                                        <td style="font-weight: 600; color: #334155;">DİĞER GİDERLER</td>
                                        <td style="font-weight: 500;">${fmtTR(digerTotal)} ₺</td>
                                    </tr>
                                    <tr style="background: #f59e0b; color: #000; font-weight: 700;">
                                        <td style="font-weight: 800; border-top: 2px solid #d97706;">TOPLAM :</td>
                                        <td style="font-weight: 800; border-top: 2px solid #d97706;">${fmtTR(giderToplamVal)} ₺</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Right: GELİRLER -->
                    <div>
                        <h3 style="text-align: center; font-size: 20px; font-weight: 700; color: #334155; margin-bottom: 15px;">GELİRLER</h3>
                        <div class="table-responsive">
                            <table class="table" style="font-size: 12px; border: 1px solid #e2e8f0;">
                                <thead>
                                    <tr style="background: white;">
                                        <th style="font-weight: 700; color: #334155; text-align: right; border-bottom: 2px solid #e2e8f0; width: 50%;">TUTAR</th>
                                        <th style="font-weight: 700; color: #334155; text-align: right; border-bottom: 2px solid #e2e8f0; width: 50%;">TÜR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="text-align: right; font-weight: 500;">0,00 ₺</td>
                                        <td style="text-align: right; font-weight: 600; color: #334155;">ÜYE İŞ YERİ <i class="fa-regular fa-hand-pointer" style="font-size: 11px;"></i></td>
                                    </tr>
                                    <tr style="background: #f59e0b; color: #000; font-weight: 700;">
                                        <td style="text-align: right; font-weight: 800; border-top: 2px solid #d97706;">0,00 ₺</td>
                                        <td style="text-align: right; font-weight: 800; border-top: 2px solid #d97706;">: TOPLAM</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Breakdown Tables Below -->
                <!-- Block 1: GELİR / GİDER / FARK -->
                <div class="table-responsive mb-3">
                    <table class="table" style="font-size: 12px; border: 1px solid #e2e8f0;">
                        <thead>
                            <tr style="background: white;">
                                <th style="font-weight: 700; color: #334155; width: 33.33%;">GELİR</th>
                                <th style="font-weight: 700; color: #334155; width: 33.33%;">GİDER</th>
                                <th style="font-weight: 700; color: #334155; width: 33.33%;">FARK</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="font-weight: 500;">0,00</td>
                                <td style="font-weight: 500;">${fmtTR(giderToplamVal)}</td>
                                <td style="background: #16a34a; color: white; font-weight: 700;">${fmtTR(0 - giderToplamVal)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Block 2: MOTOR KİRA GELİRİ / MOTOR KİRA GİDERİ / FARK -->
                <div class="table-responsive mb-3">
                    <table class="table" style="font-size: 12px; border: 1px solid #e2e8f0;">
                        <thead>
                            <tr style="background: white;">
                                <th style="font-weight: 700; color: #334155; width: 33.33%;">MOTOR KİRA GELİRİ</th>
                                <th style="font-weight: 700; color: #334155; width: 33.33%;">MOTOR KİRA GİDERİ</th>
                                <th style="font-weight: 700; color: #334155; width: 33.33%;">FARK</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="font-weight: 500;">0,00</td>
                                <td style="font-weight: 500;">0,00</td>
                                <td style="background: #16a34a; color: white; font-weight: 700;">0,00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Block 3: ÜYE İŞYERİ ADETİ / KURYE ADETİ / PERSONEL ADETİ -->
                <div class="table-responsive">
                    <table class="table" style="font-size: 12px; border: 1px solid #e2e8f0;">
                        <thead>
                            <tr style="background: white;">
                                <th style="font-weight: 700; color: #334155; width: 33.33%;">ÜYE İŞYERİ ADETİ</th>
                                <th style="font-weight: 700; color: #334155; width: 33.33%;">KURYE ADETİ</th>
                                <th style="font-weight: 700; color: #334155; width: 33.33%;">PERSONEL ADETİ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="font-weight: 500;">${shopCount}</td>
                                <td style="font-weight: 500;">${courierCount}</td>
                                <td style="font-weight: 500;">${shopCount + courierCount}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // ==========================================
    // PAKET TAKİP SEKMELERİ
    // 1. Kurye Paket Takip
    // 2. Üye İşyeri Paket Takip
    // ==========================================

    function getActiveCouriersList() {
        let raw = null;
        try {
            raw = JSON.parse(localStorage.getItem('activeCouriers'));
        } catch(e) {}
        if (!raw && window.AppData && window.AppData.activeCouriers) {
            raw = window.AppData.activeCouriers;
        }
        let list = [];
        if (Array.isArray(raw)) {
            list = raw;
        } else if (raw && Array.isArray(raw.active_couriers)) {
            list = raw.active_couriers;
        }
        if (list.length === 0) {
            list = [
                { adi: 'Mert Ali Erzincan', bolge: 'ZEYTİNBURNU' },
                { adi: 'ADEM GÜNEŞ', bolge: 'ZEYTİNBURNU' },
                { adi: 'Muhammet Tagi İlbeyli', bolge: 'ZEYTİNBURNU' },
                { adi: 'Mevlüt Demirtaş', bolge: 'ZEYTİNBURNU' },
                { adi: 'Ezel Nadar', bolge: 'ZEYTİNBURNU' },
                { adi: 'Bilal Ademoğlu', bolge: 'BAHÇELİEVLER' },
                { adi: 'Hasan Basri Kara', bolge: 'BAHÇELİEVLER' },
                { adi: 'Selin Doğan', bolge: 'BAHÇELİEVLER' },
                { adi: 'Murat Yıldırım', bolge: 'BAHÇELİEVLER' },
                { adi: 'Zafer Kayaoğlu', bolge: 'FATİH' },
                { adi: 'Volkan Demir', bolge: 'FATİH' },
                { adi: 'Tarkan Çetin', bolge: 'FATİH' }
            ];
        }
        return list;
    }

    function getActiveShopsList() {
        let raw = null;
        try {
            raw = JSON.parse(localStorage.getItem('activeShops'));
        } catch(e) {}
        if (!raw && window.AppData && window.AppData.activeShops) {
            raw = window.AppData.activeShops;
        }
        let list = [];
        if (Array.isArray(raw)) {
            list = raw;
        } else if (raw && Array.isArray(raw.active_shops)) {
            list = raw.active_shops;
        }
        if (list.length === 0) {
            list = [
                { tabela: 'ERCAN BURGER YENİBOSNA', bolge: 'BAHÇELİEVLER' },
                { tabela: 'Pilav Evi', bolge: 'ZEYTİNBURNU' },
                { tabela: 'MERHABA PASTANESİ HALKALI', bolge: 'BAHÇELİEVLER' },
                { tabela: 'SARAY MUHALLEBİCİSİ FATİH', bolge: 'FATİH' },
                { tabela: 'HATAY MEDENİYETLER SOFRASI', bolge: 'ZEYTİNBURNU' },
                { tabela: 'PASTA SANATI FATİH', bolge: 'FATİH' },
                { tabela: 'Diver Fevzipaşa', bolge: 'ZEYTİNBURNU' },
                { tabela: 'Diver Akdeniz Caddesi', bolge: 'ZEYTİNBURNU' }
            ];
        }
        return list;
    }

    window.filterKuryePaketTable = function() {
        window.renderKuryePaketRows();
    };

    window.resetKuryePaketFilter = function() {
        if (document.getElementById('kurye-filter-bolge')) document.getElementById('kurye-filter-bolge').value = 'HEPSİ';
        if (document.getElementById('kurye-filter-kurye')) document.getElementById('kurye-filter-kurye').value = 'HEPSİ';
        if (document.getElementById('kurye-filter-isyeri')) document.getElementById('kurye-filter-isyeri').value = 'HEPSİ';
        if (document.getElementById('kurye-filter-durum')) document.getElementById('kurye-filter-durum').value = 'HEPSİ';
        if (document.getElementById('kurye-paket-search')) document.getElementById('kurye-paket-search').value = '';
        window.renderKuryePaketRows();
    };

    window.togglePaketStatus = function(paketId) {
        let list = JSON.parse(localStorage.getItem('kuryeDeliveryList') || '[]');
        const idx = list.findIndex(x => x.id === paketId);
        if (idx !== -1) {
            if (list[idx].durum === 'TESLİM EDİLDİ') {
                list[idx].durum = 'DAĞITIMDA';
            } else if (list[idx].durum === 'DAĞITIMDA') {
                list[idx].durum = 'İPTAL EDİLDİ';
            } else {
                list[idx].durum = 'TESLİM EDİLDİ';
            }
            localStorage.setItem('kuryeDeliveryList', JSON.stringify(list));
            window.renderKuryePaketRows();
        }
    };

    window.showKuryePaketDetailModal = function(paketId) {
        let list = JSON.parse(localStorage.getItem('kuryeDeliveryList') || '[]');
        const p = list.find(x => x.id === paketId);
        if (!p) return;

        let existing = document.getElementById('kurye-paket-detail-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'kurye-paket-detail-modal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 999999; padding: 20px;';
        modal.innerHTML = `
            <div style="background: white; width: 100%; max-width: 500px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); padding: 24px; font-family: 'Inter', sans-serif;">
                <div class="d-flex justify-content-between align-items-center mb-3" style="border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
                    <div>
                        <span style="font-size: 11px; font-weight: 700; color: #0284c7; text-transform: uppercase;">Paket Detayı</span>
                        <h3 style="font-size: 18px; font-weight: 700; color: #1e293b; margin: 2px 0 0 0;">${p.id}</h3>
                    </div>
                    <button type="button" style="background: none; border: none; font-size: 20px; color: #94a3b8; cursor: pointer;" onclick="document.getElementById('kurye-paket-detail-modal').remove()">✕</button>
                </div>

                <div style="display: flex; flex-direction: column; gap: 12px; font-size: 13px;">
                    <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: #f8fafc; border-radius: 6px;">
                        <span style="color: #64748b; font-weight: 600;">Tarih / Saat:</span>
                        <span style="font-weight: 700; color: #0f172a;">${p.tarih}</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: #f8fafc; border-radius: 6px;">
                        <span style="color: #64748b; font-weight: 600;">Kurye:</span>
                        <span style="font-weight: 700; color: #0284c7;">${p.kurye}</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: #f8fafc; border-radius: 6px;">
                        <span style="color: #64748b; font-weight: 600;">Bölge:</span>
                        <span style="font-weight: 700; color: #334155;">${p.bolge}</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: #f8fafc; border-radius: 6px;">
                        <span style="color: #64748b; font-weight: 600;">Üye İşyeri:</span>
                        <span style="font-weight: 700; color: #0f172a;">${p.isyeri}</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: #f8fafc; border-radius: 6px;">
                        <span style="color: #64748b; font-weight: 600;">Paket Sayısı:</span>
                        <span style="font-weight: 700; color: #0284c7;">${p.paketSayisi || 1} Paket</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: #ecfdf5; border-radius: 6px;">
                        <span style="color: #047857; font-weight: 600;">Paket Birim Ücreti:</span>
                        <span style="font-weight: 800; color: #059669; font-size: 14px;">${p.hakedis}</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: #f8fafc; border-radius: 6px; align-items: center;">
                        <span style="color: #64748b; font-weight: 600;">Durum:</span>
                        <span style="font-weight: 700; color: ${p.durum === 'TESLİM EDİLDİ' ? '#16a34a' : (p.durum === 'DAĞITIMDA' ? '#0284c7' : '#dc2626')};">${p.durum}</span>
                    </div>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                    <button type="button" class="btn btn-secondary" style="padding: 8px 20px; font-weight: 600; border: none; background: #e2e8f0; color: #334155;" onclick="document.getElementById('kurye-paket-detail-modal').remove()">Kapat</button>
                    <button type="button" class="btn btn-primary" style="padding: 8px 20px; font-weight: 600;" onclick="window.togglePaketStatus('${p.id}'); document.getElementById('kurye-paket-detail-modal').remove();">Durumu Değiştir</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    };

    window.showAddKuryePaketModal = function() {
        try {
            let activeCouriers = [];
            try {
                activeCouriers = JSON.parse(localStorage.getItem('activeCouriers')) || [];
            } catch(e) {}
            if (!activeCouriers || activeCouriers.length === 0) {
                activeCouriers = (window.AppData && window.AppData.activeCouriers && window.AppData.activeCouriers.active_couriers) || [];
            }
            if (!activeCouriers || activeCouriers.length === 0) {
                activeCouriers = [
                    { adi: 'Mert Ali Erzincan', bolge: 'ZEYTİNBURNU' },
                    { adi: 'ADEM GÜNEŞ', bolge: 'ZEYTİNBURNU' },
                    { adi: 'Muhammet Tagi İlbeyli', bolge: 'ZEYTİNBURNU' },
                    { adi: 'Mevlüt Demirtaş', bolge: 'ZEYTİNBURNU' },
                    { adi: 'Ezel Nadar', bolge: 'ZEYTİNBURNU' },
                    { adi: 'Bilal Ademoğlu', bolge: 'BAHÇELİEVLER' },
                    { adi: 'Hasan Basri Kara', bolge: 'BAHÇELİEVLER' },
                    { adi: 'Selin Doğan', bolge: 'BAHÇELİEVLER' },
                    { adi: 'Murat Yıldırım', bolge: 'BAHÇELİEVLER' },
                    { adi: 'Zafer Kayaoğlu', bolge: 'FATİH' },
                    { adi: 'Volkan Demir', bolge: 'FATİH' },
                    { adi: 'Tarkan Çetin', bolge: 'FATİH' }
                ];
            }

            let activeShops = [];
            try {
                activeShops = JSON.parse(localStorage.getItem('activeShops')) || [];
            } catch(e) {}
            if (!activeShops || activeShops.length === 0) {
                activeShops = (window.AppData && window.AppData.activeShops && window.AppData.activeShops.active_shops) || [];
            }
            if (!activeShops || activeShops.length === 0) {
                activeShops = [
                    { tabela: 'ERCAN BURGER YENİBOSNA', bolge: 'BAHÇELİEVLER' },
                    { tabela: 'Pilav Evi', bolge: 'ZEYTİNBURNU' },
                    { tabela: 'MERHABA PASTANESİ HALKALI', bolge: 'BAHÇELİEVLER' },
                    { tabela: 'SARAY MUHALLEBİCİSİ FATİH', bolge: 'FATİH' },
                    { tabela: 'HATAY MEDENİYETLER SOFRASI', bolge: 'ZEYTİNBURNU' },
                    { tabela: 'PASTA SANATI FATİH', bolge: 'FATİH' },
                    { tabela: 'Diver Fevzipaşa', bolge: 'ZEYTİNBURNU' },
                    { tabela: 'Diver Akdeniz Caddesi', bolge: 'ZEYTİNBURNU' }
                ];
            }

            let cOpts = '';
            activeCouriers.forEach(c => {
                const name = typeof c === 'string' ? c : (c.adi || c.kurye || c.name || '');
                const bolge = typeof c === 'object' && c.bolge ? c.bolge : 'ZEYTİNBURNU';
                if (name) cOpts += `<option value="${name}" data-bolge="${bolge}">${name} (${bolge})</option>`;
            });

            let sOpts = '';
            activeShops.forEach(s => {
                const t = typeof s === 'string' ? s : (s.tabela || s.isyeri || s.name || '');
                if (t) sOpts += `<option value="${t}">${t}</option>`;
            });

            const now = new Date();
            const pad = (n) => n.toString().padStart(2, '0');
            const defaultDateStr = `${pad(now.getDate())}.${pad(now.getMonth()+1)}.${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

            const ex = document.getElementById('add-kurye-paket-modal');
            if (ex) ex.remove();

            const modal = document.createElement('div');
            modal.id = 'add-kurye-paket-modal';
            modal.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:999999;padding:20px;';
            modal.innerHTML = `
                <div style="background:white;width:100%;max-width:540px;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.3);padding:24px;font-family:'Inter',sans-serif;max-height:90vh;overflow-y:auto;">
                    <div class="d-flex justify-content-between align-items-center mb-3" style="border-bottom:1px solid #e2e8f0;padding-bottom:12px;">
                        <h3 style="font-size:18px;font-weight:700;color:#1e293b;margin:0;"><i class="fa-solid fa-box" style="color:#0284c7;margin-right:8px;"></i>Yeni Paket Girişi</h3>
                        <button type="button" style="background:none;border:none;font-size:20px;color:#94a3b8;cursor:pointer;" onclick="document.getElementById('add-kurye-paket-modal')?.remove()">✕</button>
                    </div>

                    <form id="add-paket-form" onsubmit="event.preventDefault(); window.saveNewKuryePaket();">
                        <div style="display:flex;flex-direction:column;gap:14px;">
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                                <div>
                                    <label style="font-size:12px;font-weight:700;color:#475569;display:block;margin-bottom:4px;">Tarih / Saat:</label>
                                    <input type="text" id="new-pkt-tarih" class="form-control" value="${defaultDateStr}" required style="height:38px;font-size:13px;">
                                </div>
                                <div>
                                    <label style="font-size:12px;font-weight:700;color:#475569;display:block;margin-bottom:4px;">Bölge:</label>
                                    <select id="new-pkt-bolge" class="form-control" style="height:38px;font-size:13px;">
                                        <option value="ZEYTİNBURNU">ZEYTİNBURNU</option>
                                        <option value="BAHÇELİEVLER">BAHÇELİEVLER</option>
                                        <option value="FATİH">FATİH</option>
                                        <option value="KADIKÖY">KADIKÖY</option>
                                        <option value="BEŞİKTAŞ">BEŞİKTAŞ</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style="font-size:12px;font-weight:700;color:#475569;display:block;margin-bottom:4px;">Kurye Seçiniz:</label>
                                <select id="new-pkt-kurye" class="form-control" required style="height:38px;font-size:13px;" onchange="
                                    const opt = this.options[this.selectedIndex];
                                    const bg = opt ? opt.getAttribute('data-bolge') : '';
                                    if (bg) document.getElementById('new-pkt-bolge').value = bg;
                                ">
                                    ${cOpts}
                                </select>
                            </div>

                            <div>
                                <label style="font-size:12px;font-weight:700;color:#475569;display:block;margin-bottom:4px;">Üye İşyeri (Restoran):</label>
                                <select id="new-pkt-isyeri" class="form-control" required style="height:38px;font-size:13px;">
                                    ${sOpts}
                                </select>
                            </div>

                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                                <div>
                                    <label style="font-size:12px;font-weight:700;color:#475569;display:block;margin-bottom:4px;">Paket Sayısı:</label>
                                    <input type="number" id="new-pkt-sayisi" class="form-control" value="1" min="1" required style="height:38px;font-size:13px;">
                                </div>
                                <div>
                                    <label style="font-size:12px;font-weight:700;color:#475569;display:block;margin-bottom:4px;">Paket Birim Ücreti (₺):</label>
                                    <input type="number" step="0.01" id="new-pkt-hakedis" class="form-control" value="25.00" required style="height:38px;font-size:13px;">
                                </div>
                            </div>

                            <div>
                                <label style="font-size:12px;font-weight:700;color:#475569;display:block;margin-bottom:4px;">Durum:</label>
                                <select id="new-pkt-durum" class="form-control" style="height:38px;font-size:13px;">
                                    <option value="TESLİM EDİLDİ">TESLİM EDİLDİ</option>
                                    <option value="DAĞITIMDA">DAĞITIMDA</option>
                                    <option value="İPTAL EDİLDİ">İPTAL EDİLDİ</option>
                                </select>
                            </div>
                        </div>

                        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px;border-top:1px solid #e2e8f0;padding-top:15px;">
                            <button type="button" class="btn btn-secondary" style="padding:8px 20px;font-weight:600;border:none;background:#e2e8f0;color:#334155;cursor:pointer;" onclick="document.getElementById('add-kurye-paket-modal')?.remove()">Vazgeç</button>
                            <button type="submit" class="btn btn-primary" style="padding:8px 28px;font-weight:700;cursor:pointer;font-size:14px;"><i class="fa-solid fa-plus" style="margin-right:6px;"></i>Ekle</button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);
        } catch(err) {
            console.error("Modal açma hatası:", err);
            alert("Hata: " + err.message);
        }
    };

    window.saveNewKuryePaket = function() {
        try {
            const kuryeSelect = document.getElementById('new-pkt-kurye');
            const kurye = kuryeSelect ? kuryeSelect.value : '';
            const bolge = document.getElementById('new-pkt-bolge') ? document.getElementById('new-pkt-bolge').value : 'ZEYTİNBURNU';
            const isyeri = document.getElementById('new-pkt-isyeri') ? document.getElementById('new-pkt-isyeri').value : '';
            const paketSayisi = parseInt(document.getElementById('new-pkt-sayisi').value) || 1;
            const hakedis = parseFloat(document.getElementById('new-pkt-hakedis').value) || 25;
            const durum = document.getElementById('new-pkt-durum') ? document.getElementById('new-pkt-durum').value : 'TESLİM EDİLDİ';

            const now = new Date();
            const pad = (n) => n.toString().padStart(2, '0');
            const defaultDateStr = `${pad(now.getDate())}.${pad(now.getMonth()+1)}.${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
            const dateStr = document.getElementById('new-pkt-tarih') ? (document.getElementById('new-pkt-tarih').value || defaultDateStr) : defaultDateStr;
            const newId = 'PKT-' + Math.floor(1000 + Math.random() * 9000);

            const newEntry = {
                id: newId,
                tarih: dateStr,
                kurye: kurye,
                bolge: bolge,
                isyeri: isyeri,
                paketSayisi: paketSayisi,
                tutar: '',
                hakedis: hakedis.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺',
                durum: durum
            };

            let list = JSON.parse(localStorage.getItem('kuryeDeliveryList') || '[]');
            list.unshift(newEntry);
            localStorage.setItem('kuryeDeliveryList', JSON.stringify(list));

            document.getElementById('add-kurye-paket-modal')?.remove();
            window.renderKuryePaketRows();

            // Toast bildirimi
            const toast = document.createElement('div');
            toast.style.cssText = 'position:fixed;bottom:30px;right:30px;background:#16a34a;color:white;padding:14px 22px;border-radius:10px;font-weight:700;font-size:14px;z-index:9999999;box-shadow:0 8px 30px rgba(0,0,0,0.2);display:flex;align-items:center;gap:10px;';
            toast.innerHTML = '<i class="fa-solid fa-check-circle"></i> Paket başarıyla eklendi!';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        } catch (err) {
            console.error("Paket kaydetme hatası:", err);
            alert("Paket kaydedilirken hata oluştu: " + err.message);
        }
    };

    window.saveInlinePaket = function() {
        try {
            const kurye = document.getElementById('ipkt-kurye')?.value || '';
            if (!kurye) { alert('Lütfen kurye seçiniz.'); return; }
            const bolge = document.getElementById('ipkt-bolge')?.value || 'ZEYTİNBURNU';
            const isyeri = document.getElementById('ipkt-isyeri')?.value || '';
            if (!isyeri) { alert('Lütfen işyeri seçiniz.'); return; }
            const paketSayisi = parseInt(document.getElementById('ipkt-sayisi')?.value) || 1;
            const hakedis = parseFloat(document.getElementById('ipkt-hakedis')?.value) || 25;
            const durum = document.getElementById('ipkt-durum')?.value || 'TESLİM EDİLDİ';

            // PAKET NO: kullanıcı girdiyse kullan, yoksa otomatik üret
            const customId = (document.getElementById('ipkt-no')?.value || '').trim();
            const newId = customId || ('PKT-' + Math.floor(1000 + Math.random() * 9000));

            const fMonth = document.getElementById('paket-month-select') ? parseInt(document.getElementById('paket-month-select').value) : new Date().getMonth();
            const fYear = document.getElementById('paket-year-select') ? parseInt(document.getElementById('paket-year-select').value) : new Date().getFullYear();
            const dayNum = String(new Date().getDate()).padStart(2, '0');
            const monthNumStr = String(fMonth + 1).padStart(2, '0');
            const dateStr = `${dayNum}.${monthNumStr}.${fYear}`;

            const newEntry = {
                id: newId,
                tarih: dateStr,
                kurye: kurye,
                bolge: bolge,
                isyeri: isyeri,
                paketSayisi: paketSayisi,
                tutar: '',
                hakedis: hakedis.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺',
                durum: durum
            };

            let list = JSON.parse(localStorage.getItem('kuryeDeliveryList') || '[]');
            list.unshift(newEntry);
            localStorage.setItem('kuryeDeliveryList', JSON.stringify(list));
            if (window.saveToServer) window.saveToServer();

            // Formu sıfırla
            const form = document.getElementById('inline-paket-form');
            if (form) form.reset();
            document.getElementById('ipkt-hakedis').value = '25.00';
            document.getElementById('ipkt-sayisi').value = '1';

            window.renderKuryePaketRows();

            // Toast bildirimi
            const toast = document.createElement('div');
            toast.style.cssText = 'position:fixed;bottom:30px;right:30px;background:#16a34a;color:white;padding:14px 22px;border-radius:10px;font-weight:700;font-size:14px;z-index:9999999;box-shadow:0 8px 30px rgba(0,0,0,0.2);display:flex;align-items:center;gap:10px;';
            toast.innerHTML = '<i class="fa-solid fa-check-circle"></i> Paket başarıyla eklendi!';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        } catch (err) {
            console.error("Inline paket kaydetme hatası:", err);
            alert("Hata: " + err.message);
        }
    };

    window.renderKuryePaketRows = function() {
        const tbody = document.getElementById('kurye-paket-tbody');
        if (!tbody) return;

        let list = JSON.parse(localStorage.getItem('kuryeDeliveryList') || '[]');
        
        // Filters
        const fBolge = document.getElementById('kurye-filter-bolge')?.value || 'HEPSİ';
        const fKurye = document.getElementById('kurye-filter-kurye')?.value || 'HEPSİ';
        const fIsyeri = document.getElementById('kurye-filter-isyeri')?.value || 'HEPSİ';
        const fDurum = document.getElementById('kurye-filter-durum')?.value || 'HEPSİ';
        const search = (document.getElementById('kurye-paket-search')?.value || '').toLowerCase().trim();

        const fMonth = document.getElementById('paket-month-select') ? parseInt(document.getElementById('paket-month-select').value) : null;
        const fYear = document.getElementById('paket-year-select') ? parseInt(document.getElementById('paket-year-select').value) : null;

        let filtered = list.filter(item => {
            if (fMonth !== null && fYear !== null && item.tarih) {
                let parts = item.tarih.split(/[-./\s]/);
                if (parts.length >= 3) {
                    let dYear = parts[0].length === 4 ? parseInt(parts[0]) : parseInt(parts[2]);
                    let dMonth = parseInt(parts[1]) - 1;
                    if (dMonth !== fMonth || dYear !== fYear) return false;
                }
            }
            if (fBolge !== 'HEPSİ' && item.bolge !== fBolge) return false;
            if (fKurye !== 'HEPSİ' && item.kurye !== fKurye) return false;
            if (fIsyeri !== 'HEPSİ' && item.isyeri !== fIsyeri) return false;
            if (fDurum !== 'HEPSİ' && item.durum !== fDurum) return false;
            if (search) {
                const combined = `${item.id} ${item.kurye} ${item.isyeri} ${item.bolge} ${item.durum}`.toLowerCase();
                if (!combined.includes(search)) return false;
            }
            return true;
        });

        // Update stats if elements exist
        let countTeslim = 0;
        let countDagitim = 0;
        filtered.forEach(x => {
            const count = parseInt(x.paketSayisi) || 1;
            if (x.durum === 'TESLİM EDİLDİ') countTeslim += count;
            if (x.durum === 'DAĞITIMDA') countDagitim += count;
        });

        const countKuryeler = [...new Set(filtered.map(x => x.kurye).filter(Boolean))].length;
        let totalHakedis = 0;
        filtered.forEach(x => {
            const count = parseInt(x.paketSayisi) || 1;
            const h = parseFloat((x.hakedis || '').toString().replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            totalHakedis += count * h;
        });

        const elTeslim = document.getElementById('kurye-stat-teslim');
        const elDagitim = document.getElementById('kurye-stat-dagitim');
        const elKuryeler = document.getElementById('kurye-stat-kuryeler');
        const elHakedis = document.getElementById('kurye-stat-hakedis');
        if (elTeslim) elTeslim.innerText = countTeslim;
        if (elDagitim) elDagitim.innerText = countDagitim;
        if (elKuryeler) elKuryeler.innerText = countKuryeler;
        if (elHakedis) elHakedis.innerText = '₺' + totalHakedis.toLocaleString('tr-TR', { minimumFractionDigits: 2 });

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px 20px; color: #94a3b8; font-weight: 500;">
                        <i class="fa-solid fa-box-open" style="font-size: 32px; display: block; margin-bottom: 10px; color: #cbd5e1;"></i>
                        Bu dönem için paket kaydı bulunmuyor.
                    </td>
                </tr>
            `;
            const elInfo = document.getElementById('kurye-paket-info');
            if (elInfo) elInfo.innerText = 'Toplam 0 kayıt';
            return;
        }

        let html = '';
        filtered.forEach((p) => {
            let statusBadge = '';
            if (p.durum === 'TESLİM EDİLDİ') {
                statusBadge = `<span style="background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 12px; font-weight: 700; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-check"></i> TESLİM EDİLDİ</span>`;
            } else if (p.durum === 'DAĞITIMDA') {
                statusBadge = `<span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 12px; font-weight: 700; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-spinner fa-spin"></i> DAĞITIMDA</span>`;
            } else {
                statusBadge = `<span style="background: #fee2e2; color: #b91c1c; padding: 4px 10px; border-radius: 12px; font-weight: 700; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-xmark"></i> İPTAL EDİLDİ</span>`;
            }

            html += `
                <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">
                    <td style="padding: 10px 8px; font-weight: 700; color: #0284c7;">${p.id}</td>
                    <td style="padding: 10px 8px; font-weight: 600; color: #1e293b;">
                        <i class="fa-solid fa-user-tag" style="color: #94a3b8; margin-right: 4px;"></i> ${p.kurye}
                    </td>
                    <td style="padding: 10px 8px;"><span style="background: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">${p.bolge}</span></td>
                    <td style="padding: 10px 8px; font-weight: 600; color: #334155;">${p.isyeri}</td>
                    <td style="padding: 10px 8px; text-align: center; font-weight: 700; color: #0284c7;">${p.paketSayisi || 1}</td>
                    <td style="padding: 10px 8px; text-align: right; font-weight: 700; color: #16a34a;">${p.hakedis}</td>
                    <td style="padding: 10px 8px; text-align: center;">${statusBadge}</td>
                    <td style="padding: 10px 8px; text-align: center; white-space: nowrap;">
                        <button class="btn btn-sm" style="background: #e0f2fe; color: #0284c7; border: none; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 11px; margin-right: 4px;" onclick="window.showKuryePaketDetailModal('${p.id}')" title="Detay">
                            <i class="fa-solid fa-eye"></i> Detay
                        </button>
                        <button class="btn btn-sm" style="background: #f1f5f9; color: #475569; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px;" onclick="window.togglePaketStatus('${p.id}')" title="Durumu Değiştir">
                            <i class="fa-solid fa-arrows-rotate"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
        const elInfo = document.getElementById('kurye-paket-info');
        if (elInfo) elInfo.innerText = `Toplam ${filtered.length} kayıt gösteriliyor`;
    };

    window.stepPaketMonth = function(delta) {
        let m = parseInt(document.getElementById('paket-month-select')?.value ?? new Date().getMonth()) + delta;
        let y = parseInt(document.getElementById('paket-year-select')?.value ?? new Date().getFullYear());
        if (m < 0) { m = 11; y--; }
        else if (m > 11) { m = 0; y++; }
        if (y < 2020) y = 2020;
        if (y > 2026) y = 2026;
        window.renderKuryePaketTakip(m, y);
    };

    function renderKuryePaketTakip(selectedMonthIdx = null, selectedYear = null) {
        if (!localStorage.getItem('kuryeDeliveryList')) {
            localStorage.setItem('kuryeDeliveryList', JSON.stringify([]));
        }

        const now = new Date();
        const monthNames = ['OCAK','ŞUBAT','MART','NİSAN','MAYIS','HAZİRAN','TEMMUZ','AĞUSTOS','EYLÜL','EKİM','KASIM','ARALIK'];
        
        if (selectedMonthIdx === null || selectedMonthIdx === undefined) {
            selectedMonthIdx = now.getMonth();
        }
        if (selectedYear === null || selectedYear === undefined) {
            selectedYear = now.getFullYear();
        }
        selectedMonthIdx = parseInt(selectedMonthIdx);
        selectedYear = parseInt(selectedYear);

        const activeCouriers = getActiveCouriersList();
        const activeShops = getActiveShopsList();

        // Courier dropdown options
        let courierOptions = '<option value="HEPSİ">Tüm Kuryeler</option>';
        activeCouriers.forEach(c => {
            const name = c.adi || c.kurye || c.name || '';
            if (name) courierOptions += `<option value="${name}">${name} (${c.bolge || 'Bölge Belirtilmemiş'})</option>`;
        });

        // Shop dropdown options
        let shopOptions = '<option value="HEPSİ">Tüm İşyerleri</option>';
        activeShops.forEach(s => {
            const t = s.tabela || s.isyeri || '';
            if (t) shopOptions += `<option value="${t}">${t}</option>`;
        });

        // Form courier options (for inline entry form)
        let formCourierOpts = '<option value="">Kurye Seçiniz...</option>';
        activeCouriers.forEach(c => {
            const name = c.adi || c.kurye || c.name || '';
            const bolge = c.bolge || 'ZEYTİNBURNU';
            if (name) formCourierOpts += `<option value="${name}" data-bolge="${bolge}">${name} (${bolge})</option>`;
        });

        // Form shop options (for inline entry form)
        let formShopOpts = '<option value="">İşyeri Seçiniz...</option>';
        activeShops.forEach(s => {
            const t = s.tabela || s.isyeri || '';
            if (t) formShopOpts += `<option value="${t}">${t}</option>`;
        });

        pageContainer.innerHTML = `
            <!-- Top Header & Breadcrumb with Month & Year Navigator Pill -->
            <div class="d-flex justify-content-between align-items-center mb-4" style="flex-wrap: wrap; gap: 12px;">
                <div>
                    <div class="d-flex align-items-center" style="flex-wrap: wrap; gap: 6px; margin-bottom: 4px;">
                        <h2 style="font-size: 22px; font-weight: 700; color: var(--text-main); margin: 0; white-space: nowrap;">Kurye Paket Takip</h2>
                        <button class="btn btn-secondary" style="display: flex; align-items: center; gap: 6px; font-weight: 600; background: #e2e8f0; color: #334155; border: none; font-size: 12px; padding: 5px 12px; margin-left: 8px;" onclick="window.printTable(this)">
                            <i class="fa-solid fa-print"></i> Yazdır / PDF
                        </button>
                    </div>
                    <div style="font-size: 13px; color: var(--text-muted);">
                        <span>Anasayfa</span> / <span>Paket Takip</span> / <span style="color: var(--primary-color); font-weight: 600;">Kurye Paket Takip</span>
                    </div>
                </div>

                <!-- Aesthetic Month & Year Navigator Pill -->
                <div style="display: inline-flex; align-items: center; background: #f0fdfa; border: 1.5px solid #99f6e4; border-radius: 30px; padding: 4px 8px; box-shadow: 0 2px 10px rgba(13, 148, 136, 0.08); gap: 4px;">
                    <button type="button" class="btn btn-sm btn-light" onclick="window.stepPaketMonth(-1)" style="width: 28px; height: 28px; border-radius: 50%; padding: 0; display: flex; align-items: center; justify-content: center; background: white; border: 1px solid #ccfbf1; color: #0d9488; box-shadow: 0 1px 3px rgba(0,0,0,0.05);" title="Önceki Ay">
                        <i class="fa-solid fa-chevron-left" style="font-size: 10px;"></i>
                    </button>

                    <div class="d-flex align-items-center gap-2 px-2">
                        <i class="fa-regular fa-calendar-days" style="color: #0d9488; font-size: 14px;"></i>
                        <select id="paket-month-select" class="form-select form-select-sm" style="border: none; background: transparent; color: #0f766e; font-weight: 800; font-size: 13px; cursor: pointer; padding: 2px 24px 2px 4px; box-shadow: none; outline: none;" onchange="window.renderKuryePaketTakip(this.value, document.getElementById('paket-year-select').value)">
                            ${monthNames.map((m, idx) => `<option value="${idx}" ${idx === selectedMonthIdx ? 'selected' : ''}>${m}</option>`).join('')}
                        </select>
                        <span style="color: #99f6e4; font-weight: bold;">|</span>
                        <select id="paket-year-select" class="form-select form-select-sm" style="border: none; background: transparent; color: #0f766e; font-weight: 800; font-size: 13px; cursor: pointer; padding: 2px 24px 2px 4px; box-shadow: none; outline: none;" onchange="window.renderKuryePaketTakip(document.getElementById('paket-month-select').value, this.value)">
                            ${[2026, 2025, 2024, 2023, 2022, 2021, 2020].map(yr => `<option value="${yr}" ${yr === selectedYear ? 'selected' : ''}>${yr}</option>`).join('')}
                        </select>
                    </div>

                    <button type="button" class="btn btn-sm btn-light" onclick="window.stepPaketMonth(1)" style="width: 28px; height: 28px; border-radius: 50%; padding: 0; display: flex; align-items: center; justify-content: center; background: white; border: 1px solid #ccfbf1; color: #0d9488; box-shadow: 0 1px 3px rgba(0,0,0,0.05);" title="Sonraki Ay">
                        <i class="fa-solid fa-chevron-right" style="font-size: 10px;"></i>
                    </button>
                </div>
            </div>

            <!-- Inline Entry Form Card -->
            <div class="card mb-4" style="border-top: 3px solid #0284c7; border-radius: 8px; padding: 18px 20px;">
                <form id="inline-paket-form" onsubmit="event.preventDefault(); window.saveInlinePaket();">
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; align-items: flex-end;">
                        <div>
                            <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;"># PAKET NO</label>
                            <input type="text" id="ipkt-no" class="form-control" placeholder="PKT-1001" style="height:36px;font-size:12px;">
                        </div>
                        <div>
                            <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">KURYE</label>
                            <select id="ipkt-kurye" class="form-control" required style="height:36px;font-size:12px;" onchange="const opt=this.options[this.selectedIndex];const bg=opt?opt.getAttribute('data-bolge'):'';if(bg)document.getElementById('ipkt-bolge').value=bg;">
                                ${formCourierOpts}
                            </select>
                        </div>
                        <div>
                            <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">BÖLGE</label>
                            <select id="ipkt-bolge" class="form-control" style="height:36px;font-size:12px;">
                                <option value="ZEYTİNBURNU">ZEYTİNBURNU</option>
                                <option value="BAHÇELİEVLER">BAHÇELİEVLER</option>
                                <option value="FATİH">FATİH</option>
                                <option value="KADIKÖY">KADIKÖY</option>
                                <option value="BEŞİKTAŞ">BEŞİKTAŞ</option>
                            </select>
                        </div>
                        <div>
                            <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">ÜYE İŞYERİ</label>
                            <select id="ipkt-isyeri" class="form-control" required style="height:36px;font-size:12px;">
                                ${formShopOpts}
                            </select>
                        </div>
                        <div>
                            <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">PAKET SAYISI</label>
                            <input type="number" id="ipkt-sayisi" class="form-control" value="1" min="1" required style="height:36px;font-size:12px;">
                        </div>
                        <div>
                            <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">PAKET BİRİM ÜCRETİ (₺)</label>
                            <input type="number" step="0.01" id="ipkt-hakedis" class="form-control" value="25.00" required style="height:36px;font-size:12px;">
                        </div>
                        <div>
                            <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">DURUM</label>
                            <select id="ipkt-durum" class="form-control" style="height:36px;font-size:12px;">
                                <option value="TESLİM EDİLDİ">TESLİM EDİLDİ</option>
                                <option value="DAĞITIMDA">DAĞITIMDA</option>
                                <option value="İPTAL EDİLDİ">İPTAL EDİLDİ</option>
                            </select>
                        </div>
                        <div style="display:flex;align-items:flex-end;">
                            <button type="submit" class="btn btn-primary" style="height:36px;width:100%;font-weight:700;font-size:13px;white-space:nowrap;">
                                <i class="fa-solid fa-plus"></i> Ekle
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Filter Card -->
            <div class="card mb-4" style="border-top: 3px solid #38bdf8; border-radius: 8px; padding: 20px;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 style="font-size: 15px; font-weight: 700; color: var(--text-main); margin: 0; display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-filter" style="color: var(--primary-color);"></i> Kurye Paket Filtreleme
                    </h4>
                    <button class="btn btn-sm" style="background: #f1f5f9; color: #475569; border: none; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 4px;" onclick="window.resetKuryePaketFilter()">
                        <i class="fa-solid fa-rotate-left"></i> Sıfırla
                    </button>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; align-items: flex-end;">
                    <div class="form-group mb-0">
                        <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 5px;">BÖLGE:</label>
                        <select id="kurye-filter-bolge" class="form-control" style="height: 38px; font-size: 13px;" onchange="window.filterKuryePaketTable()">
                            <option value="HEPSİ">HEPSİ (Tüm Bölgeler)</option>
                            <option value="BAHÇELİEVLER">BAHÇELİEVLER</option>
                            <option value="FATİH">FATİH</option>
                            <option value="ZEYTİNBURNU">ZEYTİNBURNU</option>
                            <option value="KADIKÖY">KADIKÖY</option>
                            <option value="BEŞİKTAŞ">BEŞİKTAŞ</option>
                        </select>
                    </div>

                    <div class="form-group mb-0">
                        <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 5px;">KURYE:</label>
                        <select id="kurye-filter-kurye" class="form-control" style="height: 38px; font-size: 13px;" onchange="window.filterKuryePaketTable()">
                            ${courierOptions}
                        </select>
                    </div>

                    <div class="form-group mb-0">
                        <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 5px;">İŞYERİ (RESTORAN):</label>
                        <select id="kurye-filter-isyeri" class="form-control" style="height: 38px; font-size: 13px;" onchange="window.filterKuryePaketTable()">
                            ${shopOptions}
                        </select>
                    </div>

                    <div class="form-group mb-0">
                        <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 5px;">DURUM:</label>
                        <select id="kurye-filter-durum" class="form-control" style="height: 38px; font-size: 13px;" onchange="window.filterKuryePaketTable()">
                            <option value="HEPSİ">Tüm Durumlar</option>
                            <option value="TESLİM EDİLDİ">TESLİM EDİLDİ</option>
                            <option value="DAĞITIMDA">DAĞITIMDA</option>
                            <option value="İPTAL EDİLDİ">İPTAL EDİLDİ</option>
                        </select>
                    </div>

                    <div>
                        <button type="button" class="btn btn-primary" style="height: 38px; width: 100%; font-weight: 700; font-size: 13px;" onclick="window.filterKuryePaketTable()">
                            <i class="fa-solid fa-magnifying-glass"></i> Filtrele
                        </button>
                    </div>
                </div>
            </div>

            <!-- Table Card -->
            <div class="card" style="border-top: 3px solid #38bdf8; border-radius: 8px; padding: 20px;">
                <div class="d-flex justify-content-between align-items-center mb-3" style="flex-wrap: wrap; gap: 10px;">
                    <div style="font-size: 13px; color: var(--text-muted);">
                        Sayfada 
                        <select id="kurye-paket-per-page" class="form-control" style="display: inline-block; width: 75px; padding: 4px 8px; height: 32px;" onchange="window.renderKuryePaketRows()">
                            <option value="15">15</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        Kayıt Göster
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 13px; color: var(--text-muted); font-weight: 600;">Hızlı Arama:</span>
                        <input type="text" id="kurye-paket-search" class="form-control" placeholder="Paket No, Kurye, Restoran..." style="width: 260px; height: 34px; font-size: 13px;" onkeyup="window.renderKuryePaketRows()">
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table" style="font-size: 12px; width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                                <th style="padding: 10px 8px; font-weight: 700; color: #334155;"># PAKET NO</th>
                                <th style="padding: 10px 8px; font-weight: 700; color: #334155;">KURYE</th>
                                <th style="padding: 10px 8px; font-weight: 700; color: #334155;">BÖLGE</th>
                                <th style="padding: 10px 8px; font-weight: 700; color: #334155;">ÜYE İŞYERİ</th>
                                <th style="padding: 10px 8px; font-weight: 700; color: #334155; text-align: center;">PAKET SAYISI</th>
                                <th style="padding: 10px 8px; font-weight: 700; color: #334155; text-align: right;">PAKET BİRİM ÜCRETİ</th>
                                <th style="padding: 10px 8px; font-weight: 700; color: #334155; text-align: center;">DURUM</th>
                                <th style="padding: 10px 8px; font-weight: 700; color: #334155; text-align: center;">İŞLEM</th>
                            </tr>
                        </thead>
                        <tbody id="kurye-paket-tbody">
                            <!-- Injected by window.renderKuryePaketRows() -->
                        </tbody>
                    </table>
                </div>

                <div class="d-flex justify-content-between align-items-center mt-3" style="font-size: 13px; color: #64748b; flex-wrap: wrap; gap: 10px;">
                    <div id="kurye-paket-info">Kayıtlar gösteriliyor...</div>
                    <div id="kurye-paket-pagination" style="display: flex; gap: 4px;"></div>
                </div>
            </div>
        `;

        window.renderKuryePaketRows();
    }

    // ==========================================
    // 2. Üye İşyeri Paket Takip
    // ==========================================

    function getInitialShopPacketData() {
        return [];
    }

    function renderIsyeriPaketTakip() {
        if (!localStorage.getItem('isyeriUserPacketList')) {
            localStorage.setItem('isyeriUserPacketList', JSON.stringify([]));
        }

        let activeShops = [];
        try {
            activeShops = JSON.parse(localStorage.getItem('activeShops')) || [];
        } catch(e) {}
        if (!activeShops || activeShops.length === 0) {
            activeShops = (window.AppData && window.AppData.activeShops && window.AppData.activeShops.active_shops) || [];
        }
        if (!activeShops || activeShops.length === 0) {
            activeShops = [
                { tabela: 'ERCAN BURGER YENİBOSNA', bolge: 'BAHÇELİEVLER' },
                { tabela: 'Pilav Evi', bolge: 'ZEYTİNBURNU' },
                { tabela: 'MERHABA PASTANESİ HALKALI', bolge: 'BAHÇELİEVLER' },
                { tabela: 'SARAY MUHALLEBİCİSİ FATİH', bolge: 'FATİH' },
                { tabela: 'HATAY MEDENİYETLER SOFRASI', bolge: 'ZEYTİNBURNU' },
                { tabela: 'PASTA SANATI FATİH', bolge: 'FATİH' },
                { tabela: 'Diver Fevzipaşa', bolge: 'ZEYTİNBURNU' },
                { tabela: 'Diver Akdeniz Caddesi', bolge: 'ZEYTİNBURNU' }
            ];
        }

        let sOpts = '<option value="">İşyeri Seçiniz...</option>';
        activeShops.forEach(s => {
            const t = typeof s === 'string' ? s : (s.tabela || s.isyeri || s.name || '');
            const bolge = typeof s === 'object' && s.bolge ? s.bolge : 'ZEYTİNBURNU';
            if (t) sOpts += `<option value="${t}" data-bolge="${bolge}">${t}</option>`;
        });

        pageContainer.innerHTML = `
            <!-- Top Header & Breadcrumb -->
            <div class="mb-4">
                <div class="d-flex align-items-center" style="flex-wrap: wrap; gap: 6px; margin-bottom: 4px;">
                    <h2 style="font-size: 22px; font-weight: 700; color: var(--text-main); margin: 0; white-space: nowrap;">Üye İşyeri Paket Takip</h2>
                    <button class="btn btn-secondary" style="display: flex; align-items: center; gap: 6px; font-weight: 600; background: #e2e8f0; color: #334155; border: none; font-size: 12px; padding: 5px 12px; margin-left: 8px;" onclick="window.printTable(this)">
                        <i class="fa-solid fa-print"></i> Yazdır / PDF
                    </button>
                </div>
                <div style="font-size: 13px; color: var(--text-muted);">
                    <span>Anasayfa</span> / <span>Paket Takip</span> / <span style="color: var(--primary-color); font-weight: 600;">Üye İşyeri Paket Takip</span>
                </div>
            </div>

            <!-- Inline Entry Form Card (Görseldeki Gibi Giriş Alanları) -->
            <div class="card mb-4" style="border-top: 3px solid #0284c7; border-radius: 8px; padding: 18px 20px;">
                <form id="inline-isyeri-paket-form" onsubmit="event.preventDefault(); window.saveInlineIsyeriPaket();">
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; align-items: flex-end;">
                        <div>
                            <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">BÖLGE</label>
                            <select id="iisy-bolge" class="form-control" style="height:36px;font-size:12px;">
                                <option value="ZEYTİNBURNU">ZEYTİNBURNU</option>
                                <option value="BAHÇELİEVLER">BAHÇELİEVLER</option>
                                <option value="FATİH">FATİH</option>
                                <option value="KADIKÖY">KADIKÖY</option>
                                <option value="BEŞİKTAŞ">BEŞİKTAŞ</option>
                            </select>
                        </div>

                        <div>
                            <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">ÜYE İŞ YERİ</label>
                            <select id="iisy-tabela" class="form-control" required style="height:36px;font-size:12px;" onchange="
                                const opt = this.options[this.selectedIndex];
                                const bg = opt ? opt.getAttribute('data-bolge') : '';
                                if (bg) document.getElementById('iisy-bolge').value = bg;
                            ">
                                ${sOpts}
                            </select>
                        </div>

                        <div>
                            <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">TAŞINAN PAKET</label>
                            <input type="number" id="iisy-paket" class="form-control" value="1" min="1" required style="height:36px;font-size:12px;">
                        </div>

                        <div>
                            <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">HİZMET TÜRÜ</label>
                            <select id="iisy-tur" class="form-control" style="height:36px;font-size:12px;">
                                <option value="TAM ZAMANLI">TAM ZAMANLI</option>
                                <option value="TAM ZAMANLI 26/10">TAM ZAMANLI 26/10</option>
                                <option value="TAM ZAMANLI 30/10">TAM ZAMANLI 30/10</option>
                                <option value="KONTÖR">KONTÖR</option>
                            </select>
                        </div>

                        <div style="display:flex;align-items:flex-end;">
                            <button type="submit" class="btn btn-primary" style="height:36px;width:100%;font-weight:700;font-size:13px;white-space:nowrap;background:#0284c7;border:none;border-radius:6px;display:flex;align-items:center;justify-content:center;gap:6px;">
                                <i class="fa-solid fa-plus"></i> Ekle
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Filter Card -->
            <div class="card mb-4" style="border-top: 3px solid #38bdf8; border-radius: 8px; padding: 20px;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 style="font-size: 15px; font-weight: 700; color: var(--text-main); margin: 0; display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-filter" style="color: var(--primary-color);"></i> Üye İşyeri Filtreleme
                    </h4>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; align-items: flex-end;">
                    <div class="form-group mb-0">
                        <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 5px;">BÖLGE:</label>
                        <select id="isyeri-filter-bolge" class="form-control" style="height: 38px; font-size: 13px;" onchange="window.renderIsyeriPaketRows()">
                            <option value="HEPSİ">HEPSİ (Tüm Bölgeler)</option>
                            <option value="BAHÇELİEVLER">BAHÇELİEVLER</option>
                            <option value="FATİH">FATİH</option>
                            <option value="ZEYTİNBURNU">ZEYTİNBURNU</option>
                            <option value="KADIKÖY">KADIKÖY</option>
                            <option value="BEŞİKTAŞ">BEŞİKTAŞ</option>
                        </select>
                    </div>

                    <div class="form-group mb-0">
                        <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 5px;">HİZMET TÜRÜ:</label>
                        <select id="isyeri-filter-tur" class="form-control" style="height: 38px; font-size: 13px;" onchange="window.renderIsyeriPaketRows()">
                            <option value="HEPSİ">HEPSİ (Tüm Hizmetler)</option>
                            <option value="TAM ZAMANLI">TAM ZAMANLI</option>
                            <option value="KONTÖR">KONTÖR</option>
                        </select>
                    </div>

                    <div class="form-group mb-0">
                        <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 5px;">DÖNEM (AY / YIL):</label>
                        <select id="isyeri-filter-donem" class="form-control" style="height: 38px; font-size: 13px;" onchange="window.renderIsyeriPaketRows()">
                            <option value="AĞUSTOS 2026" selected>AĞUSTOS 2026</option>
                            <option value="TEMMUZ 2026">TEMMUZ 2026</option>
                            <option value="HAZİRAN 2026">HAZİRAN 2026</option>
                        </select>
                    </div>

                    <div>
                        <button type="button" class="btn btn-primary" style="height: 38px; width: 100%; font-weight: 700; font-size: 13px;" onclick="window.renderIsyeriPaketRows()">
                            <i class="fa-solid fa-arrows-rotate"></i> Yenile
                        </button>
                    </div>
                </div>
            </div>

            <!-- Table Card -->
            <div class="card" style="border-top: 3px solid #38bdf8; border-radius: 8px; padding: 20px;">
                <div class="table-responsive">
                    <table class="table" style="font-size: 12px; width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                                <th style="padding: 10px 8px; font-weight: 700; color: #334155;">BOLGE</th>
                                <th style="padding: 10px 8px; font-weight: 700; color: #334155;">ÜYE İŞ YERİ</th>
                                <th style="padding: 10px 8px; font-weight: 700; color: #334155; text-align: center;">TAŞINAN PAKET</th>
                                <th style="padding: 10px 8px; font-weight: 700; color: #334155;">HİZMET TÜRÜ</th>
                                <th style="padding: 10px 8px; font-weight: 700; color: #334155; text-align: center;">İŞLEM</th>
                            </tr>
                        </thead>
                        <tbody id="isyeri-paket-tbody">
                            <!-- Injected by window.renderIsyeriPaketRows() -->
                        </tbody>
                    </table>
                </div>

                <div class="d-flex justify-content-between align-items-center mt-3" style="font-size: 13px; color: #64748b;">
                    <div id="isyeri-paket-info">Kayıtlar listeleniyor...</div>
                </div>
            </div>
        `;

        window.renderIsyeriPaketRows();
    }

    window.saveInlineIsyeriPaket = function() {
        try {
            const bolge = document.getElementById('iisy-bolge')?.value || 'ZEYTİNBURNU';
            const tabela = document.getElementById('iisy-tabela')?.value || '';
            if (!tabela) { alert('Lütfen üye işyeri seçiniz.'); return; }
            const tasinanPaket = parseInt(document.getElementById('iisy-paket')?.value) || 0;
            const hizmetTuru = document.getElementById('iisy-tur')?.value || 'TAM ZAMANLI';

            const newEntry = {
                id: 'ISY-' + Math.floor(1000 + Math.random() * 9000),
                bolge: bolge,
                tabela: tabela,
                tasinanPaket: tasinanPaket,
                hizmetTuru: hizmetTuru
            };

            let list = JSON.parse(localStorage.getItem('isyeriUserPacketList') || '[]');
            list.unshift(newEntry);
            localStorage.setItem('isyeriUserPacketList', JSON.stringify(list));

            const form = document.getElementById('inline-isyeri-paket-form');
            if (form) form.reset();
            if (document.getElementById('iisy-paket')) document.getElementById('iisy-paket').value = '1';

            window.renderIsyeriPaketRows();

            const toast = document.createElement('div');
            toast.style.cssText = 'position:fixed;bottom:30px;right:30px;background:#16a34a;color:white;padding:14px 22px;border-radius:10px;font-weight:700;font-size:14px;z-index:9999999;box-shadow:0 8px 30px rgba(0,0,0,0.2);display:flex;align-items:center;gap:10px;';
            toast.innerHTML = '<i class="fa-solid fa-check-circle"></i> Paket kaydı başarıyla eklendi!';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        } catch(e) {
            alert('Hata: ' + e.message);
        }
    };

    window.deleteIsyeriPaket = function(id) {
        if (!confirm('Bu paket kaydını silmek istediğinize emin misiniz?')) return;
        let list = JSON.parse(localStorage.getItem('isyeriUserPacketList') || '[]');
        list = list.filter(item => item.id !== id);
        localStorage.setItem('isyeriUserPacketList', JSON.stringify(list));
        window.renderIsyeriPaketRows();
    };

    window.renderIsyeriPaketRows = function() {
        const tbody = document.getElementById('isyeri-paket-tbody');
        if (!tbody) return;

        let list = JSON.parse(localStorage.getItem('isyeriUserPacketList') || '[]');
        const fBolge = document.getElementById('isyeri-filter-bolge')?.value || 'HEPSİ';
        const fTur = document.getElementById('isyeri-filter-tur')?.value || 'HEPSİ';

        let filtered = list.filter(item => {
            if (fBolge !== 'HEPSİ' && item.bolge !== fBolge) return false;
            if (fTur !== 'HEPSİ' && !item.hizmetTuru.includes(fTur)) return false;
            return true;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 30px; color: #94a3b8; font-weight: 500;">
                        <i class="fa-solid fa-utensils" style="font-size: 28px; display: block; margin-bottom: 8px;"></i>
                        Henüz kayıt bulunmuyor.
                    </td>
                </tr>
            `;
            const elInfo = document.getElementById('isyeri-paket-info');
            if (elInfo) elInfo.innerText = 'Toplam 0 kayıt gösteriliyor';
            return;
        }

        let html = '';
        filtered.forEach(s => {
            html += `
                <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">
                    <td style="padding: 10px 8px;"><span style="background: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">${s.bolge}</span></td>
                    <td style="padding: 10px 8px; font-weight: 700; color: #0284c7;">${s.tabela}</td>
                    <td style="padding: 10px 8px; text-align: center; font-weight: 800; color: #0284c7;">${s.tasinanPaket || 0}</td>
                    <td style="padding: 10px 8px; font-weight: 600; color: #334155;">${s.hizmetTuru}</td>
                    <td style="padding: 10px 8px; text-align: center;">
                        <button class="btn btn-sm" style="background: #fee2e2; color: #dc2626; border: none; padding: 4px 10px; border-radius: 4px; font-weight: 600; font-size: 11px; cursor: pointer;" onclick="window.deleteIsyeriPaket('${s.id}')" title="Sil">
                            <i class="fa-solid fa-trash"></i> Sil
                        </button>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
        const elInfo = document.getElementById('isyeri-paket-info');
        if (elInfo) elInfo.innerText = `Toplam ${filtered.length} kayıt gösteriliyor`;
    };

    window.showShopPackageHistoryModal = function(shopName, bolge) {
        let existing = document.getElementById('shop-pkg-history-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'shop-pkg-history-modal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px;';

        const sampleHistory = [
            { saat: '15:42', kurye: 'Mert Ali Erzincan', no: 'PKT-9401', tutar: '240,00 ₺', durum: 'TESLİM EDİLDİ', adres: 'Kazlıçeşme Mah. 24. Sok. No:12' },
            { saat: '15:20', kurye: 'Ezel Nadar', no: 'PKT-9404', tutar: '310,00 ₺', durum: 'TESLİM EDİLDİ', adres: 'Beştelsiz Mah. Rauf Denktaş Cad. No:19' },
            { saat: '14:10', kurye: 'Muhammet Tagi İlbeyli', no: 'PKT-9388', tutar: '185,00 ₺', durum: 'TESLİM EDİLDİ', adres: 'Gökalp Mah. 48. Sok. No:5' },
            { saat: '13:05', kurye: 'Mevlüt Demirtaş', no: 'PKT-9372', tutar: '420,00 ₺', durum: 'TESLİM EDİLDİ', adres: 'Telsiz Mah. 85/2 Sok. No:9' },
            { saat: '12:15', kurye: 'ADEM GÜNEŞ', no: 'PKT-9350', tutar: '190,00 ₺', durum: 'TESLİM EDİLDİ', adres: 'Sümer Mah. 28/4 Sok. No:17' }
        ];

        let historyRows = '';
        sampleHistory.forEach(h => {
            historyRows += `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px; font-weight: 700; color: #0284c7;">${h.no}</td>
                    <td style="padding: 8px; color: #475569;">${h.saat}</td>
                    <td style="padding: 8px; font-weight: 600; color: #1e293b;">${h.kurye}</td>
                    <td style="padding: 8px; color: #64748b;">${h.adres}</td>
                    <td style="padding: 8px; font-weight: 700; text-align: right; color: #0f172a;">${h.tutar}</td>
                    <td style="padding: 8px; text-align: center;"><span style="background: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 10px; font-weight: 700; font-size: 10px;">${h.durum}</span></td>
                </tr>
            `;
        });

        modal.innerHTML = `
            <div style="background: white; width: 100%; max-width: 780px; max-height: 90vh; overflow-y: auto; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.25); padding: 24px; font-family: 'Inter', sans-serif;">
                <div class="d-flex justify-content-between align-items-center mb-3" style="border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
                    <div>
                        <span style="font-size: 11px; font-weight: 700; color: #0284c7; text-transform: uppercase;">İşyeri Paket Geçmişi</span>
                        <h3 style="font-size: 18px; font-weight: 700; color: #1e293b; margin: 2px 0 0 0;">${shopName} (${bolge})</h3>
                    </div>
                    <button type="button" style="background: none; border: none; font-size: 20px; color: #94a3b8; cursor: pointer;" onclick="document.getElementById('shop-pkg-history-modal').remove()">✕</button>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 18px;">
                    <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <div style="font-size: 11px; font-weight: 700; color: #64748b;">BUGÜNKÜ PAKET</div>
                        <div style="font-size: 18px; font-weight: 800; color: #0284c7; margin-top: 2px;">22 Paket</div>
                    </div>
                    <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <div style="font-size: 11px; font-weight: 700; color: #64748b;">AYLIK PAKET TOPLAMI</div>
                        <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 2px;">660 Paket</div>
                    </div>
                    <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <div style="font-size: 11px; font-weight: 700; color: #64748b;">ORT. TESLİMAT SÜRESİ</div>
                        <div style="font-size: 18px; font-weight: 800; color: #16a34a; margin-top: 2px;">24 dk</div>
                    </div>
                </div>

                <h4 style="font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 10px;">Son Gönderilen Paketler</h4>
                <div class="table-responsive" style="border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 20px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                        <thead>
                            <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                                <th style="padding: 8px; font-weight: 700; color: #334155; text-align: left;">PAKET NO</th>
                                <th style="padding: 8px; font-weight: 700; color: #334155; text-align: left;">SAAT</th>
                                <th style="padding: 8px; font-weight: 700; color: #334155; text-align: left;">KURYE</th>
                                <th style="padding: 8px; font-weight: 700; color: #334155; text-align: left;">ADRES</th>
                                <th style="padding: 8px; font-weight: 700; color: #334155; text-align: right;">TUTAR</th>
                                <th style="padding: 8px; font-weight: 700; color: #334155; text-align: center;">DURUM</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${historyRows}
                        </tbody>
                    </table>
                </div>

                <div style="text-align: right;">
                    <button type="button" class="btn btn-primary" style="padding: 8px 24px; font-weight: 700;" onclick="document.getElementById('shop-pkg-history-modal').remove()">Kapat</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    };

    // Close dropdowns when clicking outside
    window.onclick = function(event) {
        if (!event.target.matches('.dropdown button') && !event.target.closest('.dropdown button') &&
            !event.target.matches('.btn-info') && !event.target.closest('.btn-info') && 
            !event.target.matches('.notification-btn') && !event.target.closest('.notification-btn')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            for (var i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
});
