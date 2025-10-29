---
title: Introducing the AUR
description:
  Utilizing amazing software diversity.
pubDate: 2024-01-15
category: 'Linux'
tags: ['Linux', 'Arch Linux', 'AUR', 'Tutorial']
heroImage: '/blog-ml-intro.jpg'

---

One of the reasons I love Arch is the extensive community-maintained Arch User Repository (AUR). Here is a quick tutorial on how to get started and install your first AUR packages using the yay installation helper.

## Installing yay

First, install the base development tools if not already installed.
```shell
sudo pacman -S --needed base-devel
```

Now install yay by cloning the yay repo, change into the yay directory, build and install yay.

```shell
git clone https://aur.archlinux.org/yay.git
makepkg -si
```

## Commands for yay

We can search for packages in the AUR:

```shell
yay -Ss package_name
```


```shell
yay -Syu
```


```shell
yay -Yc
```

View package information: To view detailed information about a package, use:

```shell
yay -Si package_name
```

## Conclusion

Using yay and the AUR is the main engine to turn Arch Linux into an open-source powerhouse. We now have access to an extensive library of software that is well maintained and gives you the tools you need!
