
/* Accessible, swipeable carousel */

// CHANGE: Listen for the 'load' event, which fires after all assets (like images) are loaded.
window.addEventListener('load', function(){ 
  const root = document.getElementById('resourcesCarousel');
  if (!root) { console.log('container not found'); return; }

  const slides = Array.from(root.querySelectorAll('.hb-slide'));
  if (!slides.length) { console.log('[HB Carousel] no slides'); return; }

  // 1. CONSOLIDATED ELEMENT RETRIEVAL
  const prev = root.querySelector('.hb-prev');
  const next = root.querySelector('.hb-next');
  
  
  const dotsContainer = root.querySelector('.hb-dots');
  const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.hb-dot')) : [];
  console.log('Dots found');
  // const toggle = root.querySelector('#hb-toggle');

  let index = 0;
  // , timer = null, interval = 6000, autoplay = true;

  // 2. CORE CAROUSEL FUNCTIONS
  function updateDots(){
    dots.forEach((d,i)=> d.classList.toggle('is-active', i===index));
  }

  function show(n){
    index = (n + slides.length) % slides.length;
    slides.forEach((s,i)=> s.classList.toggle('is-active', i===index));
    updateDots();
  }

  function nextSlide(){ show(index+1); }
  function prevSlide(){ show(index-1); }

  console.log("Starting static carousel.");
  show(0);

   // 4. EVENT LISTENERS
  function nextPrevGuard(fn){ return (e)=>{ e.preventDefault(); e.stopPropagation(); fn(); }; }
  prev && prev.addEventListener('click', nextPrevGuard(prevSlide));
  next && next.addEventListener('click', nextPrevGuard(nextSlide));
  // edgeL && 
  edgeL.addEventListener('click', prevSlide);
  // edgeR && 
  edgeR.addEventListener('click', nextSlide);

  root.addEventListener('click', (e) => {
    const t = e.target;
    if (t.classList.contains('hb-dot')) {
        const i = dots.indexOf(t);
        if (i > -1){
          show(i);
        } 
     }
  });
});

  // function play(){
  //   clearInterval(timer);
  //   timer = setInterval(nextSlide, interval);
  //   autoplay = true;
  //   if (toggle){ 
  //     toggle.textContent='⏸'; 
  //     toggle.setAttribute('aria-pressed','true'); 
  //     toggle.setAttribute('aria-label','Pause autoplay'); 
  //   }
  // }

  // function pause(){
  //   clearInterval(timer); timer=null;
  //   if (toggle){ 
  //     toggle.textContent='▶︎'; 
  //     toggle.setAttribute('aria-pressed','false'); 
  //     toggle.setAttribute('aria-label','Play autoplay'); 
  //   }
  // }

  // function toggleAutoplay(){
  //   if(timer){
  //     pause();
  //   }else{
  //     play();
  //   }
  // }

  // 3. DELAYED INITIAL STARTUP
  // This ensures a 100ms pause after all assets are loaded before starting the timer.


    // } else if (t === toggle) {
    //     toggleAutoplay();

  // root.tabIndex = 0;
  // root.addEventListener('keydown', (e)=>{
  //   if(e.code ==='ArrowRight'){ e.preventDefault(); nextSlide(); }
  //   if(e.code === 'ArrowLeft'){ e.preventDefault(); prevSlide(); }
  // });

  //   setTimeout(() => {
  //   console.log("Forcing delayed carousel start.");
  //   show(0);
  //   play();
  // }, 2000); 
  // root.tabIndex = 0;
  // root.addEventListener('keydown', (e)=>{
  //   if(e.key==='ArrowRight'){ e.preventDefault(); nextSlide(); }
  //   if(e.key==='ArrowLeft'){ e.preventDefault(); prevSlide(); }
  // });

  // Hover management
  // let autoPlaying = true;
  // root.addEventListener('mouseenter', () => {
  //   autoPlaying = (timer !== null);
  //   pause();
  // });
  // root.addEventListener('mouseleave', () => { 
  //   if (autoPlaying) { 
  //     play();
  //   }
  // });
  
  //Focus management
  // root.addEventListener('focusin', () => {
  //   autoPlaying = (timer !== null);
  //   pause();
  // });
  // root.addEventListener('focusout', (e) => {
  //   if (!root.contains(e.relatedTarget) && autoPlaying) {
  //     play();
  //   }
  // });

  // Swipe support
  // let startX=0, dx=0, drag=false;
  // root.addEventListener('pointerdown', e=>{ drag=true; startX=e.clientX; root.setPointerCapture?.(e.pointerId); });
  // root.addEventListener('pointermove', e=>{ if(drag) dx=e.clientX-startX; });
  // root.addEventListener('pointerup', ()=>{ if(!drag) return; if(dx<-40) nextSlide(); if(dx>40) prevSlide(); drag=false; dx=0; });