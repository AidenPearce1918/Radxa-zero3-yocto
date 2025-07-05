# 🚦 GPIO Projects Tutorial

Welcome! This guide will help you get hands-on with the GPIO pins on your **Radxa Zero 3W**.  
The GPIO header is Raspberry Pi compatible, so you can use many existing guides and accessories.

---

## 🧰 Prerequisites

- 🟢 **Radxa Zero 3W** board with Debian/Ubuntu/Armbian
- 🟢 Breadboard & jumper wires
- 🟢 LED, 330Ω resistor, push button
- 🟢 Python 3

---

## 🌐 Protocols at a Glance

!!! info "🧑‍💻 Basic Protocols"
    - 🟢 **GPIO:** Digital input/output (LEDs, buttons)
    - 🔵 **I2C:** Two-wire for sensors/LCDs (SDA, SCL)
    - 🟣 **SPI:** Four-wire for displays/ADCs (MOSI, MISO, SCLK, CS)
    - 🟠 **UART:** Serial (TX, RX) for debug, GPS, Bluetooth

---

## ⚙️ Setting Up GPIO Access

1. 🛠️ **Install Python GPIO library:**
    ```bash
    sudo apt update
    sudo apt install python3-libgpiod
    ```
2. 🛡️ **Enable GPIO permissions:**
    ```bash
    sudo usermod -aG gpio $USER
    ```
3. 🔄 **Reboot** to apply group changes.

---

## 💡 Project 1: Blinking an LED

![LED GPIO Connection](img/gpio_led_connection.png)

**Wiring:**  
- 🔴 LED anode → GPIO17 (pin 11)  
- 🟤 LED cathode → 330Ω resistor → GND (pin 6)

!!! tip "Why use a resistor?"
    The resistor limits current to protect your LED and GPIO pin.

**Python Code:**  
```python
import gpiod
import time

chip = gpiod.Chip('gpiochip0')
line = chip.get_line(17)
line.request(consumer='blink', type=gpiod.LINE_REQ_DIR_OUT)

try:
    while True:
        line.set_value(1)
        time.sleep(1)
        line.set_value(0)
        time.sleep(1)
except KeyboardInterrupt:
    line.set_value(0)
```

---

## 🔘 Project 2: Reading a Button

![Button GPIO Connection](img/gpio_button_connection.png)

**Wiring:**  
- 🔵 Button → GPIO27 (pin 13)  
- ⚫ Other side → GND (pin 14)

!!! question "How does this work?"
    When you press the button, the GPIO pin is connected to ground, registering a LOW signal.

**Python Code:**  
```python
import gpiod
import time

chip = gpiod.Chip('gpiochip0')
line = chip.get_line(27)
line.request(consumer='button', type=gpiod.LINE_REQ_DIR_IN)

print("Press the button (Ctrl+C to exit)")
try:
    while True:
        if line.get_value():
            print("Button pressed!")
        time.sleep(0.1)
except KeyboardInterrupt:
    pass
```

---

## 🖥️ Project 3: Using an I2C LCD (16x2)

![I2C LCD GPIO Connection](img/gpio_i2c_lcd_connection.png)

**Wiring:**  
- 🟢 SDA → GPIO2 (pin 3)  
- 🟣 SCL → GPIO3 (pin 5)  
- 🔴 VCC → 3.3V (pin 1)  
- ⚫ GND → GND (pin 6)

!!! info "Install LCD library"
    ```bash
    sudo pip3 install RPLCD
    ```

**Python Code:**  
```python
from RPLCD.i2c import CharLCD
import time

lcd = CharLCD('PCF8574', 0x27)  # 0x27 is a common I2C address for LCDs

lcd.write_string('Hello, Radxa!')
time.sleep(2)
lcd.clear()
lcd.write_string('GPIO Tutorial')
time.sleep(2)
lcd.clear()
```

---

## 🚀 More Project Ideas

- 🟢 Control a relay or buzzer
- 🟣 Read data from I2C/SPI sensors
- 🔵 Drive an OLED or LCD display
- 🟠 Build a simple robot (motors via PWM)

---

## 📚 References

- [Radxa GPIO Wiki](https://wiki.radxa.com/Zero3/dev/libgpiod)
- [Official Documentation](https://docs.radxa.com/en/zero/zero3)
- [Pinout Diagram](hardware-pinout.md)

!!! warning "⚠️ Voltage Warning"
    All GPIOs use 3.3V logic. **Do not connect 5V devices directly to GPIO pins.**