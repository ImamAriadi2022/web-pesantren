#!/bin/bash

echo "Starting Web Pesantren Development Server..."

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "MySQL is not running. Starting MySQL..."
    sudo mysqld_safe --skip-grant-tables &
    sleep 3
fi

# Check if database exists
if ! sudo mysql -u root -S /var/run/mysqld/mysqld.sock -e "USE web_pesantren;" 2>/dev/null; then
    echo "Creating database and importing schema..."
    sudo mysql -u root -S /var/run/mysqld/mysqld.sock -e "CREATE DATABASE IF NOT EXISTS web_pesantren;"
    sudo mysql -u root -S /var/run/mysqld/mysqld.sock web_pesantren < backend/db/db-fix.sql
fi

# Kill existing PHP server
pkill -f "php -S" 2>/dev/null

# Start PHP server with MySQL user
echo "Starting PHP development server..."
sudo -u mysql php -S 0.0.0.0:8000 -t backend &

echo "Server started successfully!"
echo "API Base URL: http://localhost:8000/api/"
echo "Surat Izin API: http://localhost:8000/api/surat_izin/surat_izin.php"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Wait for interrupt
wait