---
title: 'Fix Discords Auto Updater on Linux'
description: 'Overcoming annoying manual Discord updates.'
pubDate: 2023-10-09
category: 'Linux'
tags: ['Linux', 'Arch Linux', 'Discord', 'Tutorial']
heroImage: '/blog-ml-intro.jpg'
---

## Updating Discord Manually

People who use Discord on Linux Systems such as Arch will run into the tideous task of manually having to update the `build_info.json` in the opt/discord/resources directory whenever there is a new version out.

This means checking the update launcher window for the latest available version and incrementing it manually:

```json
{
  "releaseChannel": "stable",
  "version": "0.0.34"
}
```

## Solution

However you can easily bypass this by modifying the /.config/discord/settings.json to bypass the update view process.
you just have to add "SKIP_HOST_UPDATE": true

```json
{
  "IS_MAXIMIZED": false,
  "IS_MINIMIZED": false,
  "WINDOW_BOUNDS": {
    "x": 3,
    "y": 64,
    "width": 2042,
    "height": 1084
  },
  "SKIP_HOST_UPDATE": true
}

```

## Conslusion

As for November 2023 this method is working for even longer update intervals than one or two at a time. I will update this page as soon as that changes.
