  document.getElementById('reg').addEventListener('submit', function(event) {
      var password = document.getElementById('pass').value;
      var confirmPassword = document.getElementById('confpass').value;

      if (password != confirmPassword) {
          event.preventDefault();
          
          alert("Passwords do not match");

          document.getElementById('pass').value = '';
          document.getElementById('confpass').value = '';

          document.getElementById('pass').focus();
      }
  }); 
    