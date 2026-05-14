import os
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

# Thresholds and rules for recommendations
PH_MIN, PH_MAX = 6.5, 8.0
DO_MIN = 4  # Dissolved Oxygen (mg/L)
AMMONIA_MAX = 0.5  # mg/L
NITRATE_MAX = 150  # mg/L
TEMP_MIN, TEMP_MAX = 20, 30  # Celsius

# Column name mapping
COLS = {
    'pH': ['pH', 'PH'],
    'dissolved_oxygen': ['Dissolved Oxygen', 'DISOLVED OXYGEN', 'DO'],
    'ammonia': ['Ammonia', 'AMMONIA'],
    'nitrate': ['Nitrate', 'NITRATE'],
    'temperature': ['Temperature', 'TEMPERATURE'],
    'fish': ['Fish', 'Population', 'Fish_Count', 'Fish Number', 'FishNumber'],
    'plant': ['Plant', 'Plants', 'Crop', 'Crops', 'Plant_Count', 'Plant Number', 'PlantNumber'],
}

DEFAULTS = {
    'pH': 7.0,
    'dissolved_oxygen': 5.0,
    'ammonia': 0.1,
    'nitrate': 50.0,
    'temperature': 25.0,
    'fish': 10,
    'plant': 10,
}

RECOMMENDATIONS = [
    'Ecosystem is balanced',
    'Reduce fish or increase plants',
    'Increase aeration',
    'Increase pH',
    'Decrease pH',
    'Add more plants',
    'Add more fish',
]

# Helper to find or create columns

def find_or_create_col(df, key):
    for n in COLS[key]:
        if n in df.columns:
            return n
    df[key] = DEFAULTS[key]
    return key

# Rule-based recommendation

def get_recommendation(row):
    if (
        (PH_MIN <= row['pH'] <= PH_MAX) and
        (row['dissolved_oxygen'] > DO_MIN) and
        (row['ammonia'] < AMMONIA_MAX) and
        (row['nitrate'] < NITRATE_MAX) and
        (TEMP_MIN <= row['temperature'] <= TEMP_MAX)
    ):
        # Fish:Plant ratio check
        if row['plant'] > 0 and row['fish'] / row['plant'] > 2:
            return 'Add more plants'
        elif row['fish'] > 0 and row['plant'] / row['fish'] > 2:
            return 'Add more fish'
        else:
            return 'Ecosystem is balanced'
    if row['ammonia'] >= AMMONIA_MAX:
        return 'Reduce fish or increase plants'
    if row['dissolved_oxygen'] <= DO_MIN:
        return 'Increase aeration'
    if row['pH'] < PH_MIN:
        return 'Increase pH'
    if row['pH'] > PH_MAX:
        return 'Decrease pH'
    if row['nitrate'] >= NITRATE_MAX:
        return 'Add more plants'
    # Default
    return 'Ecosystem is balanced'

def main():
    data_dir = 'data'
    all_dfs = []
    for fname in os.listdir(data_dir):
        if fname.endswith('.csv'):
            path = os.path.join(data_dir, fname)
            df = pd.read_csv(path)
            # Ensure all needed columns exist
            for key in COLS:
                find_or_create_col(df, key)
            # Apply rules to label recommendations
            df['recommendation'] = df.apply(lambda row: get_recommendation({
                'pH': row[find_or_create_col(df, 'pH')],
                'dissolved_oxygen': row[find_or_create_col(df, 'dissolved_oxygen')],
                'ammonia': row[find_or_create_col(df, 'ammonia')],
                'nitrate': row[find_or_create_col(df, 'nitrate')],
                'temperature': row[find_or_create_col(df, 'temperature')],
                'fish': row[find_or_create_col(df, 'fish')],
                'plant': row[find_or_create_col(df, 'plant')],
            }), axis=1)
            df.to_csv(os.path.join(data_dir, f'labeled_{fname}'), index=False)
            all_dfs.append(df)
    # Combine all for training
    full_df = pd.concat(all_dfs, ignore_index=True)
    # Use only numeric columns except created_at, entry_id, and recommendation as target
    feature_cols = [str(c) for c in full_df.select_dtypes(include='number').columns if c not in ['entry_id']]
    X = full_df[feature_cols].fillna(full_df[feature_cols].mean())
    y = full_df['recommendation']
    X.columns = X.columns.astype(str)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    joblib.dump(clf, 'recommendation_model.joblib')
    print(f"Model trained and saved as recommendation_model.joblib. Test accuracy: {clf.score(X_test, y_test):.3f}")

if __name__ == '__main__':
    main() 