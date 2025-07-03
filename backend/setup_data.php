<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Setup Data Pesantren</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            text-align: center;
        }
        .section {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .section h3 {
            margin-top: 0;
            color: #34495e;
        }
        button {
            background-color: #3498db;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
        }
        button:hover {
            background-color: #2980b9;
        }
        button:disabled {
            background-color: #95a5a6;
            cursor: not-allowed;
        }
        .danger {
            background-color: #e74c3c;
        }
        .danger:hover {
            background-color: #c0392b;
        }
        .success {
            background-color: #27ae60;
        }
        .success:hover {
            background-color: #229954;
        }
        .result {
            margin-top: 10px;
            padding: 10px;
            border-radius: 5px;
        }
        .success-msg {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error-msg {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .info-msg {
            background-color: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
        .warning {
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏫 Setup Data Pesantren Walisongo</h1>
        
        <div class="warning">
            <strong>⚠️ Langkah Setup Database:</strong><br>
            1. Buat database <code>web_pesantren</code> di phpMyAdmin<br>
            2. Klik tombol "Setup Semua Data" di bawah<br>
            3. Script akan membuat tabel dan data secara otomatis
        </div>

        <div class="section">
            <h3>1. Setup Users & Password</h3>
            <p>Insert user admin, pengajar, dan santri dengan password yang benar (admin)</p>
            <button onclick="setupUsers()" id="btnUsers">Setup Users</button>
            <div id="resultUsers" class="result"></div>
        </div>

        <div class="section">
            <h3>2. Setup Data Master</h3>
            <p>Insert data mata pelajaran, kelas, dan asrama</p>
            <button onclick="setupMaster()" id="btnMaster">Setup Data Master</button>
            <div id="resultMaster" class="result"></div>
        </div>

        <div class="section">
            <h3>3. Setup Data Santri</h3>
            <p>Insert data santri dan penempatan kelas/asrama</p>
            <button onclick="setupSantri()" id="btnSantri">Setup Data Santri</button>
            <div id="resultSantri" class="result"></div>
        </div>

        <div class="section">
            <h3>4. Setup Data Akademik</h3>
            <p>Insert jadwal pelajaran, absensi, nilai, dan tahfidz</p>
            <button onclick="setupAkademik()" id="btnAkademik">Setup Data Akademik</button>
            <div id="resultAkademik" class="result"></div>
        </div>

        <div class="section">
            <h3>5. Setup Pengaturan Web</h3>
            <p>Insert pengaturan website dan konfigurasi</p>
            <button onclick="setupPengaturan()" id="btnPengaturan">Setup Pengaturan</button>
            <div id="resultPengaturan" class="result"></div>
        </div>

        <div class="section">
            <h3>🚀 Setup Lengkap</h3>
            <p>Jalankan semua setup sekaligus</p>
            <button onclick="setupAll()" id="btnAll" class="success">Setup Semua Data</button>
            <div id="resultAll" class="result"></div>
        </div>

        <div class="section">
            <h3>🗑️ Reset Database</h3>
            <p><strong>Hati-hati!</strong> Ini akan menghapus semua data dan reset database</p>
            <button onclick="resetDatabase()" id="btnReset" class="danger">Reset Database</button>
            <div id="resultReset" class="result"></div>
        </div>

        <div class="section">
            <h3>✅ Test Login</h3>
            <p>Test login dengan kredensial yang sudah dibuat</p>
            <button onclick="testLogin()" id="btnTest">Test Login</button>
            <div id="resultTest" class="result"></div>
        </div>

        <div class="section">
            <h3>🔧 Debug & Troubleshooting</h3>
            <p>Tools untuk mengatasi masalah login</p>
            
            <button onclick="debugLogin()" id="btnDebug">Debug Login Detail</button>
            <button onclick="resetPasswords()" id="btnResetPass" style="margin-left: 10px; background-color: #e74c3c;">Reset All Passwords ke 'admin'</button>
            
            <div id="resultDebug" class="result"></div>
        </div>
    </div>

    <script>
        function showResult(elementId, message, type = 'info') {
            const element = document.getElementById(elementId);
            element.innerHTML = message;
            element.className = 'result ' + type + '-msg';
        }

        function disableButton(buttonId) {
            document.getElementById(buttonId).disabled = true;
        }

        function enableButton(buttonId) {
            document.getElementById(buttonId).disabled = false;
        }

        function setupUsers() {
            disableButton('btnUsers');
            showResult('resultUsers', 'Memproses setup users...', 'info');
            
            fetch('setup_actions.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'setup_users'})
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showResult('resultUsers', data.message, 'success');
                } else {
                    showResult('resultUsers', data.message, 'error');
                }
                enableButton('btnUsers');
            })
            .catch(error => {
                showResult('resultUsers', 'Error: ' + error.message, 'error');
                enableButton('btnUsers');
            });
        }

        function setupMaster() {
            disableButton('btnMaster');
            showResult('resultMaster', 'Memproses setup data master...', 'info');
            
            fetch('setup_actions.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'setup_master'})
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showResult('resultMaster', data.message, 'success');
                } else {
                    showResult('resultMaster', data.message, 'error');
                }
                enableButton('btnMaster');
            })
            .catch(error => {
                showResult('resultMaster', 'Error: ' + error.message, 'error');
                enableButton('btnMaster');
            });
        }

        function setupSantri() {
            disableButton('btnSantri');
            showResult('resultSantri', 'Memproses setup data santri...', 'info');
            
            fetch('setup_actions.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'setup_santri'})
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showResult('resultSantri', data.message, 'success');
                } else {
                    showResult('resultSantri', data.message, 'error');
                }
                enableButton('btnSantri');
            })
            .catch(error => {
                showResult('resultSantri', 'Error: ' + error.message, 'error');
                enableButton('btnSantri');
            });
        }

        function setupAkademik() {
            disableButton('btnAkademik');
            showResult('resultAkademik', 'Memproses setup data akademik...', 'info');
            
            fetch('setup_actions.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'setup_akademik'})
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showResult('resultAkademik', data.message, 'success');
                } else {
                    showResult('resultAkademik', data.message, 'error');
                }
                enableButton('btnAkademik');
            })
            .catch(error => {
                showResult('resultAkademik', 'Error: ' + error.message, 'error');
                enableButton('btnAkademik');
            });
        }

        function setupPengaturan() {
            disableButton('btnPengaturan');
            showResult('resultPengaturan', 'Memproses setup pengaturan...', 'info');
            
            fetch('setup_actions.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'setup_pengaturan'})
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showResult('resultPengaturan', data.message, 'success');
                } else {
                    showResult('resultPengaturan', data.message, 'error');
                }
                enableButton('btnPengaturan');
            })
            .catch(error => {
                showResult('resultPengaturan', 'Error: ' + error.message, 'error');
                enableButton('btnPengaturan');
            });
        }

        function setupAll() {
            disableButton('btnAll');
            showResult('resultAll', 'Memproses setup semua data...', 'info');
            
            fetch('setup_actions.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'setup_all'})
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showResult('resultAll', data.message, 'success');
                } else {
                    showResult('resultAll', data.message, 'error');
                }
                enableButton('btnAll');
            })
            .catch(error => {
                showResult('resultAll', 'Error: ' + error.message, 'error');
                enableButton('btnAll');
            });
        }

        function resetDatabase() {
            if (!confirm('Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan!')) {
                return;
            }
            
            disableButton('btnReset');
            showResult('resultReset', 'Memproses reset database...', 'info');
            
            fetch('setup_actions.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'reset_database'})
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showResult('resultReset', data.message, 'success');
                } else {
                    showResult('resultReset', data.message, 'error');
                }
                enableButton('btnReset');
            })
            .catch(error => {
                showResult('resultReset', 'Error: ' + error.message, 'error');
                enableButton('btnReset');
            });
        }

        function testLogin() {
            disableButton('btnTest');
            showResult('resultTest', 'Testing login...', 'info');
            
            fetch('test_login.php')
            .then(response => response.text())
            .then(data => {
                showResult('resultTest', '<pre>' + data + '</pre>', 'info');
                enableButton('btnTest');
            })
            .catch(error => {
                showResult('resultTest', 'Error: ' + error.message, 'error');
                enableButton('btnTest');
            });
        }

        function debugLogin() {
            disableButton('btnDebug');
            showResult('resultDebug', 'Debugging login...', 'info');
            
            fetch('debug_login.php')
            .then(response => response.text())
            .then(data => {
                showResult('resultDebug', '<pre>' + data + '</pre>', 'info');
                enableButton('btnDebug');
            })
            .catch(error => {
                showResult('resultDebug', 'Error: ' + error.message, 'error');
                enableButton('btnDebug');
            });
        }

        function resetPasswords() {
            if (!confirm('PERINGATAN: Ini akan mereset password SEMUA user ke "admin". Lanjutkan?')) {
                return;
            }
            
            disableButton('btnResetPass');
            showResult('resultDebug', 'Resetting all passwords...', 'info');
            
            fetch('reset_all_passwords.php')
            .then(response => response.text())
            .then(data => {
                showResult('resultDebug', '<pre>' + data + '</pre>', 'success');
                enableButton('btnResetPass');
            })
            .catch(error => {
                showResult('resultDebug', 'Error: ' + error.message, 'error');
                enableButton('btnResetPass');
            });
        }
    </script>
</body>
</html>
