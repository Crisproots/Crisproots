import pandas as pd
import numpy as np
import os
import re
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, OneHotEncoder, PowerTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.metrics import mean_squared_error, r2_score
import joblib

def clean_col_names(df):
    cols = df.columns
    new_cols = []
    for col in cols:
        new_col = re.sub(r'[^a-zA-Z0-9_]', '', col.strip().replace(' ', '_'))
        new_cols.append(new_col)
    df.columns = new_cols
    return df

def load_aquaponics_data(data_path):
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Data file not found: {data_path}")
    print(f"Loading Aquaponics data from {data_path}...")
    try:
        df = pd.read_csv(data_path)
        df = clean_col_names(df)
        print(f"Successfully loaded {os.path.basename(data_path)} with shape {df.shape}")
        return df
    except Exception as e:
        raise Exception(f"Error loading {os.path.basename(data_path)}: {e}")

def preprocess_aquaponics_data(df):
    print("\nPreprocessing Aquaponics data...")
    if 'created_at' in df.columns:
        df['created_at'] = pd.to_datetime(df['created_at'], errors='coerce')
        df.dropna(subset=['created_at'], inplace=True)
        if not df.empty:
            df['hour'] = df['created_at'].dt.hour
            df['day_of_week'] = df['created_at'].dt.dayofweek
            df['month'] = df['created_at'].dt.month
            df['day'] = df['created_at'].dt.day
            df['year'] = df['created_at'].dt.year
            df['weekofyear'] = df['created_at'].dt.isocalendar().week.astype(int)
            numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
            lag_features_to_consider = [col for col in numeric_cols if col not in ['hour', 'day_of_week', 'month', 'day', 'year', 'weekofyear']]
            df.sort_values(by='created_at', inplace=True)
            for col in lag_features_to_consider:
                 df[f'{col}_lag1'] = df[col].shift(1)
                 df[f'{col}_lag2'] = df[col].shift(2)
        df.drop('created_at', axis=1, inplace=True)
    if 'entry_id' in df.columns:
        df.drop('entry_id', axis=1, inplace=True)
    df = df.loc[:, ~df.columns.str.startswith('Unnamed_')]
    categorical_cols = df.select_dtypes(include='object').columns.tolist()
    categorical_cols = [col for col in categorical_cols if col not in ['Notes', 'Day', 'Date', 'Time']]
    print(f"Identified potential categorical columns for encoding: {categorical_cols}")
    all_possible_features_targets = categorical_cols + df.select_dtypes(include=np.number).columns.tolist() + ['Notes']
    cols_to_drop = [col for col in df.columns if col not in all_possible_features_targets]
    if cols_to_drop:
        print(f"Dropping non-feature/target columns: {cols_to_drop}")
        df.drop(columns=cols_to_drop, inplace=True)
    print(f"Aquaponics DataFrame shape after preprocessing: {df.shape}")
    print("Aquaponics DataFrame info after preprocessing:")
    df.info()
    return df, categorical_cols

def train_and_evaluate_model(df, target, categorical_features, models_dir, model_name_prefix):
    print(f"\nTraining model for: {target}")
    if target not in df.columns or df[target].dropna().empty:
        print(f"Skipping {target}: Target column not found or contains no non-null values.")
        return None
    df_target = df.dropna(subset=[target]).copy()
    features = [col for col in df_target.columns if col != target and col != 'Notes']
    numeric_features = df_target[features].select_dtypes(include=np.number).columns.tolist()
    categorical_features = df_target[features].select_dtypes(include='object').columns.tolist()
    if not features:
        print(f"Skipping {target}: No valid features found after dropping NaNs and excluding target/Notes.")
        return None
    X = df_target[features]
    y = df_target[target]
    if X.empty or y.empty:
        print(f"Skipping {target}: X or y is empty after preprocessing or filtering.")
        return None
    target_transformer = None
    original_y = y.copy()
    if y.min() >= 0 and y.var() > 1e-6:
        print(f"Applying PowerTransformer to target: {target}")
        target_transformer = PowerTransformer(method='yeo-johnson')
        try:
            y = target_transformer.fit_transform(y.values.reshape(-1, 1)).flatten()
        except ValueError as e:
            print(f"Could not apply PowerTransformer to {target}: {e}. Skipping transformation.")
            y = original_y
            target_transformer = None
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='mean')),
        ('scaler', StandardScaler())])
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))])
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)],
        remainder='passthrough')
    pipeline = Pipeline(steps=[('preprocessor', preprocessor),
                               ('regressor', RandomForestRegressor(random_state=42, n_jobs=-1))])
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    try:
        param_grid = {
            'regressor__n_estimators': [100, 200, 300],
            'regressor__max_depth': [None, 10, 20, 30],
            'regressor__min_samples_split': [2, 5, 10]
        }
        grid_search = GridSearchCV(pipeline, param_grid, cv=5, scoring='r2', n_jobs=-1)
        grid_search.fit(X_train, y_train)
        best_model = grid_search.best_estimator_
        print(f"Best parameters for {target}: {grid_search.best_params_}")
        print(f"Best cross-validation R2 score for {target}: {grid_search.best_score_:.4f}")
    except ValueError as e:
        print(f"Error fitting pipeline or GridSearchCV for {target}: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred during model training for {target}: {e}")
        return None
    model_filename = os.path.join(models_dir, f"{model_name_prefix}_{target}.joblib")
    try:
        joblib.dump(best_model, model_filename)
        print(f"Model for {target} saved to {model_filename}")
    except IOError as e:
        print(f"Error saving model for {target} to {model_filename}: {e}")
    try:
        y_pred = best_model.predict(X_test)
        if target_transformer:
            y_pred_original_scale = target_transformer.inverse_transform(y_pred.reshape(-1, 1)).flatten()
            y_test_original_scale = target_transformer.inverse_transform(y_test.reshape(-1, 1)).flatten()
            mse = mean_squared_error(y_test_original_scale, y_pred_original_scale)
            r2 = r2_score(y_test_original_scale, y_pred_original_scale)
            print(f"Evaluation on original scale for {target} (after inverse transform):")
        else:
            mse = mean_squared_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
        print(f"Test Set Mean Squared Error for {target}: {mse:.4f}")
        print(f"Test Set R2 Score for {target}: {r2:.4f}")
        return {"mse": mse, "r2": r2, "best_params": grid_search.best_params_, "cv_r2": grid_search.best_score_}
    except Exception as e:
        print(f"Error evaluating model for {target}: {e}")
        return None

if __name__ == "__main__":
    aquaponics_data_filename = "Aquaponics Water Quality Data.csv"
    data_directory = os.path.join(os.path.dirname(__file__), "data")
    aquaponics_data_path = os.path.join(data_directory, aquaponics_data_filename)
    models_dir = os.path.join(os.path.dirname(__file__), "trained_models_aquaponics")
    aquaponics_preprocessed_path = os.path.join(os.path.dirname(__file__), "preprocessed_aquaponics_data.csv")
    os.makedirs(models_dir, exist_ok=True)
    aquaponics_df = None
    try:
        aquaponics_df_raw = load_aquaponics_data(aquaponics_data_path)
        aquaponics_df, aquaponics_categorical_features = preprocess_aquaponics_data(aquaponics_df_raw)
        try:
            aquaponics_df.to_csv(aquaponics_preprocessed_path, index=False)
            print(f"Preprocessed Aquaponics data saved to {aquaponics_preprocessed_path}")
        except IOError as e:
            print(f"Error saving preprocessed Aquaponics data: {e}")
        aquaponics_target_variables = ["Ammonia_ppm", "pH", "Dissolved_Oxygen_ppm", "Water_Temp_F", "Nitrate_ppm"]
        all_potential_features = [col for col in aquaponics_df.columns if col not in aquaponics_target_variables and col != 'Notes' and not col.startswith('Unnamed_')]
        print("\nStarting ML model development for Aquaponics data...")
        aquaponics_evaluation_results = {}
        for target_var in aquaponics_target_variables:
            results = train_and_evaluate_model(aquaponics_df, target_var, aquaponics_categorical_features, models_dir, "aquaponics")
            if results:
                aquaponics_evaluation_results[target_var] = results
        print("\nML model development for Aquaponics data complete.")
        print("\nAquaponics Evaluation Results:")
        for target, metrics in aquaponics_evaluation_results.items():
            print(f"{target}: Test MSE = {metrics['mse']:.4f}, Test R2 = {metrics['r2']:.4f}, CV R2 = {metrics['cv_r2']:.4f}, Best Params = {metrics['best_params']}")
    except FileNotFoundError as e:
        print(f"Error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred during Aquaponics data processing: {e}")
    print("\nOverall process complete.")