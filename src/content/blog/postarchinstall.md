---
title: 'Post Arch Installation'
description: 'Installing necessary packages and setting up Arch for daily use.'
pubDate: 2023-07-24
category: 'Linux'
tags: ['Linux', 'Arch Linux', 'Tutorial']
heroImage: '/assets/arch-linux.jpg'
---

This documentation is a copy paste guide for terminal commands and settings to setup arch linux after a successful installation. I am using KDE Plasma as a desktop environment.
## Table of contents

## Installing useful packages

Install nvidia drivers when using nvidia gpus:

```shell
sudo pacman -S nvidia
```

Install backends for KDE-Discover to use the software store, `packagekit-qt5` for "normal" packages, `flatpak` for Flatpaks and `fwupd` for firmware updates.

```shell
sudo pacman -S packagekit-qt5 flatpak fwupd
```
Install a fancy terminal theme quickly and easy. First we need the fonts:

```shell
sudo pacman -S powerline-fonts
```
Then we can install the terminal theme which we can config later if we want:

```shell
git clone --recursive https://github.com/andresgongora/synth-shell.git
chmod +x synth-shell/setup.sh
cd synth-shell
./setup.sh
```

## Disable Baloo-Indexer

This process slows down KDE-Plasma by indexing applications. You can simply turn it off

```shell
balooctl stop
balooctl disable
balooctl status
```

For the changes to take affect long-term the system needs to be rebooted:

```shell
```

## Installing Bluetooth

Arch doesn't natively ship with bluetooth. We need to manually install some utilities. I prefer blueman for a simple gui solution:

```shell
sudo pacman -S bluez bluez-utils blueman
```

Now we just need to enable the bluetooth service, so it starts automatically on bootup:


```

## Setting Up Timeshift

To install timeshift we use the AUR:

```shell
yay -S timeshift-autosnap
```
