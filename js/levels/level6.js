(function(){
  // --- Banks ---
  const TF_BANK = [
    { id:'tf1', text:'Using reusable bags reduces plastic waste.', ans:true },
    { id:'tf2', text:'Burning trash is good for the air.',        ans:false },
    { id:'tf3', text:'Turn off the tap while brushing teeth.',     ans:true },
    { id:'tf4', text:'Batteries belong in compost.',               ans:false },
    { id:'tf5', text:'Trees give us oxygen.',                      ans:true },
    { id:'tf6', text:'Littering helps animals find food.',         ans:false }
  ];

  // correct is greener: 'a' or 'b'
  const AB_BANK = [
    { id:'ab1', a:'Plant a tree 🌳',       b:'Pick a flower 🌼',         correct:'a' },
    { id:'ab2', a:'Use a lunchbox 🥪',     b:'Plastic wrap every day 🧻', correct:'a' },
    { id:'ab3', a:'Take the bus 🚌',       b:'Ride alone in a car 🚗',    correct:'a' },
    { id:'ab4', a:'Refill a bottle 🧴',    b:'Buy new bottles daily 🛒',  correct:'a' },
    { id:'ab5', a:'Short shower 🚿',       b:'Full bathtub 🛁',           correct:'a' },
    { id:'ab6', a:'Recycle cans ♻️',       b:'Trash the cans 🗑️',        correct:'a' }
  ];

  function shuffle(a){
    const arr=a.slice();
    for(let i=arr.length-1;i>0;i--){ const j=Math.random()* (i+1) | 0; [arr[i],arr[j]]=[arr[j],arr[i]]; }
    return arr;
  }

  // Prepare a mixed set of N questions
  function prepareMixed(n){
    const tfPicked = shuffle(TF_BANK).slice(0, Math.max(2, Math.floor(n/2)));
    const abPicked = shuffle(AB_BANK).slice(0, n - tfPicked.length).map(q=> {
      // randomize A/B position so correct isn’t always 'a'
      if(Math.random()<0.5){ return { id:q.id, type:'ab', a:q.b, b:q.a, correct:(q.correct==='a'?'b':'a') }; }
      return { id:q.id, type:'ab', a:q.a, b:q.b, correct:q.correct };
    });
    const tfMapped = tfPicked.map(q=> ({ id:q.id, type:'tf', text:q.text, ans:q.ans }));
    return shuffle(tfMapped.concat(abPicked)).slice(0, n);
  }

  function Level6(){
    const TOTAL = 6;
    const deck = prepareMixed(TOTAL);

    const root    = UI.el('div', {className:'stage-wrap'});
    const header  = UI.el('section', {className:'game-card'});
    const roundEl = UI.el('p', {textContent:`Question 1 / ${TOTAL}`});
    header.append(
      UI.el('h1', {textContent:'Level 6: Final Challenge'}),
      roundEl,
      UI.el('p', {textContent:'Answer the questions. Keyboard: T/F for True/False, 1/2 for A/B.'})
    );

    // Dynamic card area
    const card = UI.el('section', {className:'game-card'});
    const prompt = UI.el('h2', {textContent:''});
    const controls = UI.el('div', {className:'row'});
    card.append(prompt, UI.el('div',{style:'height:8px'}), controls);

    // Feedback
    const feedback = UI.el('section', {className:'game-card'});
    const fbText = UI.el('p', {textContent:' '});
    const nextBtn = UI.el('button', {className:'nav-btn', textContent:'Next'});
    feedback.style.display = 'none';
    feedback.append(UI.el('h2', {textContent:'Feedback'}), fbText, UI.el('div',{style:'height:8px'}), nextBtn);

    root.append(header, UI.el('div',{style:'height:12px'}), card, UI.el('div',{style:'height:12px'}), feedback);

    const state = { i:0, locked:false };

    function setLocked(v){
      state.locked = v;
      $$('button', controls).forEach(b=> b.disabled = v);
    }

    function render(){
      const q = deck[state.i];
      roundEl.textContent = `Question ${state.i+1} / ${TOTAL}`;
      controls.replaceChildren(); // clear
      feedback.style.display = 'none';
      setLocked(false);

      if(q.type === 'tf'){
        prompt.textContent = q.text;
        const btnT = UI.el('button', {className:'nav-btn', textContent:'True',  ariaLabel:'Choose True'});
        const btnF = UI.el('button', {className:'nav-btn', textContent:'False', ariaLabel:'Choose False'});
        btnT.addEventListener('click', ()=> chooseTF(true));
        btnF.addEventListener('click', ()=> chooseTF(false));
        controls.append(btnT, btnF);
      } else { // ab
        prompt.textContent = 'Which is greener?';
        const btnA = UI.el('button', {className:'nav-btn', textContent:`1) ${q.a}`, ariaLabel:'Choose option 1'});
        const btnB = UI.el('button', {className:'nav-btn', textContent:`2) ${q.b}`, ariaLabel:'Choose option 2'});
        btnA.addEventListener('click', ()=> chooseAB('a'));
        btnB.addEventListener('click', ()=> chooseAB('b'));
        controls.append(btnA, btnB);
      }
    }

    function chooseTF(choice){
      if(state.locked) return;
      setLocked(true);
      const q = deck[state.i];
      const correct = choice === q.ans;
      App.tracking.recordAnswer(6, q.id, correct ? 1 : 0, {type:'tf', response: choice?'true':'false', correct: q.ans?'true':'false'});
      fbText.textContent = correct ? 'Correct! ✅' : (q.ans ? 'It was True.' : 'It was False.');
      showNext();
    }

    function chooseAB(which){
      if(state.locked) return;
      setLocked(true);
      const q = deck[state.i];
      const correct = which === q.correct;
      App.tracking.recordAnswer(6, q.id, correct ? 1 : 0, {type:'ab', response: which, correct: q.correct, a:q.a, b:q.b});
      const greener = q.correct==='a' ? q.a : q.b;
      fbText.textContent = correct ? `Correct! ✅ ${greener} is greener.` : `Not quite. ${greener} is greener.`;
      showNext();
    }

    function showNext(){
      nextBtn.textContent = (state.i+1 >= TOTAL) ? 'Finish' : 'Next';
      feedback.style.display = 'block';
    }

    nextBtn.addEventListener('click', ()=>{
      if(state.i+1 >= TOTAL){
        finish();
      }else{
        state.i++;
        render();
      }
    });

    // Keyboard shortcuts
    root.addEventListener('keydown', (e)=>{
      if(state.locked) return;
      const q = deck[state.i];
      if(q.type==='tf'){
        if(e.key.toLowerCase()==='t') chooseTF(true);
        else if(e.key.toLowerCase()==='f') chooseTF(false);
      }else{
        if(e.key==='1') chooseAB('a');
        else if(e.key==='2') chooseAB('b');
      }
    });

    function finish(){
      const stats = App.tracking.levelStats(6);
      const score = Math.round((stats.correct / Math.max(1, stats.attempts)) * 100);
      App.tracking.completeLevel(6, {passed: score >= 60, score});

      // Certificate/summary
      const wrap = UI.el('div', {className:'stage-wrap'});
      const cert = UI.el('section', {className:'game-card'});
      const total = App.tracking.state.course.totalScore || score;

      cert.append(
        UI.el('h2', {textContent:'🎉 Eco Explorers — Course Complete'}),
        UI.el('p',  {textContent:`Level 6 score: ${score}.`}),
        UI.el('p',  {textContent:`Overall score (avg of levels): ${total}.`})
      );

      const actions = UI.el('div', {className:'row'});
      const finishBtn = UI.el('button', {className:'nav-btn primary', textContent:'Finish Course'});
      const restartBtn= UI.el('button', {className:'nav-btn', textContent:'Restart'});
      actions.append(finishBtn, restartBtn);
      cert.append(UI.el('div',{style:'height:8px'}), actions);

      finishBtn.addEventListener('click', ()=>{
        App.tracking.completeCourse();
        finishBtn.disabled = true;
        finishBtn.textContent = 'Finished ✔';
      });
      restartBtn.addEventListener('click', ()=> location.hash = '#/level/1');

      UI.render(document.getElementById('stage'), wrap);
      wrap.append(cert);
    }

    // start
    render();
    return root;
  }

  window.Level6 = Level6;
})();
