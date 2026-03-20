# 📦 Package Management

How you install and manage software depends heavily on the Operating System you have deployed to your Radxa Zero 3W.

---

## Debian / Ubuntu / Armbian
These distributions use the `apt` package manager. You have access to thousands of pre-compiled ARM64 packages.

**Update package lists and install:**
```bash
sudo apt update
sudo apt install <package_name>
```

**Recommended Developer Packages:**
```bash
sudo apt install build-essential git curl python3-pip python3-libgpiod
```

## Yocto Project
Yocto images are fundamentally designed to be pre-configured. However, if you enabled package management (`PACKAGE_CLASSES = "package_deb"` or `package_rpm` in `local.conf`), you can install packages on the fly.

* **Using APT (if configured):** `apt-get update && apt-get install <package>`
* **Using OPKG (lightweight):** `opkg update && opkg install <package>`
