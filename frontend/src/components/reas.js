// ...existing code...
const [showForgotPassword, setShowForgotPassword] = useState(false);
const [forgotEmail, setForgotEmail] = useState('');

const handleForgotPassword = async () => {
  try {
    const response = await fetch('http://localhost/web-pesantren/backend/api/forgot_password.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotEmail }),
    });

    const result = await response.json();

    if (result.success) {
      alert(result.message);
      setShowForgotPassword(false);
    } else {
      alert(result.message);
    }
  } catch (error) {
    alert('Terjadi kesalahan saat memproses permintaan');
  }
};
// ...existing code...

return (
  <>
    {/* Modal Login */}
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Alamat Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Kata Sandi</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          {/* Tambahkan tautan "Lupa Kata Sandi?" */}
          <div className="mt-2">
            <a
              href="#"
              onClick={() => {
                setShow(false);
                setShowForgotPassword(true);
              }}
              style={{ fontSize: '0.9rem', color: '#006400', textDecoration: 'none' }}
            >
              Lupa Kata Sandi?
            </a>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Tutup
        </Button>
        <Button variant="primary" style={{ backgroundColor: '#006400', borderColor: '#006400' }} onClick={handleLogin}>
          Login
        </Button>
      </Modal.Footer>
    </Modal>

    {/* Modal Lupa Kata Sandi */}
    <Modal show={showForgotPassword} onHide={() => setShowForgotPassword(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Lupa Kata Sandi</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formForgotEmail">
            <Form.Label>Alamat Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Masukkan email Anda"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowForgotPassword(false)}>
          Tutup
        </Button>
        <Button variant="primary" style={{ backgroundColor: '#006400', borderColor: '#006400' }} onClick={handleForgotPassword}>
          Kirim
        </Button>
      </Modal.Footer>
    </Modal>
  </>
);
