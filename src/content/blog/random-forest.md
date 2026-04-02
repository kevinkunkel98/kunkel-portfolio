---
title: "Random Forest with Scikit-Learn"
description: "Harness ensemble learning with Random Forest for powerful predictions"
pubDate: 2024-01-19
category: "Machine Learning"
tags: ["Python", "scikit-learn", "Random Forest", "Ensemble Learning"]
heroImage: "/assets/kderice.jpeg"
---

# Random Forest with Scikit-Learn

Random Forest is an ensemble learning method that combines multiple decision trees to create a more robust and accurate model. It's one of the most popular ML algorithms.

## How Random Forest Works

1. **Bootstrap Sampling**: Create multiple subsets of data
2. **Build Trees**: Train decision tree on each subset
3. **Random Features**: Consider random subset of features per split
4. **Aggregate**: Average predictions (regression) or vote (classification)

## Installation

```bash
pip install scikit-learn numpy pandas matplotlib seaborn
```

## Basic Classification

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# Load data
iris = load_iris()
X, y = iris.data, iris.target

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# Create Random Forest
model = RandomForestClassifier(
    n_estimators=100,      # Number of trees
    max_depth=5,           # Max tree depth
    random_state=42,
    n_jobs=-1              # Use all CPU cores
)

# Train
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)

print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred,
                           target_names=iris.target_names))
```

## Feature Importance Analysis

```python
import pandas as pd
import matplotlib.pyplot as plt

# Get feature importances
feature_importance = pd.DataFrame({
    'feature': iris.feature_names,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print(feature_importance)

# Visualize
plt.figure(figsize=(10, 6))
plt.barh(feature_importance['feature'], feature_importance['importance'])
plt.xlabel('Importance Score')
plt.ylabel('Features')
plt.title('Feature Importance in Random Forest')
plt.tight_layout()
plt.show()
```

## Regression with Random Forest

```python
from sklearn.ensemble import RandomForestRegressor
from sklearn.datasets import make_regression
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

# Generate data
X, y = make_regression(n_samples=1000, n_features=10,
                       noise=10, random_state=42)

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# Train Random Forest Regressor
model_reg = RandomForestRegressor(
    n_estimators=100,
    max_depth=10,
    random_state=42,
    n_jobs=-1
)

model_reg.fit(X_train, y_train)

# Predict
y_pred = model_reg.predict(X_test)

# Evaluate
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Mean Squared Error: {mse:.2f}")
print(f"R² Score: {r2:.3f}")
```

## Real-World Example: House Price Prediction

```python
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

# Sample housing data
data = {
    'square_feet': [1500, 1600, 1700, 1875, 1100, 1550, 2350, 2450, 1800, 2100],
    'bedrooms': [3, 3, 2, 4, 2, 3, 4, 4, 3, 3],
    'bathrooms': [2, 2, 1, 3, 1, 2, 3, 3, 2, 2],
    'age': [10, 5, 15, 8, 20, 12, 3, 2, 7, 6],
    'location_score': [7, 8, 6, 9, 5, 7, 9, 9, 8, 8],
    'price': [245000, 312000, 279000, 408000, 199000, 219000, 505000, 524000, 320000, 380000]
}

df = pd.DataFrame(data)

# Features and target
X = df.drop('price', axis=1)
y = df['price']

# Train Random Forest
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

# Predict new house
new_house = pd.DataFrame({
    'square_feet': [2000],
    'bedrooms': [3],
    'bathrooms': [2],
    'age': [5],
    'location_score': [8]
})

predicted_price = model.predict(new_house)
print(f"Predicted Price: ${predicted_price[0]:,.2f}")

# Feature importance for price prediction
for feature, importance in zip(X.columns, model.feature_importances_):
    print(f"{feature}: {importance:.3f}")
```

## Out-of-Bag (OOB) Score

```python
# Enable OOB scoring (only works with bootstrap=True)
model = RandomForestClassifier(
    n_estimators=100,
    oob_score=True,
    random_state=42
)

model.fit(X_train, y_train)

print(f"OOB Score: {model.oob_score_:.3f}")
print(f"Test Score: {model.score(X_test, y_test):.3f}")
```

## Hyperparameter Tuning

```python
from sklearn.model_selection import RandomizedSearchCV
import numpy as np

# Define parameter distribution
param_distributions = {
    'n_estimators': [50, 100, 200, 300],
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
    'max_features': ['sqrt', 'log2', None],
    'bootstrap': [True, False]
}

# Randomized search
random_search = RandomizedSearchCV(
    RandomForestClassifier(random_state=42),
    param_distributions,
    n_iter=20,
    cv=5,
    scoring='accuracy',
    n_jobs=-1,
    random_state=42
)

random_search.fit(X_train, y_train)

print(f"Best parameters: {random_search.best_params_}")
print(f"Best cross-validation score: {random_search.best_score_:.3f}")

# Use best model
best_model = random_search.best_estimator_
```

## Analyzing Individual Trees

```python
from sklearn.tree import plot_tree

# Get a single tree from the forest
single_tree = model.estimators_[0]

# Plot it
plt.figure(figsize=(20, 10))
plot_tree(single_tree,
          feature_names=iris.feature_names,
          class_names=iris.target_names,
          filled=True,
          rounded=True,
          max_depth=3)
plt.title("One Tree from Random Forest")
plt.show()
```

## Cross-Validation for Model Stability

```python
from sklearn.model_selection import cross_val_score

# 5-fold cross-validation
cv_scores = cross_val_score(
    model, X, y,
    cv=5,
    scoring='accuracy'
)

print(f"Cross-validation scores: {cv_scores}")
print(f"Mean CV accuracy: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")
```

## Handling Imbalanced Data

```python
from sklearn.ensemble import RandomForestClassifier

# Use class_weight parameter
model_balanced = RandomForestClassifier(
    n_estimators=100,
    class_weight='balanced',  # Automatically adjust weights
    random_state=42
)

# Or specify custom weights
model_custom = RandomForestClassifier(
    n_estimators=100,
    class_weight={0: 1, 1: 10},  # Give more weight to class 1
    random_state=42
)
```

## Partial Dependence Plots

```python
from sklearn.inspection import PartialDependenceDisplay

# Show how predictions change with feature values
features_to_plot = [0, 1]  # Feature indices
PartialDependenceDisplay.from_estimator(
    model, X_train, features_to_plot,
    feature_names=iris.feature_names
)
plt.tight_layout()
plt.show()
```

## Saving and Loading Models

```python
import joblib

# Save model
joblib.dump(model, 'random_forest_model.pkl')

# Load model
loaded_model = joblib.load('random_forest_model.pkl')
predictions = loaded_model.predict(X_test)
```

## Real-World Use Cases

- **Customer Churn Prediction**: Identify customers likely to leave
- **Fraud Detection**: Flag suspicious transactions
- **Medical Diagnosis**: Disease prediction from symptoms
- **Stock Price Prediction**: Financial forecasting
- **Recommendation Systems**: Product recommendations
- **Image Classification**: Computer vision tasks

## Advantages

✅ **Reduces overfitting** compared to single decision trees
✅ **Handles missing values** well
✅ **Works with both classification and regression**
✅ **Provides feature importance**
✅ **Robust to outliers**
✅ **Parallel training** (fast on multi-core systems)

## Disadvantages

❌ **Less interpretable** than single decision tree
❌ **Slower predictions** than linear models
❌ **Larger model size** (multiple trees)
❌ **Not great for extrapolation** in regression

## Performance Tips

```python
# 1. Use n_jobs=-1 for parallel processing
model = RandomForestClassifier(n_estimators=100, n_jobs=-1)

# 2. Limit tree depth to reduce overfitting
model = RandomForestClassifier(max_depth=10)

# 3. Use fewer trees for faster training (100-200 is usually enough)
model = RandomForestClassifier(n_estimators=100)

# 4. Sample fewer features per split for more diversity
model = RandomForestClassifier(max_features='sqrt')
```

## Comparing with Other Models

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import GradientBoostingClassifier
import time

models = {
    'Decision Tree': DecisionTreeClassifier(),
    'Random Forest': RandomForestClassifier(n_estimators=100),
    'Gradient Boosting': GradientBoostingClassifier(n_estimators=100)
}

for name, model in models.items():
    start = time.time()
    model.fit(X_train, y_train)
    train_time = time.time() - start

    accuracy = model.score(X_test, y_test)
    print(f"{name}:")
    print(f"  Accuracy: {accuracy:.3f}")
    print(f"  Training time: {train_time:.2f}s\n")
```

## Resources

- [Scikit-learn Random Forest](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html)
- [Ensemble Methods Guide](https://scikit-learn.org/stable/modules/ensemble.html)
- [Understanding Random Forest](https://scikit-learn.org/stable/auto_examples/ensemble/plot_forest_importances.html)
