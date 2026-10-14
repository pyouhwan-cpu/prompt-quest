let runtime;
self.onmessage = async ({data}) => {
  try {
    if (!runtime) {
      self.postMessage({status:'빈칸을 채우고 공부할 계산 도구를 준비하고 있어요. 처음 한 번은 1~2분 걸릴 수 있어요.'});
      const {loadPyodide} = await import('https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs');
      runtime = await loadPyodide();
      self.postMessage({status:'필요한 도구를 불러오고 있어요. 이 화면에서 조금만 기다려주세요…'});
      await runtime.loadPackage(['pandas','scikit-learn']);
      const response = await fetch('./engine.py?v=9');
      if (!response.ok) throw new Error('분석 파일을 불러오지 못했습니다.');
      await runtime.runPythonAsync(await response.text());
    }
    self.postMessage({status:'기록을 읽고 계산하고 있어요…'});
    runtime.globals.set('quest_mission', data.mission);
    runtime.globals.set('quest_stage', data.stage);
    runtime.globals.set('quest_strategy', data.strategy);
    runtime.globals.set('quest_model', data.model);
    const result = await runtime.runPythonAsync('run_analysis(quest_mission, quest_stage, quest_strategy, quest_model)');
    self.postMessage({result:JSON.parse(result)});
  } catch (error) {
    runtime = undefined;
    self.postMessage({error:String(error.message || error)});
  }
};
