import json
import io
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, confusion_matrix, mean_squared_error, mean_absolute_error


def dataset(mission):
    rng = np.random.default_rng(42 + mission)
    n = 360
    if mission == 0:
        sex = rng.choice(['female', 'male'], n)
        age = rng.integers(5, 76, n).astype(float)
        pclass = rng.integers(1, 4, n)
        prob = np.clip(.15 + .43 * (sex == 'female') + .13 * (3 - pclass) + .10 * (age < 16), .05, .95)
        target = (rng.random(n) < prob).astype(int)
        age[rng.choice(n, 48, replace=False)] = np.nan
        return pd.DataFrame({'Age': age, 'Sex': sex, 'Pclass': pclass, 'Survived': target})
    if mission == 1:
        spend = rng.integers(10, 1000, n).astype(float)
        visits = rng.integers(1, 55, n)
        recency = rng.integers(1, 180, n)
        score = spend / 230 + visits / 12 - recency / 60 - 1.8
        target = (rng.random(n) < 1 / (1 + np.exp(-score))).astype(int)
        spend[rng.choice(n, 24, replace=False)] = np.nan
        return pd.DataFrame({'AnnualSpend': spend, 'Visits': visits, 'Recency': recency, 'NextVIP': target})
    distance = rng.uniform(1, 45, n).round(1)
    hour = rng.integers(0, 24, n)
    day = rng.choice(['weekday', 'weekend'], n)
    duration = np.maximum(2, 4 + distance * 1.55 + np.isin(hour, [8, 9, 17, 18, 19]) * 12 + (day == 'weekday') * 3 + rng.normal(0, 3, n)).round(1)
    distance[rng.choice(n, 20, replace=False)] = np.nan
    distance[0] = -4
    return pd.DataFrame({'Distance': distance, 'Hour': hour, 'Day': day, 'Duration': duration})


def run_analysis(mission, stage, strategy='mean', model='forest'):
    if mission not in (0, 1, 2) or stage not in (0, 1, 2, 3):
        raise ValueError('지원하지 않는 미션 또는 단계입니다.')
    if strategy not in ('mean', 'median', 'mode') or model not in ('forest', 'linear'):
        raise ValueError('지원하지 않는 처리 방식입니다.')
    target = ['Survived', 'NextVIP', 'Duration'][mission]
    num = [['Age', 'Pclass'], ['AnnualSpend', 'Visits', 'Recency'], ['Distance', 'Hour']][mission]
    cat = [['Sex'], [], ['Day']][mission]
    filename = ['titanic.csv', 'customers.csv', 'trips.csv'][mission]
    raw = dataset(mission)
    # Identical CSV loading behavior in native Python and browser Python.
    csv = raw.to_csv(index=False)
    namespace = dict(globals())
    namespace['csv_text'] = csv
    intro = f"# 교육용 합성 파일: {filename}\ndf = pd.read_csv(io.StringIO(csv_text))\npreview = df.head(5)\nmissing = df.isna().sum()"
    clean = ''
    if mission == 2:
        clean += "# 음수·0인 거리/소요 시간 기록만 제거합니다. 결측치는 뒤에서 채웁니다.\ndf = df[(df['Distance'].isna() | (df['Distance'] > 0)) & (df['Duration'] > 0)].copy()\n"
    clean += f"X = df.drop(columns=[{target!r}])\ny = df[{target!r}]\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42{', stratify=y' if mission < 2 else ''})\n"
    clean += f"numeric_columns = {num!r}\n"
    reduction = "mode().iloc[0]" if strategy == 'mode' else strategy + '()'
    clean += f"# 학습 데이터에서만 결측치 대체 기준을 구합니다.\nfill_values = X_train[numeric_columns].{reduction}\nX_train[numeric_columns] = X_train[numeric_columns].fillna(fill_values)\nX_test[numeric_columns] = X_test[numeric_columns].fillna(fill_values)\n"
    if cat:
        clean += f"X_train = pd.get_dummies(X_train, columns={cat!r}, dtype=int)\nX_test = pd.get_dummies(X_test, columns={cat!r}, dtype=int)\nX_test = X_test.reindex(columns=X_train.columns, fill_value=0)\n"
    if mission == 1:
        clean += "scaler = StandardScaler()\nX_train[numeric_columns] = scaler.fit_transform(X_train[numeric_columns])\nX_test[numeric_columns] = scaler.transform(X_test[numeric_columns])\n"
    cls = ('RandomForestRegressor' if mission == 2 else 'RandomForestClassifier') if model == 'forest' else ('LinearRegression' if mission == 2 else 'LogisticRegression')
    args = 'n_estimators=80, max_depth=6, random_state=42, n_jobs=1' if model == 'forest' else ('max_iter=1000' if mission < 2 else '')
    train = f"model = {cls}({args})\nmodel.fit(X_train, y_train)"
    evaluate = 'predictions = model.predict(X_test)\n'
    if mission < 2:
        evaluate += "accuracy = accuracy_score(y_test, predictions)\nprecision = precision_score(y_test, predictions, zero_division=0)\nrecall = recall_score(y_test, predictions, zero_division=0)\ncm = confusion_matrix(y_test, predictions, labels=[0, 1])"
    else:
        evaluate += "mae = mean_absolute_error(y_test, predictions)\nrmse = np.sqrt(mean_squared_error(y_test, predictions))"
    codes = [intro, clean, train, evaluate]
    for code in codes[:stage + 1]:
        exec(code, namespace)
    df = namespace['df']
    result = {'code': codes[stage], 'fullCode': 'import io\nimport numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.ensemble import RandomForestClassifier, RandomForestRegressor\nfrom sklearn.linear_model import LogisticRegression, LinearRegression\nfrom sklearn.metrics import accuracy_score, precision_score, recall_score, confusion_matrix, mean_squared_error, mean_absolute_error\n\n' + '\n\n'.join(codes[:stage + 1]), 'rows': len(df), 'columns': len(df.columns), 'csv': csv, 'filename': filename}
    view = df.head(5) if stage == 0 else namespace['X_train'].head(5)
    result['table'] = json.loads(view.to_json(orient='split', index=False))
    if stage == 0:
        result['missing'] = {k: int(v) for k, v in namespace['missing'].items()}
        result['types'] = {k: str(v) for k, v in df.dtypes.items()}
        if mission < 2:
            result['distribution'] = {str(k): int(v) for k, v in df[target].value_counts().sort_index().items()}
        else:
            result['correlation'] = round(float(df[['Distance', 'Duration']].corr().iloc[0, 1]), 3)
    if stage >= 1:
        result['trainCount'] = len(namespace['X_train'])
        result['testCount'] = len(namespace['X_test'])
        result['missingAfter'] = int(namespace['X_train'].isna().sum().sum() + namespace['X_test'].isna().sum().sum())
        result['fillValues'] = {k: round(float(v), 3) for k, v in namespace['fill_values'].items()}
    if stage >= 2:
        result['model'] = cls
    if stage == 3:
        if mission < 2:
            result['metrics'] = {k: round(float(namespace[k]), 4) for k in ('accuracy', 'precision', 'recall')}
            result['confusion'] = namespace['cm'].tolist()
        else:
            result['metrics'] = {k: round(float(namespace[k]), 3) for k in ('mae', 'rmse')}
        pairs = pd.DataFrame({'실제 정답': namespace['y_test'].to_numpy()[:10], '모델 예측': namespace['predictions'][:10]})
        result['table'] = json.loads(pairs.round(2).to_json(orient='split', index=False))
        if model == 'forest':
            result['importance'] = sorted(zip(namespace['X_train'].columns, [round(float(x), 4) for x in namespace['model'].feature_importances_]), key=lambda x: -x[1])
        if mission == 0:
            # Evaluate the trained model for every selectable passenger. The UI
            # uses these exact predictions, never a hand-written probability rule.
            passengers = pd.DataFrame([
                {'Age': age, 'Sex': sex, 'Pclass': cabin}
                for age in range(5, 76) for sex in ('female', 'male') for cabin in (1, 2, 3)
            ])
            encoded = pd.get_dummies(passengers, columns=['Sex'], dtype=int)
            encoded = encoded.reindex(columns=namespace['X_train'].columns, fill_value=0)
            survival_index = list(namespace['model'].classes_).index(1)
            probabilities = namespace['model'].predict_proba(encoded)[:, survival_index]
            result['passengerProbabilities'] = {
                f"{row.Age}:{row.Sex}:{row.Pclass}": round(float(p), 6)
                for row, p in zip(passengers.itertuples(), probabilities)
            }
            result['probabilityCode'] = "new_passenger = pd.DataFrame([{'Age': 28, 'Sex': 'female', 'Pclass': 1}])\nnew_passenger = pd.get_dummies(new_passenger, columns=['Sex'], dtype=int)\nnew_passenger = new_passenger.reindex(columns=X_train.columns, fill_value=0)\nsurvival_column = list(model.classes_).index(1)\nprobability = model.predict_proba(new_passenger)[0, survival_column]"
    return json.dumps(result, ensure_ascii=False, allow_nan=False)
