function setMode(m){
  const single = m==='single';
  document.getElementById('g-single').style.display = single?'block':'none';
  document.getElementById('g-dual').style.display   = single?'none':'block';
  document.getElementById('verdict-single').style.display = single?'flex':'none';
  document.getElementById('verdict-dual').style.display   = single?'none':'flex';
  document.getElementById('btn1').classList.toggle('active',single);
  document.getElementById('btn2').classList.toggle('active',!single);
}

function setTutorialStep(step){
  const target=Math.max(1,Math.min(6,Number(step)||1));
  
document.querySelectorAll('[data-mode]').forEach(button=>{
  button.addEventListener('click',()=>setMode(button.dataset.mode));
});
document.querySelectorAll('[data-go-to]').forEach(button=>{
  button.addEventListener('click',()=>setTutorialStep(button.dataset.goTo));
});
document.querySelectorAll('[data-print]').forEach(button=>{
  button.addEventListener('click',()=>window.print());
});

document.querySelectorAll('[data-tutorial-step]').forEach(btn=>{
    const active=Number(btn.dataset.tutorialStep)===target;
    btn.classList.toggle('active',active);
    btn.setAttribute('aria-selected',String(active));
    btn.tabIndex=active?0:-1;
  });
  document.querySelectorAll('[data-panel-step]').forEach(panel=>{
    panel.classList.toggle('active',Number(panel.dataset.panelStep)===target);
  });
  const progress=document.getElementById('tutorial-progress');
  if(progress) progress.style.width=`${target/6*100}%`;
}

document.querySelectorAll('[data-tutorial-step]').forEach(btn=>{
  btn.addEventListener('click',()=>setTutorialStep(btn.dataset.tutorialStep));
  btn.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const delta=['ArrowRight','ArrowDown'].includes(event.key)?1:-1;
    const next=(Number(btn.dataset.tutorialStep)-1+delta+6)%6+1;
    setTutorialStep(next);
    document.querySelector(`[data-tutorial-step="${next}"]`)?.focus();
  });
});
setTutorialStep(1);
// scroll reveal
const io=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
