# 🔌 Power Management

The Radxa Zero 3W is a low-power device, but providing a stable power supply is critical for reliability, especially when using Wi-Fi or high-draw peripherals.

---

## ⚡ Power Supply Requirements
* **Connector:** USB Type-C
* **Recommended Voltage/Current:** 5V / 2A (10W minimum)
* **Powering via GPIO:** You can power the board via the 5V (Pins 2 or 4) and GND pins on the 40-pin header. *Note: This bypasses some input protection circuitry. Only do this if you have a highly stable, regulated 5V supply.*

## 🔋 Power Consumption (Estimates)
* **Idle:** ~1.0W - 1.5W
* **Under Load (CPU/GPU):** ~3.0W - 4.5W
* **With Wi-Fi/Bluetooth Active:** Adds ~0.5W - 1.0W

!!! warning "No RTC Battery"
    The Radxa Zero 3W does **not** have an onboard Real-Time Clock (RTC) battery. The system time will reset when power is lost. Ensure the board is connected to the internet to sync time via NTP automatically.
