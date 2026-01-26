// Récupérer l'email mémorisé
document.addEventListener('DOMContentLoaded', () => {
  const savedEmail = localStorage.getItem('remembered-email');
  if (savedEmail) {
    document.querySelector('#login-form input[name="email"]').value = savedEmail;
    document.getElementById('remember').checked = true;
  }

  // Charger le statut d'authentification
  if (auth.isAuthenticated()) {
    window.location.href = 'account.html';
  }
});

function switchTab(tab) {
  // Masquer tous les onglets
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  
  // Afficher l'onglet actif
  document.getElementById(tab).classList.add('active');
  event.target.classList.add('active');
  
  // Nettoyer les messages
  document.querySelectorAll('.success-message').forEach(el => el.classList.remove('show'));
}

function togglePassword(button) {
  event.preventDefault();
  const input = button.previousElementSibling;
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  button.textContent = isPassword ? '🙈' : '👁️';
}

function checkPasswordStrength(input) {
  const password = input.value;
  const strengthBar = input.parentElement.querySelector('.password-strength');
  
  if (!password) {
    strengthBar.className = 'password-strength';
    return;
  }

  let strength = 0;
  
  // Longueur
  if (password.length >= 6) strength++;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  
  // Majuscules
  if (/[A-Z]/.test(password)) strength++;
  
  // Minuscules
  if (/[a-z]/.test(password)) strength++;
  
  // Chiffres
  if (/[0-9]/.test(password)) strength++;
  
  // Caractères spéciaux
  if (/[!@#$%^&*]/.test(password)) strength++;

  strengthBar.className = 'password-strength';
  if (strength < 3) {
    strengthBar.classList.add('weak');
  } else if (strength < 5) {
    strengthBar.classList.add('medium');
  } else {
    strengthBar.classList.add('strong');
  }
}

function showErrorMessage(input, message) {
  const errorEl = input.parentElement.querySelector('.error-message');
  errorEl.textContent = message;
  errorEl.classList.add('show');
  input.classList.add('error');
}

function clearErrorMessages() {
  document.querySelectorAll('.error-message').forEach(el => {
    el.classList.remove('show');
    el.textContent = '';
  });
  document.querySelectorAll('input').forEach(el => el.classList.remove('error'));
}

async function handleLogin(event) {
  event.preventDefault();
  clearErrorMessages();

  const form = event.target;
  const email = form.email.value.trim();
  const password = form.password.value;
  const remember = form.querySelector('input[name="remember"]').checked;
  const btn = form.querySelector('button[type="submit"]');

  // Validation
  if (!email) {
    showErrorMessage(form.email, 'Email requis');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showErrorMessage(form.email, 'Email invalide');
    return;
  }

  if (!password || password.length < 1) {
    showErrorMessage(form.password, 'Mot de passe requis');
    return;
  }

  try {
    btn.disabled = true;
    btn.innerHTML = '<span class="loading"></span><span class="loading"></span><span class="loading"></span>';

    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    auth.setToken(response.token);
    auth.setUser(response.user);

    // Mémoriser l'email si demandé
    if (remember) {
      localStorage.setItem('remembered-email', email);
    } else {
      localStorage.removeItem('remembered-email');
    }

    showToast('✓ Connexion réussie !', 'success');
    setTimeout(() => {
      window.location.href = 'account.html';
    }, 800);

  } catch (error) {
    btn.disabled = false;
    btn.textContent = 'Se connecter';
    
    // Erreurs spécifiques
    if (error.message.includes('email')) {
      showErrorMessage(form.email, 'Email ou mot de passe incorrect');
    } else if (error.message.includes('password')) {
      showErrorMessage(form.password, 'Mot de passe incorrect');
    } else {
      showToast('❌ Erreur : ' + error.message, 'error');
    }
  }
}

async function handleRegister(event) {
  event.preventDefault();
  clearErrorMessages();

  const form = event.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const passwordConfirm = form.password_confirm.value;
  const btn = form.querySelector('button[type="submit"]');

  let hasError = false;

  // Validation du nom
  if (!name || name.length < 2) {
    showErrorMessage(form.name, 'Nom requis (minimum 2 caractères)');
    hasError = true;
  }

  // Validation de l'email
  if (!email) {
    showErrorMessage(form.email, 'Email requis');
    hasError = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showErrorMessage(form.email, 'Email invalide');
    hasError = true;
  }

  // Validation du mot de passe
  if (!password || password.length < 6) {
    showErrorMessage(form.password, 'Minimum 6 caractères requis');
    hasError = true;
  }

  // Confirmation du mot de passe
  if (password !== passwordConfirm) {
    showErrorMessage(form.password_confirm, 'Les mots de passe ne correspondent pas');
    hasError = true;
  }

  if (hasError) return;

  try {
    btn.disabled = true;
    btn.innerHTML = '<span class="loading"></span><span class="loading"></span><span class="loading"></span>';

    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, password_confirm: passwordConfirm })
    });

    // Afficher message de succès
    const successMsg = document.getElementById('register-success');
    successMsg.textContent = '✓ Inscription réussie ! Connectez-vous maintenant.';
    successMsg.classList.add('show');

    showToast('✓ Bienvenue ' + name + ' !', 'success');

    // Réinitialiser le formulaire
    form.reset();

    // Basculer vers connexion après 1.5s
    setTimeout(() => {
      switchTab('login');
      document.querySelector('#login-form input[name="email"]').value = email;
    }, 1500);

  } catch (error) {
    btn.disabled = false;
    btn.textContent = "S'inscrire";
    
    if (error.message.includes('email')) {
      showErrorMessage(form.email, 'Cet email est déjà utilisé');
    } else if (error.message.includes('password')) {
      showErrorMessage(form.password, 'Mot de passe non autorisé');
    } else {
      showToast('❌ Erreur : ' + error.message, 'error');
    }
  }
}

function showForgotPassword(e) {
  e.preventDefault();
  document.getElementById('forgot-modal').style.display = 'flex';
}

function closeForgotPassword() {
  document.getElementById('forgot-modal').style.display = 'none';
}

async function handleForgotPassword(event) {
  event.preventDefault();
  const email = event.target.querySelector('input[name="forgot-email"]').value.trim();
  const btn = event.target.querySelector('button[type="submit"]');

  if (!email) {
    showToast('❌ Email requis', 'error');
    return;
  }

  try {
    btn.disabled = true;
    btn.textContent = 'Envoi...';

    // Appel API pour demander réinitialisation
    await apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });

    showToast('✓ Email de réinitialisation envoyé !', 'success');
    setTimeout(() => {
      closeForgotPassword();
    }, 2000);

  } catch (error) {
    btn.disabled = false;
    btn.textContent = 'Envoyer le lien';
    showToast('❌ Erreur : ' + error.message, 'error');
  }
}
