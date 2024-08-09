document.getElementById('profile-picture-input').addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = 'Profile Picture';
        const profilePicture = document.querySelector('.profile-picture');
        profilePicture.innerHTML = '';
        profilePicture.appendChild(img);
    }
});
