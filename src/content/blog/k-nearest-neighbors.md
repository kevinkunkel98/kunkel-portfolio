---
title: "K-Nearest Neighbors with Scikit-Learn"
description: "Learn instance-based learning with K-NN for classification and regression"
pubDate: 2024-01-20
category: "Machine Learning"
tags: ["Python", "scikit-learn", "K-NN", "Classification"]
heroImage: "/assets/Shodan.jpg"
---

# K-Nearest Neighbors with Scikit-Learn

K-Nearest Neighbors (K-NN) is a simple yet powerful algorithm that classifies data points based on the labels of their nearest neighbors. It's intuitive and requires no training phase!

## How K-NN Works

1. **Choose K**: Select number of neighbors to consider
2. **Calculate Distance**: Find K nearest neighbors to new point
3. **Vote**: Classification = majority vote, Regression = average
4. **Predict**: Assign most common class or average value

## Installation

```bash
pip install scikit-learn numpy pandas matplotlib
```

## Basic Classification

```python
from sklearn.neighbors import KNeighborsClassifier
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

# Create K-NN classifier
model = KNeighborsClassifier(
    n_neighbors=5,      # K value
    weights='uniform',  # All neighbors weighted equally
    metric='euclidean'  # Distance metric
)

# Fit and predict (no training, just stores data!)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, 
                           target_names=iris.target_names))
```

## Finding Optimal K Value

```python
import matplotlib.pyplot as plt
from sklearn.model_selection import cross_val_score

# Test different K values
k_values = range(1, 31)
cv_scores = []

for k in k_values:
    knn = KNeighborsClassifier(n_neighbors=k)
    scores = cross_val_score(knn, X_train, y_train, cv=5, scoring='accuracy')
    cv_scores.append(scores.mean())

# Find optimal K
optimal_k = k_values[cv_scores.index(max(cv_scores))]
print(f"Optimal K: {optimal_k}")

# Plot
plt.figure(figsize=(10, 6))
plt.plot(k_values, cv_scores, marker='o')
plt.xlabel('K Value')
plt.ylabel('Cross-Validation Accuracy')
plt.title('Finding Optimal K for K-NN')
plt.grid(True)
plt.axvline(x=optimal_k, color='r', linestyle='--', 
            label=f'Optimal K={optimal_k}')
plt.legend()
plt.show()
```

## Distance Metrics

```python
from sklearn.neighbors import KNeighborsClassifier

# Euclidean distance (default)
model_euclidean = KNeighborsClassifier(n_neighbors=5, metric='euclidean')

# Manhattan distance
model_manhattan = KNeighborsClassifier(n_neighbors=5, metric='manhattan')

# Minkowski distance (p=1 is Manhattan, p=2 is Euclidean)
model_minkowski = KNeighborsClassifier(n_neighbors=5, metric='minkowski', p=3)

# Compare
for name, model in [('Euclidean', model_euclidean), 
                    ('Manhattan', model_manhattan),
                    ('Minkowski', model_minkowski)]:
    model.fit(X_train, y_train)
    accuracy = model.score(X_test, y_test)
    print(f"{name} Distance Accuracy: {accuracy:.3f}")
```

## Weighted K-NN

```python
# Uniform weights (all neighbors equal)
model_uniform = KNeighborsClassifier(n_neighbors=5, weights='uniform')

# Distance weights (closer neighbors matter more)
model_distance = KNeighborsClassifier(n_neighbors=5, weights='distance')

# Compare
model_uniform.fit(X_train, y_train)
model_distance.fit(X_train, y_train)

print(f"Uniform weights accuracy: {model_uniform.score(X_test, y_test):.3f}")
print(f"Distance weights accuracy: {model_distance.score(X_test, y_test):.3f}")
```

## K-NN Regression

```python
from sklearn.neighbors import KNeighborsRegressor
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

# Generate sample data
X = np.sort(5 * np.random.rand(80, 1), axis=0)
y = np.sin(X).ravel() + np.random.normal(0, 0.1, X.shape[0])

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# K-NN Regressor
model_reg = KNeighborsRegressor(n_neighbors=5, weights='distance')
model_reg.fit(X_train, y_train)

# Predict
y_pred = model_reg.predict(X_test)

# Evaluate
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Mean Squared Error: {mse:.3f}")
print(f"R² Score: {r2:.3f}")

# Visualize
X_plot = np.linspace(0, 5, 500)[:, np.newaxis]
y_plot = model_reg.predict(X_plot)

plt.figure(figsize=(10, 6))
plt.scatter(X_train, y_train, color='darkorange', label='Train data')
plt.scatter(X_test, y_test, color='navy', label='Test data')
plt.plot(X_plot, y_plot, color='cornflowerblue', linewidth=2, label='Prediction')
plt.xlabel('X')
plt.ylabel('y')
plt.title('K-NN Regression')
plt.legend()
plt.show()
```

## Real-World Example: Customer Segmentation

```python
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier

# Sample customer data
data = {
    'age': [25, 45, 35, 50, 23, 40, 60, 33, 28, 52],
    'income': [30000, 80000, 50000, 90000, 25000, 70000, 95000, 45000, 35000, 85000],
    'spending_score': [60, 75, 50, 80, 40, 65, 85, 55, 48, 78],
    'segment': [0, 1, 0, 1, 0, 1, 1, 0, 0, 1]  # 0: Budget, 1: Premium
}

df = pd.DataFrame(data)

# Features and target
X = df[['age', 'income', 'spending_score']]
y = df['segment']

# Scale features (important for K-NN!)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train K-NN
model = KNeighborsClassifier(n_neighbors=3, weights='distance')
model.fit(X_scaled, y)

# Predict new customer
new_customer = [[30, 55000, 65]]
new_customer_scaled = scaler.transform(new_customer)
prediction = model.predict(new_customer_scaled)
proba = model.predict_proba(new_customer_scaled)

print(f"Customer segment: {'Premium' if prediction[0] == 1 else 'Budget'}")
print(f"Confidence: {proba[0][prediction[0]]:.2%}")
```

## Feature Scaling is Critical!

```python
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

# Without scaling (BAD!)
model_no_scale = KNeighborsClassifier(n_neighbors=5)
model_no_scale.fit(X_train, y_train)
accuracy_no_scale = model_no_scale.score(X_test, y_test)

# With scaling (GOOD!)
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('knn', KNeighborsClassifier(n_neighbors=5))
])
pipeline.fit(X_train, y_train)
accuracy_with_scale = pipeline.score(X_test, y_test)

print(f"Accuracy without scaling: {accuracy_no_scale:.3f}")
print(f"Accuracy with scaling: {accuracy_with_scale:.3f}")
```

## Visualizing Decision Boundaries

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification

# Generate 2D data for visualization
X, y = make_classification(n_samples=100, n_features=2, 
                          n_redundant=0, n_informative=2,
                          random_state=42, n_clusters_per_class=1)

# Train K-NN
model = KNeighborsClassifier(n_neighbors=5)
model.fit(X, y)

# Create mesh
h = 0.02
x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
xx, yy = np.meshgrid(np.arange(x_min, x_max, h),
                     np.arange(y_min, y_max, h))

# Predict on mesh
Z = model.predict(np.c_[xx.ravel(), yy.ravel()])
Z = Z.reshape(xx.shape)

# Plot
plt.figure(figsize=(10, 6))
plt.contourf(xx, yy, Z, alpha=0.3, cmap='coolwarm')
plt.scatter(X[:, 0], X[:, 1], c=y, cmap='coolwarm', 
            edgecolors='black', s=50)
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.title('K-NN Decision Boundary (K=5)')
plt.show()
```

## Finding Nearest Neighbors

```python
# Get K nearest neighbors for a point
distances, indices = model.kneighbors([[5.0, 3.5, 1.5, 0.2]], n_neighbors=5)

print("Nearest neighbors indices:", indices)
print("Distances:", distances)

# Get the actual neighbor points
neighbors = X_train[indices[0]]
print("Neighbor features:\n", neighbors)
```

## Radius-Based Neighbors

```python
from sklearn.neighbors import RadiusNeighborsClassifier

# Classify based on all neighbors within radius
model_radius = RadiusNeighborsClassifier(radius=1.0, weights='distance')
model_radius.fit(X_train, y_train)

# Predict
y_pred = model_radius.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Radius Neighbors Accuracy: {accuracy:.3f}")
```

## Common Use Cases

- **Recommendation Systems**: Find similar users/products
- **Pattern Recognition**: Handwriting, image recognition
- **Anomaly Detection**: Identify outliers
- **Medical Diagnosis**: Compare patient symptoms
- **Missing Value Imputation**: Fill missing data

## Advantages

✅ **Simple and intuitive**
✅ **No training phase** (lazy learning)
✅ **Works with any number of classes**
✅ **Naturally handles multi-class problems**
✅ **Non-parametric** (no assumptions about data distribution)

## Disadvantages

❌ **Slow predictions** on large datasets
❌ **High memory usage** (stores all training data)
❌ **Sensitive to irrelevant features**
❌ **Requires feature scaling**
❌ **Curse of dimensionality** (poor performance in high dimensions)

## Performance Tips

```python
from sklearn.neighbors import KNeighborsClassifier

# 1. Use appropriate algorithm
model = KNeighborsClassifier(
    n_neighbors=5,
    algorithm='ball_tree',  # Options: 'auto', 'ball_tree', 'kd_tree', 'brute'
    leaf_size=30           # Affects speed of ball_tree/kd_tree
)

# 2. Use parallel processing
model = KNeighborsClassifier(n_neighbors=5, n_jobs=-1)

# 3. Reduce dimensions first
from sklearn.decomposition import PCA

pca = PCA(n_components=10)
X_reduced = pca.fit_transform(X_train)
```

## Handling Imbalanced Data

```python
from imblearn.over_sampling import SMOTE
from sklearn.neighbors import KNeighborsClassifier

# Use SMOTE to balance classes
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_train, y_train)

# Train on balanced data
model = KNeighborsClassifier(n_neighbors=5)
model.fit(X_resampled, y_resampled)
```

## Save and Load Model

```python
import joblib

# Save model
joblib.dump(model, 'knn_model.pkl')

# Load model
loaded_model = joblib.load('knn_model.pkl')
predictions = loaded_model.predict(X_test)
```

## Resources

- [Scikit-learn K-NN Documentation](https://scikit-learn.org/stable/modules/neighbors.html)
- [K-NN Classifier Guide](https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsClassifier.html)
- [Distance Metrics in Scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise_distances.html)
