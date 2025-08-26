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
      const dots = Array.from(document.querySelectorAll('#progress li'));
      dots.forEach((dot, i) => {
        dot.classList.toggle('current', i+1===current);
        dot.classList.toggle('done', i+1<current);
      });
      document.getElementById('progress').dataset.current = String(current);
    }
  };

  function camelToKebab(str){ return str.replace(/([A-Z])/g, '-$1').toLowerCase(); }

  function applyProps(el, props){
    if(!props) return;
    for (const [k, v] of Object.entries(props)){
      if (v == null) continue;

      if (k === 'dataset' && typeof v === 'object'){
        for (const [dk, dv] of Object.entries(v)){
          el.dataset[dk] = dv;
        }
      } else if (k === 'style'){
        if (typeof v === 'string') el.setAttribute('style', v);
        else if (typeof v === 'object') Object.assign(el.style, v);
      } else if (k === 'class' || k === 'className'){
        el.className = v;
      } else if (/^aria[A-Z]/.test(k)){
        // e.g., ariaLabel -> aria-label
        el.setAttribute(camelToKebab(k), v);
      } else if (k in el && k !== 'dataset' && k !== 'style'){
        try { el[k] = v; }
        catch { el.setAttribute(k, v); }
      } else {
        el.setAttribute(k, v);
      }
    }
  }

  const UI = {
    Progress,
    render(container, node){
      container.replaceChildren(node);
      container.focus({preventScroll:true});
    },
    el(tag, props={}, ...kids){
      const n = document.createElement(tag);
      applyProps(n, props);
      for (const kid of kids){ if(kid!=null) n.append(kid); }
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
