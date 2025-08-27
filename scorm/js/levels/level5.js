(function(){
  // Canonical rounds where `correct` is greener when shown as (a,b).
  const BASE_ROUNDS = [
    { id:'r1', a:'Ride a Bike 🚲',     b:'Drive a Car 🚗',         correct:'a' },
    { id:'r2', a:'Reuse a Bottle 🧴',  b:'Use One-Time Cup 🥤',    correct:'a' },
    { id:'r3', a:'Short Shower 🚿',    b:'Full Bathtub 🛁',        correct:'a' },
    { id:'r4', a:'Turn Lights Off 💡', b:'Leave Lights On 💡',     correct:'a' },
    { id:'r5', a:'Walk to School 🚶',  b:'Go by Taxi 🚕',          correct:'a' },
    { id:'r6', a:'Recycle Cans ♻️',    b:'Trash the Cans 🗑️',     correct:'a' },
    // more ideas later:
    // { id:'r7', a:'Plant a Tree 🌳', b:'Cut a Tree 🪓', correct:'a' },
  ];

  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Randomize display order so correct can be A or B; ensure not all the same.
  function prepareRounds(base, total){
    const picked = shuffle(base).slice(0, total).map(r => ({...r}));
    const rounds = picked.map(r => {
      const flip = Math.random() < 0.5; // 50/50 put greener on A or B
      return flip
        ? { id:r.id, a:r.b, b:r.a, correct:(r.correct === 'a' ? 'b' : 'a') }
        : { id:r.id, a:r.a, b:r.b, correct:r.correct };
    });

    // Guarantee at least one 'a' and one 'b' correct.
    const countA = rounds.filter(r=>r.correct==='a').length;
    if(countA === 0 || countA === rounds.length){
      const k = Math.floor(Math.random()*rounds.length);
      const r = rounds[k];
      [r.a, r.b] = [r.b, r.a];
      r.correct = (r.correct === 'a') ? 'b' : 'a';
    }
    return rounds;
  }

  function Level5(){
    const TOTAL = 6;
    const rounds = prepareRounds(BASE_ROUNDS, TOTAL);

    const root    = UI.el('div', {className:'stage-wrap'});
    const header  = UI.el('section', {className:'game-card'});
    const roundEl = UI.el('p', {textContent:`Round 1 / ${TOTAL}`});
    header.append(
      UI.el('h1', {textContent:'Level 5: Greener Choice (A/B)'}),
      roundEl,
      UI.el('p', {textContent:'Pick the greener option. Keyboard: 1 or 2.'})
    );

    const card    = UI.el('section', {className:'game-card'});
    const prompt  = UI.el('h2', {textContent:'Which is greener?'});
    const choices = UI.el('div', {className:'row'});
    const btnA    = UI.el('button', {className:'nav-btn', textContent:'', ariaLabel:'Choose option 1'});
    const btnB    = UI.el('button', {className:'nav-btn', textContent:'', ariaLabel:'Choose option 2'});
    choices.append(btnA, btnB);
    card.append(prompt, UI.el('div',{style:'height:8px'}), choices);

    const feedback = UI.el('section', {className:'game-card'});
    const fbText   = UI.el('p', {textContent:' '});
    const nextBtn  = UI.el('button', {className:'nav-btn', textContent:'Next'});
    feedback.style.display = 'none';
    feedback.append(UI.el('h2', {textContent:'Feedback'}), fbText, UI.el('div',{style:'height:8px'}), nextBtn);

    root.append(header, UI.el('div',{style:'height:12px'}), card, UI.el('div',{style:'height:12px'}), feedback);

    const state = { i:0, locked:false };

    function setLocked(v){
      state.locked = v;
      btnA.disabled = v;
      btnB.disabled = v;
    }

    function render(){
      const r = rounds[state.i];
      roundEl.textContent = `Round ${state.i+1} / ${TOTAL}`;
      btnA.textContent = `1) ${r.a}`;
      btnB.textContent = `2) ${r.b}`;
      feedback.style.display = 'none';
      setLocked(false);
    }

    function pick(which){
      if(state.locked) return;
      setLocked(true);
      const r = rounds[state.i];
      const correct = which === r.correct;

      App.tracking.recordAnswer(5, r.id, correct ? 1 : 0, {
        response: which,
        correct:  r.correct,
        a: r.a, b: r.b
      });

      const greener = r.correct === 'a' ? r.a : r.b;
      fbText.textContent = correct ? `Correct! ✅ ${greener} is greener.` : `Not quite. ${greener} is greener.`;
      nextBtn.textContent = (state.i+1 >= TOTAL) ? 'See results' : 'Next';
      feedback.style.display = 'block';
    }

    btnA.addEventListener('click', ()=> pick('a'));
    btnB.addEventListener('click', ()=> pick('b'));

    // Keyboard shortcuts: 1 or 2
    root.addEventListener('keydown', (e)=>{
      if(state.locked) return;
      if(e.key === '1') pick('a');
      else if(e.key === '2') pick('b');
    });

    nextBtn.addEventListener('click', ()=>{
      if(state.i+1 >= TOTAL){
        finish();
      }else{
        state.i++;
        render();
      }
    });

    function finish(){
      const stats = App.tracking.levelStats(5);
      const score = Math.round((stats.correct / Math.max(1, stats.attempts)) * 100);
      App.tracking.completeLevel(5, {passed: score >= 60, score});

      const done = UI.el('section', {className:'game-card'});
      done.append(
        UI.el('h2', {textContent:'Level 5 complete!'}),
        UI.el('p', {textContent:`Score: ${score}.`})
      );
      UI.render(document.getElementById('stage'), UI.el('div',{className:'stage-wrap'}, done));
      setTimeout(()=>App.nav.next(), 800);
    }

    // start
    render();
    return root;
  }

  window.Level5 = Level5;
})();
