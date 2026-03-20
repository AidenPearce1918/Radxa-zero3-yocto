# 🔧 Troubleshooting Guide

Common issues and solutions for the Radxa Zero 3W with Yocto and other Linux distributions.

---

## 🚀 Boot Issues

### **Issue: Board won't power on**

**Symptoms:** No LED activity, board appears dead

**Solutions:**

1. **Check Power Supply**

   ```bash
   # Verify 5V/2A USB-C power adapter
   # Test with different power supply
   # Check USB cable continuity
   ```

2. **Check Power Button/Connections**
   - Ensure USB-C connector is fully inserted
   - Try different USB-C cable
   - Inspect USB connector for damage

3. **Check SD Card Seating**
   - Remove and reinsert microSD card firmly
   - Ensure card is fully pushed in

---

### **Issue: Board boots but stuck at bootloader**

**Symptoms:** U-Boot prompt appears, no OS loads

**Solutions:**

```bash
# 1. Check if image is corrupted
# Re-flash image using Balena Etcher (more reliable than dd)

# 2. Verify bootloader integrity
# Use serial console to check messages
picocom -b 1500000 /dev/ttyUSB0

# 3. Rebuild Yocto image
cd ~/yocto
source setup-environment radxa-zero-3w
bitbake -c clean core-image-minimal
bitbake core-image-minimal

# 4. Reflash new image
sudo dd if=core-image-minimal-radxa-zero-3w.wic of=/dev/sdX bs=4M status=progress
```

---

### **Issue: "kernel panic - not syncing"**

**Symptoms:** Boot reaches kernel but crashes immediately

**Solutions:**

```bash
# 1. Check serial console for error details
picocom -b 1500000 /dev/ttyUSB0

# 2. Verify device tree is correct
# Check u-boot is loading proper .dtb file

# 3. Check kernel command line (from bootloader)
# Device tree may have incorrect GPIO/clock configuration

# 4. Rebuild with stable kernel version
cd ~/yocto
nano build/conf/local.conf
# Modify PREFERRED_VERSION_linux-kernel = "5.10%"

bitbake -c clean linux-yocto
bitbake core-image-minimal
```

---

### **Issue: Board hangs during kernel boot**

**Symptoms:** Kernel loads but system freezes (no login prompt)

**Solutions:**

```bash
# 1. Enable debug output
# Add to kernel command line:
# ignore_loglevel=y debug

# 2. Check filesystem
# Run fsck from another device
sudo fsck.ext4 /dev/sdX2

# 3. Reduce init services for debugging
# Boot to single-user mode if available
# Add 'single' to kernel command line

# 4. Check for circular dependencies in Yocto recipes
bitbake -g core-image-minimal  # Generate dependency graph
```

---

## 🌐 Network Issues

### **Issue: No IP address assigned (no DHCP)**

**Symptoms:** `ip addr show` shows no IP or only loopback

**Solutions:**

```bash
# 1. Check network manager service
sudo systemctl status NetworkManager
# OR
sudo systemctl status connman

# 2. Manually request DHCP
sudo dhclient eth0
# OR for specific interface
sudo dhclient -v

# 3. Check interface is up
sudo ip link show
sudo ip link set eth0 up

# 4. Start networking service
sudo systemctl restart networking
# OR
sudo systemctl restart NetworkManager

# 5. Check DHCP logs
sudo journalctl -xe | grep -i dhcp
```

### **Issue: WiFi not connecting (AIC8800)**

**Symptoms:** WiFi interface visible but won't connect

**Solutions:**

```bash
# 1. Check WiFi module loaded
lsmod | grep aic
# If not loaded: sudo modprobe aic8800

# 2. Scan available networks
sudo iwconfig wlan0 scan
# OR
sudo nmcli device wifi list

# 3. Connect to network
# Using nmcli (NetworkManager)
sudo nmcli device wifi connect "SSID" password "PASSWORD"

# 4. Check WiFi driver status
sudo ethtool wlan0
sudo iw dev wlan0 link

# 5. Rebuild Yocto with WiFi support
cd ~/yocto
nano build/conf/local.conf
# Ensure: IMAGE_INSTALL += "linux-firmware-aic8800"
# And: DISTRO_FEATURES += "wifi"

bitbake core-image-minimal
```

### **Issue: Bluetooth not working**

**Solutions:**

```bash
# 1. Check if Bluetooth service is running
sudo systemctl status bluetooth
sudo systemctl start bluetooth

# 2. Check if device is visible
hciconfig
# Should show: hci0

# 3. Scan for Bluetooth devices
hcitool scan

# 4. Pair device
bluetoothctl
# [bluetooth]# scan on
# [bluetooth]# pair XX:XX:XX:XX:XX:XX
# [bluetooth]# connect XX:XX:XX:XX:XX:XX

# 5. Check Bluetooth logs
sudo journalctl -u bluetooth -f
```

---

## 💾 Filesystem Issues

### **Issue: "No space left on device"**

**Symptoms:** Cannot write files, even when `df` shows space available

**Solutions:**

```bash
# 1. Check disk space
df -h
df -i  # Check inode usage

# 2. Clear package cache
sudo apt clean
sudo apt autoclean

# 3. Clean temporary files
sudo rm -rf /tmp/*
sudo rm -rf /var/tmp/*

# 4. Check for large files
du -sh /* | sort -h
du -sh /home/* | sort -h

# 5. Remove old logs
sudo journalctl --vacuum=100M
sudo logrotate -f /etc/logrotate.conf

# 6. Rebuild smaller Yocto image
cd ~/yocto
nano build/conf/local.conf
# Add: IMAGE_ROOTFS_SIZE = "256"  # Reduce MB
# Remove: IMAGE_FEATURES += "dev-pkgs"

bitbake -c clean core-image-minimal
bitbake core-image-minimal
```

### **Issue: SD card corruption (read-only filesystem)**

**Symptoms:** "Read-only file system" errors

**Solutions:**

```bash
# 1. Check if SD card is physically locked
# Look for lock switch on card reader

# 2. Try remounting read-write
sudo mount -o remount,rw /

# 3. Repair filesystem from another device
# Insert SD card in USB reader on another machine
sudo fsck.ext4 -y /dev/sdX2

# 4. Flash fresh image (last resort)
sudo dd if=core-image-minimal-radxa-zero-3w.wic of=/dev/sdX bs=4M status=progress
```

---

## 🔌 GPIO & Hardware Issues

### **Issue: GPIO pins not accessible**

**Symptoms:** Permission denied when accessing GPIO, or no `/dev/gpiochip*` device

**Solutions:**

```bash
# 1. Check if gpiochip exists
ls -la /dev/gpiochip*

# 2. Add user to gpio group
sudo usermod -aG gpio $USER
newgrp gpio  # Apply immediately without logout

# 3. Check if libgpiod is installed
dpkg -l | grep libgpiod
# If not: sudo apt install python3-libgpiod

# 4. List GPIO pins
gpioinfo

# 5. Test GPIO access
gpioset gpiochip0 17=1  # Set GPIO 17 high
gpioget gpiochip0 17    # Read GPIO 17
```

### **Issue: Serial console not detected**

**Symptoms:** No `/dev/ttyUSB*` device appears when connecting FTDI

**Solutions:**

```bash
# 1. Check if device appears
lsusb | grep FTDI

# 2. Install FTDI driver
sudo apt install ftdi-eeprom libftdi1

# 3. Check permissions
ls -la /dev/ttyUSB*
sudo usermod -aG dialout $USER

# 4. Test connection
picocom -b 1500000 /dev/ttyUSB0
# Expected: U-Boot messages and Linux console

# 5. Check dmesg for driver errors
dmesg | grep ftdi
```

### **Issue: HDMI/Display not working**

**Solutions:**

```bash
# 1. Check if display is detected
cat /sys/class/drm/*/status

# 2. Force resolution (if partial support)
# Edit device tree or kernel command line
# Rebuild Yocto with custom .dts

# 3. Use alternative output
# Serial console is always available as fallback
# SSH over network if headless setup

# 4. Check kernel logs
dmesg | grep -i hdmi
dmesg | grep -i display
```

---

## 📦 Software Issues

### **Issue: Package installation fails**

**Symptoms:** `apt install` returns errors

**Solutions:**

```bash
# 1. Update package lists
sudo apt update

# 2. Fix broken dependencies
sudo apt install -f
sudo apt --fix-broken install

# 3. Check for held packages
apt-mark showhold

# 4. Clean package cache
sudo apt clean
sudo apt autoclean

# 5. Upgrade packages first
sudo apt upgrade

# 6. Try again
sudo apt install desired-package
```

### **Issue: Python3 import errors**

**Solutions:**

```bash
# 1. Check Python version
python3 --version

# 2. Install missing packages
sudo apt install python3-pip
pip3 list

# 3. Install missing dependencies
pip3 install --upgrade pip
pip3 install module-name

# 4. Check library paths
python3 -c "import sys; print(sys.path)"
```

---

## 🔐 Permission & Security Issues

### **Issue: "Permission denied" on commands**

**Solutions:**

```bash
# 1. Use sudo for privileged operations
sudo command-name

# 2. Add user to sudoers (carefully!)
sudo usermod -aG sudo username

# 3. Check file permissions
ls -la /path/to/file
sudo chmod 755 /path/to/file

# 4. Check group membership
groups  # Show current user groups
id      # Detailed user info
```

### **Issue: SSH connection refused**

**Solutions:**

```bash
# 1. Check if SSH server is running
sudo systemctl status ssh
sudo systemctl status openssh-server

# 2. Start SSH service
sudo systemctl start ssh
sudo systemctl enable ssh  # Enable on boot

# 3. Check SSH port
netstat -an | grep :22
sudo ss -tulpn | grep :22

# 4. Check SSH configuration
sudo cat /etc/ssh/sshd_config | grep -i permit
# Ensure: PermitRootLogin yes (for root)

# 5. Restart SSH service
sudo systemctl restart ssh
```

---

## 🏗️ Yocto Build Issues

### **Issue: Bitbake build fails**

**Solutions:**

```bash
# 1. Check for error logs
grep ERROR build/tmp/log.do_build

# 2. Clean recipe
bitbake -c clean recipe-name

# 3. Clean all and rebuild
bitbake -c clean core-image-minimal
bitbake core-image-minimal

# 4. Check dependencies
bitbake -g core-image-minimal  # Generate dependency graph

# 5. Verify layer configuration
cat build/conf/bblayers.conf
```

### **Issue: "OE-core layer is not available"**

**Solutions:**

```bash
# 1. Verify layer is cloned
ls -la meta-*

# 2. Update layers
cd openembedded-core
git pull origin master
cd meta-arm
git pull origin master

# 3. Reconfigure layers
source setup-environment radxa-zero-3w
```

### **Issue: Insufficient disk space during build**

**Solutions:**

```bash
# 1. Check available space
df -h

# 2. Clean Yocto cache
bitbake -c cleanall core-image-minimal
rm -rf build/tmp/

# 3. Use different build directory
# On larger partition:
mkdir /mnt/yocto-build
cd /mnt/yocto-build
source ~/yocto/oe-init-build-env

# 4. Reduce parallel jobs
nano build/conf/local.conf
# Set: BB_NUMBER_THREADS = "2"
# Set: PARALLEL_MAKE = "-j 2"
```

---

## 📊 Performance Issues

### **Issue: System is slow/unresponsive**

**Solutions:**

```bash
# 1. Check CPU usage
top -b -n 1 | head -20
ps aux --sort=-%cpu | head -10

# 2. Check memory usage
free -h
ps aux --sort=-%mem | head -10

# 3. Check disk I/O
iostat -x 1 5
iotop

# 4. Reduce unnecessary services
sudo systemctl list-units --type=service --state=running
sudo systemctl disable unnecessary-service
sudo systemctl stop unnecessary-service

# 5. Enable swap if low on RAM
sudo fallocate -l 512M /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## 📞 Getting Help

### **Collect Debug Information**

```bash
# System information
uname -a
cat /etc/os-release
free -h
df -h

# Kernel logs
dmesg | tail -50
sudo journalctl -n 100

# Network status
ip addr show
ip route show
ip link show

# Save all to file
{
  echo "=== System Info ==="
  uname -a
  echo "=== Memory ==="
  free -h
  echo "=== Disk ==="
  df -h
  echo "=== Kernel Logs ==="
  dmesg | tail -100
  echo "=== Network ==="
  ip addr show
} > debug-report-$(date +%Y%m%d_%H%M%S).txt
```

### **Contact Support**

1. **Radxa Forum** - <https://forum.radxa.com/>
2. **GitHub Issues** - <https://github.com/radxa/yocto/issues>
3. **Radxa Documentation** - <https://docs.radxa.com/en/zero/zero3>

**Always include:**

- Debug report from above
- Steps to reproduce issue
- Expected vs actual behavior
- Hardware/software versions

---

## 📚 Additional Resources

- [Yocto Troubleshooting](https://docs.yoctoproject.org/ref-manual/troubleshooting.html)
- [Linux Kernel Debugging](https://www.kernel.org/doc/html/latest/admin-guide/index.html)
- [Debian/Ubuntu Support](https://askubuntu.com/)
- [Radxa GitHub Issues](https://github.com/radxa)
