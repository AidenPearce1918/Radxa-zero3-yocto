# 🌐 Networking Setup

The Radxa Zero 3W comes equipped with an **AIC8800** wireless chip, providing support for **Wi-Fi 6 (802.11ax)** and **Bluetooth 5.4**. 

This guide will walk you through configuring your network connections using the command line, which is essential for headless setups and custom Yocto builds.

---

## 📶 1. Connecting to Wi-Fi

Depending on the operating system and packages you included in your build, you will typically use either `NetworkManager` (`nmcli`) or `wpa_supplicant`.

### Method A: Using NetworkManager (Recommended)

If you are using Armbian or included `networkmanager` in your Yocto build, `nmcli` is the easiest way to manage Wi-Fi.

**1. Verify the Wi-Fi radio is enabled:**
```bash
nmcli radio wifi on
```

**2. Scan for available networks:**
```bash
nmcli device wifi list
```

**3. Connect to your network:**
Replace `YOUR_SSID` and `YOUR_PASSWORD` with your actual Wi-Fi details.
```bash
sudo nmcli device wifi connect "YOUR_SSID" password "YOUR_PASSWORD"
```

**4. Verify connection:**
```bash
ip a show wlan0
```
You should see an `inet` address assigned to your board.

### Method B: Using `wpa_supplicant`

For minimal Yocto builds without NetworkManager, `wpa_supplicant` is the standard tool.

**1. Generate your PSK (Pre-Shared Key):**
```bash
wpa_passphrase "YOUR_SSID" "YOUR_PASSWORD" | sudo tee /etc/wpa_supplicant/wpa_supplicant-wlan0.conf
```

**2. Start the `wpa_supplicant` service:**
```bash
sudo systemctl enable wpa_supplicant@wlan0
sudo systemctl start wpa_supplicant@wlan0
```

**3. Request an IP address:**
```bash
sudo dhclient wlan0
```

---

## 🎧 2. Setting Up Bluetooth

The Radxa Zero 3W's Bluetooth 5.4 can be managed using the `bluetoothctl` utility.

**1. Check Bluetooth service status:**
```bash
sudo systemctl status bluetooth
```
*(If it's not running, start it with `sudo systemctl start bluetooth`)*

**2. Enter the Bluetooth control prompt:**
```bash
bluetoothctl
```

**3. Power on and scan for devices (inside the `bluetoothctl` prompt):**
```text
[bluetooth]# power on
[bluetooth]# agent on
[bluetooth]# default-agent
[bluetooth]# scan on
```

**4. Pair and connect:**
Find the MAC address of your device from the scan list (e.g., `XX:XX:XX:XX:XX:XX`).
```text
[bluetooth]# pair XX:XX:XX:XX:XX:XX
[bluetooth]# trust XX:XX:XX:XX:XX:XX
[bluetooth]# connect XX:XX:XX:XX:XX:XX
```
Type `quit` to exit the prompt.

---

## 🔌 3. Using USB Ethernet

Because the Radxa Zero 3W does not have a built-in Ethernet port, you can use a USB-C to Gigabit Ethernet adapter (like those based on the RTL8153 or AX88179 chips) for a stable wired connection.

**1. Plug in your USB Ethernet adapter.**

**2. Check if the device is recognized:**
```bash
lsusb
ip link
```
You should see a new interface, usually named `eth0` or `enx...`.

**3. Bring the interface up and get an IP:**
```bash
sudo ip link set eth0 up
sudo dhclient eth0
```
*(Note: NetworkManager usually handles this automatically the moment you plug it in).*

---

## 🛠️ Troubleshooting

* **"wlan0 not found":** The AIC8800 driver might not be loaded. Check your kernel logs using `dmesg | grep aic`. In custom Yocto builds, ensure `linux-firmware-aic8800` is included in your `IMAGE_INSTALL`.
* **"rfkill hard blocked":** If Wi-Fi or Bluetooth is blocked, unblock it using:
  ```bash
  sudo rfkill unblock all
  ```
* **Connection drops:** Ensure your 5V/2A power supply is stable. High Wi-Fi transmission power combined with CPU load can cause brownouts if the power supply is weak.

---

**Next Steps:** Now that you're connected, you can set up Remote Access (SSH) so you no longer need a keyboard and monitor connected to the board!