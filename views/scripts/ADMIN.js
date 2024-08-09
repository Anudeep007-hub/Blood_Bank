// document.addEventListener('DOMContentLoaded', function (event) {
//     const loadingPopup = document.getElementById("loading-popup");

//     async function handleBloodReserves(event) {
//         event.preventDefault();
//         loadingPopup.style.display = "flex";

//         try {
//             if (window.location.pathname !== "/BloodReserves.html") {
//                 await fetch('/BloodReserves');
//                 window.location.href = "/BloodReserves.html";
//             }
//         } catch (error) {
//             console.error('Error fetching BloodReserves:', error);
//         } finally {
//             loadingPopup.style.display = "none";
//         }
//     }
//     async function handleDonorData(event) {
//         event.preventDefault();
//         loadingPopup.style.display = "flex";

//         try {
//             if (window.location.pathname !== "/DonorData.html") {
//                 await fetch('/DonorData');
//                 window.location.href = "/DonorData.html";
//             }
//         } catch (error) {
//             console.error('Error fetching DonorData:', error);
//         } finally {
//             loadingPopup.style.display = "none";
//         }
//     }

//     async function handleRecipientData(event) {
//         event.preventDefault();
//         loadingPopup.style.display = "flex";

//         try {
//             if (window.location.pathname !== "/RecipientData.html") {
//                 await fetch('/RecipientData');
//                 window.location.href = "/RecipientData.html";
//             }
//         } catch (error) {
//             console.error('Error fetching RecipientData:', error);
//         } finally {
//             loadingPopup.style.display = "none";
//         }
//     }

//     async function handleEmployeeData(event) {
//         event.preventDefault();
//         loadingPopup.style.display = "flex";

//         try {
//             if (window.location.pathname !== "/EmployeeData.html") {
//                 await fetch('/EmployeeData');
//                 window.location.href = "/EmployeeData.html";
//             }
//         } catch (error) {
//             console.error('Error fetching EmployeeData:', error);
//         } finally {
//             loadingPopup.style.display = "none";
//         }
//     }

//     async function handleAddEmployee(event) {
//         event.preventDefault();
//         loadingPopup.style.display = "flex";

//         try {
//             if (window.location.pathname !== "/AddEmployee.html") {
//                 await fetch('/AddEmployee');
//                 window.location.href = "/AddEmployee.html";
//             }
//         } catch (error) {
//             console.error('Error fetching AddEmployee:', error);
//         } finally {
//             loadingPopup.style.display = "none";
//         }
//     }

    
//     document.getElementById("BR").addEventListener('click', handleBloodReserves);
//     document.getElementById("DD").addEventListener('click', handleDonorData);
//     document.getElementById("RD").addEventListener('click', handleRecipientData);
//     document.getElementById("ED").addEventListener('click', handleEmployeeData);
//     document.getElementById("AE").addEventListener('click', handleAddEmployee);
// });

// function displayImage() {
//     console.log("displayImage function called");
//     var input = document.getElementById('profile-picture-input-AE');
//     var img = document.getElementById('uploaded-image-AE');
    
//     if (input.files && input.files[0]) {
//         var reader = new FileReader();
//         reader.onload = function(e) {
//             console.log("Image loaded");
//             console.log(e.target.result); // Log the image data
//             img.src = e.target.result;
//         };
//         reader.readAsDataURL(input.files[0]); // Convert image to base64 string
//     }
// }

// const numberDisplay = document.getElementsByClassName('Count');

//     let count = 0;

//     function updateDisplay() {
//         numberDisplay[0].textContent = count + 61;
//         numberDisplay[1].textContent = count + 23;
//         numberDisplay[2].textContent = count + 34;
//         numberDisplay[3].textContent = count + 11;
//         numberDisplay[4].textContent = count + 7;
//         numberDisplay[5].textContent = count + 45;
//         numberDisplay[6].textContent = count + 39;
//         numberDisplay[7].textContent = count +21;
//     }

//     function incrementWithDelay() {
//         setTimeout(() => {
//             count++;
//             updateDisplay();
//             if (count < 150) {
//                 incrementWithDelay();
//             }
//         }, 20);
//     }

//     window.onload = function() {
//         incrementWithDelay();
//     };

    