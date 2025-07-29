<?php
// Session helper functions

function startSession() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

function isLoggedIn() {
    startSession();
    return isset($_SESSION['user_id']) && isset($_SESSION['user_role']);
}

function getCurrentUserId() {
    startSession();
    return $_SESSION['user_id'] ?? null;
}

function getCurrentUserRole() {
    startSession();
    return $_SESSION['user_role'] ?? null;
}

function getCurrentSantriId() {
    startSession();
    return $_SESSION['santri_id'] ?? null;
}

function getCurrentUstadzId() {
    startSession();
    return $_SESSION['ustadz_id'] ?? null;
}

function requireSantriSession() {
    if (!isLoggedIn() || getCurrentUserRole() !== 'santri') {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized access']);
        exit;
    }
    
    $santri_id = getCurrentSantriId();
    if (!$santri_id) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Santri ID not found in session']);
        exit;
    }
    
    return $santri_id;
}

function requireUstadzSession() {
    if (!isLoggedIn() || getCurrentUserRole() !== 'pengajar') {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized access']);
        exit;
    }
    
    $ustadz_id = getCurrentUstadzId();
    if (!$ustadz_id) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Ustadz ID not found in session']);
        exit;
    }
    
    return $ustadz_id;
}

function requireAdminSession() {
    if (!isLoggedIn() || getCurrentUserRole() !== 'admin') {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized access']);
        exit;
    }
    
    return getCurrentUserId();
}
?>