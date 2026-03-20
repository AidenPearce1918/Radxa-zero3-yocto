# 📡 Remote Access (SSH & Serial)

Accessing your Radxa Zero 3W remotely allows you to work without a dedicated monitor and keyboard (Headless Mode).

---

## 1. SSH (Secure Shell)

SSH is the standard way to access Linux terminals over a local network.

**Connecting from Linux/macOS:**

```bash
ssh username@<ip_address>
```

* **Armbian Default:** `root` / `1234`

* **Yocto Default:** `root` (no password by default if `debug-tweaks` is enabled)

**Connecting from Windows:**
Use Windows Terminal, PuTTY, or MobaXterm.

## 2. Serial Console (UART)

If you lose network access, the serial console is your best fallback.

**Hardware setup:**

* Connect a 3.3V USB-to-Serial adapter to pins 6 (GND), 8 (TX), and 10 (RX).
* *See the Headless Setup for wiring diagrams.*

**Connection (Baud Rate: 115200):**

```bash
# On Linux/macOS
screen /dev/ttyUSB0 115200
```

*(Note: Exit `screen` by pressing `Ctrl+A` followed by `K`)*
