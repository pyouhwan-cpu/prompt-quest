import importlib.util
import json
from pathlib import Path
spec=importlib.util.spec_from_file_location('engine','dist/engine.py')
engine=importlib.util.module_from_spec(spec);spec.loader.exec_module(engine)
r=json.loads(engine.run_analysis(0,3))
assert len(r['passengerProbabilities'])==71*2*3
assert all(0<=p<=1 for p in r['passengerProbabilities'].values())
# Independently execute the exported training code and compare direct inference.
ns={'csv_text':r['csv']};exec(r['fullCode'],ns);exec(r['probabilityCode'],ns)
assert abs(ns['probability']-r['passengerProbabilities']['28:female:1'])<1e-6
assert len(set(r['passengerProbabilities'].values()))>10
fixtures=[[json.loads(engine.run_analysis(m,s,model='linear' if m==1 else 'forest')) for s in range(4)] for m in range(3)]
Path('.qa/results.json').write_text(json.dumps(fixtures,ensure_ascii=False),encoding='utf-8')
print('PASS: 426 valid probabilities, direct model parity, variation, refreshed DOM fixtures.')
