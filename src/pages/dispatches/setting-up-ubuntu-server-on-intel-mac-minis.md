# Setting Up Ubuntu Server on Intel Mac Minis: Complete Guide

This guide will walk you through setting up Ubuntu Server on Intel-based Mac Minis, configuring static IP addresses, and securing SSH access. Whether you're new to Linux or have some experience, this step-by-step tutorial will help you get your servers up and running.

> ℹ️ This is the guide I wished I had when I first set up my server. It's a bit verbose, but it's should get the job done.

## What You'll Find Here

- How to create a bootable Ubuntu Server USB drive
- How to install Ubuntu Server on Mac Minis
- How to configure static IP addresses (and why you need them)
- How to set up secure SSH access with key-based authentication
- Basic security hardening for your servers

## Prerequisites

- Intel-based Mac Mini (this guide is specifically for Intel Macs)
- USB drive (8GB or larger)
- Basic familiarity with terminal/command line (optional, we'll explain each step but you will feel more comfortable if you have some experience)
- Access to your network router configuration (optional, for advanced setup)

## Step 1: Download Ubuntu Server

1. Go to [https://ubuntu.com/download/server](https://ubuntu.com/download/server)
2. Download the latest LTS (Long Term Support) version
3. Save the `.iso` file to your computer

**Why LTS?** LTS versions receive security updates for 5 years, making them more stable for server use.

## Step 2: Create Bootable USB Drive

1. Download and install [Balena Etcher](https://www.balena.io/etcher/)
2. Insert your USB drive
3. Open Balena Etcher
4. Select the Ubuntu Server `.iso` file you downloaded
5. Select your USB drive
6. Click "Flash" and wait for completion

**Important:** This will erase everything on your USB drive. Make sure you don't have important data on it.

## Step 3: Install Ubuntu Server on Mac Mini

1. Insert the bootable USB into your Mac Mini
2. Power on the Mac Mini while holding the **Option key**
3. You'll see a boot menu - select the Ubuntu installation option
4. Follow the installation wizard:
   - Choose your language
   - Select keyboard layout
   - **Skip network configuration** (we'll do this manually later for better control)
   - Use entire disk for installation
   - Create your user account (remember this username - you'll need it later)
   - Skip additional software installation for now

5. After installation completes, remove the USB drive and reboot

**Why skip network configuration?** Manual network setup gives us more control and helps us understand what's happening.

## Step 4: Configure Static IP Address

**What is a static IP and why do we need it?**
A static IP means your server will always have the same IP address on your network. This makes it easier to connect to remotely and ensures other devices can always find it.

**Some guide on choosing an IP address:**
If you already know what IP address you want to use, you can skip this step and go to the next one.
If you don't know, here's a guide on choosing an IP address:
### Understanding IP Addresses and Where to Get Them

**Important:** You can't just use any IP address! The numbers must match your specific network setup.

### How to Find Your Network Information

**Option 1: Check Your Current Computer's Network Settings**

On **Mac/Linux**, run in terminal:
```bash
ip route | grep default
ifconfig | grep inet
```

On **Windows**, run in Command Prompt:
```cmd
ipconfig
```

Look for:
- **Gateway/Router IP** (usually ends in .1, like 192.168.1.1)
- **Your current IP** (this shows what range your network uses)
- **Subnet mask** (usually 255.255.255.0, which equals /24)

**Option 2: Check Your Router's Admin Panel**
1. Open a web browser
2. Go to your router's IP (usually 192.168.1.1 or 192.168.0.1)
3. Log in with admin credentials
4. Look for "Network Settings" or "LAN Settings"
5. Find the IP range and DHCP settings

**Option 3: Ask Your Network Administrator**
- In office/enterprise environments (like your DevOps team case)
- They'll provide you with:
  - Available IP address to use
  - Gateway/router IP
  - DNS servers
  - Subnet mask

### Choosing the Right IP Address

**For Home Networks:**
- Most home routers use these ranges:
  - `192.168.1.x` (gateway: 192.168.1.1)
  - `192.168.0.x` (gateway: 192.168.0.1)
  - `10.0.0.x` (gateway: 10.0.0.1)

**Pick an IP that's:**
- In the same range as your network
- NOT in the DHCP range (to avoid conflicts)
- NOT already used by another device

**Example:** If your router is 192.168.1.1 and gives out DHCP from .2 to .50, choose something like 192.168.1.100

**For Office/Enterprise Networks:**
- **Always ask your IT team or DevOps first**
- They manage IP allocation and have specific ranges for servers
- They may have firewall rules that depend on specific IP ranges
- Using wrong IPs can cause network conflicts

### What Each Number Means

Using `192.168.1.100/24` as an example:
- `192.168.1` = Your network identifier
- `.100` = Your specific device number
- `/24` = Subnet mask (means first 24 bits are for network, last 8 for devices)

**The gateway** (like 192.168.1.1) is your router - it connects your local network to the internet.

### DNS Servers
- **Home users:** Can use public DNS like 8.8.8.8 (Google) or 1.1.1.1 (Cloudflare)
- **Enterprise users:** Ask your IT team - they might have specific DNS servers you must use

### Run these commands on your Mac Mini server:

First, check your network interface:
```bash
ip a
```
This will show you the network interfaces on your server. You should see something like this:
```
enp1s0f0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:00:00:00:00:00 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.100/24 brd 192.168.1.255 scope global dynamic enp1s0f0
```

In this example, the network interface is `enp1s0f0`.
Pay attention to the state of the interface. If it's `DOWN`, you need to bring it up.

If the interface is `DOWN`, bring it up with the following command:
```bash
sudo ip link set enp1s0f0 up
```

Once the interface is up, you can set a static IP address.

Set a static IP address, for this example, we'll use `192.168.1.100/24` (replace with your network's IP range):
```bash
sudo ip a a 192.168.1.100/24 dev enp1s0f0
```

Add a default route to your router:
```bash
sudo ip r a default via 192.168.1.1
```

Test connectivity to your router:
```bash
ping 192.168.1.1
```
**Important:** Make sure the number of packets sent equals packets received. Press Ctrl+C to stop.

### Make the configuration permanent:

Create a network configuration file:
```bash
sudo nano /etc/systemd/network/10-ethernet.network
```

Add this content (adjust IP addresses for your network):
```
[Match]
Name=enp1s0f0

[Network]
DHCP=no
Address=192.168.1.100/24
Gateway=192.168.1.1
DNS=8.8.8.8
DNS=8.8.4.4

[Route]
Gateway=192.168.1.1
```

**How to use nano editor:**
- Type or paste the content above
- Press `Ctrl + X` to exit
- Press `Y` to save changes
- Press `Enter` to confirm the filename

**IP Address Explanation:**
- `192.168.1.100` - Your server's IP address
- `192.168.1.1` - Your router's IP address (gateway)
- `/24` - Subnet mask (means first 24 bits are for network, last 8 for devices)
- DNS servers `8.8.8.8` and `8.8.4.4` are Google's public DNS servers

Restart the network service:
```bash
sudo systemctl restart systemd-networkd
```

Verify your configuration:
```bash
ip addr show enp1s0f0
ip route show
```

## Step 5: Install and Configure SSH Server

**What is SSH?** SSH (Secure Shell) lets you connect to your server remotely from another computer, so you don't need to plug in a keyboard and monitor every time.

Install SSH server:
```bash
sudo apt update
sudo apt install openssh-server
```

Start and enable SSH service:
```bash
sudo systemctl start ssh
sudo systemctl enable ssh
```

Check that SSH is running:
```bash
sudo systemctl status ssh
```
You should see "active (running)" in green.

## Step 6: Set Up SSH Key Authentication

**Why use SSH keys instead of passwords?** SSH keys are much more secure than passwords and can't be brute-forced easily.

### Run these commands on your ***LOCAL*** computer (not the server):

Generate an SSH key pair:
```bash
ssh-keygen -t ed25519
```
**Just press Enter for all prompts** to use default settings.

Copy your public key to the server (replace `username` and IP address):
```bash
scp ~/.ssh/id_ed25519.pub username@192.168.1.100:~/
```
You'll need to enter your server password one last time.

### Run these commands on your ***SERVER***:

Create SSH directory with proper permissions:
```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
```

Add your public key to authorized keys:
```bash
cat ~/id_ed25519.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Remove the temporary key file:
```bash
rm ~/id_ed25519.pub
```

**Permission Numbers Explained:**
- `700` = Owner can read, write, execute; no one else can access
- `600` = Owner can read and write; no one else can access

### Test SSH connection from your ***LOCAL*** computer (make sure you use the username you set during installation and the IP address you set in the previous step):
```bash
ssh username@192.168.1.100
```
You should now connect without entering a password!

## Step 7: Secure SSH Configuration

**Why disable password authentication?** Once key-based authentication works, disabling passwords prevents brute-force attacks.

### Run on your SERVER:

Edit SSH configuration:
```bash
sudo nano /etc/ssh/sshd_config
```

Find and modify these lines (or add them if they don't exist):
```
PasswordAuthentication no
UsePAM no
```

**What these settings do:**
- `PasswordAuthentication no` - Disables password login, forces key-only access
- `UsePAM no` - Disables Pluggable Authentication Modules for additional security

Restart SSH service:
```bash
sudo systemctl restart ssh
```

### Test from your LOCAL computer:
```bash
ssh username@192.168.1.100
```
You should still connect successfully with your key.

## Adding More SSH Keys (Optional)

If you want to connect from multiple computers:

### On your SERVER:
```bash
nano ~/.ssh/authorized_keys
```
Add each new public key on a separate line, then:
```bash
chmod 600 ~/.ssh/authorized_keys
```

# You're Done!
> ℹ️ Your server is now ready for whatever projects you have in mind. Remember to keep it updated and monitor its security regularly.
