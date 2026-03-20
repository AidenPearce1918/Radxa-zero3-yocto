# 💻 Software Overview

The Radxa Zero 3W supports multiple operating systems and software environments, with a strong focus on **Yocto Project** for custom embedded Linux distributions. This section provides an overview of available software options and frameworks.

---

## 📦 Operating System Options

### **1. Yocto Project (Recommended for Custom Builds)**

**Yocto** is a collaborative open-source project that provides tools and metadata for creating custom Linux distributions for embedded devices. It's ideal for:

- ✅ **Custom firmware** tailored to your specific hardware needs
- ✅ **Minimal footprint** - build only what you need
- ✅ **Long-term support** - stable, predictable releases
- ✅ **Full control** over dependencies and package versions
- ✅ **Integration** with Radxa's optimized board support packages (BSP)

**Key Benefits for Radxa Zero 3W:**

- Pre-configured recipes for RK3566 SoC (Rockchip)
- Optimized drivers for WiFi (AIC8800), Bluetooth, and GPU (Mali-G52)
- Hardware acceleration support
- systemd init system
- Cross-compilation for faster builds

👉 See [Supported OS](software-os.md) for Yocto setup and variants.

---

### **2. Armbian (Quick Start Alternative)**

A lightweight, Debian-based distribution pre-built for ARM boards.

**Pros:**

- Quick deployment (no build time required)
- Familiar Debian/APT ecosystem
- Active community support
- Multiple desktop/CLI variants

**Cons:**

- Less customization than Yocto
- Community-maintained (not official Radxa)
- Larger footprint than custom Yocto builds

👉 Download: [Armbian for Radxa Zero](https://www.armbian.com/radxa-zero/)

---

### **3. Other Linux Distributions**

Additional OS options maintained by the community:

- **Debian** - Full Debian releases (if available)
- **Ubuntu** - Ubuntu Server/Core editions
- **OpenWrt** - For IoT/networking applications
- **Custom Linux** - Build your own using buildroot or other tools

---

## 🛠️ Software Development Environment

### **Yocto Build System**

When building custom Yocto images for Radxa Zero 3W:

**Core Components:**

- **BitBake** - Task execution engine and scheduler
- **Metadata** - Recipes (.bb files) and configuration
- **Radxa BSP** - Board Support Package with device trees, kernel patches
- **oe-core** - OpenEmbedded core layer

**Build Layers:**

```text
meta-openembedded/  (OE core recipes)
meta-radxa/         (Radxa-specific recipes)
meta-arm/           (ARM SoC support)
meta-rk3566/        (RK3566-specific optimizations)
```

👉 See [Flashing Images](software-flashing.md) for build process and deployment.

---

## 📋 Pre-installed Software & Utilities

### **Standard System Tools**

**Package Manager:**

- `apt` (if Debian/Ubuntu-based) or `opkg` (lightweight option)
- Custom feeds and repositories

**Essential Utilities:**

- `systemd` - System and service manager
- `connman` or `NetworkManager` - Network connectivity
- `alsa-utils` - Audio support
- `bluez` - Bluetooth stack
- Development tools (gcc, git, make, etc.)

### **Hardware Support**

**Pre-configured Drivers:**

- Rockchip GPU (Mali-G52) with OpenGL ES support
- Wireless: AIC8800 WiFi 6 driver
- Bluetooth 5.4 stack
- USB 3.0/2.0 controllers
- HDMI display support
- GPIO via `libgpiod`

---

## 🔧 Configuration & Customization

### **Image Customization Options**

1. **Local Configuration** - `local.conf` in build directory
2. **Machine Definition** - `radxa-zero-3w.conf`
3. **Distro Features** - Enable/disable features like systemd, X11, Wayland
4. **Package Selection** - Add/remove recipes via `IMAGE_INSTALL`
5. **Device Tree Customization** - Modify `.dts` files for hardware tweaks

### **Common Customizations**

- Add specific development packages (Python, Node.js, Qt, etc.)
- Include custom scripts or applications
- Configure boot options and kernel parameters
- Setup SSH keys, hostname, users
- Pre-install additional repositories

👉 See [Configuration Guide](software-configuration.md) for detailed steps.

---

## 📚 Software Versions & Stability

**Release Channels:**

- **Stable** - Tested, long-term support
- **Latest** - Newest features, frequent updates
- **Development** - Cutting-edge, unstable

**Version Information:**

- Kernel version (depends on Yocto release and BSP)
- Yocto releases: LTS (long-term), stable point releases
- Package versions: Latest from OE-core and meta layers

---

## 🔄 Updates & Maintenance

The Radxa Zero 3W supports multiple update mechanisms:

- **OTA (Over-The-Air)** - If configured in custom Yocto image
- **Manual Updates** - Via `apt upgrade` or equivalent
- **Full Image Reflashing** - Deploy new Yocto image
- **Kernel Updates** - Target-specific kernel packages

👉 See [Updates & Upgrades](software-updates.md) for detailed update strategies.

---

## 📚 Next Steps

1. **Choose your OS** → [Supported OS & Yocto Setup](software-os.md)
2. **Build/Flash images** → [Flashing Guide](software-flashing.md)
3. **Configure system** → [Configuration Guide](software-configuration.md)
4. **Manage packages** → [Package Management](software-packages.md)
5. **Troubleshoot issues** → [Troubleshooting](troubleshooting.md)

---

## 🔗 Resources

- [Yocto Project Official Docs](https://docs.yoctoproject.org/)
- [Radxa BSP & Build Guides](https://github.com/radxa/yocto)
- [OpenEmbedded Metadata](https://layers.openembedded.org/)
- [Rockchip RK3566 Documentation](https://dl.radxa.com/)
