(function(){
  const TOTAL_LEVELS = 6;

  const App = {
    currentLevel: 1,
    tracking: null,

    init(){
      // Progress UI is optional on SCORM shell; guarded in UI.Progress
      UI.Progress.init(TOTAL_LEVELS);
      this.bindUI();
      this.tracking = window.AppTracking;
      this.tracking.startCourse();
      this.routeFromHash();
      window.addEventListener('hashchange', ()=>this.routeFromHash());
    },

    bindUI(){
      const reset = document.getElementById('btn-reset');
      const mute  = document.getElementById('btn-mute');
      const back  = document.getElementById('btn-back');
      const next  = document.getElementById('btn-next');
      const hint  = document.getElementById('btn-hint');

      reset && reset.addEventListener('click', ()=> this.tracking.reset());
      mute  && mute.addEventListener('click', (e)=>{
        const pressed = e.currentTarget.getAttribute('aria-pressed') === 'true';
        e.currentTarget.setAttribute('aria-pressed', String(!pressed));
      });

      back && back.addEventListener('click', ()=> this.nav.back());
      next && next.addEventListener('click', ()=> this.nav.next());
      hint && hint.addEventListener('click', ()=> alert('Try matching by color!'));
    },

    routeFromHash(){
      const match = location.hash.match(/#\/level\/(\d+)/);
      const lvl = match ? clamp(parseInt(match[1],10), 1, TOTAL_LEVELS) : 1;
      this.gotoLevel(lvl);
    },

    gotoLevel(n){
      this.currentLevel = n;
      UI.Progress.update(n);

      const back = document.getElementById('btn-back');
      const next = document.getElementById('btn-next');
      if (back) back.disabled = n<=1;
      if (next) next.disabled = n>=TOTAL_LEVELS;

      // Start tracking for the level
      this.tracking.startLevel(n);

      let view = null;
      if(n===1) view = window.Level1();
      else view = this.placeholder(n);

      UI.render(document.getElementById('stage'), view);
    },

    placeholder(n){
      // Keep placeholders centered like Level 1
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
