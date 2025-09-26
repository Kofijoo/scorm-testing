(function(){
  // --- drag helper (same pattern as L1) ---
  function pointerDraggable(el){
    let dragging = false, offsetX=0, offsetY=0, ghost=null;

    function onStart(e){
      e.preventDefault();
      dragging = true;
      const rect = el.getBoundingClientRect();
      const clientX = e.clientX || e.touches?.[0]?.clientX;
      const clientY = e.clientY || e.touches?.[0]?.clientY;
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;

      ghost = el.cloneNode(true);
      Object.assign(ghost.style, {
        position:'fixed',
        pointerEvents:'none',
        opacity:'0.85',
        zIndex:'999',
        transform:'scale(1.05)',
        touchAction:'none'
      });
      document.body.appendChild(ghost);
      move(e);
      
      if(e.type === 'touchstart'){
        document.addEventListener('touchmove', move, {passive:false});
        document.addEventListener('touchend', end, {passive:false});
      } else {
        document.addEventListener('pointermove', move);
        document.addEventListener('pointerup', end);
      }
    }

    function move(e){
      if(!dragging || !ghost) return;
      e.preventDefault();
      const cx = e.clientX || e.touches?.[0]?.clientX;
      const cy = e.clientY || e.touches?.[0]?.clientY;
      if(cx==null || cy==null) return;
      ghost.style.left = (cx - offsetX) + 'px';
      ghost.style.top  = (cy - offsetY) + 'px';
    }

    function end(e){
      if(!dragging) return;
      e.preventDefault();
      dragging = false;
      ghost?.remove(); ghost = null;

      const ptX = e.clientX || e.changedTouches?.[0]?.clientX;
      const ptY = e.clientY || e.changedTouches?.[0]?.clientY;
      const drop = document.elementFromPoint(ptX, ptY);
      const bin = drop?.closest?.('.bin');
      if(bin){
        el.dispatchEvent(new CustomEvent('item:drop', {bubbles:true, detail:{bin}}));
      }

      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', end);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', end);
    }

    if('ontouchstart' in window){
      el.addEventListener('touchstart', onStart, {passive:false});
    } else {
      el.addEventListener('pointerdown', onStart);
    }
  }

  // --- level data ---
  // key: item id; bin: recycle | compost | trash
  const ITEMS = [
    {id:'bottle', label:'Plastic Bottle 🧴',  bin:'recycle'},
    {id:'newspaper', label:'Newspaper 🗞️',   bin:'recycle'},
    {id:'can', label:'Tin Can 🥫',           bin:'recycle'},
    {id:'banana', label:'Banana Peel 🍌',    bin:'compost'},
    {id:'apple', label:'Apple Core 🍎',      bin:'compost'},
    {id:'chips', label:'Chip Bag 🧃',        bin:'trash'}, // laminated/plastic film
  ];

  const BIN_META = [
    {key:'recycle', label:'Recycle ♻️'},
    {key:'compost', label:'Compost 🌱'},
    {key:'trash',   label:'Trash 🗑️'}
  ];

  function makeItem(data, idx){
    const el = UI.el('button', {
      className:'nav-btn item',
      textContent: data.label,
      dataset:{ id:data.id, bin:data.bin },
      ariaLabel:`${data.label} draggable`,
    });
    pointerDraggable(el);
    // Keyboard shortcuts: 1=recycle, 2=compost, 3=trash
    el.addEventListener('keydown', (e)=>{
      if(['1','2','3'].includes(e.key)){
        const targetKey = BIN_META[Number(e.key)-1].key;
        el.dispatchEvent(new CustomEvent('item:keydrop', {bubbles:true, detail:{binKey:targetKey}}));
      }
    });
    return el;
  }

  function binBox(meta){
    const box = UI.el('div', {className:'game-card'});
    const bin = UI.el('div', {className:'bin', dataset:{key:meta.key}});
    bin.setAttribute('aria-label', meta.label + ' bin');
    box.append(UI.el('h2', {textContent: meta.label}), bin);
    return {box, bin};
  }

  function Level3(){
    const root = UI.el('div', {className:'stage-wrap'});

    // Header
    const head = UI.el('section', {className:'game-card'});
    head.append(
      UI.el('h1', {textContent:'Level 3: Recycle Sorter'}),
      UI.el('p', {textContent:'Drag items into the correct bin. Keyboard: 1=Recycle, 2=Compost, 3=Trash.'})
    );

    // Items row
    const row = UI.el('div', {className:'row'});
    const items = ITEMS.map((d,i)=> makeItem(d, i));
    items.forEach(el=>{
      // drag drop
      el.addEventListener('item:drop', (e)=>{
        const chosenKey = e.detail.bin.dataset.key;
        judge(el, chosenKey);
      });
      // keyboard drop
      el.addEventListener('item:keydrop', (e)=>{
        judge(el, e.detail.binKey);
      });
    });
    row.append(...items);
    head.append(row);

    // Bins grid
    const grid = UI.el('div', {className:'grid cols-3'});
    const bins = BIN_META.map(meta=> binBox(meta));
    bins.forEach(b=> grid.append(b.box));

    // Feedback card
    const fb = UI.el('section', {className:'game-card'});
    const fbText = UI.el('p', {textContent:' '});
    fb.style.display = 'none';
    fb.append(UI.el('h2', {textContent:'Feedback'}), fbText);

    root.append(head, UI.el('div',{style:'height:12px'}), grid, UI.el('div',{style:'height:12px'}), fb);

    function judge(buttonEl, chosenKey){
      const correctKey = buttonEl.dataset.bin;
      const isCorrect = chosenKey === correctKey;
      const itemId = buttonEl.dataset.id;

      // record attempt
      App.tracking.recordAnswer(3, itemId, isCorrect ? 1 : 0, {response: chosenKey, correct: correctKey});

      // remove the item from row
      buttonEl.remove();

      // simple feedback
      fbText.textContent = isCorrect ? 'Nice job! ✅' : `Oops — that belongs in ${labelFor(correctKey)}.`;
      fb.style.display = 'block';

      // win condition: all items placed
      const remaining = head.querySelectorAll('.item').length;
      if(remaining===0) finish();
    }

    function labelFor(key){ return BIN_META.find(b=>b.key===key)?.label || key; }

    function finish(){
      const stats = App.tracking.levelStats(3);
      const score = Math.round((stats.correct / Math.max(1, stats.attempts)) * 100);
      App.tracking.completeLevel(3, {passed: score >= 60, score});

      const done = UI.el('section', {className:'game-card'});
      done.append(
        UI.el('h2', {textContent:'Level 3 complete!'}),
        UI.el('p', {textContent:`Score: ${score}.`})
      );
      UI.render(document.getElementById('stage'), UI.el('div',{className:'stage-wrap'}, done));
      setTimeout(()=>App.nav.next(), 800);
    }

    return root;
  }

  window.Level3 = Level3;
})();
