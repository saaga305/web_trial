document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const userEmailElement = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Check auth state
    firebase.auth().onAuthStateChanged((user) => {
        if (user && user.emailVerified) {
            // User is signed in and verified
            userEmailElement.textContent = `Logged in as: ${user.email}`;
        } else {
            // User is not signed in or not verified
            window.location.href = 'auth.html';
        }
    });
    
    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        firebase.auth().signOut().then(() => {
            window.location.href = 'auth.html';
        }).catch((error) => {
            console.error('Logout error:', error);
        });
    });
});