// password validation
document.getElementById('account_password').addEventListener('input', function() {
  const password = this.value;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{12,}$/;

  if (passwordRegex.test(password)) {
    this.setCustomValidity('');
    this.style.backgroundColor = 'yellow'; // Change background color to yellow
  } else {
    this.setCustomValidity('Password must be at least 12 characters and contain at least 1 number, 1 capital letter, and 1 special character.');
    this.style.backgroundColor = ''; // Reset background color
  }
});

//   Password Toggle Button
  
  const toggleButton = document.getElementById('togglePassword');
  toggleButton.addEventListener('click', () => {
    const passwordInput = document.getElementById('account_password');
  if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleButton.textContent = 'Hide Password';
  } else {
      passwordInput.type = 'password';
      toggleButton.textContent = 'Show Password';
  }
  });