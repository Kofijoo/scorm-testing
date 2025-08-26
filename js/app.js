(function(){
  const TOTAL_LEVELS = 6;

  const App = {
    currentLevel: 1,

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

      // Start tracking for the level
      this.tracking.startLevel(n);

      let view = null;
      if(n===1) view = window.Level1();
      else view = this.placeholder(n);

      UI.render(document.getElementById('stage'), view);
    },

    placeholder(n){
      const card = UI.el('section', {className:'game-card'});
      card.append(
        UI.el('h1', {textContent: 'Level ' + n}),
        UI.el('p', {textContent: 'Prototype placeholder. Build in M2/M3.'})
      );
      return card;
    },

    nav:{
      back(){ location.hash = '#/level/' + clamp(App.currentLevel-1, 1, TOTAL_LEVELS); },
      next(){ location.hash = '#/level/' + clamp(App.currentLevel+1, 1, TOTAL_LEVELS); }
    }
  };

  window.App = App;

  window.addEventListener('DOMContentLoaded', ()=> App.init());
})();
