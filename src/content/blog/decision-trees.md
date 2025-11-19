---
title: "Decision Trees with Scikit-Learn"
description: "Build interpretable tree-based models with if-else decision rules"
pubDate: 2024-01-18
category: "Machine Learning"
tags: ["Python", "scikit-learn", "Decision Trees", "Machine Learning"]
heroImage: "/assets/Fallout.jpg"
---

# Decision Trees with Scikit-Learn

Decision trees create a model that predicts values by learning simple if-else decision rules from data. They're intuitive, interpretable, and powerful.

## How Decision Trees Work

1. **Split**: Choose best feature to split data
2. **Decide**: Use criterion (Gini or Entropy)
3. **Repeat**: Continue splitting until stopping condition
4. **Predict**: Follow path from root to leaf

## Installation

```bash
pip install scikit-learn numpy pandas matplotlib
```

## Basic Classification Tree

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# Load dataset
iris = load_iris()
X, y = iris.data, iris.target

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# Create and train decision tree
model = DecisionTreeClassifier(
    criterion='gini',
    max_depth=3,
    random_state=42
)
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, 
                           target_names=iris.target_names))
```

## Visualizing the Tree

```python
from sklearn.tree import plot_tree
import matplotlib.pyplot as plt

plt.figure(figsize=(20, 10))
plot_tree(model, 
          feature_names=iris.feature_names,
          class_names=iris.target_names,
          filled=True,
          rounded=True,
          fontsize=10)
plt.title("Decision Tree Visualization")
plt.show()
```

## Export Tree as Text

```python
from sklearn.tree import export_text

tree_rules = export_text(model, feature_names=iris.feature_names)
print(tree_rules)
```

## Regression with Decision Trees

```python
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

# Generate sample data
X = np.sort(5 * np.random.rand(80, 1), axis=0)
y = np.sin(X).ravel() + np.random.normal(0, 0.1, X.shape[0])

# Train regression tree
model_reg = DecisionTreeRegressor(max_depth=5, random_state=42)
model_reg.fit(X, y)

# Predictions
X_test = np.arange(0.0, 5.0, 0.01)[:, np.newaxis]
y_pred = model_reg.predict(X_test)

# Visualize
plt.figure(figsize=(10, 6))
plt.scatter(X, y, s=20, edgecolor="black", c="darkorange", label="data")
plt.plot(X_test, y_pred, color="cornflowerblue", linewidth=2, label="prediction")
plt.xlabel("Data")
plt.ylabel("Target")
plt.title("Decision Tree Regression")
plt.legend()
plt.show()
```

## Real-World Example: Credit Scoring

```python
import pandas as pd
from sklearn.tree import DecisionTreeClassifier

# Sample credit data
data = {
    'age': [25, 45, 35, 50, 23, 40, 60, 33],
    'income': [30000, 80000, 50000, 90000, 25000, 70000, 95000, 45000],
    'credit_score': [600, 750, 680, 800, 550, 720, 780, 650],
    'debt_ratio': [0.5, 0.2, 0.3, 0.15, 0.6, 0.25, 0.1, 0.35],
    'approved': [0, 1, 1, 1, 0, 1, 1, 0]  # 1: approved, 0: rejected
}

df = pd.DataFrame(data)

# Features and target
X = df[['age', 'income', 'credit_score', 'debt_ratio']]
y = df['approved']

# Train model
model = DecisionTreeClassifier(max_depth=3, random_state=42)
model.fit(X, y)

# Predict for new applicant
new_applicant = [[30, 55000, 700, 0.3]]
prediction = model.predict(new_applicant)
probability = model.predict_proba(new_applicant)

print(f"Decision: {'APPROVED' if prediction[0] == 1 else 'REJECTED'}")
print(f"Approval probability: {probability[0][1]:.2%}")
```

## Feature Importance

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
plt.xlabel('Importance')
plt.title('Feature Importance in Decision Tree')
plt.show()
```

## Preventing Overfitting

### Control Tree Depth

```python
# Shallow tree (may underfit)
model_shallow = DecisionTreeClassifier(max_depth=2)

# Deep tree (may overfit)
model_deep = DecisionTreeClassifier(max_depth=10)

# Optimal depth through validation
from sklearn.model_selection import cross_val_score

depths = range(1, 15)
scores = []

for depth in depths:
    model = DecisionTreeClassifier(max_depth=depth, random_state=42)
    score = cross_val_score(model, X, y, cv=5).mean()
    scores.append(score)

optimal_depth = depths[scores.index(max(scores))]
print(f"Optimal depth: {optimal_depth}")
```

### Minimum Samples Split

```python
model = DecisionTreeClassifier(
    max_depth=5,
    min_samples_split=10,  # Min samples to split a node
    min_samples_leaf=5,    # Min samples in a leaf
    random_state=42
)
```

### Pruning with Cost Complexity

```python
# Cost complexity pruning
path = model.cost_complexity_pruning_path(X_train, y_train)
ccp_alphas = path.ccp_alphas

# Train trees with different alpha values
models = []
for ccp_alpha in ccp_alphas:
    model = DecisionTreeClassifier(ccp_alpha=ccp_alpha, random_state=42)
    model.fit(X_train, y_train)
    models.append(model)

# Find best alpha
train_scores = [model.score(X_train, y_train) for model in models]
test_scores = [model.score(X_test, y_test) for model in models]

plt.figure(figsize=(10, 6))
plt.plot(ccp_alphas, train_scores, label="Train", marker='o')
plt.plot(ccp_alphas, test_scores, label="Test", marker='o')
plt.xlabel("Alpha")
plt.ylabel("Accuracy")
plt.legend()
plt.title("Accuracy vs Alpha for Pruning")
plt.show()
```

## Hyperparameter Tuning

```python
from sklearn.model_selection import GridSearchCV

param_grid = {
    'max_depth': [3, 5, 7, 10, None],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
    'criterion': ['gini', 'entropy']
}

grid_search = GridSearchCV(
    DecisionTreeClassifier(random_state=42),
    param_grid,
    cv=5,
    scoring='accuracy',
    n_jobs=-1
)

grid_search.fit(X_train, y_train)

print(f"Best parameters: {grid_search.best_params_}")
print(f"Best score: {grid_search.best_score_:.3f}")
```

## Common Use Cases

- **Credit Scoring**: Loan approval decisions
- **Medical Diagnosis**: Disease prediction
- **Fraud Detection**: Identifying fraudulent transactions
- **Customer Segmentation**: Marketing strategies
- **Risk Assessment**: Insurance underwriting

## Advantages

✅ **Easy to understand and interpret**
✅ **Visualizable decision paths**
✅ **Handles both numerical and categorical data**
✅ **No feature scaling required**
✅ **Captures non-linear relationships**

## Disadvantages

❌ **Prone to overfitting**
❌ **Unstable (small data changes = different tree)**
❌ **Biased with imbalanced data**
❌ **Not optimal for regression**

## Tips for Better Performance

1. **Limit tree depth** to prevent overfitting
2. **Use ensemble methods** (Random Forest, Gradient Boosting)
3. **Prune trees** using cost complexity
4. **Cross-validate** to find optimal parameters
5. **Balance classes** for imbalanced datasets

## Save and Load Model

```python
import joblib

# Save model
joblib.dump(model, 'decision_tree_model.pkl')

# Load model
loaded_model = joblib.load('decision_tree_model.pkl')
predictions = loaded_model.predict(X_test)
```

## Resources

- [Scikit-learn Decision Trees](https://scikit-learn.org/stable/modules/tree.html)
- [Tree Visualization Guide](https://scikit-learn.org/stable/modules/generated/sklearn.tree.plot_tree.html)
- [Decision Tree Tutorial](https://scikit-learn.org/stable/auto_examples/tree/plot_tree_regression.html)
