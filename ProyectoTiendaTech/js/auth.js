(function () {
  'use strict';

  const MAX_RETRIES = 40;
  const RETRY_INTERVAL = 150; 

  function setupAuth() {
    const btnLogin = document.getElementById('btn-login');
    const btnRegister = document.getElementById('btn-register');
    const btnLogout = document.getElementById('btn-logout');
    const iframeSection = document.getElementById('iframe-login');
    const loginIframe = document.getElementById('login-iframe');
    const iframeClose = document.getElementById('iframe-close');
    const msgSesion = document.getElementById('msg-sesion');
    const btnUser = document.getElementById('btn-user');

    // ✨ NUEVA REFERENCIA: Obtenemos el modal del Carrito
    const iframeCartSection = document.getElementById('iframe-cart');

    if (!btnLogin || !btnRegister || !iframeSection || !loginIframe || !iframeClose || !msgSesion || !btnUser) {
      return false; 
    }

    function actualizarUI() {
      const logged = localStorage.getItem('usuario_logged') === 'true';
      const nombre = localStorage.getItem('usuario_nombre') || '';

      if (logged && nombre) {
        btnLogin.style.display = 'none';
        btnRegister.style.display = 'none';
        msgSesion.textContent = 'Sesión iniciada con éxito';
        msgSesion.style.display = 'inline-block';
        msgSesion.setAttribute('aria-hidden', 'false');
        btnUser.textContent = nombre;
        btnUser.style.display = 'inline-block';
        btnLogout && (btnLogout.style.display = 'inline-block');
      } else {
        btnLogin.style.display = 'inline-block';
        btnRegister.style.display = 'inline-block';
        msgSesion.style.display = 'none';
        msgSesion.setAttribute('aria-hidden', 'true');
        btnUser.style.display = 'none';
        btnLogout && (btnLogout.style.display = 'none');
      }
    }

    if (!btnLogin.dataset.authAttached) {
      btnLogin.addEventListener('click', () => {
        loginIframe.src = 'login.html?view=login';
        iframeSection.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        loginIframe.focus();
      });
      btnLogin.dataset.authAttached = '1';
    }

    if (!btnRegister.dataset.authAttached) {
      btnRegister.addEventListener('click', () => {
        loginIframe.src = 'login.html?view=register';
        iframeSection.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        loginIframe.focus();
      });
      btnRegister.dataset.authAttached = '1';
    }

    if (btnLogout && !btnLogout.dataset.authAttached) {
      btnLogout.addEventListener('click', () => {
        localStorage.removeItem('usuario_logged');
        localStorage.removeItem('usuario_nombre');
        localStorage.removeItem('last_login_time');
        actualizarUI();
      });
      btnLogout.dataset.authAttached = '1';
    }

    if (!iframeClose.dataset.authAttached) {
      iframeClose.addEventListener('click', () => {
        iframeSection.style.display = 'none';
        loginIframe.src = '';
        document.body.style.overflow = 'auto';
      });
      iframeClose.dataset.authAttached = '1';
    }

    
    actualizarUI();
    window.addEventListener('storage', (e) => {
      if (['usuario_logged', 'usuario_nombre', 'last_login_time'].includes(e.key)) actualizarUI();
    });


   // MODIFICACIÓN A ESTE BLOQUE: AÑADIMOS LA LÓGICA PARA ABRIR EL LOGIN DESDE EL CARRITO
    window.addEventListener('message', (event) => {
      if (event.data === 'login_success') {
        iframeSection.style.display = 'none';
        document.body.style.overflow = 'auto';
        actualizarUI();
      }
      // ✨ NUEVO: Si el carrito solicita abrir el modal de login
      if (event.data === 'open_login_modal') {
        iframeCartSection.style.display = 'none';
        loginIframe.src = 'login.html?view=login';
        iframeSection.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        loginIframe.focus();
      }
    });

    return true;
  }



  let retries = 0;
  const intervalId = setInterval(() => {
    if (setupAuth() || retries++ > MAX_RETRIES) {
      clearInterval(intervalId);
    }
  }, RETRY_INTERVAL);

  document.addEventListener('DOMContentLoaded', () => {
    if (setupAuth()) clearInterval(intervalId);
  });

  const observer = new MutationObserver((mutations, obs) => {
    if (setupAuth()) obs.disconnect();
  });
  observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

})();

