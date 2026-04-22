/* ══ ADMIN HESAPLARI ══ */
const ADMINS=[
  {uid:'admin01',pass:'libra2024',ad:'Ahmet Yılmaz',rol:'Baş Kütüphaneci',bg:'linear-gradient(135deg,#16a34a,#059669)'},
  {uid:'ktp01',  pass:'kitap123', ad:'Ayşe Kara',   rol:'Kütüphaneci',    bg:'linear-gradient(135deg,#2563eb,#1d4ed8)'},
  {uid:'asistan',pass:'asistan1', ad:'Mehmet Demir',rol:'Asistan',         bg:'linear-gradient(135deg,#7c3aed,#6d28d9)'},
];
let currentAdmin=null;

/* ══ DATA ══ */
let kitaplar=[],uyeler=[],islemler=[],loglar=[],yazarlar=[],turler=[],yayinevleri=[],notifs=[];
let ctab='all',selUid=null,nkid=100,nuid=10,niid=20,cidx=-1,cmdItems=[];

const MK = [];

const MYZ=[];
const MT=[];
const MYN=[];
const MU=[];
const MI=[];
const ML=[];



const API_URL = 'http://localhost:5135/api/GenelBakis/istatistikler';

fetch funciton() {
    method: 'GET',
        body: JSON
}


/* ══ HELPERS ══ */
const AC=[['#f0fdf4','#16a34a'],['#eff6ff','#2563eb'],['#f5f3ff','#7c3aed'],['#fffbeb','#d97706'],['#fdf2f8','#db2777'],['#fef2f2','#dc2626']];
const uAC=u=>AC[u.id%AC.length];
const uI=u=>((u.ad||'')[0]||'')+((u.sy||'')[0]||'');
const yzA=id=>{const y=yazarlar.find(x=>x.id===id);return y?y.ad+' '+y.sy:'—';};
const tA=id=>{const t=turler.find(x=>x.id===id);return t?t.ad:'—';};
const yA=id=>{const y=yayinevleri.find(x=>x.id===id);return y?y.ad:'—';};
const kA=id=>{const k=kitaplar.find(x=>x.id===id);return k?k.ad:'—';};
const uAS=id=>{const u=uyeler.find(x=>x.id===id);return u?u.ad+' '+u.sy:'—';};
const fD=d=>d?d.split('T')[0]:'—';
const nS=()=>new Date().toISOString().split('T')[0];
const nTs=()=>new Date().toLocaleString('tr-TR');
const dSince=d=>d?Math.floor((Date.now()-new Date(d))/86400000):0;

function sbadge(s){if(s<=5)return`<span class="badge b-r">Kritik: ${s}</span>`;if(s<=15)return`<span class="badge b-a">Düşük: ${s}</span>`;return`<span class="badge b-g">${s}</span>`;}
function dpill(d){if(d<=14)return`<span class="dpill" style="background:var(--accent-bg);color:var(--accent)">${d}g</span>`;if(d<=30)return`<span class="dpill" style="background:var(--amber-bg);color:var(--amber)">⚠ ${d}g</span>`;return`<span class="dpill" style="background:var(--red-bg);color:var(--red)">🔴 ${d}g</span>`;}
function genISBN(n,id){const p='978';let s=id*31337;for(let i=0;i<n.length;i++)s=(s*31+n.charCodeAt(i))&0xFFFFFF;const b=String(Math.abs(s)).padStart(9,'0').slice(0,9);const r=p+b;let sum=0;for(let i=0;i<12;i++)sum+=parseInt(r[i])*(i%2===0?1:3);return r+((10-(sum%10))%10);}
function prevISBN(){const n=document.getElementById('fk-ad').value.trim();const eid=document.getElementById('fk-id').value;if(eid)return;document.getElementById('fk-isbn').value=n?genISBN(n,nkid):'';}
function spark(vals,col){const mx=Math.max(...vals,1);return vals.map(v=>`<div class="spark-bar" style="height:${Math.max((v/mx)*100,10)}%;background:${col}25;border-top:2px solid ${col}80"></div>`).join('');}
function genBarkod(){document.getElementById('fu-barkod').value='LIB'+Date.now().toString().slice(-7);}

/* ══ LOGIN ══ */
function buildQuickLogin(){
  document.getElementById('lquick').innerHTML=ADMINS.map(a=>`
    <button class="lchip" onclick="quickLogin('${a.uid}','${a.pass}')">
      <div class="lav" style="background:${a.bg};color:#fff">${a.ad.split(' ').map(w=>w[0]).join('')}</div>
      <div>
        <div class="lname">${a.ad}</div>
        <div class="lrole">${a.rol} · <code style="font-size:10px;background:var(--page-bg);padding:1px 5px;border-radius:4px;color:var(--text-3)">${a.uid}</code></div>
      </div>
      <span style="margin-left:auto;color:var(--text-3)">→</span>
    </button>
  `).join('');
}

function quickLogin(uid,pass){document.getElementById('l-uid').value=uid;document.getElementById('l-pass').value=pass;doLogin();}

function toggleVis(){const i=document.getElementById('l-pass');const t=i.type==='text';i.type=t?'password':'text';document.getElementById('l-eye').textContent=t?'👁':'🙈';}

function doLogin(){
  const uid=document.getElementById('l-uid').value.trim();
  const pass=document.getElementById('l-pass').value;
  const err=document.getElementById('lerr');
  const admin=ADMINS.find(a=>a.uid===uid&&a.pass===pass);
  if(!admin){
    err.style.display='block';err.style.animation='none';
    setTimeout(()=>err.style.animation='shake .35s ease',10);
    document.getElementById('l-pass').value='';document.getElementById('l-pass').focus();return;
  }
  currentAdmin=admin;err.style.display='none';
  document.getElementById('sb-av').textContent=admin.ad.split(' ').map(w=>w[0]).join('');
  document.getElementById('sb-av').style.background=admin.bg;
  document.getElementById('sb-name').textContent=admin.ad;
  document.getElementById('sb-role').textContent=admin.rol;
  const ls=document.getElementById('login-screen');
  ls.style.transition='opacity .4s,transform .4s';ls.style.opacity='0';ls.style.transform='scale(1.04)';
  setTimeout(()=>ls.style.display='none',420);
  addLog(`Giriş: ${admin.ad} (${admin.uid})`,'Information');
  toast(`Hoş geldiniz, ${admin.ad.split(' ')[0]}! 👋`,'s');
}

function doLogout(){
  currentAdmin=null;
  ['l-uid','l-pass'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('l-pass').type='password';document.getElementById('l-eye').textContent='👁';
  document.getElementById('lerr').style.display='none';
  const ls=document.getElementById('login-screen');
  ls.style.display='flex';ls.style.opacity='0';ls.style.transform='scale(1.04)';
  setTimeout(()=>{ls.style.transition='opacity .3s,transform .3s';ls.style.opacity='1';ls.style.transform='scale(1)';},10);
  addLog('Çıkış yapıldı','Information');
}

/* ══ INIT ══ */
function init(){
  kitaplar=MK.map(x=>({...x}));uyeler=MU.map(x=>({...x}));islemler=MI.map(x=>({...x}));loglar=ML.map(x=>({...x}));
  yazarlar=MYZ;turler=MT;yayinevleri=MYN;
  nkid=Math.max(...kitaplar.map(x=>x.id),0)+1;nuid=Math.max(...uyeler.map(x=>x.id),0)+1;niid=Math.max(...islemler.map(x=>x.id),0)+1;
  buildQuickLogin();fillSels();buildCmd();renderAll();
}
function renderAll(){renderDash();renderKitaplar();renderUyeGrid();renderIslemler();renderGecikme();renderStok();renderIstatistik();renderLogs();updateBadges();buildNotifs();}

/* ══ NAV ══ */
const PM={dashboard:{t:'Genel Bakış',b:'Kitap Ekle',f:'openKitapModal()'},kitaplar:{t:'Kitaplık',b:'Kitap Ekle',f:'openKitapModal()'},uyeler:{t:'Üyeler',b:'Üye Kaydet',f:'openUyeModal()'},islemler:{t:'Ödünç İşlemleri',b:'Ödünç Ver',f:'openOduncModal(null,null)'},gecikme:{t:'Gecikme Takibi',b:null},stok:{t:'Stok Uyarıları',b:null},istatistik:{t:'İstatistikler',b:null},loglar:{t:'Sistem Logları',b:null}};
function go(name,el){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  if(el)el.classList.add('active');
  const m=PM[name]||{};document.getElementById('ttitle').textContent=m.t||name;
  const b=document.getElementById('tbbtn');
  if(m.b){b.style.display='';b.innerHTML=`<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>${m.b}`;b.setAttribute('onclick',m.f);}
  else b.style.display='none';
  closeNp();
}

/* ══ DASHBOARD ══ */
function renderDash(){
  const ts=kitaplar.reduce((s,k)=>s+k.stok,0);
  const ao=islemler.filter(i=>!i.iade).length;
  const gec=islemler.filter(i=>!i.iade&&dSince(i.alis)>14).length;
  ['k','u','o','g'].forEach((x,i)=>document.getElementById('sv-'+x).textContent=[kitaplar.length,uyeler.length,ao,gec][i]);
  document.getElementById('sp-k').innerHTML=spark([8,10,9,11,10,12,kitaplar.length],'#16a34a');
  document.getElementById('sp-u').innerHTML=spark([2,3,3,3,4,4,uyeler.length],'#2563eb');
  document.getElementById('sp-o').innerHTML=spark([3,5,4,6,5,7,ao],'#d97706');
  document.getElementById('sp-g').innerHTML=spark([0,1,0,2,1,2,gec],'#dc2626');
  const months=['Eki','Kas','Ara','Oca','Şub','Mar','Nis'];const vals=[4,7,5,9,6,8,ao];const mx=Math.max(...vals,1);
  document.getElementById('dash-chart').innerHTML=`<div class="chart-bars">${vals.map((v,i)=>`<div class="cb-col"><div class="cb-val">${v}</div><div class="cb-bar${i===vals.length-1?' active':''}" style="height:${Math.max((v/mx)*100,6)}%"></div><div class="cb-lbl">${months[i]}</div></div>`).join('')}</div>`;
  const td={};kitaplar.forEach(k=>{const t=tA(k.tid);td[t]=(td[t]||0)+1;});const tmx=Math.max(...Object.values(td),1);const tc=['#16a34a','#2563eb','#7c3aed','#d97706','#dc2626','#0ea5e9'];
  document.getElementById('dash-tur').innerHTML=Object.entries(td).sort((a,b)=>b[1]-a[1]).map(([t,c],i)=>`<div style="margin-bottom:11px"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:12.5px;color:var(--text-1)">${t}</span><span style="font-size:11.5px;color:var(--text-3)">${c}</span></div><div class="prog"><div class="prog-bar" style="width:${(c/tmx)*100}%;background:${tc[i%tc.length]}"></div></div></div>`).join('');
  document.getElementById('dash-books').innerHTML=[...kitaplar].slice(-6).reverse().map(k=>`<tr><td class="tp">${k.ad}</td><td>${sbadge(k.stok)}</td><td>${k.stok<=15?'<span class="badge b-a">Düşük</span>':'<span class="badge b-g">OK</span>'}</td></tr>`).join('');
  const aktif=islemler.filter(i=>!i.iade);
  document.getElementById('dash-odunc').innerHTML=aktif.length?aktif.slice(0,6).map(i=>{const d=dSince(i.alis);return`<tr><td class="tp" style="max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${kA(i.kid)}</td><td style="font-size:12.5px">${uAS(i.uid)}</td><td>${dpill(d)}</td><td><button class="act ret" onclick="iade(${i.id})" title="İade">↩</button></td></tr>`;}).join(''):'<tr><td colspan="4"><div class="empty" style="padding:1rem"><p>Aktif ödünç yok</p></div></td></tr>';
}

/* ══ KİTAPLAR ══ */
function renderKitaplar(list){
  let d=list||[...kitaplar];
  const t=document.getElementById('tf').value;if(t)d=d.filter(k=>k.tid==t);
  const s=document.getElementById('sf').value;
  if(s==='stok-asc')d.sort((a,b)=>a.stok-b.stok);else if(s==='stok-desc')d.sort((a,b)=>b.stok-a.stok);else if(s==='yeni')d.sort((a,b)=>b.id-a.id);else d.sort((a,b)=>a.ad.localeCompare(b.ad,'tr'));
  document.getElementById('kclbl').textContent=`${d.length} kitap`;document.getElementById('nb-k').textContent=kitaplar.length;
  document.getElementById('ktbody').innerHTML=d.length?d.map((k,i)=>`<tr><td style="color:var(--text-3);font-size:11.5px">${i+1}</td><td class="tp">${k.ad}</td><td style="font-family:monospace;font-size:11px;color:var(--text-3)">${k.isbn}</td><td>${sbadge(k.stok)}</td><td style="font-size:12px">${yA(k.yid)}</td><td><span class="badge b-p">${tA(k.tid)}</span></td><td style="font-size:12px">${yzA(k.yzid)}</td><td><button class="act lend" onclick="openOduncModal(${k.id},null)" title="Ödünç">📖</button><button class="act edit" onclick="editKitap(${k.id})" title="Düzenle">✎</button><button class="act del" onclick="delKitap(${k.id},'${k.ad.replace(/'/g,"\\'")}')">✕</button></td></tr>`).join(''):'<tr><td colspan="8"><div class="empty"><div class="ei">📭</div><p>Kitap bulunamadı</p></div></td></tr>';
}
function handleSearch(q){if(!q){renderKitaplar();return;}const l=q.toLowerCase();renderKitaplar(kitaplar.filter(k=>k.ad?.toLowerCase().includes(l)||k.isbn?.includes(l)||yzA(k.yzid).toLowerCase().includes(l)));}

/* ══ ÜYELER ══ */
function renderUyeGrid(list){
  document.getElementById('nb-u').textContent=uyeler.length;
  const d=list||uyeler;
  document.getElementById('ugrid').innerHTML=d.length?d.map(u=>{
    const[bg,cl]=uAC(u);const a=islemler.filter(i=>i.uid===u.id&&!i.iade).length;const tot=islemler.filter(i=>i.uid===u.id).length;
    let db='';
    if(u.blacklist)db='<span class="badge b-r" style="font-size:10px">⛔ Kara Liste</span>';
    else if(!u.aktif)db='<span class="badge b-a" style="font-size:10px">Pasif</span>';
    else if((u.ceza||0)>0)db=`<span class="badge b-a" style="font-size:10px">₺${u.ceza} Ceza</span>`;
    else if(a>0)db=`<span class="badge b-a" style="font-size:10px">${a} ödünçte</span>`;
    else db='<span class="badge b-g" style="font-size:10px">Aktif</span>';
    return`<div class="mcard${selUid===u.id?' selected':''}" onclick="openDetay(${u.id})">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="mavatar" style="background:${bg};color:${cl};border-color:${cl}">${uI(u)}</div>
        <div style="flex:1;overflow:hidden">
          <div style="font-family:'Lora',serif;font-weight:700;font-size:13.5px;color:var(--text-1)">${u.ad} ${u.sy}</div>
          <div style="font-size:11px;color:var(--text-3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u.ep||'E-posta yok'}</div>
        </div>
      </div>
      <div style="font-size:11px;color:var(--text-3);margin-bottom:6px">${u.barkod?'🔖 '+u.barkod:''}${u.tel?' · 📞 '+u.tel:''}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding-top:8px;border-top:1px solid var(--card-border)">
        <span style="font-size:11px;color:var(--text-3)">${tot} işlem · ${a}/${u.maxOdunc||5}</span>${db}
      </div>
    </div>`;
  }).join(''):'<div class="empty"><div class="ei">👥</div><p>Üye yok</p></div>';
}
function searchUye(q){if(!q){renderUyeGrid();return;}const l=q.toLowerCase();renderUyeGrid(uyeler.filter(u=>(u.ad+' '+u.sy).toLowerCase().includes(l)||u.ep?.toLowerCase().includes(l)||u.barkod?.includes(l)));}

function openDetay(uid){
  selUid=uid;const u=uyeler.find(x=>x.id===uid);if(!u)return;
  const[bg,cl]=uAC(u);const da=document.getElementById('d-avatar');
  da.textContent=uI(u);da.style.cssText=`width:56px;height:56px;font-size:20px;background:${bg};color:${cl};border-color:${cl}`;
  let sp='';
  if(u.blacklist)sp='<span class="badge b-r" style="font-size:10px">⛔ Kara Liste</span>';
  else if(!u.aktif)sp='<span class="badge b-a" style="font-size:10px">Pasif Üye</span>';
  else if((u.ceza||0)>0)sp='<span class="badge b-a" style="font-size:10px">₺ Ceza Var</span>';
  else sp='<span class="badge b-g" style="font-size:10px">✓ Aktif</span>';
  document.getElementById('d-spill').innerHTML=sp;
  document.getElementById('d-baslik').textContent=u.ad+' '+u.sy;
  document.getElementById('d-sub').textContent=`Üye #${u.id} · Barkod: ${u.barkod||'—'} · Kayıt: ${u.baslangic||'—'}`;
  document.getElementById('d-ad').textContent=u.ad+' '+u.sy;
  document.getElementById('d-tc').innerHTML=u.tc?`🪪 TC: ${u.tc.slice(0,3)}***${u.tc.slice(-4)}`:'';
  document.getElementById('d-ep').innerHTML=u.ep?`✉ ${u.ep}`:'';
  document.getElementById('d-tel').innerHTML=u.tel?`📞 ${u.tel}`:'';
  document.getElementById('d-adres').innerHTML=u.adres?`📍 ${u.adres}`:'';
  const a=islemler.filter(i=>i.uid===uid&&!i.iade).length;const ia=islemler.filter(i=>i.uid===uid&&i.iade).length;
  document.getElementById('d-stats').innerHTML=[['Aktif',a,a>0?'var(--amber)':'var(--accent)'],['İade',ia,'var(--blue)'],['Toplam',a+ia,'var(--text-1)']].map(([l,v,c])=>`<div style="text-align:center;padding:8px 10px;background:var(--page-bg);border-radius:10px;border:1px solid var(--card-border)"><div style="font-family:'Lora',serif;font-size:20px;font-weight:700;color:${c}">${v}</div><div style="font-size:10px;color:var(--text-3)">${l}</div></div>`).join('');
  const kap=(u.maxOdunc||5)-a;
  document.getElementById('d-info').innerHTML=`
    <div style="display:flex;justify-content:space-between;padding:7px 10px;background:var(--page-bg);border-radius:8px;font-size:12.5px"><span style="color:var(--text-3)">Ödünç Kapasitesi</span><span style="font-weight:600;color:${kap===0?'var(--red)':'var(--text-1)'}">${a}/${u.maxOdunc||5} (${kap} boş)</span></div>
    <div style="display:flex;justify-content:space-between;padding:7px 10px;background:var(--page-bg);border-radius:8px;font-size:12.5px"><span style="color:var(--text-3)">Üyelik Başlangıcı</span><span style="font-weight:600;color:var(--accent)">${u.baslangic||'—'}</span></div>
    <div style="display:flex;justify-content:space-between;padding:7px 10px;background:var(--page-bg);border-radius:8px;font-size:12.5px"><span style="color:var(--text-3)">Gecikme Cezası</span><span style="font-weight:600;color:${(u.ceza||0)>0?'var(--red)':'var(--accent)'}">${(u.ceza||0)>0?'₺'+u.ceza:'Yok'}</span></div>
    <div style="display:flex;justify-content:space-between;padding:7px 10px;background:var(--page-bg);border-radius:8px;font-size:12.5px"><span style="color:var(--text-3)">Kara Liste</span><span style="font-weight:600;color:${u.blacklist?'var(--red)':'var(--accent)'}">${u.blacklist?'⛔ Evet':'Hayır'}</span></div>
  `;
  const gec=islemler.filter(i=>i.uid===uid);const turD={};
  gec.forEach(i=>{const k=kitaplar.find(x=>x.id===i.kid);if(k){const t=tA(k.tid);turD[t]=(turD[t]||0)+1;}});
  const tmx=Math.max(...Object.values(turD),1);
  document.getElementById('d-turdagilim').innerHTML=Object.keys(turD).length?Object.entries(turD).sort((a,b)=>b[1]-a[1]).map(([t,c])=>`<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px"><span style="font-size:12px;color:var(--text-2);width:80px;flex-shrink:0">${t}</span><div class="prog" style="flex:1"><div class="prog-bar" style="width:${(c/tmx)*100}%;background:var(--accent)"></div></div><span style="font-size:11px;color:var(--text-3);flex-shrink:0">${c}</span></div>`).join(''):'<span style="font-size:12px;color:var(--text-3)">Henüz geçmiş yok</span>';
  document.getElementById('d-odunc').onclick=()=>{
    if(u.blacklist){toast('Kara listede! Ödünç verilemez.','e');return;}
    if(!u.aktif){toast('Pasif üye!','e');return;}
    if((u.ceza||0)>0){toast(`₺${u.ceza} birikmiş ceza var!`,'w');return;}
    if(a>=(u.maxOdunc||5)){toast('Maksimum limite ulaşıldı!','e');return;}
    openOduncModal(null,uid);
  };
  document.getElementById('d-duzenle').onclick=()=>editUye(uid);
  document.getElementById('d-sil').onclick=()=>delUye(uid,u.ad+' '+u.sy);
  const il=islemler.filter(i=>i.uid===uid).sort((a,b)=>b.id-a.id);
  document.getElementById('d-tbody').innerHTML=il.length?il.map(i=>{const d=dSince(i.alis);return`<tr><td class="tp">${kA(i.kid)}</td><td style="font-size:12px;color:var(--text-2)">${fD(i.alis)}</td><td style="font-size:12px;color:var(--text-2)">${i.iade?fD(i.iade):'—'}</td><td>${dpill(d)}</td><td>${i.iade?'<span class="badge b-g">İade</span>':'<span class="badge b-a">Ödünçte</span>'}</td><td>${!i.iade?`<button class="btn btn-xs" style="background:var(--accent-bg);color:var(--accent);border:1px solid var(--accent-b)" onclick="iade(${i.id})">↩ İade</button>`:''}</td></tr>`;}).join(''):'<tr><td colspan="6"><div class="empty" style="padding:1rem"><p>İşlem yok</p></div></td></tr>';
  const det=document.getElementById('udetay');det.style.display='';setTimeout(()=>det.scrollIntoView({behavior:'smooth',block:'start'}),50);renderUyeGrid();
}
function closeDetay(){document.getElementById('udetay').style.display='none';selUid=null;renderUyeGrid();}

/* ══ İŞLEMLER ══ */
function renderIslemler(){
  let d=[...islemler];if(ctab==='odunc')d=d.filter(i=>!i.iade);if(ctab==='iade')d=d.filter(i=>!!i.iade);
  const ao=islemler.filter(i=>!i.iade).length;const no=document.getElementById('nb-o');no.textContent=ao;no.style.display=ao>0?'':'none';
  document.getElementById('itbody').innerHTML=d.length?d.sort((a,b)=>b.id-a.id).map((i,idx)=>{const d2=dSince(i.alis);return`<tr><td style="color:var(--text-3);font-size:11.5px">${idx+1}</td><td class="tp">${kA(i.kid)}</td><td style="font-size:12.5px">${uAS(i.uid)}</td><td style="font-size:12px;color:var(--text-2)">${fD(i.alis)}</td><td style="font-size:12px;color:var(--text-2)">${i.iade?fD(i.iade):'—'}</td><td>${dpill(d2)}</td><td>${i.iade?'<span class="badge b-g">İade</span>':'<span class="badge b-a">Ödünçte</span>'}</td><td>${!i.iade?`<button class="act ret" onclick="iade(${i.id})" title="İade">↩</button>`:''}</td></tr>`;}).join(''):'<tr><td colspan="8"><div class="empty"><div class="ei">📋</div><p>İşlem yok</p></div></td></tr>';
}
function switchTab(t,el){ctab=t;document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));el.classList.add('active');const m={all:'Tüm İşlemler',odunc:'Ödünçte',iade:'İade Edildi'};document.getElementById('itabtitle').textContent=m[t];renderIslemler();}

/* ══ GECİKME ══ */
function renderGecikme(){
  const g=islemler.filter(i=>!i.iade&&dSince(i.alis)>14).sort((a,b)=>dSince(b.alis)-dSince(a.alis));
  const ng=document.getElementById('nb-g');ng.textContent=g.length;ng.style.display=g.length>0?'':'none';
  document.getElementById('gc-c').textContent=g.length+' kitap';
  document.getElementById('gtbody').innerHTML=g.length?g.map(i=>{const d=dSince(i.alis);return`<tr><td class="tp">${kA(i.kid)}</td><td style="font-size:12.5px">${uAS(i.uid)}</td><td style="font-size:12px;color:var(--text-2)">${fD(i.alis)}</td><td>${dpill(d)}</td><td>${d>30?'<span class="badge b-r">Kritik</span>':'<span class="badge b-a">Gecikmiş</span>'}</td><td><button class="act ret" onclick="iade(${i.id})" title="İade">↩</button></td></tr>`;}).join(''):'<tr><td colspan="6"><div class="empty"><div class="ei">✅</div><p>Geciken kitap yok</p></div></td></tr>';
}

/* ══ STOK ══ */
function renderStok(){
  const low=kitaplar.filter(k=>k.stok<=15).sort((a,b)=>a.stok-b.stok);const krit=kitaplar.filter(k=>k.stok<=5).length;const ts=kitaplar.reduce((s,k)=>s+k.stok,0);
  const ns=document.getElementById('nb-s');ns.textContent=low.length;ns.style.display=low.length>0?'':'none';
  document.getElementById('s-k').textContent=krit;document.getElementById('s-d').textContent=low.length;document.getElementById('s-t').textContent=ts;
  const mx=Math.max(...kitaplar.map(k=>k.stok),1);
  document.getElementById('stbody').innerHTML=low.length?low.map(k=>`<tr><td class="tp">${k.ad}</td><td>${sbadge(k.stok)}</td><td style="min-width:100px"><div class="prog"><div class="prog-bar" style="width:${(k.stok/mx)*100}%;background:${k.stok<=5?'var(--red)':k.stok<=10?'var(--amber)':'var(--accent)'}"></div></div></td><td>${k.stok<=5?'<span class="badge b-r">Kritik</span>':'<span class="badge b-a">Düşük</span>'}</td><td><button class="act edit" onclick="editKitap(${k.id})" style="width:auto;padding:0 10px">✎ Güncelle</button></td></tr>`).join(''):'<tr><td colspan="5"><div class="empty"><div class="ei">✅</div><p>Stoklar yeterli</p></div></td></tr>';
}

/* ══ İSTATİSTİK ══ */
function renderIstatistik(){
  const ts=kitaplar.reduce((s,k)=>s+k.stok,0);const ort=kitaplar.length?(ts/kitaplar.length).toFixed(1):0;const ia=islemler.filter(i=>i.iade).length;
  document.getElementById('is-k').textContent=kitaplar.length;document.getElementById('is-s').textContent=ts;document.getElementById('is-o').textContent=ort;document.getElementById('is-i').textContent=ia;
  const yd={};kitaplar.forEach(k=>{const y=yzA(k.yzid);yd[y]=(yd[y]||0)+1;});const ymx=Math.max(...Object.values(yd),1);
  document.getElementById('is-y').innerHTML=Object.entries(yd).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([y,c])=>`<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--card-border)"><span style="font-size:12.5px;color:var(--text-1);flex:1">${y}</span><div style="width:70px"><div class="prog"><div class="prog-bar" style="width:${(c/ymx)*100}%;background:var(--blue)"></div></div></div><span class="badge b-b">${c}</span></div>`).join('');
  const pd={};kitaplar.forEach(k=>{const p=yA(k.yid);pd[p]=(pd[p]||0)+1;});const pmx=Math.max(...Object.values(pd),1);
  document.getElementById('is-yn').innerHTML=Object.entries(pd).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([p,c])=>`<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--card-border)"><span style="font-size:12.5px;color:var(--text-1);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p}</span><div style="width:70px"><div class="prog"><div class="prog-bar" style="width:${(c/pmx)*100}%;background:var(--purple)"></div></div></div><span class="badge b-p">${c}</span></div>`).join('');
  const mx=Math.max(...kitaplar.map(k=>k.stok),1);
  document.getElementById('is-st').innerHTML=kitaplar.map(k=>`<div style="display:flex;align-items:center;gap:10px;margin-bottom:9px"><div style="width:140px;font-size:12px;color:var(--text-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-shrink:0">${k.ad}</div><div class="prog" style="flex:1"><div class="prog-bar" style="width:${(k.stok/mx)*100}%;background:${k.stok<=5?'var(--red)':k.stok<=15?'var(--amber)':'var(--accent)'}"></div></div><div style="width:26px;font-size:12px;color:var(--text-3);text-align:right;flex-shrink:0">${k.stok}</div></div>`).join('');
}

/* ══ LOGLAR ══ */
function renderLogs(){
  const lv=document.getElementById('lf').value;const d=lv?loglar.filter(l=>l.lvl===lv):loglar;
  const lb={Information:'b-b',Warning:'b-a',Error:'b-r'};
  document.getElementById('log-b').textContent=d.length+' kayıt';
  document.getElementById('ltbody').innerHTML=d.length?[...d].reverse().map((l,i)=>`<tr><td style="color:var(--text-3);font-size:11.5px">${l.id||i+1}</td><td><span class="badge ${lb[l.lvl]||'b-n'}">${l.lvl}</span></td><td style="font-size:13px;color:var(--text-2)">${l.msg}</td><td style="font-size:11.5px;color:var(--text-3);white-space:nowrap">${l.ts}</td></tr>`).join(''):'<tr><td colspan="4"><div class="empty"><p>Log yok</p></div></td></tr>';
}

/* ══ BADGES & NOTIFS ══ */
function updateBadges(){
  const low=kitaplar.filter(k=>k.stok<=15).length;const ns=document.getElementById('nb-s');ns.textContent=low;ns.style.display=low>0?'':'none';
  const gec=islemler.filter(i=>!i.iade&&dSince(i.alis)>14).length;const ng=document.getElementById('nb-g');ng.textContent=gec;ng.style.display=gec>0?'':'none';
  const ao=islemler.filter(i=>!i.iade).length;const no=document.getElementById('nb-o');no.textContent=ao;no.style.display=ao>0?'':'none';
}
function buildNotifs(){
  notifs=[];
  kitaplar.filter(k=>k.stok<=5).forEach(k=>notifs.push({type:'danger',icon:'⚠️',text:`Kritik stok: "${k.ad}" — ${k.stok} adet`,time:'Bugün',read:false}));
  islemler.filter(i=>!i.iade&&dSince(i.alis)>14).forEach(i=>notifs.push({type:'warn',icon:'⏰',text:`Gecikme: "${kA(i.kid)}" — ${uAS(i.uid)} (${dSince(i.alis)}g)`,time:'Bugün',read:false}));
  uyeler.filter(u=>(u.ceza||0)>0).forEach(u=>notifs.push({type:'warn',icon:'₺',text:`Birikmiş ceza: ${u.ad} ${u.sy} — ₺${u.ceza}`,time:'Bugün',read:false}));
  uyeler.filter(u=>u.blacklist).forEach(u=>notifs.push({type:'danger',icon:'⛔',text:`Kara listede: ${u.ad} ${u.sy}`,time:'Bugün',read:false}));
  if(!notifs.length)notifs.push({type:'ok',icon:'✅',text:'Her şey yolunda.',time:'Şimdi',read:true});
  renderNotifs();document.getElementById('ndot').style.display=notifs.some(n=>!n.read)?'':'none';
}
function renderNotifs(){document.getElementById('np-list').innerHTML=notifs.map(n=>`<div class="ni${n.read?'':' unread'}"><div class="ni-icon" style="background:${n.type==='danger'?'var(--red-bg)':n.type==='warn'?'var(--amber-bg)':'var(--accent-bg)'}">${n.icon}</div><div><div class="ni-text">${n.text}</div><div class="ni-time">${n.time}</div></div></div>`).join('');}
function toggleNp(){document.getElementById('np').classList.toggle('open');}
function closeNp(){document.getElementById('np').classList.remove('open');}
function markRead(){notifs.forEach(n=>n.read=true);renderNotifs();document.getElementById('ndot').style.display='none';}

/* ══ CMD PALETTE ══ */
function buildCmd(){
  cmdItems=[
    {g:'Sayfalar',ic:'🏠',l:'Genel Bakış',d:'',a:()=>go('dashboard',document.querySelector('.nav-item'))},
    {g:'Sayfalar',ic:'📚',l:'Kitaplık',d:'',a:()=>go('kitaplar',document.querySelectorAll('.nav-item')[1])},
    {g:'Sayfalar',ic:'👥',l:'Üyeler',d:'',a:()=>go('uyeler',document.querySelectorAll('.nav-item')[2])},
    {g:'Sayfalar',ic:'📖',l:'Ödünç İşlemleri',d:'',a:()=>go('islemler',document.querySelectorAll('.nav-item')[3])},
    {g:'Sayfalar',ic:'⏰',l:'Gecikme Takibi',d:'',a:()=>go('gecikme',document.querySelectorAll('.nav-item')[4])},
    {g:'Sayfalar',ic:'📊',l:'İstatistikler',d:'',a:()=>go('istatistik',document.querySelectorAll('.nav-item')[6])},
    {g:'Eylemler',ic:'➕',l:'Kitap Ekle',d:'',a:openKitapModal},
    {g:'Eylemler',ic:'👤',l:'Üye Kaydet',d:'',a:openUyeModal},
    {g:'Eylemler',ic:'📖',l:'Ödünç Ver',d:'',a:()=>openOduncModal(null,null)},
    {g:'Eylemler',ic:'🚪',l:'Çıkış Yap',d:'',a:doLogout},
    ...kitaplar.map(k=>({g:'Kitaplar',ic:'📗',l:k.ad,d:`Stok: ${k.stok}`,a:()=>go('kitaplar',document.querySelectorAll('.nav-item')[1])})),
  ];
}
function openCmd(){document.getElementById('cov').classList.add('open');setTimeout(()=>document.getElementById('cinp').focus(),50);filterCmd('');}
function filterCmd(q){cidx=-1;const l=q.toLowerCase();const f=q?cmdItems.filter(i=>i.l.toLowerCase().includes(l)||i.d?.toLowerCase().includes(l)):cmdItems.slice(0,12);const grps={};f.forEach(i=>{if(!grps[i.g])grps[i.g]=[];grps[i.g].push(i);});document.getElementById('cres').innerHTML=Object.entries(grps).map(([g,items])=>`<div class="cmd-grp">${g}</div>${items.map(item=>`<div class="cmd-item" onclick="runCmd(${cmdItems.indexOf(item)})"><div class="cmd-ico">${item.ic}</div><span class="cmd-lbl">${item.l}</span><span class="cmd-desc">${item.d||''}</span></div>`).join('')}`).join('');}
function runCmd(idx){cmdItems[idx]?.a();document.getElementById('cov').classList.remove('open');document.getElementById('cinp').value='';}
function cmdKey(e){const items=document.querySelectorAll('.cmd-item');if(e.key==='ArrowDown'){e.preventDefault();cidx=Math.min(cidx+1,items.length-1);}else if(e.key==='ArrowUp'){e.preventDefault();cidx=Math.max(cidx-1,-1);}else if(e.key==='Enter'){const s=document.querySelector('.cmd-item.sel');if(s)s.click();return;}else if(e.key==='Escape'){document.getElementById('cov').classList.remove('open');return;}items.forEach((el,i)=>el.classList.toggle('sel',i===cidx));if(items[cidx])items[cidx].scrollIntoView({block:'nearest'});}
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();openCmd();}if(e.key==='Escape')document.getElementById('cov').classList.remove('open');});

/* ══ SEARCHABLE DROPDOWN ══ */
const sddS={};
function initSdd(cfg){
  sddS[cfg.id]=cfg;
  const inp=document.getElementById(cfg.inpId);const drop=document.getElementById(cfg.dropId);
  inp.addEventListener('input',()=>renderDrop(cfg.id));
  inp.addEventListener('focus',()=>renderDrop(cfg.id));
  inp.addEventListener('keydown',e=>ddKey(e,cfg.id));
  document.addEventListener('mousedown',e=>{if(!inp.contains(e.target)&&!drop.contains(e.target))drop.classList.remove('open');});
}
function hl(text,q){if(!q)return text;const re=new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');return text.replace(re,'<mark class="hl">$1</mark>');}
function renderDrop(id){
  const cfg=sddS[id];const inp=document.getElementById(cfg.inpId);const drop=document.getElementById(cfg.dropId);
  const q=inp.value.trim().toLowerCase();
  const items=cfg.items().filter(it=>it.label.toLowerCase().includes(q)||(it.sub||'').toLowerCase().includes(q));
  drop.innerHTML=items.length?items.map(it=>`<div class="sdd-item" data-val="${it.value}" data-lbl="${it.label.replace(/"/g,'&quot;')}" onmousedown="pickDd('${id}',${it.value},'${it.label.replace(/'/g,"\\'")}')"><span>${hl(it.label,inp.value.trim())}</span>${it.sub?`<span class="sdd-sub">${it.sub}</span>`:''}</div>`).join(''):`<div class="sdd-empty">Sonuç bulunamadı</div>`;
  drop.classList.add('open');cfg._hi=-1;
}
function pickDd(id,value,label){const cfg=sddS[id];document.getElementById(cfg.inpId).value=label;document.getElementById(cfg.hidId).value=value;document.getElementById(cfg.dropId).classList.remove('open');if(cfg.onSel)cfg.onSel(value);}
function ddKey(e,id){
  const cfg=sddS[id];const drop=document.getElementById(cfg.dropId);if(!drop.classList.contains('open'))return;
  const items=drop.querySelectorAll('.sdd-item');if(!items.length)return;
  if(e.key==='ArrowDown'){e.preventDefault();cfg._hi=Math.min((cfg._hi||0)+1,items.length-1);}
  else if(e.key==='ArrowUp'){e.preventDefault();cfg._hi=Math.max((cfg._hi||0)-1,0);}
  else if(e.key==='Enter'){e.preventDefault();const hi=items[cfg._hi];if(hi)pickDd(id,+hi.dataset.val,hi.dataset.lbl);else drop.classList.remove('open');return;}
  else if(e.key==='Escape'){drop.classList.remove('open');return;}
  items.forEach((el,i)=>el.classList.toggle('hi',i===cfg._hi));
  if(items[cfg._hi])items[cfg._hi].scrollIntoView({block:'nearest'});
}
function setSdd(id,value,label){const cfg=sddS[id];document.getElementById(cfg.inpId).value=label||'';document.getElementById(cfg.hidId).value=value||'';}
function getSdd(hidId){return+document.getElementById(hidId).value||0;}

/* ══ SELECTS ══ */
function fillSels(){
  const tf=document.getElementById('tf');while(tf.options.length>1)tf.remove(1);turler.forEach(t=>tf.add(new Option(t.ad,t.id)));
  initSdd({id:'fky',inpId:'fk-y-inp',hidId:'fk-y',dropId:'sdd-fky',items:()=>yazarlar.map(y=>({value:y.id,label:y.ad+' '+y.sy}))});
  initSdd({id:'fkt',inpId:'fk-t-inp',hidId:'fk-t',dropId:'sdd-fkt',items:()=>turler.map(t=>({value:t.id,label:t.ad}))});
  initSdd({id:'fkyn',inpId:'fk-yn-inp',hidId:'fk-yn',dropId:'sdd-fkyn',items:()=>yayinevleri.map(y=>({value:y.id,label:y.ad}))});
  initSdd({id:'fou',inpId:'fo-u-inp',hidId:'fo-u',dropId:'sdd-fou',items:()=>uyeler.map(u=>{const a=islemler.filter(i=>i.uid===u.id&&!i.iade).length;return{value:u.id,label:u.ad+' '+u.sy,sub:a>0?`${a} ödünçte`:u.ep||''};} ),onSel:()=>onOU()});
  initSdd({id:'fok',inpId:'fo-k-inp',hidId:'fo-k',dropId:'sdd-fok',items:()=>kitaplar.filter(k=>k.stok>0).map(k=>({value:k.id,label:k.ad,sub:`Stok: ${k.stok}`})),onSel:()=>onOK()});
}
function fillOS(preK=null,preU=null){
  if(preU){const u=uyeler.find(x=>x.id===preU);setSdd('fou',preU,u?u.ad+' '+u.sy:'');}else setSdd('fou','','');
  if(preK){const k=kitaplar.find(x=>x.id===preK);setSdd('fok',preK,k?k.ad:'');}else setSdd('fok','','');
  onOK();onOU();
}
function onOK(){const id=getSdd('fo-k');const k=kitaplar.find(x=>x.id===id);document.getElementById('oi-k').innerHTML=k?`${sbadge(k.stok)} <span style="font-size:11.5px;color:var(--text-3);margin-left:8px">${yA(k.yid)} · ${tA(k.tid)}</span>`:'';}
function onOU(){const id=getSdd('fo-u');const u=uyeler.find(x=>x.id===id);if(!u){document.getElementById('oi-u').innerHTML='';return;}const a=islemler.filter(i=>i.uid===id&&!i.iade).length;document.getElementById('oi-u').innerHTML=`<span class="badge ${a>0?'b-a':'b-g'}">${a} aktif ödünç</span>${u.ep?` <span style="font-size:11.5px;color:var(--text-3);margin-left:8px">${u.ep}</span>`:''}`;}

/* ══ MODALS ══ */
const openModal=id=>{document.querySelectorAll('.sdd-drop').forEach(d=>d.classList.remove('open'));document.getElementById(id).classList.add('open');};
const closeModal=id=>document.getElementById(id).classList.remove('open');
document.querySelectorAll('.overlay').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('open');}));

/* ══ MODAL TABS ══ */
function switchMtab(tab,el){
  document.querySelectorAll('.mtab').forEach(t=>t.classList.remove('active'));el.classList.add('active');
  document.querySelectorAll('.mpanel').forEach(p=>p.classList.remove('active'));document.getElementById('mup-'+tab).classList.add('active');
  const h={kimlik:'Sonraki: İletişim →',iletisim:'Sonraki: Üyelik Statüsü →',uyelik:'Tüm bilgiler tamam'};
  document.getElementById('mu-hint').textContent=h[tab]||'';
}

/* ══ KİTAP MODAL ══ */
function openKitapModal(){document.getElementById('mk-t').textContent='Yeni Kitap Ekle';document.getElementById('mk-i').textContent='📗';['fk-id','fk-ad','fk-isbn','fk-stok'].forEach(id=>document.getElementById(id).value='');setSdd('fky','','');setSdd('fkt','','');setSdd('fkyn','','');openModal('mk');}
function editKitap(id){const k=kitaplar.find(x=>x.id===id);if(!k)return;document.getElementById('mk-t').textContent='Kitap Düzenle';document.getElementById('mk-i').textContent='✏️';document.getElementById('fk-id').value=id;document.getElementById('fk-ad').value=k.ad;document.getElementById('fk-isbn').value=k.isbn;document.getElementById('fk-stok').value=k.stok;const yz=yazarlar.find(x=>x.id===k.yzid);setSdd('fky',k.yzid,yz?yz.ad+' '+yz.sy:'');const tr=turler.find(x=>x.id===k.tid);setSdd('fkt',k.tid,tr?tr.ad:'');const yn=yayinevleri.find(x=>x.id===k.yid);setSdd('fkyn',k.yid,yn?yn.ad:'');openModal('mk');}
function saveKitap(){
  const eid=document.getElementById('fk-id').value;const ad=document.getElementById('fk-ad').value.trim();const stok=parseInt(document.getElementById('fk-stok').value);const yzid=getSdd('fk-y');const tid=getSdd('fk-t');const yid=getSdd('fk-yn');
  if(!ad){toast('Kitap adı boş olamaz!','e');return;}if(isNaN(stok)||stok<0){toast('Geçerli stok girin!','e');return;}
  if(eid){const isbn=document.getElementById('fk-isbn').value;const k=kitaplar.find(x=>x.id===+eid);if(k){k.ad=ad;k.isbn=isbn;k.stok=stok;k.yzid=yzid;k.tid=tid;k.yid=yid;}addLog(`Güncellendi: ${ad}`,'Information');toast(`"${ad}" güncellendi`,'s');}
  else{const isbn=genISBN(ad,nkid);kitaplar.push({id:nkid++,ad,isbn,stok,yzid,tid,yid});addLog(`Eklendi: ${ad} — ${isbn}`,'Information');toast(`"${ad}" eklendi 📚`,'s');}
  closeModal('mk');buildCmd();renderAll();
}
function delKitap(id,ad){confirm2(`"${ad}" silinecek. Geri alınamaz.`,()=>{kitaplar=kitaplar.filter(k=>k.id!==id);addLog(`Silindi: ${ad}`,'Warning');toast(`"${ad}" silindi`,'w');buildCmd();renderAll();});}

/* ══ ÜYE MODAL ══ */
function openUyeModal(editId=null){
  document.getElementById('mu-t').textContent=editId?'Üye Düzenle':'Yeni Üye Kaydı';document.getElementById('mu-i').textContent='👤';
  document.querySelectorAll('.mtab').forEach((t,i)=>{t.classList.toggle('active',i===0);});document.querySelectorAll('.mpanel').forEach((p,i)=>{p.classList.toggle('active',i===0);});
  document.getElementById('mu-hint').textContent='Sonraki: İletişim →';
  if(editId){
    const u=uyeler.find(x=>x.id===editId);if(!u)return;
    document.getElementById('fu-a').value=u.ad;document.getElementById('fu-s').value=u.sy;document.getElementById('fu-tc').value=u.tc||'';document.getElementById('fu-barkod').value=u.barkod||'';
    document.getElementById('fu-e').value=u.ep||'';document.getElementById('fu-tel').value=u.tel||'';document.getElementById('fu-adres').value=u.adres||'';
    document.getElementById('fu-baslangic').value=u.baslangic||'';document.getElementById('fu-max').value=u.maxOdunc||5;document.getElementById('fu-ceza').value=u.ceza||0;
    document.getElementById('fu-aktif').checked=u.aktif!==false;document.getElementById('fu-bl').checked=!!u.blacklist;
    document.getElementById('fu-a').dataset.eid=editId;
  }else{
    ['fu-a','fu-s','fu-tc','fu-e','fu-tel','fu-adres'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('fu-barkod').value='';genBarkod();
    document.getElementById('fu-baslangic').value=nS();document.getElementById('fu-max').value=5;document.getElementById('fu-ceza').value=0;
    document.getElementById('fu-aktif').checked=true;document.getElementById('fu-bl').checked=false;
    document.getElementById('fu-a').dataset.eid='';
  }
  openModal('mu');
}
function editUye(id){openUyeModal(id);}
function saveUye(){
  const eid=+document.getElementById('fu-a').dataset.eid||0;
  const ad=document.getElementById('fu-a').value.trim();const sy=document.getElementById('fu-s').value.trim();const tc=document.getElementById('fu-tc').value.trim();
  const barkod=document.getElementById('fu-barkod').value.trim();const ep=document.getElementById('fu-e').value.trim();const tel=document.getElementById('fu-tel').value.trim();const adres=document.getElementById('fu-adres').value.trim();
  const baslangic=document.getElementById('fu-baslangic').value;const maxOdunc=+document.getElementById('fu-max').value||5;const ceza=+document.getElementById('fu-ceza').value||0;
  const aktif=document.getElementById('fu-aktif').checked;const blacklist=document.getElementById('fu-bl').checked;
  if(!ad||!sy){toast('Ad ve soyad zorunludur!','e');return;}if(tc&&tc.length!==11){toast('TC Kimlik No 11 hane olmalı!','e');return;}
  if(eid){
    const u=uyeler.find(x=>x.id===eid);if(u)Object.assign(u,{ad,sy,tc,barkod,ep,tel,adres,baslangic,maxOdunc,ceza,aktif,blacklist});
    addLog(`Üye güncellendi: ${ad} ${sy}`,'Information');toast(`${ad} ${sy} güncellendi ✓`,'s');
  }else{
    uyeler.push({id:nuid++,ad,sy,tc,barkod,ep,tel,adres,kayit:nS(),baslangic,maxOdunc,ceza,aktif,blacklist});
    addLog(`Üye kaydedildi: ${ad} ${sy}`,'Information');toast(`${ad} ${sy} kaydedildi 👤`,'s');
  }
  closeModal('mu');if(eid&&selUid===eid)openDetay(eid);renderAll();
}
function delUye(id,ad){confirm2(`"${ad}" silinecek.`,()=>{uyeler=uyeler.filter(u=>u.id!==id);addLog(`Üye silindi: ${ad}`,'Warning');toast(`"${ad}" silindi`,'w');closeDetay();renderAll();});}

/* ══ ÖDÜNÇ ══ */
function openOduncModal(preK=null,preU=null){fillOS(preK,preU!==null?preU:selUid);openModal('mo');}
function saveOdunc(){
  const kid=getSdd('fo-k');const uid=getSdd('fo-u');
  if(!kid){toast('Kitap seçin!','e');return;}if(!uid){toast('Üye seçin!','e');return;}
  const k=kitaplar.find(x=>x.id===kid);const u=uyeler.find(x=>x.id===uid);
  if(!k||k.stok<1){toast('Stok yok!','e');return;}
  if(islemler.find(i=>i.kid===kid&&i.uid===uid&&!i.iade)){toast('Bu kitap zaten ödünçte!','w');return;}
  if(u.blacklist){toast('Kara listede!','e');return;}
  if(!u.aktif){toast('Pasif üye!','e');return;}
  if((u.ceza||0)>0){toast(`₺${u.ceza} birikmiş ceza var!`,'w');return;}
  const aktifSayi=islemler.filter(i=>i.uid===uid&&!i.iade).length;
  if(aktifSayi>=(u.maxOdunc||5)){toast('Maksimum limite ulaşıldı!','e');return;}
  islemler.push({id:niid++,kid,uid,alis:nS(),iade:null});k.stok--;
  addLog(`Ödünç: ${u.ad} ${u.sy} → ${k.ad}`,'Information');toast(`"${k.ad}" → ${u.ad} ${u.sy}`,'s');
  closeModal('mo');if(selUid===uid)openDetay(uid);buildNotifs();renderAll();
}
function iade(id){
  const i=islemler.find(x=>x.id===id);if(!i)return;
  const k=kitaplar.find(x=>x.id===i.kid);const u=uyeler.find(x=>x.id===i.uid);
  i.iade=nS();if(k)k.stok++;
  addLog(`İade: ${u?.ad||''} ${u?.sy||''} ← ${k?.ad||''}`,'Information');toast('İade tamamlandı ✓','s');
  if(selUid===i.uid)openDetay(i.uid);buildNotifs();renderAll();
}
function confirm2(msg,cb){document.getElementById('cmsg').textContent=msg;document.getElementById('cok').onclick=()=>{cb();closeModal('mc');};openModal('mc');}

/* ══ LOG & TOAST ══ */
function addLog(msg,lvl='Information'){loglar.push({id:loglar.length+1,lvl,msg,ts:nTs()});}
function toast(msg,type='s'){
  const t=document.createElement('div');t.className=`toast t${type}`;
  t.innerHTML=`<div class="tdot"></div><span>${msg}</span>`;
  document.getElementById('tz').appendChild(t);
  setTimeout(()=>{t.style.transition='all .35s';t.style.opacity='0';t.style.transform='translateX(60px)';},3200);
  setTimeout(()=>t.remove(),3600);
}

document.addEventListener('DOMContentLoaded',init);