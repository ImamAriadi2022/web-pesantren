<?php
// Generate password hash untuk testing
echo "Admin Password Hash (admin123): " . password_hash('admin123', PASSWORD_DEFAULT) . "\n";
echo "Ustadz Password Hash (ustadz123): " . password_hash('ustadz123', PASSWORD_DEFAULT) . "\n"; 
echo "Santri Password Hash (santri123): " . password_hash('santri123', PASSWORD_DEFAULT) . "\n";
echo "Simple Password Hash (123): " . password_hash('123', PASSWORD_DEFAULT) . "\n";
?>
