# 🚀 Getting Started with Radxa Zero 3W

Welcome to your Radxa Zero 3W! This step-by-step guide will help you set up your board, from unboxing to your first successful login—whether you’re a newcomer or a seasoned maker.

---

## 📦 1. Unboxing

**What’s in the box:**

* Radxa Zero 3W board
* (Optional) Power supply, USB OTG cable, heatsink, case

**What you’ll need:**

* microSD card (Class 10/UHS-1, 8GB or larger recommended)
* USB-C power supply (5V/2A or higher)
* HDMI cable and display (for desktop setup)
* USB keyboard and mouse (for desktop setup)
* FTDI USB-to-serial adapter (for headless setup or troubleshooting)

!!! tip "Why use a quality power supply?"
Using a reliable 5V/2A USB-C power supply ensures stable operation and helps prevent random reboots or SD card corruption.

---

## 📀 2. Download an Operating System Image

Select the operating system that best fits your needs:

* [Custom Yocto Images](https://github.com/aidenpearce1918/radxa-zero3w-yocto-guide/releases): Built for embedded developers
* [Armbian Images](https://www.armbian.com/radxa-zero/): Lightweight CLI or minimal GUI options

!!! info "Which OS should I choose?"
\- **Armbian:** Ideal for lightweight headless or server usage.
\- **Yocto:** Best for embedded development and custom firmware integration.

---

## 📝 3. Flash the OS to Your microSD Card

**Steps:**

1. Download [Balena Etcher](https://www.balena.io/etcher/) or your preferred flashing tool.
2. Insert your microSD card into your computer.
3. Open Etcher, select the downloaded OS image and your SD card.
4. Click **Flash** and wait for the process to complete.
5. Safely eject the microSD card from your computer.

!!! tip "Verify your download"
Always check the image checksum (SHA256 or MD5) to avoid corrupted flashes and boot issues.

---

## 🛠️ 4. UART Serial Console (Optional)

For headless setup or troubleshooting, connect a 3.3V FTDI USB-to-serial adapter:

| FTDI Pin | Zero 3W Pin |
| -------- | ----------- |
| GND      | GND         |
| TX       | RX          |
| RX       | TX          |

**How to connect:**

* **Linux/macOS:**

  ```bash
  screen /dev/ttyUSB0 115200
  ```
* **Windows:**
  Use [PuTTY](https://www.putty.org/) or [Tera Term](https://osdn.net/projects/ttssh2/releases/).

!!! info "Why use UART?"
UART gives you direct access to the board’s console, even if HDMI is not working or you’re running headless.

---

## ⚡ 5. First Boot

1. Insert the flashed microSD card into the Radxa Zero 3W.
2. Connect HDMI, keyboard, and mouse (if using desktop mode).
3. Connect the power supply via USB-C.
4. Wait for the system to boot. The first boot may take a few minutes as the OS resizes the filesystem and initializes.

**Default login credentials:**

* Username: `radxa`
* Password: `radxa`

!!! warning "Change your password!"
For security, change your password immediately after first login:
`bash
    passwd
    `

---

## 🔄 6. Update Your System

After logging in, update your packages for the latest features and security patches:

```bash
sudo apt update && sudo apt upgrade
```

This ensures your system is up to date and secure.

---

## 🌐 7. Connect to the Internet

* **Wi-Fi:**

  * Desktop: Use the network manager icon in the taskbar.
  * Terminal: Run `nmtui` and follow the prompts to connect to your Wi-Fi network.
* **Ethernet:**

  * Use a USB-to-Ethernet adapter for a wired connection. Most adapters are plug-and-play.

!!! tip "Headless Wi-Fi setup"
You can pre-configure Wi-Fi by editing `wpa_supplicant.conf` on the SD card’s `/boot` partition before first boot (if supported by your OS image).

---

## 🧑‍💻 8. Next Steps

* [Hardware Overview](hardware.md): Explore board features, layout, and specs.
* [Software Overview](software.md): Learn about supported OS, configuration, and package management.
* [First Boot Tutorial](tutorial-first-boot.md): Step-by-step guide for your first login and setup.
* [GPIO Projects](tutorial-gpio.md): Start building hardware projects with the GPIO header.
* [Pinout Diagram](hardware-pinout.md): Reference for all GPIO pins and functions.

---

## ❓ Need Help?

* [Radxa Forum](https://forum.radxa.com/): Community support and discussions.
* [Documentation Archive](https://dl.radxa.com/zero3/docs/hw/3w/): Schematics and datasheets.
* [Troubleshooting](troubleshooting.md): Solutions to common issues.

---

## 🎉 Congratulations!

You’ve completed the initial setup for your Radxa Zero 3W.
Explore the rest of the documentation to unlock the full potential of your board. Happy hacking!