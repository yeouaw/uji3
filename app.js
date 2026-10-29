/* EduClass prototype: data is stored in this browser only.
   Connect Supabase before using real student accounts or real school data. */
const STORAGE_KEY = "educlass_demo_v1";
const initialState = {
  completedLessons: [],
  quizResults: [],
  submissions: [],
  attendance: [],
  posts: [
    {id:1, author:"Bu Rani (Guru)", role:"Guru", text:"Selamat datang di kelas Integral! Silakan tulis pertanyaan kalian di sini.", date:"Hari ini"}
  ]
};
let state = loadState();
let currentView = "dashboard";
const content = document.getElementById("appContent");
const toastEl = document.getElementById("toast");

function loadState(){
  try { return {...initialState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")}; }
  catch { return structuredClone(initialState); }
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function escapeHTML(value=""){
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function toast(message){
  toastEl.textContent=message; toastEl.classList.add("show");
  clearTimeout(toast._timer); toast._timer=setTimeout(()=>toastEl.classList.remove("show"),2600);
}
function today(){ return new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"}); }
function setView(view){
  currentView=view;
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
  document.getElementById("sidebar").classList.remove("open");
  render();
}
document.querySelectorAll(".nav-link").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.view)));
document.getElementById("mobileMenu").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));

const lessons = [
  {id:"konsep",icon:"∫",title:"Pengenalan Integral",desc:"Memahami integral sebagai antiturunan dan kebalikan diferensial.",duration:"12 menit",tag:"Dasar"},
  {id:"rumus",icon:"ƒ",title:"Rumus Dasar Integral",desc:"Aturan pangkat, konstanta, dan penjumlahan pada integral tak tentu.",duration:"18 menit",tag:"Materi inti"},
  {id:"contoh",icon:"✎",title:"Contoh Soal Integral",desc:"Menerapkan rumus dasar melalui contoh langkah demi langkah.",duration:"15 menit",tag:"Latihan"}
];
const quiz = [
  {q:"Hasil dari ∫ 3x² dx adalah ...",options:["x³ + C","6x + C","3x³ + C","x² + C"],answer:0},
  {q:"Jika f(x) = 4x³, maka ∫ f(x) dx adalah ...",options:["12x² + C","x⁴ + C","4x⁴ + C","4x² + C"],answer:2},
  {q:"Konstanta C pada integral tak tentu menunjukkan ...",options:["Nilai maksimum fungsi","Konstanta integrasi","Turunan kedua","Batas integral"],answer:1},
  {q:"Hasil dari ∫ 2 dx adalah ...",options:["2x + C","x² + C","2 + C","x/2 + C"],answer:0},
  {q:"Integral tak tentu berkaitan dengan operasi ...",options:["Matriks","Antiturunan","Peluang","Logaritma saja"],answer:1}
];
const tasks = [
  {id:"latihan-1",title:"Latihan Integral Dasar",desc:"Kerjakan 5 soal integral tak tentu di buku, lalu tulis ringkasan jawaban pada formulir pengumpulan.",due:"30 Oktober 2026",points:100},
  {id:"refleksi",title:"Refleksi Pembelajaran",desc:"Tuliskan 3 hal yang kamu pahami dan 1 pertanyaan tentang materi integral.",due:"2 November 2026",points:100}
];
function completedCount(){return state.completedLessons.length;}
function averageScore(){
 const scores=state.quizResults.map(x=>x.score);
 return scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : null;
}
function head(eyebrow,title,desc,extra=""){
 return `<div class="page-head"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${desc}</p></div>${extra}</div>`;
}
function stat(icon,label,value,foot){return `<div class="stat-card"><div class="stat-top"><span>${label}</span><span class="stat-icon">${icon}</span></div><strong>${value}</strong><small>${foot}</small></div>`;}
function render(){
 const pages={dashboard:renderDashboard,materi:renderMateri,kuis:renderKuis,tugas:renderTugas,nilai:renderNilai,absensi:renderAbsensi,diskusi:renderDiskusi};
 content.innerHTML=(pages[currentView]||renderDashboard)();
}
function renderDashboard(){
 const avg=averageScore();
 return `${head("DASHBOARD","Halo, Selamat Datang! 👋","Lanjutkan perjalanan belajarmu. Sedikit kemajuan setiap hari berarti banyak.",`<div class="date-pill">◷ ${today()}</div>`)}
 <section class="hero"><div class="hero-main"><p class="eyebrow">MATERI PILIHAN MINGGU INI</p><h2>Kenali dunia Integral</h2><p>Pelajari konsep antiturunan, pahami rumus, lalu uji kemampuanmu dengan kuis singkat.</p><button class="btn" data-action="view" data-view="materi">Mulai belajar <span>→</span></button></div>
 <div class="hero-progress"><div class="progress-ring"><strong>${Math.round(completedCount()/lessons.length*100)}%</strong></div><h3>Progres materi</h3><p>${completedCount()} dari ${lessons.length} materi selesai</p></div></section>
 <section class="stats-grid">${stat("▤","Materi selesai",completedCount(),`dari ${lessons.length} materi`)}${stat("✓","Kuis dikerjakan",state.quizResults.length,"percobaan tersimpan di perangkat")}${stat("▣","Tugas dikumpulkan",state.submissions.length,`dari ${tasks.length} tugas`)}${stat("★","Rata-rata kuis",avg===null?"—":avg,avg===null?"belum ada hasil kuis":"berdasarkan hasil kuis")}</section>
 <div class="dashboard-columns"><section><div class="section-heading"><h2>Lanjutkan belajar</h2><button class="text-button" data-action="view" data-view="materi">Lihat semua →</button></div><div class="course-list">${lessons.slice(0,2).map(l=>`<div class="course-row"><div class="course-icon">${l.icon}</div><div><strong>${l.title}</strong><small>${l.duration} · ${l.tag}</small></div><div class="row-end"><small>${state.completedLessons.includes(l.id)?"Selesai":"Materi"}</small><button class="text-button" data-action="lesson" data-id="${l.id}">${state.completedLessons.includes(l.id)?"Ulangi":"Buka"} →</button></div></div>`).join("")}</div></section>
 <section class="panel"><h3>Aktivitas berikutnya</h3><p class="panel-sub">Hal yang bisa kamu lakukan sekarang</p><div class="activity-list"><div class="activity"><span class="activity-mark"></span><div><strong>Kuis Integral Dasar</strong><small>5 pertanyaan pilihan ganda</small><br><button class="text-button" data-action="view" data-view="kuis">Kerjakan kuis →</button></div></div><div class="activity"><span class="activity-mark" style="background:#e7a34b"></span><div><strong>Latihan Integral Dasar</strong><small>Batas pengumpulan ${tasks[0].due}</small><br><button class="text-button" data-action="view" data-view="tugas">Lihat tugas →</button></div></div></div></section></div>`;
}
function renderMateri(){
 return `${head("RUANG BELAJAR","Materi Pembelajaran","Pelajari materi Integral sesuai urutan yang disarankan.")}<div class="notice">Materi ini merupakan contoh awal. Guru dapat mengganti deskripsi dan menambahkan bahan ajar sesuai kurikulum sekolah.</div><div class="card-grid">${lessons.map((l,i)=>`<article class="course-card"><div class="course-card-top"><span class="subject-icon">${l.icon}</span><span class="tag ${i===1?"purple":""}">${l.tag}</span></div><h3>${l.title}</h3><p>${l.desc}</p><div class="course-meta"><span>◷ ${l.duration}</span><span>${state.completedLessons.includes(l.id)?"✓ Selesai":"Belum selesai"}</span></div><button class="btn ${state.completedLessons.includes(l.id)?"secondary":""}" style="margin-top:15px;width:100%" data-action="lesson" data-id="${l.id}">${state.completedLessons.includes(l.id)?"Buka lagi":"Buka materi"} →</button></article>`).join("")}</div>`;
}
function showLesson(id){
 const l=lessons.find(x=>x.id===id); if(!l)return;
 const details={
 konsep:`<h3>Apa itu integral?</h3><p>Integral tak tentu adalah proses mencari antiturunan. Jika F'(x) = f(x), maka ∫ f(x) dx = F(x) + C.</p><div class="quiz-question"><strong>Contoh</strong><p>Karena turunan x³ adalah 3x², maka ∫ 3x² dx = x³ + C.</p></div>`,
 rumus:`<h3>Aturan pangkat</h3><p>Untuk n ≠ −1, ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C.</p><div class="quiz-question"><strong>Contoh</strong><p>∫ 2x³ dx = 2 · x⁴/4 + C = x⁴/2 + C.</p></div>`,
 contoh:`<h3>Langkah penyelesaian</h3><ol><li>Identifikasi bentuk fungsi yang akan diintegralkan.</li><li>Terapkan aturan integral yang sesuai.</li><li>Sederhanakan hasil dan tambahkan konstanta C.</li><li>Periksa dengan menurunkan hasil integral.</li></ol><div class="quiz-question"><strong>Coba pahami</strong><p>∫ 6x dx = 3x² + C, karena turunan 3x² adalah 6x.</p></div>`
 };
 content.innerHTML=`${head("MATERI",l.title,l.desc)}<section class="panel lesson-body">${details[id]||""}<button class="btn" data-action="complete-lesson" data-id="${id}">${state.completedLessons.includes(id)?"Tandai belum selesai":"Tandai selesai"} ✓</button> <button class="btn outline" data-action="view" data-view="materi">Kembali ke materi</button></section>`;
}
function renderKuis(){
 const latest=state.quizResults[state.quizResults.length-1];
 return `${head("UJI PEMAHAMAN","Kuis Integral Dasar","Pilih satu jawaban terbaik untuk setiap pertanyaan.")}${latest?`<div class="notice">Hasil percobaan terakhir: <strong>${latest.score}/100</strong> · ${latest.correct}/${quiz.length} jawaban benar.</div>`:""}<form id="quizForm"><div class="panel"><div class="section-heading"><h2>Kuis • 5 soal</h2><span class="tag orange">Pilihan ganda</span></div>${quiz.map((q,i)=>`<div class="quiz-question"><h3>${i+1}. ${q.q}</h3>${q.options.map((o,j)=>`<label class="option"><input type="radio" name="q${i}" value="${j}" required> <span>${String.fromCharCode(65+j)}. ${o}</span></label>`).join("")}</div>`).join("")}<button class="btn" type="submit">Kirim jawaban →</button></div></form>`;
}
function renderTugas(){
 return `${head("TUGAS SEKOLAH","Daftar Tugas","Kumpulkan jawaban dan pantau status tugasmu.")}<div class="notice">Pada versi demo, jawaban disimpan hanya di browser yang sedang digunakan. Jangan memasukkan data pribadi atau menganggapnya sudah terkirim ke guru.</div><div class="card-grid">${tasks.map(t=>{const sub=state.submissions.find(s=>s.taskId===t.id);return `<article class="item-card"><div class="course-card-top"><span class="subject-icon">▣</span><span class="tag ${sub?"":"orange"}">${sub?"Terkumpul":"Perlu dikerjakan"}</span></div><h3>${t.title}</h3><p>${t.desc}</p><div class="course-meta"><span>▣ Maks. ${t.points} poin</span><span>⌛ ${t.due}</span></div>${sub?`<div class="notice" style="margin:14px 0 0">Jawaban tersimpan di perangkat. ${escapeHTML(sub.text.slice(0,95))}${sub.text.length>95?"…":""}</div><button class="btn secondary" style="margin-top:12px;width:100%" data-action="submit-task" data-id="${t.id}">Ubah jawaban</button>`:`<button class="btn" style="margin-top:15px;width:100%" data-action="submit-task" data-id="${t.id}">Kerjakan / kumpulkan →</button>`}</article>`}).join("")}</div>`;
}
function showTaskForm(id){
 const task=tasks.find(t=>t.id===id);const old=state.submissions.find(s=>s.taskId===id);
 content.innerHTML=`${head("PENGUMPULAN TUGAS",task.title,"Tulis jawaban atau refleksi pembelajaranmu.")}<form id="taskForm" class="panel"><input type="hidden" name="taskId" value="${task.id}"><div class="field"><label for="studentName">Nama siswa (contoh)</label><input id="studentName" name="studentName" value="${escapeHTML(old?.studentName||"Siswa Demo")}" required maxlength="80"></div><div class="field"><label for="answerText">Jawaban</label><textarea id="answerText" name="answerText" placeholder="Tulis jawabanmu di sini..." required minlength="5" maxlength="5000">${escapeHTML(old?.text||"")}</textarea></div><button class="btn" type="submit">Simpan di perangkat ✓</button> <button class="btn outline" type="button" data-action="view" data-view="tugas">Batal</button></form>`;
}
function renderNilai(){
 const avg=averageScore();
 const rows=state.quizResults.map((r,i)=>`<tr><td>Kuis Integral Dasar</td><td>Percobaan ${i+1}</td><td class="score">${r.score}</td><td>${r.correct}/${quiz.length}</td><td>${escapeHTML(r.date)}</td></tr>`).join("");
 return `${head("HASIL BELAJAR","Nilai Saya","Pantau hasil kuis dan status tugas yang sudah dikerjakan.")}<div class="stats-grid">${stat("★","Rata-rata kuis",avg===null?"—":avg, "skala 0–100")}${stat("✓","Percobaan kuis",state.quizResults.length,"tersimpan lokal")}${stat("▣","Tugas terkumpul",state.submissions.length,`dari ${tasks.length} tugas`)}${stat("◷","Kehadiran",state.attendance.length, "catatan demo")}</div><section class="panel"><h3>Riwayat nilai kuis</h3><p class="panel-sub">Nilai otomatis dari jawaban kuis pilihan ganda.</p>${rows?`<div style="overflow:auto"><table class="grade-table"><thead><tr><th>Aktivitas</th><th>Detail</th><th>Nilai</th><th>Benar</th><th>Tanggal</th></tr></thead><tbody>${rows}</tbody></table></div>`:`<div class="empty">Belum ada nilai. Kerjakan kuis untuk melihat hasilnya.</div>`}</section><section class="panel" style="margin-top:16px"><h3>Status tugas</h3><p class="panel-sub">Pengumpulan demo belum dinilai oleh guru.</p>${tasks.map(t=>{const s=state.submissions.find(x=>x.taskId===t.id);return `<div class="attendance-row"><div><strong>${t.title}</strong><small>${s?"Jawaban tersimpan di browser":"Belum dikumpulkan"}</small></div><span class="tag ${s?"":"orange"}">${s?"Terkumpul":"Belum"}</span></div>`}).join("")}</section>`;
}
function renderAbsensi(){
 const checkedToday=state.attendance.some(a=>a.date===today());
 return `${head("KEHADIRAN","Absensi Kelas","Catat kehadiran untuk sesi belajar hari ini.")}<div class="notice">Ini hanya simulasi absensi di perangkat. Absensi resmi memerlukan login dan validasi dari sistem sekolah.</div><section class="panel"><div class="section-heading"><h2>Matematika • Integral</h2><span class="tag">${today()}</span></div><p class="panel-sub">Pastikan kamu mengikuti sesi pembelajaran sesuai jadwal sekolah.</p><div class="attendance-row"><div><strong>Kehadiran hari ini</strong><small>${checkedToday?"Kamu sudah mencatat kehadiran hari ini.":"Belum ada catatan untuk hari ini."}</small></div><button class="btn ${checkedToday?"secondary":""}" data-action="attendance" ${checkedToday?"disabled":""}>${checkedToday?"✓ Hadir tercatat":"Saya hadir"}</button></div><h3 style="margin-top:24px">Riwayat absensi</h3>${state.attendance.length?state.attendance.slice().reverse().map(a=>`<div class="attendance-row"><div><strong>${escapeHTML(a.date)}</strong><small>Matematika • Integral</small></div><span class="tag">Hadir</span></div>`).join(""):`<div class="empty" style="margin-top:12px">Belum ada riwayat absensi.</div>`}</section>`;
}
function renderDiskusi(){
 return `${head("RUANG DISKUSI","Diskusi Kelas","Berbagi pertanyaan dan membantu teman memahami Integral.")}<section class="panel"><form id="postForm" class="discussion-form"><div class="field"><label for="postText">Tulis pertanyaan atau tanggapan</label><textarea id="postText" name="postText" rows="2" placeholder="Contoh: Mengapa integral x² menjadi x³/3?" required maxlength="1000" style="min-height:70px"></textarea></div><button class="btn" type="submit">Kirim pesan</button></form><div style="margin-top:20px"><div class="section-heading"><h2>Obrolan kelas</h2><span class="tag">${state.posts.length} pesan</span></div>${state.posts.slice().reverse().map(p=>`<article class="post"><div class="post-head"><div class="avatar small">${p.role==="Guru"?"GR":"SD"}</div><div><strong>${escapeHTML(p.author)}</strong><br><small>${escapeHTML(p.role)} · ${escapeHTML(p.date)}</small></div></div><p>${escapeHTML(p.text)}</p></article>`).join("")}</div></section>`;
}
content.addEventListener("click",e=>{
 const b=e.target.closest("[data-action]");if(!b)return;
 const a=b.dataset.action;
 if(a==="view")setView(b.dataset.view);
 if(a==="lesson")showLesson(b.dataset.id);
 if(a==="complete-lesson"){
  const id=b.dataset.id;
  state.completedLessons=state.completedLessons.includes(id)?state.completedLessons.filter(x=>x!==id):[...state.completedLessons,id];
  saveState();toast("Progres materi diperbarui.");render();
 }
 if(a==="submit-task")showTaskForm(b.dataset.id);
 if(a==="attendance"){
  if(!state.attendance.some(x=>x.date===today())){state.attendance.push({date:today(),status:"Hadir"});saveState();toast("Absensi demo berhasil dicatat.");render();}
 }
});
content.addEventListener("submit",e=>{
 if(e.target.id==="quizForm"){
  e.preventDefault();const fd=new FormData(e.target);
  let correct=0;quiz.forEach((q,i)=>{if(Number(fd.get("q"+i))===q.answer)correct++;});
  const result={score:Math.round(correct/quiz.length*100),correct,date:today()};
  state.quizResults.push(result);saveState();toast(`Kuis selesai! Nilai: ${result.score}`);renderKuis();return;
 }
 if(e.target.id==="taskForm"){
  e.preventDefault();const fd=new FormData(e.target);const taskId=fd.get("taskId");
  const sub={taskId,studentName:fd.get("studentName").trim(),text:fd.get("answerText").trim(),date:today()};
  state.submissions=state.submissions.filter(s=>s.taskId!==taskId);state.submissions.push(sub);saveState();toast("Jawaban disimpan di browser ini.");setView("tugas");return;
 }
 if(e.target.id==="postForm"){
  e.preventDefault();const fd=new FormData(e.target);const text=fd.get("postText").trim();if(!text)return;
  state.posts.push({id:Date.now(),author:"Siswa Demo",role:"Siswa",text,date:today()});saveState();toast("Pesan ditambahkan ke diskusi demo.");renderDiskusi();
 }
});
render();
