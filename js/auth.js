document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const container = document.getElementById('container');
    const signUpLink = document.getElementById('sign-up-link');
    const signInLink = document.getElementById('sign-in-link');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const backToLoginLink = document.getElementById('back-to-login-link');
    
    // Form toggle event listeners
    signUpLink.addEventListener('click', (e) => {
        e.preventDefault();
        container.classList.add('active');
    });
    
    signInLink.addEventListener('click', (e) => {
        e.preventDefault();
        container.classList.remove('active');
    });
    
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        container.classList.add('forgot-active');
    });
    
    backToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        container.classList.remove('forgot-active');
    });

    // Auth Functions
    document.getElementById('login-btn').addEventListener('click', login);
    document.getElementById('signup-btn').addEventListener('click', signUp);
    document.getElementById('reset-btn').addEventListener('click', sendPasswordReset);
    
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    function hideError(elementId) {
        document.getElementById(elementId).style.display = 'none';
    }
    
    async function login() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;
        
        hideError('login-error');
        
        if (!email || !password) {
            return showError('login-error', 'Please fill in all fields');
        }
        
        try {
            await firebase.auth().setPersistence(
                rememberMe ? firebase.auth.Auth.Persistence.LOCAL : 
                            firebase.auth.Auth.Persistence.SESSION
            );
            
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            
            if (!userCredential.user.emailVerified) {
                await firebase.auth().signOut();
                return showError('login-error', 'Please verify your email first. Check your inbox.');
            }
            
            window.location.href = 'dashboard.html';
        } catch (error) {
            let errorMessage = error.message;
            if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password';
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email';
            }
            showError('login-error', errorMessage);
        }
    }
    
    async function signUp() {
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        
        hideError('signup-error');
        
        if (!email || !password || !confirmPassword) {
            return showError('signup-error', 'Please fill in all fields');
        }
        
        if (password !== confirmPassword) {
            return showError('signup-error', "Passwords don't match");
        }
        
        if (password.length < 6) {
            return showError('signup-error', "Password should be at least 6 characters");
        }
        
        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            await userCredential.user.sendEmailVerification();
            
            alert('Account created! Please check your email for verification link.');
            container.classList.remove('active');
        } catch (error) {
            let errorMessage = error.message;
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address';
            }
            showError('signup-error', errorMessage);
        }
    }
    
    async function sendPasswordReset() {
        const email = document.getElementById('reset-email').value;
        
        hideError('reset-error');
        
        if (!email) {
            return showError('reset-error', 'Please enter your email');
        }
        
        try {
            await firebase.auth().sendPasswordResetEmail(email);
            alert('Password reset email sent! Please check your inbox.');
            container.classList.remove('forgot-active');
        } catch (error) {
            let errorMessage = error.message;
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email';
            }
            showError('reset-error', errorMessage);
        }
    }
    
    // Check auth state on page load
    firebase.auth().onAuthStateChanged((user) => {
        if (user && user.emailVerified) {
            window.location.href = 'dashboard.html';
        }
    });
});