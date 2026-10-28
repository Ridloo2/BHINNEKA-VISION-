const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");
menuToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
$$('#mainNav a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

// Interactive illustrated viewer. This intentionally avoids claiming a real scanned 3D object.
const slider = $("#rotateSlider"), viewerObject = $("#viewerObject"), angleLabel = $("#angleLabel");
function rotateViewer(angle) {
  const a = Number(angle);
  angleLabel.textContent = `SUDUT ${a}°`;
  // A perspective flip makes the front illustration respond to the angle control.
  const normalized = a <= 180 ? a : 360-a;
  const side = a <= 180 ? 1 : -1;
  viewerObject.style.transform = `perspective(900px) rotateY(${(normalized-90)*0.34*side}deg) rotateZ(${Math.sin(a*Math.PI/180)*2.8}deg) scaleX(${0.72 + 0.28*Math.abs(Math.cos(a*Math.PI/180))})`;
  $("#viewerObject").style.filter = `brightness(${0.88 + 0.12*Math.abs(Math.cos(a*Math.PI/180))})`;
}
slider.addEventListener("input", e => rotateViewer(e.target.value));
$("#resetView").addEventListener("click", () => { slider.value=0; rotateViewer(0); });
const parts = {
  dadak: {title:"Dadak Merak", desc:"Bagian paling ikonik: susunan bulu merak membentuk kipas besar di atas kepala harimau/singa. Bentuk, ukuran, dan hiasannya dapat berbeda menurut kelompok atau pembuat."},
  caplokan: {title:"Caplokan / kepala", desc:"Bagian kepala berbentuk harimau atau singa yang sering disebut caplokan. Detail wajah, warna, dan ornamen mengikuti gaya pengerjaan kelompok Reog."},
  rangka: {title:"Rangka & pegangan", desc:"Struktur penopang membantu membentuk dan menyeimbangkan Dadak Merak. Pembuatan serta penggunaannya memerlukan keterampilan khusus; ilustrasi ini tidak untuk meniru teknik mengangkat."},
  busana: {title:"Hiasan & busana", desc:"Busana dan ornamen memperkuat karakter penari. Warna serta detail kostum dapat bervariasi antara kelompok, jenis pertunjukan, dan kesempatan."}
};
function choosePart(key) {
  const p=parts[key] || parts.dadak;
  $("#partTitle").textContent=p.title; $("#partDescription").textContent=p.desc;
  $$(".part-tab").forEach(b=>b.classList.toggle("active",b.dataset.part===key));
}
$$("[data-part]").forEach(el=>el.addEventListener("click",()=>choosePart(el.dataset.part)));

// Performance illustration animation.
let dancing=false;
$("#danceButton").addEventListener("click",()=>{
  dancing=!dancing;
  $("#performer").classList.toggle("dancing",dancing);
  $("#danceButton").textContent=dancing?"Ⅱ Hentikan gerak":"▶ Peragakan gerak";
  $("#danceStatus").textContent=dancing?"Animasi gerak sedang berlangsung":"Pertunjukan siap dimulai";
});

// Quiz with answer explanations.
const questions = [
 {q:"Reog Ponorogo berasal dari daerah mana?",a:["Kabupaten Ponorogo, Jawa Timur","Kabupaten Banyuwangi, Jawa Timur","Kota Surakarta, Jawa Tengah","Kabupaten Cirebon, Jawa Barat"],correct:0,why:"Reog Ponorogo berasal dan berkembang kuat di Kabupaten Ponorogo, Jawa Timur."},
 {q:"Apa nama hiasan besar berupa kipas bulu merak yang menjadi ikon Reog?",a:["Kuda kepang","Dadak Merak","Pecut Samandiman","Kendang"],correct:1,why:"Dadak Merak adalah ikon visual Reog yang menampilkan kepala harimau/singa dengan hiasan bulu merak."},
 {q:"Tokoh mana yang dikenal sebagai patih muda yang energik dan jenaka?",a:["Jathil","Warok","Bujang Ganong","Pengrawit"],correct:2,why:"Bujang Ganong atau Pujangga Anom dikenal sebagai tokoh patih yang energik dan sering menampilkan gerak atraktif."},
 {q:"Mengapa asal-usul Reog sebaiknya dijelaskan dengan menyebut beberapa versi?",a:["Karena tidak memiliki cerita sama sekali","Karena hanya ada satu catatan resmi","Karena cerita rakyat memiliki beberapa versi yang diwariskan","Karena Reog baru dibuat beberapa tahun lalu"],correct:2,why:"Sumber budaya mencatat beberapa versi legenda, termasuk kisah Ki Ageng Kutu dan legenda Bantarangin. Legenda tidak selalu sama dengan catatan sejarah."},
 {q:"Apa tindakan yang membantu pelestarian Reog?",a:["Menyebarkan cerita yang belum diperiksa","Menganggap seniman tidak penting","Meniru atraksi berisiko tanpa latihan","Belajar dari sumber tepercaya dan menghargai seniman"],correct:3,why:"Mengenali sumber tepercaya, menghargai seniman, dan mendukung kegiatan budaya dengan cara yang aman adalah bentuk dukungan pelestarian."}
];
let qIndex=0, answers=Array(questions.length).fill(null), submitted=false;
function renderQuestion(){
 const q=questions[qIndex]; $("#questionCounter").textContent=`PERTANYAAN ${qIndex+1} DARI ${questions.length}`;
 $("#progressPercent").textContent=`${Math.round((qIndex+1)/questions.length*100)}%`; $("#progressBar").style.width=`${(qIndex+1)/questions.length*100}%`;
 $("#questionText").textContent=q.q; $("#answerOptions").innerHTML=""; $("#quizFeedback").textContent=""; $("#quizFeedback").className="quiz-feedback";
 q.a.forEach((answer,i)=>{
   const b=document.createElement("button"); b.className="answer-option"; b.innerHTML=`<span>${String.fromCharCode(65+i)}</span><div>${answer}</div>`;
   if(answers[qIndex]!==null){b.disabled=true;if(i===q.correct)b.classList.add("correct");else if(i===answers[qIndex])b.classList.add("wrong");}
   b.addEventListener("click",()=>{if(answers[qIndex]!==null)return;answers[qIndex]=i;renderQuestion();});
   $("#answerOptions").appendChild(b);
 });
 if(answers[qIndex]!==null){
   const correct=answers[qIndex]===q.correct;$("#quizFeedback").textContent=(correct?"Tepat! ":"Belum tepat. ")+q.why;$("#quizFeedback").classList.add(correct?"good":"bad");
   $("#nextQuestion").disabled=false;$("#nextQuestion").textContent=qIndex===questions.length-1?"Lihat hasil →":"Pertanyaan berikutnya →";
 } else {$("#nextQuestion").disabled=true;$("#nextQuestion").textContent="Pilih jawaban dahulu →";}
 $("#liveScore").textContent=answers.every(a=>a!==null)?`${Math.round(answers.filter((a,i)=>a===questions[i].correct).length/questions.length*100)}`:"—";
}
$("#nextQuestion").addEventListener("click",()=>{
 if(answers[qIndex]===null)return;
 if(qIndex<questions.length-1){qIndex++;renderQuestion();}
 else {
   const score=Math.round(answers.filter((a,i)=>a===questions[i].correct).length/questions.length*100);
   $("#questionText").textContent=`Kuis selesai! Skormu ${score}/100`;
   $("#answerOptions").innerHTML=`<div class="result-card"><div class="result-score">${score}</div><h3>${score===100?"Luar biasa!":score>=60?"Bagus, terus belajar!":"Yuk, jelajahi lagi!"}</h3><p>${answers.filter((a,i)=>a===questions[i].correct).length} dari ${questions.length} jawaban benar. Baca lagi bagian asal-usul, jelajah bagian, dan tokoh pertunjukan untuk memperkuat pemahamanmu.</p></div>`;
   $("#quizFeedback").textContent="Skor tersimpan di tampilan ini selama halaman terbuka.";$("#nextQuestion").classList.add("hidden");$("#restartQuiz").classList.remove("hidden");$("#progressBar").style.width="100%";$("#liveScore").textContent=score;
 }
});
$("#restartQuiz").addEventListener("click",()=>{qIndex=0;answers=Array(questions.length).fill(null);$("#nextQuestion").classList.remove("hidden");$("#restartQuiz").classList.add("hidden");renderQuestion();});
renderQuestion();

// Challenge checklist progress.
const challengeChecks=$$(".challenge-check");
function updateChallenges(){
 const done=challengeChecks.filter(c=>c.checked).length;
 $("#challengeCount").textContent=`${done} dari ${challengeChecks.length} tantangan selesai`;
 $("#challengeMessage").textContent=done===challengeChecks.length?"Hebat! Kamu sudah menuntaskan semua aksi yang tersedia.":done===0?"Pilih satu aksi untuk memulai.":"Lanjutkan satu langkah kecil lagi untuk ikut menjaga warisan budaya.";
 $("#challengeMeter").style.width=`${done/challengeChecks.length*100}%`;
}
challengeChecks.forEach(c=>c.addEventListener("change",updateChallenges));
updateChallenges();
