---
title: "Linear Regression with Scikit-Learn"
description: "Learn how to implement linear regression for predicting continuous values using scikit-learn"
pubDate: 2024-01-15
category: "Machine Learning"
tags: ["Python", "scikit-learn", "Machine Learning", "Regression"]
heroImage: "/assets/terminal.jpg"
---

# Linear Regression with Scikit-Learn

Linear regression is one of the most fundamental machine learning algorithms. It predicts continuous values by fitting a linear equation to your data.

## Mathematical Foundation

The equation for linear regression is:

```
y = mx + b
```

Where:
- `y` is the predicted value
- `m` is the slope
- `x` is the input feature
- `b` is the y-intercept

## Installing Dependencies

```bash
pip install scikit-learn numpy pandas matplotlib
```

## Basic Implementation

```python
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import numpy as np

# Generate sample data
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 5, 4, 5])

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create and train model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)
print(f"Predictions: {predictions}")
print(f"Score: {model.score(X_test, y_test)}")
```

## Real-World Example: House Price Prediction

```python
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Sample housing data
data = {
    'square_feet': [1500, 1600, 1700, 1875, 1100, 1550, 2350, 2450],
    'bedrooms': [3, 3, 2, 4, 2, 3, 4, 4],
    'price': [245000, 312000, 279000, 308000, 199000, 219000, 405000, 324000]
}

df = pd.DataFrame(data)

# Features and target
X = df[['square_feet', 'bedrooms']]
y = df['price']

# Train model
model = LinearRegression()
model.fit(X, y)

# Model coefficients
print(f"Coefficients: {model.coef_}")
print(f"Intercept: {model.intercept_}")

# Predict a new house
new_house = [[2000, 3]]
predicted_price = model.predict(new_house)
print(f"Predicted price: ${predicted_price[0]:,.2f}")
```

## Model Evaluation

```python
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

y_pred = model.predict(X_test)

# Calculate metrics
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print(f"MAE: {mae}")
print(f"MSE: {mse}")
print(f"RMSE: {rmse}")
print(f"R² Score: {r2}")
```

## Visualization

```python
import matplotlib.pyplot as plt

plt.scatter(X, y, color='blue', label='Actual')
plt.plot(X, model.predict(X), color='red', label='Predicted')
plt.xlabel('Feature')
plt.ylabel('Target')
plt.legend()
plt.title('Linear Regression')
plt.show()
```

## Common Use Cases

- **Price Prediction**: Real estate, stock prices, product pricing
- **Sales Forecasting**: Revenue prediction based on marketing spend
- **Risk Assessment**: Insurance premium calculation
- **Trend Analysis**: Time series forecasting

## When to Use Linear Regression

✅ **Good for:**
- Linear relationships between variables
- Continuous target variables
- Interpretable models
- Quick baseline models

❌ **Not ideal for:**
- Non-linear relationships
- Classification problems
- Complex interactions without feature engineering

## Next Steps

- Try polynomial regression for non-linear relationships
- Explore regularization (Ridge, Lasso)
- Learn about multicollinearity and feature selection
- Practice with real-world datasets from Kaggle

## Resources

- [Scikit-learn Documentation](https://scikit-learn.org/stable/modules/linear_model.html)
- [Linear Regression Tutorial](https://scikit-learn.org/stable/auto_examples/linear_model/plot_ols.html)
