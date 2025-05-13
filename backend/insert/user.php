<?php
// filepath: c:\laragon\www\web-pesantren\backend\insert\user.php

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $role = $_POST['role'] ?? '';

    // Validasi input
    if (empty($email) || empty($password) || empty($role)) {
        echo json_encode(['success' => false, 'message' => 'Semua field harus diisi']);
        exit;
    }

    // Validasi role
    $validRoles = ['admin', 'pengajar', 'siswa'];
    if (!in_array($role, $validRoles)) {
        echo json_encode(['success' => false, 'message' => 'Role tidak valid']);
        exit;
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    try {
        // Insert data ke tabel users
        $stmt = $pdo->prepare("INSERT INTO users (email, password, role) VALUES (?, ?, ?)");
        $stmt->execute([$email, $hashedPassword, $role]);

        echo json_encode(['success' => true, 'message' => 'Data berhasil ditambahkan']);
    } catch (PDOException $e) {
        // Tangani error jika email sudah ada
        if ($e->getCode() === '23000') { // Kode 23000 untuk pelanggaran UNIQUE
            echo json_encode(['success' => false, 'message' => 'Email sudah terdaftar']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }
} else {
    // Tampilkan form HTML jika metode request bukan POST
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tambah User</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #f4f4f9;
            }
            form {
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                width: 300px;
            }
            h2 {
                text-align: center;
                margin-bottom: 20px;
            }
            label {
                font-weight: bold;
                display: block;
                margin-bottom: 5px;
            }
            input, select, button {
                width: 100%;
                padding: 10px;
                margin-bottom: 15px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }
            button {
                background-color: #006400;
                color: white;
                border: none;
                cursor: pointer;
            }
            button:hover {
                background-color: #004d00;
            }
            .password-container {
                position: relative;
            }
            .toggle-password {
                position: absolute;
                top: 50%;
                right: 10px;
                transform: translateY(-50%);
                cursor: pointer;
                color: #888;
            }
        </style>
    </head>
    <body>
        <form action="" method="POST">
            <h2>Tambah User</h2>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>

            <label for="password">Password:</label>
            <div class="password-container">
                <input type="password" id="password" name="password" required>
                <span class="toggle-password" onclick="togglePassword()">👁️</span>
            </div>

            <label for="role">Role:</label>
            <select id="role" name="role" required>
                <option value="admin">Admin</option>
                <option value="pengajar">Pengajar</option>
                <option value="siswa">Siswa</option>
            </select>

            <button type="submit">Tambah User</button>
        </form>

        <script>
            function togglePassword() {
                const passwordInput = document.getElementById('password');
                const toggleIcon = document.querySelector('.toggle-password');
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    toggleIcon.textContent = '🙈'; // Ikon mata tertutup
                } else {
                    passwordInput.type = 'password';
                    toggleIcon.textContent = '👁️'; // Ikon mata terbuka
                }
            }
        </script>
    </body>
    </html>
    <?php
}