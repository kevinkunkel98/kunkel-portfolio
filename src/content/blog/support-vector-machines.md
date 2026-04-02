---
title: "Support Vector Machines with Scikit-Learn"
description: "Learn how to use SVM for classification by finding the optimal decision boundary"
pubDate: 2024-01-17
category: "Machine Learning"
tags: ["Python", "scikit-learn", "SVM", "Classification"]
heroImage: "/assets/CyberPunk.jpg"
---

# Support Vector Machines with Scikit-Learn

Support Vector Machines (SVM) find the optimal hyperplane that maximizes the margin between different classes. They're powerful for high-dimensional spaces.

## Core Concepts

- **Hyperplane**: Decision boundary separating classes
- **Support Vectors**: Data points closest to the hyperplane
- **Margin**: Distance between hyperplane and nearest points
- **Kernel Trick**: Transform data to higher dimensions

## Installation

```bash
pip install scikit-learn numpy matplotlib
```

## Basic Linear SVM

```python
from sklearn.svm import SVC
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
import numpy as np

# Generate sample data
X, y = make_classification(n_samples=100, n_features=2,
                          n_redundant=0, n_informative=2,
                          random_state=42, n_clusters_per_class=1)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# Create SVM classifier with linear kernel
model = SVC(kernel='linear', C=1.0, random_state=42)
model.fit(X_train, y_train)

# Evaluate
accuracy = model.score(X_test, y_test)
print(f"Accuracy: {accuracy:.3f}")

# Get support vectors
print(f"Support vectors: {model.support_vectors_}")
print(f"Number of support vectors: {model.n_support_}")
```

## Visualizing Decision Boundary

```python
import matplotlib.pyplot as plt
import numpy as np

def plot_svm_decision_boundary(model, X, y):
    # Create mesh
    h = 0.02
    x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
    y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
    xx, yy = np.meshgrid(np.arange(x_min, x_max, h),
                         np.arange(y_min, y_max, h))

    # Predict
    Z = model.predict(np.c_[xx.ravel(), yy.ravel()])
    Z = Z.reshape(xx.shape)

    # Plot
    plt.contourf(xx, yy, Z, alpha=0.3, cmap='coolwarm')
    plt.scatter(X[:, 0], X[:, 1], c=y, cmap='coolwarm',
                edgecolors='black', s=50)

    # Plot support vectors
    plt.scatter(model.support_vectors_[:, 0],
                model.support_vectors_[:, 1],
                s=200, facecolors='none', edgecolors='green',
                linewidths=2, label='Support Vectors')

    plt.xlabel('Feature 1')
    plt.ylabel('Feature 2')
    plt.legend()
    plt.title('SVM Decision Boundary')
    plt.show()

plot_svm_decision_boundary(model, X, y)
```

## Kernel Tricks

### RBF (Radial Basis Function) Kernel

```python
# For non-linearly separable data
model_rbf = SVC(kernel='rbf', gamma='scale', C=1.0)
model_rbf.fit(X_train, y_train)

print(f"RBF Kernel Accuracy: {model_rbf.score(X_test, y_test):.3f}")
```

### Polynomial Kernel

```python
# For polynomial relationships
model_poly = SVC(kernel='poly', degree=3, C=1.0)
model_poly.fit(X_train, y_train)

print(f"Polynomial Kernel Accuracy: {model_poly.score(X_test, y_test):.3f}")
```

## Real-World Example: Image Classification

```python
from sklearn.svm import SVC
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

# Load digit dataset
digits = load_digits()
X, y = digits.data, digits.target

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# Train SVM
model = SVC(kernel='rbf', gamma='scale')
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# Evaluation
print(f"Accuracy: {model.score(X_test, y_test):.3f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))
```

## Hyperparameter Tuning

### C Parameter (Regularization)

```python
# Small C: Wider margin, more misclassifications allowed
model_soft = SVC(kernel='linear', C=0.1)

# Large C: Narrower margin, fewer misclassifications
model_hard = SVC(kernel='linear', C=100)
```

### Gamma Parameter (RBF Kernel)

```python
# Small gamma: Far-reaching influence
model_low_gamma = SVC(kernel='rbf', gamma=0.01)

# Large gamma: Close-range influence
model_high_gamma = SVC(kernel='rbf', gamma=10)
```

## Grid Search for Best Parameters

```python
from sklearn.model_selection import GridSearchCV

# Define parameter grid
param_grid = {
    'C': [0.1, 1, 10, 100],
    'gamma': ['scale', 'auto', 0.001, 0.01, 0.1],
    'kernel': ['rbf', 'linear']
}

# Grid search
grid_search = GridSearchCV(SVC(), param_grid, cv=5,
                          scoring='accuracy', n_jobs=-1)
grid_search.fit(X_train, y_train)

print(f"Best parameters: {grid_search.best_params_}")
print(f"Best cross-validation score: {grid_search.best_score_:.3f}")

# Use best model
best_model = grid_search.best_estimator_
```

## Text Classification with SVM

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline

# Sample text data
texts = [
    "Machine learning is fascinating",
    "I love programming in Python",
    "Sports are exciting to watch",
    "Football game was amazing",
    "Neural networks are powerful",
    "Basketball is my favorite sport"
]
labels = [0, 0, 1, 1, 0, 1]  # 0: tech, 1: sports

# Create pipeline
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('svm', SVC(kernel='linear'))
])

# Train
pipeline.fit(texts, labels)

# Predict
new_texts = ["Deep learning tutorial", "Soccer match highlights"]
predictions = pipeline.predict(new_texts)
print(f"Predictions: {predictions}")
```

## Common Use Cases

- **Image Classification**: Face detection, object recognition
- **Text Categorization**: Document classification, sentiment analysis
- **Bioinformatics**: Protein classification, gene expression
- **Handwriting Recognition**: Digit and character recognition

## When to Use SVM

✅ **Good for:**
- High-dimensional spaces
- Clear margin of separation
- Small to medium datasets
- Text classification

❌ **Not ideal for:**
- Very large datasets (slow training)
- Noisy data with overlapping classes
- Need for probability estimates (use `probability=True`)

## Performance Tips

```python
# Scale features for better performance
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

model = make_pipeline(
    StandardScaler(),
    SVC(kernel='rbf', gamma='scale')
)
model.fit(X_train, y_train)
```

## Multi-class Classification

```python
# SVM automatically handles multi-class using One-vs-One
model = SVC(kernel='rbf', decision_function_shape='ovo')
model.fit(X_train, y_train)

# Or One-vs-Rest
model_ovr = SVC(kernel='rbf', decision_function_shape='ovr')
model_ovr.fit(X_train, y_train)
```

## Resources

- [Scikit-learn SVM Guide](https://scikit-learn.org/stable/modules/svm.html)
- [Understanding the Kernel Trick](https://scikit-learn.org/stable/auto_examples/svm/plot_svm_kernels.html)
- [SVM Parameters Explained](https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html)
