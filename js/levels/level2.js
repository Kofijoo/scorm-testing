(function(){
  // Level 2 — Bug Count (count up to 10)
  // 5 rounds. One attempt per round. Keyboard: 1–9 and 0 (=10).

  const BUGS = ['🐞','🐛','🦋','🐝','🪲'];

  function bugCluster(count){
    const grid = UI.el('div', {
      className:'bug-grid',
      style:{
        display:'grid',
        gridTemplateColumns:'repeat(5, minmax(44px, 1fr))',
        gap:'8px',
        justifyItems:'center',
        alignItems:'center',
        padding:'8px'
      },
      role:'group',
      ariaLabel:`${count} bugs`
    });
    for(let i=0;i<count;i++){
      const bug = UI.el('div', {
        className:'bug',
        style:{
          fontSize:'28px',
          lineHeight:'44px',
          width:'44px',
          height:'44px',
          textAlign:'center',
          userSelect:'none'
        },
        textContent: BUGS[Math.floor(Math.random()*BUGS.length)],
        ariaHidden:'true'
      });
      grid.append(bug);
    }
    return grid;
  }

  function numberPad(onPick, disabled=false){
    const wrap = UI.el('div', {
      className:'num-grid',
      style:{
        display:'grid',
        gridTemplateColumns:'repeat(5, minmax(44px, 1fr))',
        gap:'8px'
      }
    });
    for(let n=1;n<=10;n++){
      const btn = UI.el('button', {
        className:'nav-btn num-btn',
        textContent:String(n),
        disabled,
        ariaLabel:`Choose ${n}`
      });
      btn.addEventListener('click', ()=> onPick(n));
      wrap.append(btn);
    }
    return wrap;
  }

  function Level2(){
    const TOTAL_ROUNDS = 5;
    const root   = UI.el('div', {className:'stage-wrap'});
    const header = UI.el('section', {className:'game-card'});
    const roundEl= UI.el('p', {textContent:'Round 1 / ' + TOTAL_ROUNDS});
    const instr  = UI.el('p', {textContent:'Count the bugs, then choose the correct number. Keyboard: 1–9 and 0 (=10).'});
    header.append(UI.el('h1', {textContent:'Level 2: Bug Count'}), roundEl, instr);

    const play   = UI.el('section', {className:'game-card'});
    const bugWrap= UI.el('div');
    const quiz   = UI.el('div');
    play.append(bugWrap, UI.el('div',{style:'height:8px'}), quiz);

    const feedbackCard = UI.el('section', {className:'game-card'});
    const feedbackText = UI.el('p', {textContent:' '});
    const nextBtn = UI.el('button', {className:'nav-btn', textContent:'Next round'});
    feedbackCard.append(UI.el('h2', {textContent:'Feedback'}), feedbackText, UI.el('div',{style:'height:8px'}), nextBtn);
    feedbackCard.style.display = 'none';

    root.append(header, UI.el('div',{style:'height:12px'}), play, UI.el('div',{style:'height:12px'}), feedbackCard);

    const state = { round:1, target:0, locked:false };

    function setLocked(v){
      state.locked = v;
      $$('.num-btn', quiz).forEach(b=> b.disabled = v);
    }

    function newRound(){
      // pick 1..10 (slightly bias to 3..9 to keep count visible)
      const pool = [1,2,3,4,5,6,7,8,9,10];
      state.target = pool[Math.floor(Math.random()*pool.length)];
      roundEl.textContent = `Round ${state.round} / ${TOTAL_ROUNDS}`;

      // render bugs and fresh keypad
      UI.render(bugWrap, bugCluster(state.target));
      UI.render(quiz, numberPad(pick, false));

      // feedback hidden
      feedbackCard.style.display = 'none';
      setLocked(false);
    }

    function pick(n){
      if(state.locked) return;
      setLocked(true);
      const correct = n === state.target;
      App.tracking.recordAnswer(2, `round-${state.round}`, correct ? 1 : 0, {response:n, correct:state.target});

      feedbackText.textContent = correct
        ? `Correct! There ${state.target===1?'is':'are'} ${state.target} bug${state.target===1?'':'s'}.`
        : `Not quite. It was ${state.target}.`;
      feedbackCard.style.display = 'block';

      nextBtn.textContent = state.round >= TOTAL_ROUNDS ? 'See results' : 'Next round';
    }

    nextBtn.addEventListener('click', ()=>{
      if(state.round >= TOTAL_ROUNDS){
        finish();
      }else{
        state.round++;
        newRound();
      }
    });

    // Keyboard: 1..9, 0 -> 10
    root.addEventListener('keydown', (e)=>{
      if(state.locked) return;
      if(/^[0-9]$/.test(e.key)){
        const n = e.key === '0' ? 10 : Number(e.key);
        const btn = $$('.num-btn', quiz).find(b => b.textContent === String(n));
        if(btn){ btn.click(); }
      }
    });

    function finish(){
      const stats = App.tracking.levelStats(2);
      const score = Math.round((stats.correct / Math.max(1, stats.attempts)) * 100);
      App.tracking.completeLevel(2, {passed: score >= 60, score});

      const done = UI.el('section', {className:'game-card'});
      done.append(
        UI.el('h2', {textContent:'Level 2 complete!'}),
        UI.el('p', {textContent:`Score: ${score}.`})
      );
      UI.render(document.getElementById('stage'), UI.el('div',{className:'stage-wrap'}, done));
      setTimeout(()=>App.nav.next(), 800);
    }

    // start
    newRound();
    return root;
  }

  window.Level2 = Level2;
})();
