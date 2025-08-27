(function(){
  // --- Question bank (simple, kid-friendly) ---
  // ans: true for "True", false for "False"
  const QUESTIONS = [
    { id:'q1',  text:'Turning off the lights saves energy.', ans:true },
    { id:'q2',  text:'Throwing plastic in the ocean helps fish.', ans:false },
    { id:'q3',  text:'Trees help clean the air we breathe.', ans:true },
    { id:'q4',  text:'Recycling cans and bottles is bad for Earth.', ans:false },
    { id:'q5',  text:'Short showers save water.', ans:true },
    { id:'q6',  text:'Littering is okay if it is small.', ans:false },
    { id:'q7',  text:'Bikes and walking create no air pollution.', ans:true },
    { id:'q8',  text:'Compost turns food scraps into soil.', ans:true },
    { id:'q9',  text:'Leaving the tap running wastes water.', ans:true },
    { id:'q10', text:'Batteries should go in regular trash.', ans:false },
    { id:'q11', text:'Planting flowers can help bees.', ans:true },
    { id:'q12', text:'We should throw paper in the ocean.', ans:false }
  ];

  function pickN(arr, n){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, n);
  }

  function Level4(){
    const TOTAL = 6;
    const quiz = pickN(QUESTIONS, TOTAL);

    const root    = UI.el('div', {className:'stage-wrap'});
    const header  = UI.el('section', {className:'game-card'});
    const roundEl = UI.el('p', {textContent:`Question 1 / ${TOTAL}`});
    header.append(
      UI.el('h1', {textContent:'Level 4: Eco Quiz (True/False)'}),
      roundEl,
      UI.el('p', {textContent:'Read the sentence and choose True or False. Keyboard: T/F.'})
    );

    const card    = UI.el('section', {className:'game-card'});
    const prompt  = UI.el('h2', {textContent:''});
    const buttons = UI.el('div', {className:'row'});
    const btnTrue = UI.el('button', {className:'nav-btn primary', textContent:'True',  ariaLabel:'Choose True'});
    const btnFalse= UI.el('button', {className:'nav-btn',          textContent:'False', ariaLabel:'Choose False'});
    buttons.append(btnTrue, btnFalse);
    card.append(prompt, UI.el('div',{style:'height:8px'}), buttons);

    const feedbackCard = UI.el('section', {className:'game-card'});
    const feedbackText = UI.el('p', {textContent:' '});
    const nextBtn = UI.el('button', {className:'nav-btn', textContent:'Next'});
    feedbackCard.style.display = 'none';
    feedbackCard.append(UI.el('h2', {textContent:'Feedback'}), feedbackText, UI.el('div',{style:'height:8px'}), nextBtn);

    root.append(header, UI.el('div',{style:'height:12px'}), card, UI.el('div',{style:'height:12px'}), feedbackCard);

    const state = { i:0, locked:false };

    function setLocked(v){
      state.locked = v;
      btnTrue.disabled = v;
      btnFalse.disabled = v;
    }

    function render(){
      const q = quiz[state.i];
      roundEl.textContent = `Question ${state.i+1} / ${TOTAL}`;
      prompt.textContent = q.text;
      feedbackCard.style.display = 'none';
      setLocked(false);
    }

    function answer(choice){
      if(state.locked) return;
      setLocked(true);
      const q = quiz[state.i];
      const correct = choice === q.ans;

      App.tracking.recordAnswer(4, q.id, correct ? 1 : 0, {
        response: choice ? 'true' : 'false',
        correct:  q.ans ? 'true' : 'false'
      });

      feedbackText.textContent = correct ? 'Correct! ✅' : (q.ans ? 'It was True.' : 'It was False.');
      nextBtn.textContent = (state.i+1 >= TOTAL) ? 'See results' : 'Next';
      feedbackCard.style.display = 'block';
    }

    btnTrue.addEventListener('click', ()=> answer(true));
    btnFalse.addEventListener('click', ()=> answer(false));

    root.addEventListener('keydown', (e)=>{
      if(state.locked) return;
      if(e.key.toLowerCase() === 't') answer(true);
      else if(e.key.toLowerCase() === 'f') answer(false);
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
      const stats = App.tracking.levelStats(4);
      const score = Math.round((stats.correct / Math.max(1, stats.attempts)) * 100);
      App.tracking.completeLevel(4, {passed: score >= 60, score});

      const done = UI.el('section', {className:'game-card'});
      done.append(
        UI.el('h2', {textContent:'Level 4 complete!'}),
        UI.el('p', {textContent:`Score: ${score}.`})
      );
      UI.render(document.getElementById('stage'), UI.el('div',{className:'stage-wrap'}, done));
      setTimeout(()=>App.nav.next(), 800);
    }

    // kick off
    render();
    return root;
  }

  window.Level4 = Level4;
})();
