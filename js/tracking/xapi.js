(function(){
  // xAPI lightweight sender. No-ops if not configured.
  const cfg = {
    endpoint: window.XAPI_ENDPOINT || null,           // e.g., "https://lrs.example.com/xapi/"
    auth: window.XAPI_AUTH || null,                   // "Basic <base64>"
    actor: window.XAPI_ACTOR || null,                 // { mbox: "mailto:you@example.com", name: "Your Name" }
    activityBase: location.origin + location.pathname // used for object ids
  };

  function send(stmt){
    if(!cfg.endpoint || !cfg.auth || !cfg.actor){
      console.info('[xAPI] Not configured — statement would be:', stmt);
      return Promise.resolve({ok:true, skipped:true});
    }
    const full = Object.assign({ actor: cfg.actor, timestamp: new Date().toISOString(), version:"1.0.3" }, stmt);
    return fetch(cfg.endpoint + 'statements', {
      method:'POST',
      headers: { 'Content-Type':'application/json', 'Authorization': cfg.auth, 'X-Experience-API-Version':'1.0.3' },
      body: JSON.stringify(full)
    }).then(r=>r.ok ? r.json() : r.text().then(t=>Promise.reject(new Error(t))));
  }

  const XAPI = {
    initialized(){
      return send({
        verb:{ id:"http://adlnet.gov/expapi/verbs/initialized", display:{ "en-US":"initialized" }},
        object:{ id: cfg.activityBase + "#course", definition:{ name:{ "en-US":"Eco Explorers" }}}
      });
    },
    interacted(level, action){
      return send({
        verb:{ id:"http://adlnet.gov/expapi/verbs/interacted", display:{ "en-US":"interacted" }},
        object:{ id: cfg.activityBase + "#level-" + level, definition:{ name:{ "en-US":"Level " + level } } },
        context:{ contextActivities:{ parent:[{ id: cfg.activityBase + "#course" }] } },
        result:{ response: action }
      });
    },
    answered(level, itemId, score, extras){
      return send({
        verb:{ id:"http://adlnet.gov/expapi/verbs/answered", display:{ "en-US":"answered" }},
        object:{ id: cfg.activityBase + "#level-" + level + "/item/" + itemId },
        result:{ score:{ raw: Number(score) }, response: extras.response, extensions: extras }
      });
    },
    completedLevel(level, levelState){
      return send({
        verb:{ id:"http://adlnet.gov/expapi/verbs/completed", display:{ "en-US":"completed" }},
        object:{ id: cfg.activityBase + "#level-" + level, definition:{ name:{ "en-US":"Level " + level } } },
        result:{ completion:true, success: !!levelState.passed, score:{ raw: levelState.score0to100 } }
      });
    },
    completedCourse(course){
      return send({
        verb:{ id:"http://adlnet.gov/expapi/verbs/completed", display:{ "en-US":"completed" }},
        object:{ id: cfg.activityBase + "#course" },
        result:{ completion:true, success: !!(course.totalScore>=60), score:{ raw: course.totalScore } }
      });
    }
  };

  window.XAPI = XAPI;
})();
