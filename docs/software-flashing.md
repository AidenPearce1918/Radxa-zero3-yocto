# 📥 Flashing Images

This guide covers flashing operating system images to your Radxa Zero 3W, including custom Yocto builds and pre-built distributions.

---

## 🎯 Overview

You have two main options:

1. **Flash Pre-built Images** - Fastest, no build required
2. **Build & Flash Custom Yocto** - Full control, optimized for your needs

---

## 📋 What You'll Need

### **Hardware**

- Radxa Zero 3W board
- microSD card (Class 10, 8GB+ recommended) OR eMMC module
- USB-C card reader
- USB-C power supply (5V/2A+)
- Computer running Linux, macOS, or Windows

### **Software**

- **Balena Etcher** (recommended) - <https://www.balena.io/etcher/>
- OR `dd` command (Linux/macOS)
- OR Win32DiskImager (Windows)

---

## 🔨 Option 1: Flash Pre-built Images

### **1.1 Download Image**

**Official Radxa Yocto Releases:**

**Community Armbian:**

```text
https://www.armbian.com/radxa-zero/
```

**Expected files:**

```text
radxa-zero-3w-yocto-*.wic.bz2      # Compressed Yocto image
Armbian_*.img.xz                    # Compressed Armbian image
```

### **1.2 Verify Checksum**

Always verify image integrity:

```bash
# For Yocto images
sha256sum -c radxa-zero-3w-yocto-*.wic.bz2.sha256sum

# For Armbian
echo "HASH_VALUE radxa-zero-3w-image.img" | sha256sum -c -
```

If checksum fails, **delete and re-download**.

### **1.3 Decompress Image**

```bash
# Yocto
bunzip2 radxa-zero-3w-yocto-*.wic.bz2

# Armbian
unxz Armbian_*.img.xz
```

Output: `.wic` or `.img` file (typically 500MB - 1GB)

### **1.4 Flash with Balena Etcher (Recommended)**

**GUI Method:**

1. Insert microSD card into reader
2. Connect reader to computer
3. Open Balena Etcher
4. Click **Select Image** → Choose `.wic` or `.img` file
5. Click **Select Target** → Choose your microSD card
6. Click **Flash**
7. Wait for completion (5-10 minutes depending on speed)
8. Safely eject card

![Balena Etcher Flashing Process](img/balena_etcher.png)

### **1.5 Flash with `dd` Command (Linux/macOS)**

**⚠️ Warning:** `dd` can overwrite any disk. Use with caution!

```bash
# 1. Find your microSD device
lsblk
# OR
diskutil list  # macOS

# 2. Decompress (if needed)
bunzip2 radxa-zero-3w-yocto-*.wic.bz2

# 3. Unmount the SD card (Linux)
sudo umount /media/username/BOOT
sudo umount /media/username/ROOT

# 4. Write image to device
sudo dd if=radxa-zero-3w-yocto-*.wic of=/dev/sdX bs=4M status=progress
# Replace /dev/sdX with your device (e.g., /dev/sdb, NOT /dev/sdb1)

# 5. Sync to ensure all data written
sudo sync

# 6. Eject safely
sudo eject /dev/sdX
```

### **1.6 First Boot**

1. Insert microSD into Radxa Zero 3W
2. Connect 5V/2A USB-C power
3. Wait 30-60 seconds for system to boot
4. LED should blink (if configured)

**Login:**

- Username: `root` (Yocto, if debug-tweaks enabled)
- Username: `radxa` (Armbian, no password set initially)
- Password: (check release notes)

---

## 🏗️ Option 2: Build & Flash Custom Yocto Image

### **2.1 Prepare Build Environment**

See [Supported OS - Yocto Setup](software-os.md#yocto-build-environment-setup) for detailed instructions.

```bash
# Install dependencies (Ubuntu 22.04)
sudo apt-get update
sudo apt-get install -y git python3 python3-pip build-essential \
  chrpath socat texinfo wget cpio diffstat unzip texi2html perl \
  xz-utils debianutils iputils-ping libssl-dev

# Clone Poky and initialize
git clone git://git.yoctoproject.org/poky.git -b kirkstone
cd poky

# (See OS Setup guide for cloning necessary meta layers)

# Initialize build environment
source oe-init-build-env build
```

### **2.2 Configure Build (Optional)**

Edit `build/conf/local.conf` to customize:

```bash
# Parallel jobs (adjust for your system)
BB_NUMBER_THREADS = "4"
PARALLEL_MAKE = "-j 4"

# Add SSH server
IMAGE_FEATURES += "ssh-server-openssh"

# Add development tools
IMAGE_FEATURES += "dev-pkgs tools-sdk"

# Enable WiFi & Bluetooth
DISTRO_FEATURES += "wifi bluetooth"

# Reduce image size
IMAGE_ROOTFS_SIZE = "512"  # 512MB
```

### **2.3 Build Image**

```bash
# Build minimal image (100-200MB)
bitbake core-image-minimal

# OR build full CLI with SSH
bitbake core-image-full-cmdline

# OR build with Wayland desktop
bitbake core-image-weston

# Optional: parallel make for speed
bitbake -k core-image-minimal &
```

**Build time:** 1-3 hours (first build), 15-30 minutes (subsequent)

**Monitor progress:**

```bash
# In another terminal
tail -f build/tmp/log.do_build
```

### **2.4 Locate Build Output**

```bash
cd build/tmp/deploy/images/radxa-zero-3w/

ls -lh
# core-image-minimal-radxa-zero-3w.wic.bz2
# core-image-minimal-radxa-zero-3w.wic
# radxa-zero-3w.dtb
# Image (kernel)
# u-boot.bin
```

### **2.5 Flash Custom Image**

```bash
# Decompress if needed
bunzip2 core-image-minimal-radxa-zero-3w.wic.bz2

# Flash using dd (Linux/macOS)
sudo dd if=core-image-minimal-radxa-zero-3w.wic of=/dev/sdX bs=4M status=progress
sudo sync

# OR use Balena Etcher (GUI)
```

Follow **1.6 First Boot** steps above.

---

## 📦 eMMC Module Flashing

### **USB Flashing Method**

If your board has eMMC module (instead of microSD):

1. **Prepare USB Adapter:**

   ```bash
   # Use Radxa's RockChip USB loader tool
   # Download: https://github.com/radxa/tools
   ```

2. **Flash via USB:**

   ```bash
   # Put board into Maskrom mode (hold specific button during boot)
   # Then:
   ./rkdeveloptool wl 0 core-image-minimal-radxa-zero-3w.wic
   ```

---

## ✅ Verify Successful Flash

### **Check Boot Messages**

Connect via serial console (UART):

```bash
# Using minicom, picocom, or screen
picocom -b 1500000 /dev/ttyUSB0

# Expected output:
# U-Boot 2022.10...
# Linux version 5.10 (on Yocto builds)
# [ OK ] Started serial getty on ttyS0
# radxa-zero-3w login:
```

### **SSH Login (if configured)**

```bash
# Find board's IP address (check your router)
ssh root@radxa-zero-3w.local
# OR
ssh radxa@192.168.1.xxx
```

### **Verify Kernel & System**

```bash
uname -a
# Output: Linux radxa-zero-3w 5.10.x #1 SMP ... aarch64 GNU/Linux

cat /etc/os-release
# Shows distro info

df -h
# Shows filesystem layout
```

---

## 🔧 Troubleshooting Flash Issues

### **Issue: "Image write failed"**

```bash
# Solution: Try dd directly with lower blocksize
sudo dd if=image.wic of=/dev/sdX bs=1M status=progress
sudo sync
```

### **Issue: "Board won't boot after flashing"**

1. Check SD card is fully inserted
2. Verify checksum of original image
3. Try reflashing with different tool
4. Test SD card on another device

### **Issue: "Permission denied" with dd**

```bash
# Need sudo for block device access
sudo dd if=image.wic of=/dev/sdX bs=4M status=progress
```

### **Issue: "Device is read-only"**

```bash
# Some SD cards have physical lock switch
# Check microSD card adapter for lock tab
# If locked, unlock and re-insert
```

---

## 📊 Common Image Sizes

| Image Type | Size | Time to Flash |
| --- | --- | --- |
| core-image-minimal | 100-150 MB | 1-2 min |
| core-image-full-cmdline | 300-500 MB | 3-5 min |
| core-image-weston (Wayland) | 800-1200 MB | 8-10 min |
| Armbian Full | 1-2 GB | 10-15 min |

---

## 🚀 Next Steps After Flashing

1. **First Boot Setup** → [First Boot Tutorial](tutorial-first-boot.md)
2. **Configure Network** → [Network Setup Tutorial](tutorial-networking.md)
3. **Enable SSH** → [Remote Access Guide](tutorial-remote.md)
4. **GPIO Projects** → [GPIO Tutorial](tutorial-gpio.md)

---

## 📚 Additional Resources

- [Balena Etcher Docs](https://www.balena.io/etcher/docs/)
- [Yocto Build Complete Guide](https://docs.yoctoproject.org/singleindex.html)
- [Radxa Yocto GitHub](https://github.com/radxa/yocto)
- [RockChip Tools & Docs](https://github.com/rockchip-linux)
