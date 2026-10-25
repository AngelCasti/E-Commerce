/*
================================================================================
  NovaPay — Modern Financial Platform
  Template: templatemo-623-novapay
  JavaScript
  Designed by TemplateMo  (https://templatemo.com)

  Modules:
    1. Live ticker         — infinite CSS scroll with hover-pause
    2. Trusted-by logos    — infinite CSS scroll
    3. Nav scroll behavior — translateY snap on scroll past ticker
    4. Mobile menu         — body-scroll-lock + landscape-safe layout
    5. Stats counter       — IntersectionObserver count-up + bar fill
    6. Sticky stack        — scroll-driven feature switcher with right-panel swap
    7. Pricing toggle      — monthly / annual with dual price display
    8. FAQ                 — independent accordion + expand/collapse all
    9. Testimonials        — auto-scroll carousel with play/pause
   10. Period switcher     — dashboard time range toggle (7D/1M/3M/1Y)
   11. Silk reveals        — IntersectionObserver scroll-triggered animations
   12. Phone 3D tilt       — window-wide mouse tracking with lerp easing
================================================================================
*/

//Inciar sesion en Login
// Función para alternar la visibilidad de la contraseña
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const isPassword = input.getAttribute('type') === 'password';
  input.setAttribute('type', isPassword ? 'text' : 'password');
  btn.classList.toggle('active', isPassword);

  // SVG del ojo abierto vs ojo tachado
  if (isPassword) {
    // Ojo tachado (ocultar)
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
    `;
  } else {
    // Ojo normal (mostrar)
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `;
  }
}

// --- LÓGICA DE AUTENTICACIÓN CON SUPABASE ---
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const navAuthBtn = document.getElementById('navAuthBtn');
const authModal = document.getElementById('authModal');

// 1. Registrar un nuevo usuario
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
    options: {
      data: { full_name: name } // Guarda el nombre en los metadatos del usuario
    }
  });

  if (error) {
    alert('Error al registrarse: ' + error.message);
  } else {
    alert('¡Registro exitoso! Revisa tu correo para confirmar o inicia sesión.');
    authModal.classList.remove('open');
    registerForm.reset();
  }
});

// 2. Iniciar sesión con un usuario existente
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    alert('Credenciales incorrectas: ' + error.message);
  } else {
    alert('¡Bienvenido de nuevo!');
    authModal.classList.remove('open');
    loginForm.reset();
    checkUserSession(); // Actualiza la interfaz para mostrar el perfil
  }
});

// 3. Comprobar si hay una sesión activa y mostrar el perfil en el botón
async function checkUserSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  
  if (session) {
    const user = session.user;
    // Extraemos el nombre guardado o el correo si no hay nombre
    const displayName = user.user_metadata?.full_name || user.email.split('@')[0];
    
    // Cambiamos el botón de "Sign in" por el nombre del usuario (simulando su perfil)
    navAuthBtn.textContent = `👤 ${displayName}`;
    navAuthBtn.href = "#profile"; // Podrías redirigirlo o abrir un menú de perfil
    
    // Opcional: si dan clic y ya están logueados, podríamos preguntar si desean cerrar sesión
    navAuthBtn.onclick = async (ev) => {
      ev.preventDefault();
      if (confirm('¿Deseas cerrar sesión?')) {
        await supabaseClient.auth.signOut();
        location.reload(); // Recarga la página para limpiar el estado
      }
    };
  }
}

// Ejecutar la comprobación al cargar la página
checkUserSession();



// Abrir y cerrar el modal de Login/Registro
const closeAuthModalBtn = document.getElementById('closeAuthModal');
const openAuthBtns = document.querySelectorAll('.open-auth-btn');

// Abrir Modal
openAuthBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    authModal.classList.add('open');
  });
});

// Cerrar Modal al hacer clic en la (X)
closeAuthModalBtn.addEventListener('click', () => {
  authModal.classList.remove('open');
});

// Cerrar Modal al dar clic fuera de los límites del cuadro
authModal.addEventListener('click', (e) => {
  if (e.target === authModal) {
    authModal.classList.remove('open');
  }
});

// Alternar entre pestañas de Login y Registro
function switchAuthTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabRegisterBtn = document.getElementById('tabRegisterBtn');

  if (tab === 'login') {
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    tabLoginBtn.classList.add('active');
    tabRegisterBtn.classList.remove('active');
  } else {
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
    tabRegisterBtn.classList.add('active');
    tabLoginBtn.classList.remove('active');
  }
}
//Es para el login lo de arriba - firmita Cruz Uwu

const nav=document.getElementById('mainNav');
const ticker=document.querySelector('.ticker');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled',window.scrollY>10);
});
window.addEventListener('load',()=>{
  document.querySelectorAll('.hero-content,.hero-visual').forEach((el,i)=>{
    setTimeout(()=>el.classList.add('visible'),i*150+100);
  });
});

const hamburger=document.getElementById('hamburger');
const mobileMenu=document.getElementById('mobileMenu');
let scrollY=0;
hamburger.addEventListener('click',()=>{
  const open=mobileMenu.classList.contains('open');
  if(open){
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded','false');
    document.body.style.position='';
    document.body.style.top='';
    window.scrollTo({top:scrollY,behavior:'instant'});
  } else {
    scrollY=window.scrollY;
    document.body.style.position='fixed';
    document.body.style.top=`-${scrollY}px`;
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded','true');
  }
});
mobileMenu.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click',()=>{
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded','false');
    document.body.style.position='';
    document.body.style.top='';
    window.scrollTo({top:scrollY,behavior:'instant'});
  });
});


function switchPeriod(btn,period){
  document.querySelectorAll('.dp-period-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const configs={
    '7d':{val:'$284,920',change:'▲ +$12,840 (4.72%) today'},
    '1m':{val:'$284,920',change:'▲ +$74,920 (35.7%) month'},
    '3m':{val:'$284,920',change:'▲ +$104,920 (58.3%) quarter'},
    '1y':{val:'$284,920',change:'▲ +$164,920 (137.4%) year'},
  };
  const c=configs[period];
  document.getElementById('dpChartVal').textContent=c.val;
  document.getElementById('dpChartChange').textContent=c.change;
}

const sparkBars=[60,75,50,90,65,85,70,95];
document.getElementById('sparkline').innerHTML=sparkBars.map(h=>`<div class="pm-spark-bar" style="height:${h}%"></div>`).join('');

const stickyCards=document.querySelectorAll('.sticky-card');
const panelViews=document.querySelectorAll('.panel-view');
const panelLabel=document.getElementById('panelLabel');
const panelLabels=['Transfers','Analytics','Multi-currency','Security'];
stickyCards.forEach((card,i)=>{
  card.addEventListener('click',()=>{
    stickyCards.forEach(c=>c.classList.remove('active'));
    panelViews.forEach(p=>p.classList.remove('active'));
    card.classList.add('active');
    document.getElementById('panel-'+i).classList.add('active');
    panelLabel.textContent=panelLabels[i];
  });
});

const observer=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      stickyCards.forEach((card,i)=>{
        const rect=card.getBoundingClientRect();
        const viewH=window.innerHeight;
        if(rect.top<viewH*0.6&&rect.bottom>viewH*0.3){
          stickyCards.forEach(c=>c.classList.remove('active'));
          panelViews.forEach(p=>p.classList.remove('active'));
          card.classList.add('active');
          document.getElementById('panel-'+i).classList.add('active');
          panelLabel.textContent=panelLabels[i];
        }
      });
    }
  });
},{threshold:0.3});
stickyCards.forEach(c=>observer.observe(c));

const statNums=document.querySelectorAll('.stat-num[data-target]');
const statsObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el=e.target;
      const target=parseFloat(el.dataset.target);
      const suffix=el.dataset.suffix||'';
      const decimal=parseInt(el.dataset.decimal)||0;
      const prefix=el.dataset.prefix||'';
      let start=0,duration=1800,startTime=null;
      function animate(ts){
        if(!startTime)startTime=ts;
        const progress=Math.min((ts-startTime)/duration,1);
        const ease=1-Math.pow(1-progress,3);
        const val=start+(target-start)*ease;
        el.textContent=prefix+(decimal?val.toFixed(decimal):Math.round(val))+suffix;
        if(progress<1)requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
      const bar=el.closest('.stat-block').querySelector('.stat-bar');
      if(bar){setTimeout(()=>{bar.style.width=bar.dataset.width;},200);}
      statsObs.unobserve(el);
    }
  });
},{threshold:0.5});
statNums.forEach(el=>statsObs.observe(el));

let isAnnual=false;
function togglePricing(){
  isAnnual=!isAnnual;
  document.getElementById('pricingToggle').classList.toggle('on',isAnnual);
  document.querySelectorAll('.price-num').forEach(el=>{
    el.textContent=isAnnual?el.dataset.annual:el.dataset.monthly;
  });
  document.querySelectorAll('.period-label').forEach(el=>{
    el.textContent=isAnnual?'annually':'monthly';
  });
  document.querySelectorAll('.price-alt-monthly').forEach(el=>{
    el.style.display=isAnnual?'none':'inline';
  });
  document.querySelectorAll('.price-alt-annual').forEach(el=>{
    el.style.display=isAnnual?'inline':'none';
  });
}

const faqs=[
  {q:'1. How can automation help my business?',a:'Automation reduces repetitive tasks, saves time, and minimizes human errors. It allows your team to focus on more important activities while routine processes run automatically.'},
  {q:'2. How much does an automation project cost?',a:'Pricing depends on the complexity and requirements of your project. We provide a personalized quote after evaluating your business needs. You pay for the solution, not a mandatory monthly subscription.'},
  {q:'3. How long does it take to implement a solution?',a:'Implementation time depends on the project. Simple automations may take a few days, while more complex solutions may require several weeks.'},
  {q:'4. Do I need technical knowledge to use your solutions?',a:"Not at all. Our solutions are designed to be simple and user-friendly. We also provide guidance to help your team use them effectively."},
  {q:'5. Can you work with the tools my business already uses?',a:'Yes. We can evaluate integration options for tools such as Excel, email platforms, databases, and business management systems, depending on their compatibility.'},
  {q:'6. What happens if I need changes or support?',a:'We offer additional support, maintenance, and updates based on your needs. New features or modifications can be quoted separately.'},
  {q:'7. How do I get started with FlowSync?',a:"Simply tell us which tasks are taking too much time. We'll review your needs, recommend a solution, and provide a quote before starting development."},
];
const faqList=document.getElementById('faqList');
faqs.forEach((f,i)=>{
  const item=document.createElement('div');
  item.className='faq-item';
  item.innerHTML=`<div class="faq-q"><span class="faq-q-text">${f.q}</span><svg class="faq-chevron" viewBox="0 0 24 24"><polyline points="6,9 12,15 18,9"/></svg></div><div class="faq-a">${f.a}</div>`;
  item.querySelector('.faq-q').addEventListener('click',()=>{
    item.classList.toggle('open');
  });
  faqList.appendChild(item);
});

let allExpanded=false;
function toggleAllFaq(){
  allExpanded=!allExpanded;
  document.querySelectorAll('.faq-item').forEach(el=>{
    allExpanded?el.classList.add('open'):el.classList.remove('open');
  });
  document.getElementById('faqToggleLabel').textContent=allExpanded?'Collapse all':'Expand all';
  const icon=document.getElementById('faqToggleIcon');
  icon.innerHTML=allExpanded
    ?'<line x1="5" y1="12" x2="19" y2="12"/>'
    :'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>';
}

const testimonials=[
  {q:'NovaPay cut our international settlement time from 3 days to under 2 seconds. It completely changed how we operate.',name:'Sarah Kim',role:'CFO at Hive Commerce',init:'SK'},
  {q:"The multi-currency accounts saved us over $40K in FX fees last year. The rate transparency alone is worth it.",name:'James Adler',role:'Finance Director, Nomad Labs',init:'JA'},
  {q:'Finally a fintech platform that doesn\'t feel like it was built in 2015. The dashboard is genuinely beautiful and fast.',name:'Priya Mehta',role:'Head of Ops, Stackflow',init:'PM'},
  {q:'Migrated from our bank\'s business account in a weekend. The API docs are exceptional — engineers loved it.',name:'Tom Brennan',role:'CTO at Vaulted',init:'TB'},
  {q:'The fraud detection caught three suspicious transactions before they hit our account. Incredible peace of mind.',name:'Liu Wei',role:'Founder, CloudMint',init:'LW'},
  {q:'Our accountants love the automated reconciliation. What took 8 hours a month now takes 20 minutes.',name:'Amara Osei',role:'Controller, Drift Studio',init:'AO'},
];
const tt=document.getElementById('testiTrack');
[...testimonials,...testimonials].forEach(t=>{
  const el=document.createElement('div');
  el.className='testi-card';
  el.innerHTML=`<div class="testi-stars">${[...Array(5)].map(()=>'<svg viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>').join('')}</div><p class="testi-quote">"${t.q}"</p><div class="testi-author"><div class="testi-avatar">${t.init}</div><div><div class="testi-name">${t.name}</div><div class="testi-role">${t.role}</div></div></div>`;
  tt.appendChild(el);
});

let testiPaused=false;
function toggleTestimonials(){
  testiPaused=!testiPaused;
  tt.style.animationPlayState=testiPaused?'paused':'running';
  const icon=document.getElementById('testiIcon');
  const label=document.getElementById('testiLabel');
  const btn=document.getElementById('testiToggle');
  if(testiPaused){
    icon.innerHTML='<polygon points="6,4 20,12 6,20"/>';
    label.textContent='Play';
    btn.setAttribute('aria-label','Play testimonials');
  } else {
    icon.innerHTML='<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>';
    label.textContent='Pause';
    btn.setAttribute('aria-label','Pause testimonials');
  }
}

document.getElementById('testiToggle').addEventListener('mouseenter',function(){
  this.style.borderColor='var(--sky)';
  this.style.color='var(--sky)';
});
document.getElementById('testiToggle').addEventListener('mouseleave',function(){
  this.style.borderColor='var(--border2)';
  this.style.color='var(--text2)';
});


document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const href=a.getAttribute('href');
    if(href==='#')return;
    e.preventDefault();
    const target=document.querySelector(href);
    if(target)target.scrollIntoView({behavior:'smooth'});
  });
});

const revealObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
},{threshold:0.12});
document.querySelectorAll('.silk-reveal,.silk-reveal-left,.silk-reveal-right').forEach((el,i)=>{
  el.style.animationDelay=(i%4)*0.08+'s';
  revealObs.observe(el);
});

const statBlocks=document.querySelectorAll('.stat-block');
statBlocks.forEach((el,i)=>{
  el.style.opacity='0';
  el.style.transform='translateY(20px)';
  el.style.transition=`opacity .8s var(--silk) ${i*0.1}s, transform .8s var(--silk) ${i*0.1}s, border-color .6s var(--silk), box-shadow .6s var(--silk)`;
});
const statObs2=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.style.opacity='1';
      e.target.style.transform='translateY(0)';
      statObs2.unobserve(e.target);
    }
  });
},{threshold:0.2});
statBlocks.forEach(el=>statObs2.observe(el));

const sectionHeaders=document.querySelectorAll('.section-title,.section-tag,.section-sub');
sectionHeaders.forEach(el=>{
  el.style.opacity='0';
  el.style.transform='translateY(16px)';
  el.style.transition='opacity .8s var(--silk), transform .8s var(--silk)';
});
const headerObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.style.opacity='1';
      e.target.style.transform='translateY(0)';
      headerObs.unobserve(e.target);
    }
  });
},{threshold:0.3});
sectionHeaders.forEach(el=>headerObs.observe(el));

const phoneFrame=document.getElementById('phoneFrame');
if(phoneFrame){
  let targetX=0,targetY=0,currentX=0,currentY=0,rafId=null,running=false;
  const MAX_TILT=16;
  function animate(){
    currentX+=(targetX-currentX)*.06;
    currentY+=(targetY-currentY)*.06;
    phoneFrame.style.transform=`rotateX(${currentY}deg) rotateY(${currentX}deg) translateZ(0)`;
    if(Math.abs(targetX-currentX)>.02||Math.abs(targetY-currentY)>.02){
      rafId=requestAnimationFrame(animate);
    } else {
      rafId=null;
      running=false;
    }
  }
  function kick(){
    if(!rafId){running=true;rafId=requestAnimationFrame(animate);}
  }
  window.addEventListener('mousemove',e=>{
    const x=e.clientX/window.innerWidth-.5;
    const y=e.clientY/window.innerHeight-.5;
    targetX=x*MAX_TILT*4;
    targetY=-y*MAX_TILT*2;
    kick();
  });
  window.addEventListener('mouseleave',()=>{
    targetX=0;targetY=0;
    kick();
  });
}
