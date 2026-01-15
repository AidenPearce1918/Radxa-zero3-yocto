# 🐧 Supported Operating Systems

The Radxa Zero 3W supports multiple operating systems, with **Yocto Project** being the primary platform for building custom embedded Linux distributions. This guide covers available OS options and Yocto setup.

---

## 🎯 Operating System Comparison

| OS | Type | Use Case | Build Time | Footprint | Customization |
|---|---|---|---|---|---|
| **Yocto** | Custom Linux | Embedded, custom firmware | 1-2 hours | Minimal | Maximum |
| **Armbian** | Pre-built Debian | General purpose, quick start | None | Medium | Limited |
| **Buildroot** | Minimal Linux | Ultra-light systems, IoT | 30-60 min | Very small | High |
| **OpenWrt** | Network-focused | Router, gateway, networking | 1-2 hours | Small | High |

---

## 🚀 Yocto Project (Primary Recommendation)

### **What is Yocto?**

Yocto Project is a collaborative, open-source initiative providing tools and processes for creating custom Linux distributions on embedded systems. It enables you to build minimal, optimized images for the RK3566 SoC.

### **Why Yocto for Radxa Zero 3W?**

✅ **Radxa BSP Integration** - Pre-configured kernel, bootloader, and device trees
✅ **RK3566 Optimization** - Rockchip-specific drivers and GPU support
✅ **Minimal Builds** - Start with 100MB+ and add only what you need
✅ **Reproducible** - Exact same build = exact same output
✅ **Control** - Full access to kernel config, services, packages
✅ **Security** - Build only trusted components, no bloat

### **Yocto Distribution Options**

#### **1. Radxa Official Yocto**

**Repository:** https://github.com/radxa/yocto

Pre-configured Yocto layers with Radxa optimizations:
- `meta-radxa` - Board support packages
- `meta-arm` - ARM SoC support
- `meta-openembedded` - Community recipes

**Supported Distributions:**
- **Core** - Minimal system (systemd, basic tools)
- **X11** - Graphical environment with X11
- **Wayland** - Modern display server
- **Headless** - Server/IoT deployment

```bash
git clone https://github.com/radxa/yocto.git radxa-yocto
cd radxa-yocto
git checkout radxa-zero-3w
```

**Build Image:**
```bash
source setup-environment
bitbake core-image-minimal  # Minimal image
bitbake core-image-full-cmdline  # Full CLI
bitbake core-image-weston  # Wayland desktop
```

**Output:** `build/tmp/deploy/images/radxa-zero-3w/`
- `.wic` - Complete flashable image
- `.tar.bz2` - Filesystem archive
- Device trees and bootloaders

#### **2. OpenEmbedded (Community)**

**Generic ARM/RK3566 recipes:**
- https://github.com/openembedded/meta-openembedded

Broader package selection, less Radxa-specific optimization.

```bash
bitbake core-image-base  # With gcc, make, basic dev tools
```

---

## 🔧 Yocto Build Environment Setup

### **System Requirements**

**Host Machine:**
- Ubuntu 20.04 LTS / 22.04 LTS recommended
- 4+ cores, 8GB RAM minimum (16GB+ for faster builds)
- 30+ GB free disk space
- Git, Python 3.7+

**Essential Packages:**
```bash
sudo apt-get update
sudo apt-get install -y git python3 python3-pip build-essential \
  chrpath socat texinfo wget cpio diffstat unzip texi2html perl \
  xz-utils debianutils iputils-ping libssl-dev
```

### **Clone & Setup**

```bash
# Clone Radxa Yocto
git clone https://github.com/radxa/yocto.git
cd yocto

# Initialize build environment
source setup-environment radxa-zero-3w

# This creates:
# - build/ directory with cache
# - conf/local.conf for customization
# - conf/bblayers.conf for layer management
```

### **Configuration (local.conf)**

Edit `build/conf/local.conf` to customize:

```bash
# Number of parallel build tasks
BB_NUMBER_THREADS = "4"
PARALLEL_MAKE = "-j 4"

# Machine target
MACHINE = "radxa-zero-3w"

# Image features
IMAGE_FEATURES += "ssh-server-openssh"
IMAGE_FEATURES += "dev-pkgs"  # Development packages

# Package format
PACKAGE_CLASSES = "package_deb"  # Use APT

# Distro features
DISTRO_FEATURES += "wifi"
DISTRO_FEATURES += "bluetooth"
```

---

## 🛠️ Building Custom Yocto Images

### **Basic Build Commands**

```bash
# Source environment (required each session)
source setup-environment radxa-zero-3w

# Build minimal system
bitbake core-image-minimal

# Build with X11 desktop
bitbake -k core-image-x11

# Build with Wayland desktop
bitbake -k core-image-weston

# Build a specific package
bitbake curl  # Just build curl recipe
```

### **Build Output**

Located in `build/tmp/deploy/images/radxa-zero-3w/`:

```
├── core-image-minimal-radxa-zero-3w.wic       # Flashable image
├── core-image-minimal-radxa-zero-3w.wic.bz2   # Compressed
├── core-image-minimal-radxa-zero-3w.tar.bz2   # Filesystem
├── radxa-zero-3w.dtb                          # Device tree
├── u-boot.bin                                 # Bootloader
├── Image                                      # Linux kernel
└── modules-radxa-zero-3w.tgz                  # Kernel modules
```

### **Custom Image Recipe**

Create `meta-radxa/recipes-core/images/my-custom-image.bb`:

```bitbake
inherit core-image

IMAGE_INSTALL += "git openssh openssh-sftp-server"
IMAGE_INSTALL += "htop vim nano"
IMAGE_INSTALL += "python3 python3-dev python3-pip"
IMAGE_INSTALL += "nodejs npm"

IMAGE_FEATURES += "ssh-server-openssh"
IMAGE_FEATURES += "debug-tweaks"  # Allow root login, no password
IMAGE_FEATURES += "dev-pkgs"      # Include dev headers

# Image size configuration
IMAGE_ROOTFS_SIZE = "512"  # MB

# Post-install scripts
do_rootfs_prepend() {
    # Custom setup
}
```

Build it:
```bash
bitbake my-custom-image
```

---

## 🔗 Alternative OS Options

### **Armbian (Quick Start)**

Pre-built Debian/Ubuntu for rapid deployment:

```bash
# Download from:
https://www.armbian.com/radxa-zero/

# Flash with Balena Etcher or dd:
sudo dd if=Armbian_*.img of=/dev/sdX bs=4M status=progress
```

**Pros:** No build time, familiar Debian tools
**Cons:** Larger, less control, community-maintained

---

### **Buildroot**

Minimal, lightweight alternative to Yocto:

```bash
git clone https://git.buildroot.net/buildroot
cd buildroot

# Select Radxa Zero 3W config (if available)
make list-defconfigs | grep radxa
make radxa-zero-3w_defconfig

# Customize
make menuconfig

# Build
make
```

Output: `output/images/sdcard.img`

---

### **OpenWrt**

Purpose-built for networking devices:

```bash
git clone https://github.com/openwrt/openwrt.git
cd openwrt

# Search for Radxa support
./scripts/feeds/update -a
./scripts/feeds/install -a

make menuconfig  # Select target
make
```

---

## 📊 OS Feature Matrix

| Feature | Yocto | Armbian | Buildroot | OpenWrt |
|---------|-------|---------|-----------|---------|
| Customization | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Build Time | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Footprint | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Documentation | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Community Support | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## ✅ Next Steps

1. **Build Yocto** → [Flashing Images & Build Deployment](software-flashing.md)
2. **Configure System** → [Software Configuration](software-configuration.md)
3. **Manage Packages** → [Package Management](software-packages.md)
4. **Update System** → [Updates & Upgrades](software-updates.md)
5. **Troubleshoot** → [Troubleshooting Guide](troubleshooting.md)

---

## 📚 Resources

- [Yocto Project Manual](https://docs.yoctoproject.org/singleindex.html)
- [OpenEmbedded Manual](https://www.openembedded.org/wiki/Documentation)
- [Radxa GitHub - Yocto](https://github.com/radxa/yocto)
- [Radxa Forum Support](https://forum.radxa.com/)
- [Rockchip Linux SDK](https://github.com/rockchip-linux)

