
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
