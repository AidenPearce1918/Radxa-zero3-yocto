# 🔄 Updates & Upgrades

This guide covers system updates, kernel upgrades, and maintenance strategies for your Radxa Zero 3W.

---

## 📋 Overview

### **Update Types**

1. **Package Updates** - Individual package security/feature updates
2. **System Updates** - Full system patches and component upgrades
3. **Kernel Updates** - Linux kernel version upgrades
4. **Bootloader Updates** - U-Boot and firmware updates
5. **Full Image Reflash** - Deploy completely new OS image

---

## 🔄 Package Updates

### **APT-based Systems (Armbian, Debian Yocto)**

#### **Update Package Lists**

```bash
sudo apt update
```

This refreshes local package metadata from repositories. Run this regularly.

#### **Check Available Updates**

```bash
apt list --upgradable
# OR
apt-get -s upgrade  # Simulate upgrade
```

#### **Install Available Updates**

```bash
# Upgrade all packages
sudo apt upgrade

# Full upgrade (may remove packages)
sudo apt full-upgrade

# Upgrade specific package
sudo apt install --upgrade curl
```

#### **Security Updates**

```bash
# Install only security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Check what would be upgraded
sudo unattended-upgrade -d  # Dry run
```

**Enable automatic updates (optional):**

```bash
# Edit configuration
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades

# Add:
Unattended-Upgrade::Mail "root";
Unattended-Upgrade::Automatic-Reboot "true";
Unattended-Upgrade::Automatic-Reboot-Time "02:00";
```

### **OPKG-based Systems (Lightweight Yocto)**

If your Yocto image uses `opkg`:

```bash
# Update package lists
opkg update

# Upgrade all packages
opkg upgrade

# Specific package
opkg install --upgrade curl
```

---

## 🐧 System Updates

### **Full System Upgrade (Dist-Upgrade)**

```bash
sudo apt update
sudo apt full-upgrade

# Reboot to apply all changes
sudo reboot
```

**Warning:** May take 10-30 minutes and require reboot.

### **Update Kernel**

#### **Via Package Manager**

```bash
# Check current kernel
uname -r
# Output: 5.10.110-radxa-zero-3w

# Update kernel package
sudo apt update
sudo apt install --upgrade linux-image-current-radxa-zero-3w

# Reboot to use new kernel
sudo reboot
```

#### **Verify Kernel After Update**

```bash
uname -r
uname -a
```

### **Update Bootloader**

#### **Check Current Version**

```bash
# U-Boot version
strings /dev/mtd0 | grep "U-Boot"
# OR
sudo cat /proc/version
```

#### **Update U-Boot**

For Yocto-based systems:

```bash
# From latest Yocto build
sudo dd if=u-boot.bin of=/dev/mmcblk0 bs=512 seek=64

# Reboot to apply
sudo reboot
```

For Armbian:

```bash
# Typically handled by apt
sudo apt update
sudo apt install --upgrade u-boot-radxa-zero-3w

# Or manual:
armbian-install  # Interactive tool
```

---

## 🎯 Rebuild & Redeploy Yocto Image

The most thorough way to "update" for custom Yocto systems is to rebuild and reflash.

### **Scenario: You've Modified Yocto Configuration**

```bash
# Navigate to Yocto directory
cd ~/yocto
source setup-environment radxa-zero-3w

# Make changes to local.conf or recipes
nano build/conf/local.conf

# Clean old build artifacts
bitbake -c clean core-image-minimal

# Rebuild with new configuration
bitbake core-image-minimal

# Output: build/tmp/deploy/images/radxa-zero-3w/
```

### **Reflash Updated Image**

```bash
# Locate new image
ls -lh build/tmp/deploy/images/radxa-zero-3w/*.wic*

# Flash to board
sudo dd if=core-image-minimal-radxa-zero-3w.wic of=/dev/sdX bs=4M status=progress
sudo sync
```

---

## 📦 Add/Remove Packages Post-Boot

### **Install New Packages**

```bash
# Single package
sudo apt install vim

# Multiple packages
sudo apt install git curl htop tmux

# From custom repository
echo "deb [trusted=yes] https://your-repo.com/deb ./ " | \
  sudo tee /etc/apt/sources.list.d/custom.list
sudo apt update
sudo apt install your-package
```

### **Remove Packages**

```bash
# Remove unused package
sudo apt remove curl

# Remove and clean config
sudo apt purge curl

# Auto-remove unused dependencies
sudo apt autoremove
```

### **Clean Package Cache**

```bash
# Remove downloaded package files
sudo apt clean

# Remove only old versions
sudo apt autoclean
```

---

## 💾 Backup Before Updates

### **Backup Root Filesystem**

```bash
# Create image of current SD card
sudo dd if=/dev/sdX of=radxa-zero-3w-backup-$(date +%Y%m%d).img bs=4M status=progress

# Compress backup
bzip2 radxa-zero-3w-backup-*.img
```

### **Backup Important Data**

```bash
# Compress home directory
tar -czf home-backup-$(date +%Y%m%d).tar.gz /home/

# Backup system configuration
sudo tar -czf etc-backup-$(date +%Y%m%d).tar.gz /etc/

# SCP to another machine
scp *.tar.gz user@backup-server:/backups/
```

---

## 🔄 Rollback Procedures

### **If Update Breaks System**

#### **1. Boot with Backup Image**

```bash
# Flash previous working image
sudo dd if=radxa-zero-3w-backup-previous.img of=/dev/sdX bs=4M
sudo reboot
```

#### **2. Downgrade Package**

```bash
# If only specific package is broken
sudo apt install package-name=X.Y.Z  # Specify version

# OR remove and reinstall
sudo apt remove broken-package
sudo apt install broken-package
```

#### **3. Check Package Version History**

```bash
# Show available versions
apt-cache policy curl

# Show package history
apt-cache showpkg curl
```

---

## 📅 Update Schedule & Maintenance

### **Recommended Schedule**

| Task | Frequency | Impact |
|------|-----------|--------|
| `apt update` | Daily/Weekly | None (metadata only) |
| `apt upgrade` | Weekly | Minimal reboot |
| Full system upgrade | Monthly | Reboot required |
| Security patches | ASAP | Reboot may be needed |
| Kernel updates | Quarterly | Reboot required |
| Bootloader updates | As needed | System must be offline |

### **Automated Update Script**

```bash
#!/bin/bash
# Update script with logging

LOG_FILE="/var/log/system-update-$(date +%Y%m%d).log"

echo "Starting system update at $(date)" >> $LOG_FILE
apt update >> $LOG_FILE 2>&1
apt -y upgrade >> $LOG_FILE 2>&1
apt -y autoremove >> $LOG_FILE 2>&1
echo "Update completed at $(date)" >> $LOG_FILE

# Reboot if kernel was updated
if grep -q "linux-image" $LOG_FILE; then
    echo "Kernel updated. Rebooting..."
    sudo shutdown -r +5 "System rebooting after kernel update"
fi
```

**Schedule with cron:**

```bash
# Edit crontab
sudo crontab -e

# Run updates daily at 2 AM
0 2 * * * /usr/local/bin/update-system.sh
```

---

## 🔐 Security Updates Priority

### **Critical Security Patches**

Always apply immediately:

```bash
# Kernel security fix
sudo apt install --upgrade linux-image-*

# libc, openssl, openssh
sudo apt install --upgrade libc6 openssl openssh-client openssh-server
```

### **Check Security Advisories**

```bash
# Debian Security Tracker
https://security-tracker.debian.org/

# Ubuntu Security Notices
https://ubuntu.com/security/notices

# For Yocto
https://www.yoctoproject.org/software-overview/security/
```

---

## 🧪 Testing Updates

### **Test in Staging Environment**

Before deploying to production:

```bash
# Clone to test device/image
cp radxa-zero-3w.img test-radxa-zero-3w.img
sudo dd if=test-radxa-zero-3w.img of=/dev/sdY bs=4M

# Test updates on test device
ssh root@test-device
sudo apt update && sudo apt upgrade
# Verify functionality
```

### **Update Verification**

```bash
# Check if system still boots
sudo reboot

# Verify services running
sudo systemctl status
sudo systemctl list-units --all --type=service

# Check kernel
uname -r

# Check disk space
df -h

# Check running processes
ps aux
```

---

## 🐛 Troubleshooting Update Issues

### **Issue: "E: Unable to locate package"**

```bash
# Update package lists
sudo apt update

# Check repositories
cat /etc/apt/sources.list
ls /etc/apt/sources.list.d/

# Add missing repository if needed
```

### **Issue: "E: Could not get lock"**

```bash
# Another apt process is running
lsof /var/lib/apt/lists/lock

# Wait or force kill (careful!)
sudo rm /var/lib/apt/lists/lock
sudo apt update
```

### **Issue: "Breaks dependencies"**

```bash
# Install with force dependencies
sudo apt install --fix-broken

# OR clean and restart
sudo apt clean
sudo apt autoclean
sudo apt update
sudo apt install --fix-missing
```

---

## 📊 Monitoring System Health

### **Check System Load**

```bash
uptime
top -b -n 1
htop
```

### **Monitor Disk Space**

```bash
df -h
du -sh /home/*
ncdu /  # Interactive disk usage
```

### **Check Update Status**

```bash
# Pending updates
apt list --upgradable

# Held packages (won't auto-update)
apt-mark showhold
```

---

## ✅ Checklist: After Major Update

- [ ] Reboot system and verify boot
- [ ] Check kernel version: `uname -r`
- [ ] Verify all services running: `systemctl status`
- [ ] Test network connectivity: `ping -c 3 8.8.8.8`
- [ ] Check disk space: `df -h`
- [ ] Run application tests
- [ ] Backup current state if satisfied

---

## 📚 Next Steps

1. **Troubleshooting Issues** → [Troubleshooting Guide](troubleshooting.md)
2. **Configure System** → [Configuration Guide](software-configuration.md)
3. **First Boot Setup** → [First Boot Tutorial](tutorial-first-boot.md)

---

## 🔗 Resources

- [Debian Apt Manual](https://wiki.debian.org/apt)
- [Ubuntu Update Guide](https://help.ubuntu.com/stable/serverguide/updates.html)
- [Yocto Package Management](https://docs.yoctoproject.org/manual/manage-layers.html)
- [Armbian Documentation](https://docs.armbian.com/)

