"""Generate fixed lesson results using the same Python analysis engine."""
import importlib.util
import json
from pathlib import Path

root = Path(__file__).parent
spec = importlib.util.spec_from_file_location('engine', root / 'dist/engine.py')
engine = importlib.util.module_from_spec(spec)
spec.loader.exec_module(engine)
out = root / 'dist/results'
out.mkdir(exist_ok=True)
for mission in range(3):
    for stage in range(1, 4):
        result = json.loads(engine.run_analysis(mission, stage, model='linear' if mission == 1 else 'forest'))
        result['executionMode'] = 'precomputed'
        path = out / f'{mission}-{stage}.json'
        path.write_text(json.dumps(result, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
        print(path.name, path.stat().st_size, 'bytes')
