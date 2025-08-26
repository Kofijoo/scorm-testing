(function(){
  const STORAGE_KEY = 'eco-explorers-v1';

  const Tracking = {
    state: {
      course: { startedAt:null, endedAt:null, completed:false, totalScore:0, totalTimeSec:0 },
      levels: {
        1:{ attempts:0, correct:0, incorrect:0, startedAt:null, endedAt:null, passed:false, score0to100:0, timeSec:0 },
        2:{ attempts:0, correct:0, incorrect:0, startedAt:null, endedAt:null, passed:false, score0to100:0, timeSec:0 },
        3:{ attempts:0, correct:0, incorrect:0, startedAt:null, endedAt:null, passed:false, score0to100:0, timeSec:0 },
        4:{ attempts:0, correct:0, incorrect:0, startedAt:null, endedAt:null, passed:false, score0to100:0, timeSec:0 },
        5:{ attempts:0, correct:0, incorrect:0, startedAt:null, endedAt:null, passed:false, score0to100:0, timeSec:0 },
        6:{ attempts:0, correct:0, incorrect:0, startedAt:null, endedAt:null, passed:false, score0to100:0, timeSec:0 }
      }
    },

    load(){
      try{
        const raw = localStorage.getItem(STORAGE_KEY);
        if(raw) this.state = JSON.parse(raw);
      }catch(e){ console.warn('tracking load failed', e); }
    },
    save(){
      try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state)); }catch(e){}
    },

    startCourse(){
      this.load();
      if(!this.state.course.startedAt){
        this.state.course.startedAt = new Date().toISOString();
        this.save();
      }
      SCORM.initialize();
      XAPI.initialized();
    },

    startLevel(n){
      const l = this.state.levels[n];
      if(!l.startedAt) l.startedAt = new Date().toISOString();
      this.save();
      XAPI.interacted(n, 'level-start');
    },

    recordAnswer(levelId, itemId, score, extras={}){
      const l = this.state.levels[levelId];
      l.attempts++;
      if(score>0) l.correct++; else l.incorrect++;
      this.save();
      XAPI.answered(levelId, itemId, score, extras);
    },

    levelStats(n){
      return this.state.levels[n];
    },

    completeLevel(n, {passed=false, score=0}={}){
      const l = this.state.levels[n];
      if(!l.startedAt) l.startedAt = new Date().toISOString();
      l.endedAt = new Date().toISOString();
      l.passed = !!passed;
      l.score0to100 = Math.round(score);
      this.save();

      // Aggregate score as average of completed level scores
      const scores = Object.values(this.state.levels).map(x=>x.score0to100 || 0);
      const completedCount = scores.filter(s=>s>0).length;
      const totalScore = completedCount ? Math.round(scores.reduce((a,b)=>a+b,0)/completedCount) : 0;
      this.state.course.totalScore = totalScore;
      this.save();

      XAPI.completedLevel(n, l);
      SCORM.setScore(totalScore);
      SCORM.setObjective(n, l.score0to100, l.passed);
      SCORM.commit();
    },

    completeCourse(){
      this.state.course.endedAt = new Date().toISOString();
      this.state.course.completed = true;
      this.save();
      const status = this.state.course.totalScore >= 60 ? 'passed' : 'failed';
      XAPI.completedCourse(this.state.course);
      SCORM.setStatus(this.state.course.totalScore >= 60 ? 'passed' : 'completed');
      if(status==='failed') SCORM.setStatus('failed');
      SCORM.finish();
    },

    reset(){
      localStorage.removeItem(STORAGE_KEY);
      this.state = JSON.parse(JSON.stringify(Tracking.state));
      location.reload();
    }
  };

  window.AppTracking = Tracking;
})();
