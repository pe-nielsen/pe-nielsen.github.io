---
title: "Arch Maintenance"
date: 2024-5-31
draft: false
toc: false
images:
tags:
  - untagged
---


# Performing Regular Maintenance

- Perform regular updates. Check announcements on the [Arch forums](https://bbs.archlinux.org/viewforum.php?id=24) to resolve any problems.
```bash
sudo pacman -Syu
```

- Occasionally remove [orphaned packages](https://wiki.archlinux.org/title/Pacman/Tips_and_tricks#Removing_unused_packages_(orphans))
```bash
sudo pacman -Qdtq | sudo pacman -Rns -
```