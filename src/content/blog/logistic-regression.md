---
title: "Logistic Regression with Scikit-Learn"
description: "Master binary classification using logistic regression and the sigmoid function"
pubDate: 2024-01-16
category: "Machine Learning"
tags: ["Python", "scikit-learn", "Classification", "Machine Learning"]
heroImage: "/assets/terminal2.jpg"
---

# Logistic Regression with Scikit-Learn

Logistic regression is a powerful algorithm for binary classification that outputs probabilities between 0 and 1 using the sigmoid function.

## Mathematical Foundation

The sigmoid function:

```
P(y=1) = 1 / (1 + e^(-z))
```

Where `z = mx + b`

## Installation

```bash
pip install scikit-learn numpy pandas matplotlib seaborn
```

## Basic Implementation

```python
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import numpy as np

# Sample data (0 or 1 labels)
X = np.array([[1.2], [1.8], [2.5], [3.1], [3.8], [4.2], [4.9], [5.5]])
y = np.array([0, 0, 0, 0, 1, 1, 1, 1])

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)

# Create and train model
model = LogisticRegression()
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)
probabilities = model.predict_proba(X_test)

print(f"Predictions: {predictions}")
print(f"Probabilities: {probabilities}")
print(f"Accuracy: {accuracy_score(y_test, predictions)}")
```

## Real-World Example: Email Spam Detection

```python
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, classification_report

# Sample email data
emails = [
    "Win free money now!",
    "Meeting at 3pm tomorrow",
    "Claim your prize!!!",
    "Project update attached",
    "You've won the lottery!",
    "Lunch next week?",
    "URGENT: Click here NOW",
    "Please review the document"
]

labels = [1, 0, 1, 0, 1, 0, 1, 0]  # 1 = spam, 0 = not spam

# Vectorize text
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(emails)

# Train model
model = LogisticRegression(max_iter=1000)
model.fit(X, labels)

# Test on new email
new_email = ["Free gift for you!!!"]
new_email_vec = vectorizer.transform(new_email)
prediction = model.predict(new_email_vec)
probability = model.predict_proba(new_email_vec)

print(f"Spam prediction: {'SPAM' if prediction[0] == 1 else 'NOT SPAM'}")
print(f"Spam probability: {probability[0][1]:.2%}")
```

## Model Evaluation with Confusion Matrix

```python
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
import matplotlib.pyplot as plt

# Get predictions
y_pred = model.predict(X_test)

# Create confusion matrix
cm = confusion_matrix(y_test, y_pred)
disp = ConfusionMatrixDisplay(confusion_matrix=cm,
                               display_labels=['Not Spam', 'Spam'])
disp.plot()
plt.title('Confusion Matrix')
plt.show()

# Detailed classification report
print(classification_report(y_test, y_pred,
                           target_names=['Not Spam', 'Spam']))
```

## Feature Importance

```python
# Get feature coefficients
feature_names = vectorizer.get_feature_names_out()
coefficients = model.coef_[0]

# Sort by importance
feature_importance = sorted(zip(coefficients, feature_names),
                           reverse=True)

print("Top spam indicators:")
for coef, word in feature_importance[:5]:
    print(f"{word}: {coef:.3f}")
```

## Handling Imbalanced Data

```python
from sklearn.linear_model import LogisticRegression

# Use class_weight parameter for imbalanced datasets
model = LogisticRegression(class_weight='balanced', max_iter=1000)
model.fit(X_train, y_train)
```

## Cross-Validation

```python
from sklearn.model_selection import cross_val_score

# 5-fold cross-validation
scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
print(f"Cross-validation scores: {scores}")
print(f"Mean accuracy: {scores.mean():.3f} (+/- {scores.std() * 2:.3f})")
```

## Common Use Cases

- **Spam Detection**: Email filtering
- **Medical Diagnosis**: Disease prediction (yes/no)
- **Customer Churn**: Will customer leave?
- **Credit Default**: Loan approval decisions
- **Fraud Detection**: Transaction classification

## When to Use Logistic Regression

✅ **Good for:**
- Binary classification problems
- Probability estimates needed
- Interpretable models
- Linearly separable classes

❌ **Not ideal for:**
- Multi-class problems (use multinomial logistic regression)
- Complex non-linear boundaries
- Very high-dimensional data without regularization

## Hyperparameter Tuning

```python
from sklearn.model_selection import GridSearchCV

# Define parameter grid
param_grid = {
    'C': [0.001, 0.01, 0.1, 1, 10, 100],
    'penalty': ['l1', 'l2'],
    'solver': ['liblinear']
}

# Grid search
grid_search = GridSearchCV(LogisticRegression(max_iter=1000),
                          param_grid, cv=5, scoring='accuracy')
grid_search.fit(X_train, y_train)

print(f"Best parameters: {grid_search.best_params_}")
print(f"Best score: {grid_search.best_score_:.3f}")
```

## Resources

- [Scikit-learn Logistic Regression](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html)
- [Classification Metrics Guide](https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics)
