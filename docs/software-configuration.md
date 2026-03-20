# ⚙️ Software Configuration

After flashing your OS and completing the first boot, you may need to configure system settings, hardware interfaces, and network properties.

---

## 1. Armbian Configuration (`armbian-config`)
If you are running Armbian, the easiest way to configure your system is using the built-in graphical utility:

```bash
sudo armbian-config
```

* **System:** Set hostname, timezone, and language.
* **Network:** Connect to Wi-Fi, set static IP addresses.
* **Hardware:** Enable/disable device tree overlays (I2C, SPI, UART).

## 2. Yocto Configuration
In a custom Yocto build, configuration is typically done during the build phase via `local.conf`. To change settings post-boot manually:

* **Timezone:** Run `timedatectl set-timezone Region/City`
* **Hostname:** Edit `/etc/hostname` and `/etc/hosts`, then reboot.
* **Hardware Interfaces:** Modify the `uEnv.txt` or `extlinux.conf` in your `/boot` partition to load specific `.dtbo` (Device Tree Blob Overlays) to enable SPI, I2C, or extra UART ports.
