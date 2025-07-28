# 🚀 **Deployment Guide - Sistem Pesantren v2.0**

## 📋 **Overview**

Panduan lengkap untuk deploy Sistem Pesantren v2.0 ke production server atau local development environment.

## 🎯 **Deployment Options**

### **1. Local Development (XAMPP/LARAGON)**
- Untuk development dan testing
- Quick setup dengan built-in server

### **2. Shared Hosting (cPanel)**  
- Untuk website pesantren skala kecil-menengah
- Budget-friendly option

### **3. VPS/Cloud Server**
- Untuk performa optimal dan customization
- Scalable untuk growth

### **4. Docker Container**
- Untuk deployment yang konsisten
- Easy scaling dan maintenance

---

## 🛠️ **System Requirements**

### **Minimum Requirements**
| Component | Specification |
|-----------|---------------|
| **OS** | Windows 10+ / Ubuntu 18.04+ / CentOS 7+ |
| **Web Server** | Apache 2.4+ / Nginx 1.18+ |
| **PHP** | 8.0+ dengan extensions: PDO, JSON, GD, FileInfo |
| **Database** | MySQL 8.0+ / MariaDB 10.5+ |
| **Node.js** | 18.0+ (untuk build frontend) |
| **Memory** | 2GB RAM minimum |
| **Storage** | 5GB free space |
| **Bandwidth** | 10Mbps untuk 50 concurrent users |

### **Recommended Specifications**
| Component | Specification |
|-----------|---------------|
| **CPU** | 4 cores @ 2.5GHz |
| **Memory** | 8GB RAM |
| **Storage** | 20GB SSD |
| **Bandwidth** | 100Mbps |
| **Database** | Dedicated MySQL server |

---

## 🚀 **Quick Deploy (LARAGON/XAMPP)**

### **Step 1: Download & Install LARAGON**
```bash
# Download dari https://laragon.org/
# Install dengan default settings
# Start Apache & MySQL
```

### **Step 2: Clone Project**
```bash
cd C:\laragon\www\
git clone https://github.com/pesantren/web-pesantren.git
# Atau extract ZIP file ke folder
```

### **Step 3: Database Setup**
```bash
# Buka phpMyAdmin: http://localhost/phpmyadmin
# Create database: pesantren_db
# Import: DATABASE_SETUP.md SQL commands
```

### **Step 4: Configure Backend**
```php
<?php
// Edit: backend/config/database.php
$host = 'localhost';
$dbname = 'pesantren_db';
$username = 'root';
$password = '';  // Default LARAGON/XAMPP
?>
```

### **Step 5: Build Frontend**
```bash
cd frontend/
npm install
npm run build
# Files akan di-generate ke folder build/
```

### **Step 6: Test Installation**
```bash
# Akses: http://localhost/web-pesantren/frontend/build
# Login dengan:
# Admin: admin@pesantren.com / admin123
# Test semua fitur utama
```

**🎉 Done! Development environment ready in 15 minutes**

---

## 🌐 **Production Deployment**

### **Option 1: Shared Hosting (cPanel)**

#### **Step 1: Prepare Files**
```bash
# Compress project files
zip -r pesantren-v2.zip web-pesantren/
# Upload ke hosting via cPanel File Manager
```

#### **Step 2: Database Setup**
```sql
-- Create database via cPanel MySQL Databases
-- Import SQL via phpMyAdmin
-- Update credentials di backend/config/database.php
```

#### **Step 3: File Permissions**
```bash
# Set permissions via cPanel File Manager
chmod 755 backend/uploads/
chmod 755 backend/api/
chmod 644 backend/config/database.php
```

#### **Step 4: Domain Configuration**
```apache
# .htaccess di root folder
RewriteEngine On
RewriteRule ^$ frontend/build/ [L]
RewriteRule (.*) frontend/build/$1 [L]
```

### **Option 2: VPS Deployment (Ubuntu)**

#### **Step 1: Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install LAMP stack
sudo apt install apache2 mysql-server php8.0 php8.0-mysql php8.0-curl php8.0-gd php8.0-mbstring php8.0-xml php8.0-zip -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Enable Apache modules
sudo a2enmod rewrite
sudo systemctl restart apache2
```

#### **Step 2: Database Configuration**
```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database dan user
sudo mysql -u root -p
```

```sql
CREATE DATABASE pesantren_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pesantren_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON pesantren_db.* TO 'pesantren_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### **Step 3: Deploy Application**
```bash
# Clone ke server
cd /var/www/html/
sudo git clone https://github.com/pesantren/web-pesantren.git
sudo chown -R www-data:www-data web-pesantren/
sudo chmod -R 755 web-pesantren/

# Configure database
sudo nano web-pesantren/backend/config/database.php
```

#### **Step 4: Build Frontend**
```bash
cd /var/www/html/web-pesantren/frontend/
sudo npm install
sudo npm run build
```

#### **Step 5: Apache Virtual Host**
```apache
# /etc/apache2/sites-available/pesantren.conf
<VirtualHost *:80>
    ServerName pesantren.example.com
    DocumentRoot /var/www/html/web-pesantren/frontend/build
    
    <Directory /var/www/html/web-pesantren/frontend/build>
        AllowOverride All
        Require all granted
    </Directory>
    
    Alias /api /var/www/html/web-pesantren/backend/api
    <Directory /var/www/html/web-pesantren/backend/api>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/pesantren_error.log
    CustomLog ${APACHE_LOG_DIR}/pesantren_access.log combined
</VirtualHost>
```

```bash
# Enable site
sudo a2ensite pesantren.conf
sudo systemctl restart apache2
```

### **Option 3: Docker Deployment**

#### **Step 1: Create Dockerfile**
```dockerfile
# Dockerfile
FROM php:8.0-apache

# Install dependencies
RUN apt-get update && apt-get install -y \
    mysql-client \
    && docker-php-ext-install pdo pdo_mysql

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Copy application files
COPY backend/ /var/www/html/backend/
COPY frontend/build/ /var/www/html/

# Set permissions
RUN chown -R www-data:www-data /var/www/html/
RUN chmod -R 755 /var/www/html/

EXPOSE 80
```

#### **Step 2: Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    depends_on:
      - db
    environment:
      - DB_HOST=db
      - DB_NAME=pesantren_db
      - DB_USER=pesantren_user
      - DB_PASS=secure_password
    volumes:
      - ./backend/uploads:/var/www/html/backend/uploads

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: pesantren_db
      MYSQL_USER: pesantren_user
      MYSQL_PASSWORD: secure_password
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database_setup.sql:/docker-entrypoint-initdb.d/setup.sql

volumes:
  mysql_data:
```

#### **Step 3: Deploy with Docker**
```bash
# Build dan run
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs web
```

---

## 🔒 **Security Configuration**

### **SSL Certificate (Let's Encrypt)**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache -y

# Generate certificate
sudo certbot --apache -d pesantren.example.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **Security Headers**
```apache
# .htaccess di root
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
</IfModule>
```

### **File Upload Security**
```php
<?php
// backend/config/security.php
$allowed_extensions = ['jpg', 'jpeg', 'png', 'pdf'];
$max_file_size = 5 * 1024 * 1024; // 5MB
$upload_path = __DIR__ . '/../uploads/';

// Validate file uploads
function validateUpload($file) {
    global $allowed_extensions, $max_file_size;
    
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    if (!in_array($extension, $allowed_extensions)) {
        throw new Exception('File type not allowed');
    }
    
    if ($file['size'] > $max_file_size) {
        throw new Exception('File too large');
    }
    
    return true;
}
?>
```

---

## 📊 **Performance Optimization**

### **Database Optimization**
```sql
-- Add indexes untuk performa
ALTER TABLE santri ADD INDEX idx_nis (nis);
ALTER TABLE santri ADD INDEX idx_user_id (user_id);
ALTER TABLE nilai ADD INDEX idx_santri_mapel (santri_id, mapel_id);
ALTER TABLE jadwal ADD INDEX idx_kelas_hari (kelas_id, hari);
ALTER TABLE komunikasi ADD INDEX idx_penerima_status (penerima_id, status);

-- Query optimization
ANALYZE TABLE santri, nilai, jadwal, komunikasi;
```

### **Apache Configuration**
```apache
# /etc/apache2/apache2.conf
# Enable compression
LoadModule deflate_module modules/mod_deflate.so
<Location />
    SetOutputFilter DEFLATE
    SetEnvIfNoCase Request_URI \
        \.(?:gif|jpe?g|png)$ no-gzip dont-vary
</Location>

# Enable caching
LoadModule expires_module modules/mod_expires.so
ExpiresActive On
ExpiresByType text/css "access plus 1 month"
ExpiresByType application/javascript "access plus 1 month"
ExpiresByType image/png "access plus 1 year"
ExpiresByType image/jpg "access plus 1 year"
```

### **PHP Configuration**
```ini
; /etc/php/8.0/apache2/php.ini
memory_limit = 256M
upload_max_filesize = 10M
post_max_size = 20M
max_execution_time = 60
max_input_vars = 3000

; OPcache for production
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=4000
opcache.revalidate_freq=2
```

---

## 🔄 **Backup & Recovery**

### **Automated Backup Script**
```bash
#!/bin/bash
# backup.sh

# Configuration
BACKUP_DIR="/var/backups/pesantren"
DB_NAME="pesantren_db"
DB_USER="pesantren_user"
DB_PASS="secure_password"
APP_DIR="/var/www/html/web-pesantren"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Files backup
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz $APP_DIR/backend/uploads/

# Clean old backups (keep 7 days)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

### **Scheduled Backups**
```bash
# Add to crontab
sudo crontab -e

# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh >> /var/log/pesantren_backup.log 2>&1
```

### **Recovery Process**
```bash
# Database recovery
mysql -u pesantren_user -p pesantren_db < backup_file.sql

# Files recovery
cd /var/www/html/web-pesantren/backend/
tar -xzf files_backup_YYYYMMDD_HHMMSS.tar.gz
chown -R www-data:www-data uploads/
```

---

## 📈 **Monitoring & Maintenance**

### **Health Check Script**
```bash
#!/bin/bash
# health_check.sh

# Check Apache
if ! systemctl is-active --quiet apache2; then
    echo "Apache is down! Restarting..."
    systemctl restart apache2
fi

# Check MySQL
if ! systemctl is-active --quiet mysql; then
    echo "MySQL is down! Restarting..."
    systemctl restart mysql
fi

# Check disk space
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "Disk usage is at ${DISK_USAGE}%"
fi

# Check API endpoint
if ! curl -f http://localhost/web-pesantren/backend/api/dashboard/getUserStats.php >/dev/null 2>&1; then
    echo "API endpoint is not responding"
fi
```

### **Log Monitoring**
```bash
# Monitor error logs
tail -f /var/log/apache2/pesantren_error.log

# Monitor access logs
tail -f /var/log/apache2/pesantren_access.log

# Monitor MySQL logs
tail -f /var/log/mysql/error.log
```

### **Performance Monitoring**
```bash
# Check Apache status
sudo a2enmod status
# Access: http://localhost/server-status

# MySQL performance
SHOW FULL PROCESSLIST;
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Slow_queries';
```

---

## 🐛 **Troubleshooting**

### **Common Issues**

#### **1. "Database Connection Failed"**
```bash
# Check MySQL service
sudo systemctl status mysql

# Verify credentials
mysql -u pesantren_user -p pesantren_db

# Check firewall
sudo ufw status
```

#### **2. "Permission Denied" Upload Files**
```bash
# Fix permissions
sudo chown -R www-data:www-data /var/www/html/web-pesantren/backend/uploads/
sudo chmod -R 755 /var/www/html/web-pesantren/backend/uploads/
```

#### **3. "API Not Responding"**
```bash
# Check PHP errors
tail -f /var/log/apache2/error.log

# Test API directly
curl -X GET http://localhost/web-pesantren/backend/api/dashboard/getUserStats.php
```

#### **4. "Frontend Not Loading"**
```bash
# Rebuild frontend
cd /var/www/html/web-pesantren/frontend/
npm run build

# Check Apache config
sudo apache2ctl -t
sudo systemctl restart apache2
```

### **Performance Issues**

#### **Slow Loading Pages**
```sql
-- Check slow queries
SHOW VARIABLES LIKE 'slow_query_log';
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

#### **High Memory Usage**
```bash
# Check processes
top -p $(pgrep apache2 | tr '\n' ',' | sed 's/,$//')

# Optimize Apache
sudo nano /etc/apache2/mods-available/mpm_prefork.conf
```

---

## 📞 **Support & Maintenance**

### **24/7 Monitoring Setup**
```bash
# Install monitoring tools
sudo apt install nagios-nrpe-server htop iotop

# Setup email alerts
sudo apt install mailutils
# Configure in /etc/aliases
```

### **Support Contacts**
- **Emergency**: +62 812-3456-7890 (24/7)
- **Email**: support@pesantren.com
- **Ticket System**: https://support.pesantren.com
- **Documentation**: https://docs.pesantren.com

### **Maintenance Windows**
- **Regular Updates**: Sundays 02:00-04:00 WIB
- **Emergency Patches**: As needed
- **Security Updates**: Within 24 hours

---

## ✅ **Deployment Checklist**

### **Pre-Deployment**
- [ ] Server requirements verified
- [ ] Database backup created
- [ ] SSL certificate ready
- [ ] DNS configured
- [ ] Firewall rules set

### **Deployment**
- [ ] Files uploaded/cloned
- [ ] Database imported
- [ ] Configuration updated
- [ ] Permissions set correctly
- [ ] Apache/Nginx configured

### **Post-Deployment**
- [ ] All API endpoints tested
- [ ] Login functionality verified
- [ ] File uploads working
- [ ] Email notifications tested
- [ ] Performance benchmarks met

### **Go-Live**
- [ ] DNS propagation complete
- [ ] SSL certificate active
- [ ] Monitoring active
- [ ] Backup schedule configured
- [ ] Support team notified

---

**🎉 Deployment Complete!**  
*Your Sistem Pesantren v2.0 is now live and ready to serve your educational community.*
