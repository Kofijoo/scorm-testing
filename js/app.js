(function(){
  const TOTAL_LEVELS = 6;
  const levelMeta = {
    1: { title: 'Sort the Leaves' },
    2: { title: 'Bug Count' },
    3: { title: 'Recycle Sorter' },
    4: { title: 'Eco Quiz (True/False)' }
  };

  const App = {
    currentLevel: 1,
    tracking: null,

    init(){
      UI.Progress.init(TOTAL_LEVELS);
      this.bindUI();
      this.tracking = window.AppTracking;
      this.tracking.startCourse();
      this.routeFromHash();
      window.addEventListener('hashchange', ()=>this.routeFromHash());
    },

    bindUI(){
      on($('#btn-reset'), 'click', ()=> this.tracking.reset());
      on($('#btn-mute'), 'click', (e)=>{
        const pressed = e.currentTarget.getAttribute('aria-pressed') === 'true';
        e.currentTarget.setAttribute('aria-pressed', String(!pressed));
      });

      on($('#btn-back'), 'click', ()=> this.nav.back());
      on($('#btn-next'), 'click', ()=> this.nav.next());
      on($('#btn-hint'), 'click', ()=> alert('Try matching by color!'));
    },

    routeFromHash(){
      const match = location.hash.match(/#\/level\/(\d+)/);
      const lvl = match ? clamp(parseInt(match[1],10), 1, TOTAL_LEVELS) : 1;
      this.gotoLevel(lvl);
    },

    gotoLevel(n){
      this.currentLevel = n;
      UI.Progress.update(n);
      $('#btn-back').disabled = n<=1;
      $('#btn-next').disabled = n>=TOTAL_LEVELS;
      this.showIntro(n);
    },

    showIntro(n){
      const wrap = UI.el('div', {className:'stage-wrap'});
      const card = UI.el('section', {className:'hero-card'});

      const photo = UI.el('div', {className:'hero-photo'});
      const img = UI.el('img', {
        src: this.characterFor(n),
        alt: `Explorer character for Level ${n}`,
        loading: 'eager',
        decoding: 'async'
      });
      photo.append(img);

      const title = UI.el('h1', {className:'hero-title', textContent: `Level ${n}: ${this.titleFor(n)}`});
      const speech = UI.el('div', {className:'speech', textContent:'Good luck!'});

      const actions = UI.el('div', {className:'hero-actions'});
      const startBtn = UI.el('button', {className:'nav-btn primary', textContent:'Start Level'});
      actions.append(startBtn);

      card.append(photo, title, speech, actions);
      wrap.append(card);
      UI.render(document.getElementById('stage'), wrap);

      startBtn.addEventListener('click', ()=> this.launchLevel(n));
    },

    titleFor(n){ return (levelMeta[n] && levelMeta[n].title) || `Level ${n}`; },
    characterFor(n){
      const idx = ((n - 1) % 9) + 1; // cycle through pic1..pic9
      return `assets/images/pic${idx}.png`;
    },

    launchLevel(n){
      this.tracking.startLevel(n);

      let view = null;
      if(n===1) view = window.Level1();
      else if(n===2) view = window.Level2();
      else if(n===3) view = window.Level3();
      else if(n===4) view = window.Level4();
      else view = this.placeholder(n);

      UI.render(document.getElementById('stage'), view);
    },

    placeholder(n){
      const wrap = UI.el('div', {className:'stage-wrap'});
      const card = UI.el('section', {className:'game-card'});
      card.append(
        UI.el('h1', {textContent: 'Level ' + n}),
        UI.el('p', {textContent: 'Prototype placeholder. Build in M2/M3.'})
      );
      wrap.append(card);
      return wrap;
    },

    nav:{
      back(){ location.hash = '#/level/' + clamp(App.currentLevel-1, 1, TOTAL_LEVELS); },
      next(){ location.hash = '#/level/' + clamp(App.currentLevel+1, 1, TOTAL_LEVELS); }
    }
  };

  window.App = App;
  window.addEventListener('DOMContentLoaded', ()=> App.init());
})();
