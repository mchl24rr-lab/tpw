(function () {
    // Utils para manejar cuentas en localStorage
    function obtenerCuentas() {
    try {
        const raw = localStorage.getItem('cuentas');
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
    }
    function guardarCuentas(cuentas) {
    localStorage.setItem('cuentas', JSON.stringify(cuentas));
    }

    // Elementos
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');

    // Mostrar vista inicial según parámetro
    const params = new URLSearchParams(window.location.search);
    const initialView = params.get('view') === 'register' ? 'register' : 'login';

    function mostrarLogin() {
        loginView.style.display = '';
        registerView.style.display = 'none';
        loginView.setAttribute('aria-hidden', 'false');
        registerView.setAttribute('aria-hidden', 'true');
    }
    function mostrarRegister() {
        loginView.style.display = 'none';
        registerView.style.display = '';
        loginView.setAttribute('aria-hidden', 'true');
        registerView.setAttribute('aria-hidden', 'false');
    }

    if (initialView === 'register') mostrarRegister(); else mostrarLogin();

    // Switch buttons
    showRegister && showRegister.addEventListener('click', function () { mostrarRegister(); });
    showLogin && showLogin.addEventListener('click', function () { mostrarLogin(); });

    // LOGIN
    formLogin && formLogin.addEventListener('submit', function (e) {
    e.preventDefault();
        const identifier = document.getElementById('login-identifier').value.trim();
        const password = document.getElementById('login-password').value;

    if (!identifier || !password) {
        alert('Por favor completa todos los campos.');
        return;
        }

    const cuentas = obtenerCuentas();
    const cuenta = cuentas.find(c => (c.email === identifier || c.nombre === identifier) && c.password === password);

    if (!cuenta) {
        alert('Credenciales incorrectas o la cuenta no existe. Si no tienes cuenta, crea una.');
        return;
    }

      // Login OK 
    localStorage.setItem('usuario_logged', 'true');
    localStorage.setItem('usuario_nombre', cuenta.nombre);
    localStorage.setItem('last_login_time', Date.now());

    alert('Inicio de sesión exitoso. Bienvenido, ' + cuenta.nombre + '!');
    if (window.parent) {
        window.parent.postMessage('login_success', '*');
    }
    });

    // REGISTER
    formRegister && formRegister.addEventListener('submit', function (e) {
    e.preventDefault();
    const nombre = document.getElementById('reg-nombre').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const pass1 = document.getElementById('reg-password').value;
    const pass2 = document.getElementById('reg-password2').value;

    if (!nombre || !email || !pass1 || !pass2) {
        alert('Por favor completa todos los campos.');
        return;
    }
    if (pass1 !== pass2) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    const cuentas = obtenerCuentas();
    const exists = cuentas.some(c => c.email === email || c.nombre === nombre);
    if (exists) {
        alert('Ya existe una cuenta con ese email o nombre. Intenta iniciar sesión o usa otro email/nombre.');
        return;
    }

      // Guardar nueva cuenta 
    cuentas.push({ nombre: nombre, email: email, password: pass1 });
    guardarCuentas(cuentas);
    alert('Cuenta creada correctamente.');
    if (window.parent) {
        window.parent.postMessage('login_success', '*');
    }
    });

    // Permitir cierre con Es
    window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        
        try {
            if (window.parent && window.parent.document.getElementById('iframe-close')) {
            window.parent.document.getElementById('iframe-close').click();
            }
        } catch (err) { /* noop */ }
    }
    });
    })();