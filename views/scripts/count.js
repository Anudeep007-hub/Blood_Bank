const numberDisplay1 = document.getElementById('numberDisplay1');
const numberDisplay2 = document.getElementById('numberDisplay2');
const numberDisplay3 = document.getElementById('numberDisplay3');
const numberDisplay4 = document.getElementById('numberDisplay4');
    let count = 0;
    function updateDisplay() {
      numberDisplay1.textContent = count;
      numberDisplay2.textContent = count+23;
      numberDisplay3.textContent = count+34;
      numberDisplay4.textContent = count+11;
    }
    function incrementWithDelay() {
      setTimeout(() => {
        count++;
        updateDisplay();
        if (count < 150) {
          incrementWithDelay();
        }
      }, 20);
    }
    window.onload = function() {
      incrementWithDelay();
    };