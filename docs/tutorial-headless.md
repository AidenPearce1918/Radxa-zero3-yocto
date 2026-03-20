# 🖥️ Headless Setup for Radxa Zero 3W

Setting up your Radxa Zero 3W without a monitor or keyboard is called **headless mode**. This guide walks you through accessing your board remotely over SSH, serial UART, or USB OTG.

---

## 📦 What You Need

* Radxa Zero 3W board
* MicroSD card with a flashed image (see [Flashing Guide](software-flashing.md))
* USB-C data cable or FTDI adapter
* Network access (WiFi or Ethernet via USB dongle)
* Optional: serial UART cable for first-time setup

---

## ⚙️ Option 1: SSH Over Ethernet or WiFi (Recommended)

### Step 1: Enable SSH (if image requires it)

Some OS images may disable SSH by default. If so:

1. Mount the microSD card on your PC.
2. Create an empty file named `ssh` (no extension) in the `/boot` partition.

### Step 2: Setup `wpa_supplicant.conf` (WiFi only)

Add this file in `/boot`:

```conf
country=IN
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
  ssid="YourSSID"
  psk="YourPassword"
}
```

### Step 3: Boot and Scan Network

Boot the board and find its IP address using:

```bash
nmap -sn 192.168.1.0/24
```

Or check your router’s DHCP list.

### Step 4: Connect via SSH

```bash
ssh radxa@<ip-address>
# default password might be: radxa
```

---

## 🔧 Option 2: Serial UART Console

Use this if SSH is unavailable or for first-time debug.

### Wiring (3.3V logic)

| FTDI | Radxa |
| ---- | ----- |
| GND  | GND   |
| TX   | RX    |
| RX   | TX    |

![UART Wiring Diagram](img/uart_wiring.png)

Use `screen`, `minicom`, or `PuTTY`:

```bash
screen /dev/ttyUSB0 115200
```

---

## 🔌 Option 3: USB OTG Ethernet (RNDIS / ECM)

Some OS images expose a virtual Ethernet device via USB-C.

1. Connect the USB-C to your PC
2. Your PC may see a new RNDIS or ECM device
3. Board may come up as `192.168.100.1` or similar

Try:

```bash
ssh radxa@192.168.100.1
```

---

## 🛠️ Tips & Troubleshooting

* Use `arp -a` to scan local IPs
* LEDs may indicate boot status (check Power Management)
* Use serial logs (`dmesg`) for troubleshooting

---

> ✅ Once connected, change the password and run system updates:

```bash
sudo passwd
sudo apt update && sudo apt upgrade
```
