# 🚀 First Boot & Initial Setup

Congratulations on successfully flashing your Radxa Zero 3W! This tutorial will guide you through the crucial first steps after powering on your device for the very first time.

---

## 🔌 1. Powering On

1. **Insert the microSD card** (or ensure your eMMC is flashed).
2. **Connect your peripherals** (optional): If you are using a desktop environment, connect your HDMI monitor, keyboard, and mouse.
3. **Apply Power:** Connect a reliable 5V/2A power supply to the USB-C port.
4. **Watch the LED:** The green power LED should turn on. If configured in your OS, a blue activity LED will blink as the system boots.

![Radxa Zero 3W Powered On](img/board_powered_on.png)

!!! info "Boot Time"
    The first boot usually takes a bit longer (1-3 minutes) because the operating system is generating SSH keys and resizing the root filesystem to fill the SD card.

---

## 🔑 2. Logging In

Depending on your setup, you can log in locally (via HDMI) or remotely (via SSH/Serial).

**Default Credentials:**

* **Yocto Project (if `debug-tweaks` is enabled):**
  * **Username:** `root`
  * **Password:** *(none, just press Enter)*
* **Armbian:**
  * **Username:** `root`
  * **Password:** `1234`

*(Note: Armbian will force you to create a new root password and a standard user account immediately upon first login).*

👉 If you are running headless, see the Remote Access Guide for instructions on finding your board's IP address and connecting via SSH.

---

## 🛡️ 3. Change Your Password

If you are using a custom Yocto build with `debug-tweaks` enabled, your system is completely open. **Secure it immediately.**

```bash
passwd
```

Enter your new password twice when prompted.

---

## 💽 4. Verify Filesystem Expansion

Most modern images (like Armbian) auto-expand the root partition to use the entire SD card. Let's verify this:

```bash
df -h /
```

If the size looks much smaller than your SD card, you may need to expand it manually.

**On Armbian:**
Run `armbian-config`, navigate to **System** -> **Expand**, and reboot.

**On Yocto:**
If you built the image with a fixed `IMAGE_ROOTFS_SIZE`, you will need to use `parted` and `resize2fs` manually:

```bash
# Example commands (use carefully, assuming root is mmcblk0p2)
parted /dev/mmcblk0 resizepart 2 100%
resize2fs /dev/mmcblk0p2
```

---

## 🕒 5. Set Date and Time

The Radxa Zero 3W does not have a hardware Real-Time Clock (RTC) with a battery backup. This means the time will reset on every power cycle unless connected to the internet.

Check the current date and time:

```bash
date
```

Enable Network Time Protocol (NTP) to sync the time automatically (requires internet connection):

```bash
# On systemd-based systems (Yocto/Armbian)
timedatectl set-ntp true
timedatectl status
```

To set your timezone:

```bash
# List available timezones
timedatectl list-timezones

# Set your timezone (e.g., New York)
timedatectl set-timezone America/New_York
```

---

## ✅ Next Steps

Your Radxa Zero 3W is now secure, configured, and ready for development!

* Network & Wi-Fi Setup
* Remote Access (SSH & Serial)
* Blinking an LED with GPIO
