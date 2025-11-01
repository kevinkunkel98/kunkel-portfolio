---
title: 'Creating a Flask Project'
description: 'Installing and setting up the Flask-Framework for python web development.'
pubDate: 2023-01-15
category: 'Web Development'
tags: ['Flask', 'Beginner', 'Python', 'Tutorial']
heroImage: '/blog-ml-intro.jpg'
---

Flask is a simple python webframework that is easy to start and setup. This is a quick start guide to get the fundamentals going.

## Installation

First of all we want to install and enable a virtual environment (venv):

pip3 install virtualenv
```

Then we need to create it in our project directory
```shell
virtualenv venv --system-site-packages
```

Then we activate it


```shell
source venv/bin/activate
```

Now install Flask

```shell
pip3 install Flask
```

## Creating your first server

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return 'hello, world'
```
Now we can start the server using

```shell
flask --app hello run
```