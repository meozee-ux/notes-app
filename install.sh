#!/bin/bash

# Install script for CachyOS with Wayland and Hyprland support

# Function to detect Node.js installation
check_node() {
  if command -v node > /dev/null 2>&1; then
    echo "Node.js is installed."
  else
    echo "Node.js is not installed. Installing..."
    pacman -S --noconfirm nodejs npm
  fi
}

# Function to configure systemd service for Wayland
configure_systemd_service() {
  echo "[Unit]\nDescription=MyApp Wayland Service\nAfter=display-manager.service\n\n[Service]\nExecStart=/path/to/your/app\nEnvironment=WAYLAND_DISPLAY=wayland-0\n\n[Install]\nWantedBy=default.target" > /etc/systemd/system/myapp.service

  systemctl daemon-reload
  systemctl enable myapp.service
}

# Function to detect browser for Hyprland
check_browser() {
  if command -v firefox > /dev/null 2>&1; then
    echo "Firefox is installed for Hyprland."
  elif command -v chromium > /dev/null 2>&1; then
    echo "Chromium is installed for Hyprland."
  else
    echo "No supported browser found for Hyprland."
  fi
}

# Start the installation process
check_node
configure_systemd_service
check_browser
