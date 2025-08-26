(function(){
  // --- helpers ---
  function makeLeaf(color, id){
    const el = document.createElement('div');
    el.className = 'leaf';
    el.setAttribute('draggable', 'true');
    el.dataset.color = color;
    el.dataset.id = id;
    el.tabIndex = 0;
    el.setAttribute('role','button');
    el.setAttribute('aria-label', color + ' leaf');
    el.textContent = '🍃';
    return el;
  }

  function pointerDraggable(el){
    let dragging = false, offsetX=0, offsetY=0, ghost=null;

    function onStart(e){
      dragging = true;
      const rect = el.getBoundingClientRect();
      offsetX = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
      offsetY = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

      ghost = el.cloneNode(true);
      Object.assign(ghost.style, {
        position:'fixed',
        pointerEvents:'none',
        opacity:'0.85',
        zIndex:'999',
        transform:'scale(1.05)'
      });
      document.body.appendChild(ghost);
      move(e);
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', end);
      document.addEventListener('touchmove', move, {passive:false});
      document.addEventListener('touchend', end);
    }

    function move(e){
      if(!dragging || !ghost) return;
      const cx = e.clientX || e.touches?.[0]?.clientX;
      const cy = e.clientY || e.touches?.[0]?.clientY;
      if(cx==null || cy==null) return;
      ghost.style.left = (cx - offsetX) + 'px';
      ghost.style.top  = (cy - offsetY) + 'px';
      e.preventDefault?.();
    }

    function end(e){
      if(!dragging) return;
      dragging = false;
      ghost?.remove();
      ghost = null;

      const ptX = e.clientX || e.changedTouches?.[0]?.clientX;
      const ptY = e.clientY || e.changedTouches?.[0]?.clientY;
      const drop = document.elementFromPoint(ptX, ptY);
      const bucket = drop?.closest?.('.bucket');
      if(bucket){
        el.dispatchEvent(new CustomEvent('leaf:drop', {bubbles:true, detail:{bucket}}));
      }
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', end);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', end);
    }

    el.addEventListener('pointerdown', onStart);
    el.addEventListener('touchstart', (e)=>{ e.preventDefault(); onStart(e); }, {passive:false});
  }

  // --- Level view ---
  function Level1(){
    const root = UI.el('div', {className:'stage-wrap'});

    const header = UI.el('section', {className:'game-card'});
    header.append(
      UI.el('h1', {textContent:'Level 1: Sort the Leaves'}),
      UI.el('p', {textContent:'Drag the leaves into the matching baskets. Tip: focus a leaf and press 1, 2, or 3 to drop it by keyboard.'})
    );

    const buckets = ['red','yellow','green'].map(c=>{
      const b = UI.el('div', {className:'bucket', dataset:{color:c}});
      b.setAttribute('aria-label', c + ' basket');
      return b;
    });

    const leafRow = UI.el('div', {className:'row'});
    const colors = ['red','yellow','green','green','red','yellow'];
    const leaves = colors.map((c,i)=> makeLeaf(c, i+1));

    leaves.forEach(l=>{
      pointerDraggable(l);
      l.addEventListener('leaf:drop', (e)=>{
        const chosen = e.detail.bucket.dataset.color;
        const isCorrect = chosen === l.dataset.color;
        App.tracking.recordAnswer(1, 'leaf-'+l.dataset.id, isCorrect ? 1 : 0, {response: chosen, correct: l.dataset.color});
        l.remove();
        const done = header.querySelectorAll('.leaf').length === 0;
        if(done) finish();
      });
      l.addEventListener('keydown', (e)=>{
        if(['1','2','3'].includes(e.key)){
          const idx = Number(e.key)-1;
          const bucket = buckets[idx];
          const chosen = bucket.dataset.color;
          const isCorrect = chosen === l.dataset.color;
          App.tracking.recordAnswer(1, 'leaf-'+l.dataset.id, isCorrect ? 1 : 0, {response: chosen, correct: l.dataset.color});
          l.remove();
          const done = header.querySelectorAll('.leaf').length === 0;
          if(done) finish();
        }
      });
    });

    leafRow.append(...leaves);
    header.append(leafRow);

    const grid = UI.el('div', {className:'grid cols-3'});
    buckets.forEach((b, i)=>{
      const label = ['Red','Yellow','Green'][i];
      const box = UI.el('div', {className:'game-card'});
      box.append(UI.el('h2', {textContent: label + ' Basket'}), b);
      grid.append(box);
    });

    root.append(header, UI.el('div', {style:'height:12px'}), grid);

    function finish(){
      const stats = App.tracking.levelStats(1);
      const score = Math.round((stats.correct / Math.max(1, stats.attempts)) * 100);
      App.tracking.completeLevel(1, {passed: score >= 60, score});

      const doneView = UI.el('div', {className:'game-card'});
      doneView.append(
        UI.el('h2', {textContent:'Nice work!'}),
        UI.el('p', {textContent:`Level 1 complete. Score: ${score}.`})
      );
      UI.render(document.getElementById('stage'), UI.el('div',{className:'stage-wrap'}, doneView));
      setTimeout(()=>App.nav.next(), 600);
    }

    return root;
  }

  window.Level1 = Level1;
})();
