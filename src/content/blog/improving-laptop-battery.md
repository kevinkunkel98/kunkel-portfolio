---
title: 'Battery Optimization with TLP'
description: 'Improving Battery Life on Linux Laptops.'
pubDate: 2024-05-09
tags: ['hardware']
---

Whenever you first setup a laptop with linux, chances are the battery usage is very poorly optimized. TLP is a feature-rich command line utility for Linux, saving laptop battery power without the need to delve deeper into technical details.
## Table of contents

## Installation

Firstly we need to install two packages

    tlp (Community) – Power saving

    tlp-rdw (Community) – optional, Radio Device Wizard

Install them with your favorite package manager:

```shell
sudo pacman -S tlp tlp-rdw
```

## Enable the Services

To complete the installation you must enable TLP’s service:

```shell
sudo systemctl enable tlp.service
```

Using the Radio Device Wizard (tlp-rdw) requires one more service:

```shell
sudo systemctl enable NetworkManager-dispatcher.service
```

You should also mask the following services to avoid conflicts and assure proper operation of TLP’s Radio Device Switching options:

```shell
sudo systemctl mask systemd-rfkill.service systemd-rfkill.socket
```

## Conclusion

This quick and easy setup allows for a vast improvement of battery life for most systems. If you want to read more about TLP you can check this page: https://linrunner.de/tlp/introduction.html
