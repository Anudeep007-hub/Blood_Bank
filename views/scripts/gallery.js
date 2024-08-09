let currentImageIndex = 0;
const images = document.querySelectorAll('.image');

function changeImage(step) {
    images[currentImageIndex].classList.remove('active');
    currentImageIndex = (currentImageIndex + step + images.length) % images.length;
    images[currentImageIndex].classList.add('active');
}