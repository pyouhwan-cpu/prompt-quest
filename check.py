import importlib.util
import json
from pathlib import Path
import tempfile
import subprocess
import sys

spec = importlib.util.spec_from_file_location('engine', Path(__file__).parent / 'dist/engine.py')
engine = importlib.util.module_from_spec(spec)
spec.loader.exec_module(engine)

for mission in range(3):
    for stage in range(4):
        r = json.loads(engine.run_analysis(mission, stage))
        assert r['table']['data'] and r['code']
        if stage >= 1:
            assert r['missingAfter'] == 0
            assert r['trainCount'] + r['testCount'] == (359 if mission == 2 else 360)
    for strategy in ('mean', 'median', 'mode'):
        for model in ('forest', 'linear'):
            r = json.loads(engine.run_analysis(mission, 3, strategy, model))
            assert all(v >= 0 for v in r['metrics'].values())
            if mission < 2:
                assert all(v <= 1 for v in r['metrics'].values())
                assert sum(sum(row) for row in r['confusion']) == r['testCount']
            else:
                assert r['metrics']['rmse'] >= r['metrics']['mae']
    r = json.loads(engine.run_analysis(mission, 3))
    repeat = json.loads(engine.run_analysis(mission, 3))
    assert r['metrics'] == repeat['metrics']
    # Downloaded source and CSV must work together independently of the app.
    with tempfile.TemporaryDirectory() as folder:
        path = Path(folder)
        (path / r['filename']).write_text(r['csv'], encoding='utf-8-sig')
        code = r['fullCode'].replace('pd.read_csv(io.StringIO(csv_text))', f"pd.read_csv('{r['filename']}')")
        (path / 'quest.py').write_text(code, encoding='utf-8-sig')
        subprocess.run([sys.executable, 'quest.py'], cwd=path, check=True)
    print(f'Mission {mission + 1}: PASS, metrics={r["metrics"]}')
print('All 12 stages, preprocessing/model variants, reproducibility, and downloaded Python files passed.')
