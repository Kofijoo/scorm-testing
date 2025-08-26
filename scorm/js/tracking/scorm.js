(function(){
  // Minimal SCORM 1.2 wrapper with safe no-ops outside LMS
  let apiHandle = null;
  let initialized = false;

  function findAPI(win){
    let depth = 0;
    try{
      while((win.API == null) && (win.parent != null) && (win.parent != win) && depth < 500){
        depth++;
        win = win.parent;
      }
    }catch(e){}
    return win.API || null;
  }

  function getAPI(){
    if(apiHandle) return apiHandle;
    apiHandle = findAPI(window) || (window.opener ? findAPI(window.opener) : null);
    return apiHandle;
  }

  const SCORM = {
    initialize(){
      const api = getAPI();
      if(!api){
        console.info('[SCORM] No API found (non-LMS mode).');
        return false;
      }
      if(initialized) return true;
      const ok = api.LMSInitialize("") === "true" || api.LMSInitialize("") === true;
      initialized = !!ok;
      if(ok){
        try{
          api.LMSSetValue("cmi.core.lesson_status", "incomplete");
        }catch(e){}
      }
      return ok;
    },
    setValue(k, v){
      const api = getAPI();
      if(!api) return false;
      try{ return api.LMSSetValue(k, String(v)); }catch(e){ return false; }
    },
    getValue(k){
      const api = getAPI();
      if(!api) return "";
      try{ return api.LMSGetValue(k); }catch(e){ return ""; }
    },
    commit(){
      const api = getAPI();
      if(!api) return false;
      try{ return api.LMSCommit(""); }catch(e){ return false; }
    },
    finish(){
      const api = getAPI();
      if(!api) return false;
      try{ return api.LMSFinish(""); }catch(e){ return false; }
    },
    setStatus(status){
      this.setValue("cmi.core.lesson_status", status);
    },
    setScore(score){
      this.setValue("cmi.core.score.raw", clamp(score,0,100));
    },
    setObjective(idx, score, passed){
      // Optional: map level to SCORM objectives
      try{
        this.setValue(`cmi.objectives.${idx-1}.id`, `level-${idx}`);
        this.setValue(`cmi.objectives.${idx-1}.score.raw`, clamp(score,0,100));
        this.setValue(`cmi.objectives.${idx-1}.status`, passed ? "passed" : "failed");
      }catch(e){}
    }
  };

  window.SCORM = SCORM;
})();
