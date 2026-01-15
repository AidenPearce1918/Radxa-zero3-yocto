# ❓ Frequently Asked Questions (FAQ)

Common questions about the Radxa Zero 3W, Yocto builds, and embedded Linux development.

---

## 🎯 General Questions

### **Q: What is Radxa Zero 3W?**

**A:** The Radxa Zero 3W is a compact, high-performance single-board computer featuring a Rockchip RK3566 quad-core ARM processor, up to 8GB RAM, WiFi 6, Bluetooth 5.4, and a 40-pin GPIO header. It's designed for embedded projects, IoT, edge computing, and maker applications.

**Key Specs:**
- CPU: Rockchip RK3566 (Cortex-A55)
- RAM: 1GB / 2GB / 4GB / 8GB
- Storage: microSD + optional eMMC
- Connectivity: WiFi 6 (802.11ax), Bluetooth 5.4
- Size: 65mm × 30mm

---

### **Q: How much does Radxa Zero 3W cost?**

**A:** Pricing varies by variant:
- **1GB RAM, no eMMC**: ~$20-25
- **2GB RAM, no eMMC**: ~$25-30
- **4GB RAM + 32GB eMMC**: ~$60-70
- **8GB RAM + 64GB eMMC**: ~$100+

Check official retailers:
- [Radxa Store](https://radxa.com/products/)
- [Seeed Studio](https://www.seeedstudio.com/)
- [AliExpress](https://www.aliexpress.com/) (third-party sellers)

---

### **Q: Is Radxa Zero 3W compatible with Raspberry Pi accessories?**

**A:** **Partially**. 
- ✅ **40-pin GPIO header** - Raspberry Pi compatible
- ✅ **Most GPIO libraries** work (RPi.GPIO, gpiozero)
- ✅ **Mechanical fit** similar to Raspberry Pi Zero
- ❌ **USB ports** different (Type-C vs Micro)
- ❌ **HDMI** different (Micro vs full-size)
- ❌ **Power input** different (USB-C vs Micro)

Always check hardware documentation before purchasing accessories.

---

## 💾 Software & OS Questions

### **Q: What operating systems can I use?**

**A:** Multiple options available:

1. **Yocto Project** (Recommended for custom builds)
   - Minimal, customizable Linux distributions
   - Full control over kernel and packages
   - 1-2 hour build time

2. **Armbian** (Quick start)
   - Pre-built Debian/Ubuntu-based
   - No build required
   - Community maintained

3. **Buildroot** (Ultra-light)
   - Minimal embedded Linux
   - Fast build time
   - Limited package ecosystem

4. **OpenWrt** (Networking focus)
   - Router/gateway operating system
   - Network-optimized

See [Supported OS Guide](software-os.md) for detailed setup instructions.

---

### **Q: Why use Yocto instead of Armbian?**

**A:** Depends on your use case:

**Choose Yocto if:**
- You need a minimal, custom image
- You want full control over components
- You're building embedded products
- You need long-term stability & reproducibility
- Your application requires specific kernel version

**Choose Armbian if:**
- You want quick deployment (no build time)
- You need familiar Debian/APT ecosystem
- You prefer community-maintained OS
- You don't need extensive customization

---

### **Q: How long does it take to build a Yocto image?**

**A:** Varies based on system specs:

- **First build**: 1-3 hours (downloads all sources)
- **Subsequent builds**: 15-30 minutes (cache hit)
- **Factors affecting time:**
  - CPU cores (more = faster)
  - Disk speed (SSD >> HDD)
  - Available RAM
  - Image complexity (minimal < full-cmdline < desktop)

**Speedup tips:**
```bash
# Use more parallel jobs
BB_NUMBER_THREADS = "8"
PARALLEL_MAKE = "-j 8"
```

---

### **Q: Can I use Yocto to build production firmware?**

**A:** **Yes**, absolutely. Yocto is designed for exactly this:

- ✅ Reproducible builds (same input = same output)
- ✅ Version control for all components
- ✅ Security audit trail
- ✅ Long-term maintenance & updates
- ✅ Custom licensing compliance

Production workflow:
```bash
git tag v1.0.0
source setup-environment radxa-zero-3w
bitbake core-image-minimal
# Build is reproducible from this tag
```

---

## 🔌 Hardware Questions

### **Q: Can I power the Radxa Zero 3W from GPIO pins?**

**A:** **Not recommended for main power**, but possible for testing:

- **USB-C (5V):** Recommended way - 2A minimum
- **GPIO 5V rail:** Can power USB devices, **not** recommended for main board power
- **GPIO GND:** Multiple pins available

**Safe approach:**
```
USB-C 5V → Main power
GPIO 5V → External devices (sensors, LEDs, etc.)
```

See [Power & Connectivity](hardware-power.md) for detailed power specs.

---

### **Q: What is the maximum GPIO voltage?**

**A:** **3.3V logic levels**

- GPIO inputs: 3.3V max (5V will damage)
- GPIO outputs: 3.3V
- **Not 5V tolerant!**

Always use level shifters if interfacing with 5V devices.

---

### **Q: Does Radxa Zero 3W have analog inputs (ADC)?**

**A:** **No built-in ADC**. GPIO pins are digital only.

**Solutions for analog sensing:**
```python
# Use external ADC module (ADS1115, MCP3008)
import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn

i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c)
channel = AnalogIn(ads, ADS.P0)
print(f"ADC value: {channel.value}")
```

---

### **Q: Can I use multiple SPI/I2C devices?**

**A:** **Yes**, with proper addressing:

**I2C (2 devices max theoretically, many in practice):**
```bash
i2cdetect -y 1  # Scan for devices
# Common addresses: 0x48-0x4F (ADS1115), 0x68 (MPU6050)
```

**SPI (multiple Chip Select pins):**
```python
# Each device needs separate CS pin
spi = busio.SPI(clock=board.SCLK, MOSI=board.MOSI, MISO=board.MISO)
cs1 = board.GPIO17  # Device 1
cs2 = board.GPIO27  # Device 2
```

See [GPIO Tutorial](tutorial-gpio.md) for examples.

---

## 🌐 Network Questions

### **Q: How do I connect to WiFi?**

**A:** Several methods:

**Method 1: nmcli (NetworkManager)**
```bash
sudo nmcli device wifi list
sudo nmcli device wifi connect "SSID" password "PASSWORD"
```

**Method 2: wpa_supplicant**
```bash
sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
# Add:
# network={
#   ssid="SSID"
#   psk="PASSWORD"
# }
sudo systemctl restart wpa_supplicant
```

**Method 3: connman**
```bash
sudo connmanctl
> enable wifi
> scan wifi
> connect SSID
> agent on
> connect SSID
```

See [Networking Setup Tutorial](tutorial-networking.md) for details.

---

### **Q: What WiFi standard does Zero 3W support?**

**A:** **WiFi 6 (802.11ax)**, but also supports:
- 802.11a (5GHz)
- 802.11b (2.4GHz)
- 802.11g (2.4GHz)
- 802.11n (2.4GHz/5GHz)
- 802.11ac (5GHz)
- 802.11ax (5GHz/2.4GHz) ← Latest

**Performance:** Up to ~150 Mbps (actual speed depends on AP and environment)

---

### **Q: Can I use Ethernet (USB adapter)?**

**A:** **Yes**, via USB adapter:

```bash
# Connect USB Ethernet adapter to USB 3.0 port
# Usually auto-detected as eth0

sudo dhclient eth0
ip addr show eth0
```

Recommended adapters: RTL8152, AX88179 (well-supported on Linux)

---

## 🔐 Security Questions

### **Q: How do I secure my Radxa Zero 3W?**

**A:** Essential security steps:

```bash
# 1. Change default password
sudo passwd root
sudo passwd radxa

# 2. Disable root login over SSH
sudo nano /etc/ssh/sshd_config
# Change: PermitRootLogin no
sudo systemctl restart ssh

# 3. Enable firewall
sudo apt install ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw enable

# 4. Update all packages
sudo apt update && sudo apt upgrade

# 5. Enable automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# 6. Use SSH keys instead of passwords
ssh-keygen -t rsa -b 4096
ssh-copy-id -i ~/.ssh/id_rsa.pub user@radxa-zero-3w

# 7. Disable unused services
sudo systemctl disable unnecessary-service
```

---

### **Q: Is the board vulnerable to specific attacks?**

**A:** Standard Linux security practices apply:

**Keep these updated:**
- Linux kernel
- C library (libc)
- OpenSSL/SSH
- Python/Node.js (if used)

**Monitor:**
- Failed login attempts: `sudo journalctl -u ssh`
- Disk space: `df -h`
- Running services: `sudo ss -tulpn`

---

## 🧪 Development Questions

### **Q: Can I use Python on Radxa Zero 3W?**

**A:** **Yes**, fully supported.

```bash
# Check Python version
python3 --version

# Install packages
sudo apt install python3-pip
pip3 install numpy scipy requests

# Run Python scripts
python3 my_script.py

# Example: GPIO control
import gpiod
# See GPIO Tutorial for examples
```

---

### **Q: Can I use Node.js?**

**A:** **Yes**, but check architecture:

```bash
# Check if ARM64 binary is available
node --version

# If not, install from apt
sudo apt install nodejs npm

# Or build from source (slow)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install nodejs
```

---

### **Q: How do I enable SSH server?**

**A:** Usually enabled by default, but verify:

```bash
# Check if running
sudo systemctl status ssh
# OR
sudo systemctl status openssh-server

# Enable on boot (if not already)
sudo systemctl enable ssh

# Verify listening on port 22
sudo ss -tulpn | grep :22

# Connect from another machine
ssh user@radxa-zero-3w.local
# OR
ssh user@192.168.1.xxx
```

---

### **Q: Can I compile C/C++ code on the board?**

**A:** **Yes**, but slow. Better to cross-compile:

**On the board (slow):**
```bash
sudo apt install build-essential gcc g++ make
gcc -o my_program my_program.c
```

**Cross-compile on x86 (fast):**
```bash
# On build machine (Ubuntu x86)
sudo apt install gcc-aarch64-linux-gnu
aarch64-linux-gnu-gcc -o my_program my_program.c

# Transfer to board
scp my_program user@radxa-zero-3w:~/
ssh user@radxa-zero-3w ./my_program
```

---

## 🐛 Debugging Questions

### **Q: How do I access the serial console?**

**A:** Use FTDI USB-to-serial adapter:

```bash
# Install tools
sudo apt install picocom screen minicom

# Connect
picocom -b 1500000 /dev/ttyUSB0
# Or
screen /dev/ttyUSB0 1500000

# Exit picocom: Ctrl-A, Ctrl-X
# Exit screen: Ctrl-A, then :quit
```

See [Serial Console Setup](tutorial-headless.md#serial-console) for wiring.

---

### **Q: How do I view kernel logs?**

**A:** Multiple methods:

```bash
# Real-time kernel messages
dmesg --follow

# Last 50 messages
dmesg | tail -50

# Search for specific driver/module
dmesg | grep -i wifi
dmesg | grep -i bluetooth

# Journal (systemd)
sudo journalctl -n 100
sudo journalctl -u service-name -f
sudo journalctl --since "1 hour ago"
```

---

### **Q: How do I profile system performance?**

**A:** Tools for monitoring:

```bash
# CPU usage
top -b -n 1
ps aux --sort=-%cpu

# Memory
free -h
ps aux --sort=-%mem

# Disk I/O
iostat -x 1 5
iotop

# Network
iftop
nethogs

# System load
uptime
load average: 0.5, 0.3, 0.1  # 1, 5, 15 min average
```

---

## 📞 Support & Community

### **Q: Where can I get help?**

**A:** Multiple resources:

1. **Radxa Forum** - https://forum.radxa.com/ (Official)
2. **GitHub Issues** - https://github.com/radxa/yocto/issues
3. **Reddit** - r/radxa, r/embedded_linux
4. **Discord/Chat** - Radxa community channels
5. **This Documentation** - [Troubleshooting](troubleshooting.md)

**When asking for help, include:**
- Board model & variant (RAM, storage)
- OS & kernel version (`uname -a`)
- Steps to reproduce issue
- Error messages & logs
- What you've already tried

---

### **Q: How do I contribute improvements?**

**A:** Open source contributions welcome:

1. **Documentation** - Improve guides on GitHub
2. **Bug reports** - File GitHub issues
3. **Code patches** - Submit pull requests
4. **Community help** - Answer others' questions

See [Contributing Guide](contributing.md) for details.

---

## 📚 Learning Resources

### **Q: Where can I learn embedded Linux?**

**A:** Recommended resources:

- **Yocto Project** - https://www.yoctoproject.org/
- **OpenEmbedded** - https://www.openembedded.org/
- **Linux Kernel Docs** - https://www.kernel.org/doc/
- **GPIO & Sensors** - [Our GPIO Tutorial](tutorial-gpio.md)
- **ARM Architecture** - ARM official documentation

---

### **Q: What's the best way to learn GPIO programming?**

**A:** Start simple:

```python
# 1. Blink an LED (basic digital output)
# 2. Read a button (basic digital input)
# 3. Fade LED with PWM (analog simulation)
# 4. I2C sensor (real data acquisition)
# 5. SPI display (more complex interface)
```

See [GPIO Tutorial](tutorial-gpio.md) for step-by-step examples.

---

## 🔗 Quick Links

| Topic | Link |
|-------|------|
| Hardware Specs | [Specifications](hardware-specs.md) |
| Pinout Diagram | [GPIO Pinout](hardware-pinout.md) |
| Getting Started | [First Steps](getting-started.md) |
| Build Yocto | [Supported OS](software-os.md) |
| Flash Images | [Flashing Guide](software-flashing.md) |
| GPIO Projects | [GPIO Tutorial](tutorial-gpio.md) |
| Networking | [Network Setup](tutorial-networking.md) |
| Remote Access | [SSH/Serial Guide](tutorial-remote.md) |
| Troubleshooting | [Common Issues](troubleshooting.md) |

---

## 📞 Still Have Questions?

1. Check [Troubleshooting](troubleshooting.md) for common issues
2. Search [Radxa Forum](https://forum.radxa.com/)
3. Read [Official Radxa Docs](https://docs.radxa.com/en/zero/zero3)
4. File [GitHub Issue](https://github.com/radxa)

