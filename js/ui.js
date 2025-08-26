(function(){
  const Progress = {
    init(total=6){
      const ol = document.getElementById('progress');
      ol.innerHTML = '';
      for(let i=1;i<=total;i++){
        const li = document.createElement('li');
        li.setAttribute('role','listitem');
        li.setAttribute('aria-label', 'Level ' + i);
        ol.appendChild(li);
      }
    },
    update(current){
      const dots = $$('#progress li');
      dots.forEach((dot, i) => {
        dot.classList.toggle('current', i+1===current);
        dot.classList.toggle('done', i+1<current);
      });
      $('#progress').dataset.current = String(current);
    }
  };

  const UI = {
    Progress,
    render(container, node){
      container.replaceChildren(node);
      container.focus({preventScroll:true});
    },
    el(tag, props={}, ...kids){
      const n = Object.assign(document.createElement(tag), props);
      for(const k of kids) n.append(k);
      return n;
    },
    toast(msg, timeout=1500){
      const t = this.el('div', {className:'toast', textContent: msg});
      document.body.appendChild(t);
      setTimeout(()=>t.remove(), timeout);
    }
  };

  window.UI = UI;
})();
