// Get a reference to the Firebase Auth service
const auth = firebase.auth();

// NOTE: We no longer directly call signInWithRedirect or getRedirectResult in the main app
// The provider is only needed if you were using signInWithPopup or other methods directly
// const provider = new firebase.auth.GoogleAuthProvider();

// Function to open the helper page for Google Sign-in
function signInWithGoogle() {
    // Open the helper page on Firebase Hosting in a new window/tab
    // Make sure the URL below points to where you deploy auth-helper.html on Firebase Hosting
    const authHelperUrl = 'https://eli-s-maths-notes.firebaseapp.com/auth-helper.html';
    window.open(authHelperUrl, 'firebaseAuthWindow', 'width=500,height=600');
}

// Function to handle sign out (this remains the same)
function signOutUser() {
  auth.signOut().then(() => {
    console.log("User signed out successfully.");
    // Force a re-check of auth state to update UI
    auth.onAuthStateChanged(auth.currentUser);
  }).catch((error) => {
    console.error("Sign out Error:", error);
  });
}

// Listen for messages from the helper page
window.addEventListener('message', function(event) {
    // IMPORTANT: Verify the origin of the message for security
    if (event.origin !== "https://eli-s-maths-notes.firebaseapp.com") { // <-- MUST BE YOUR FIREBASE HOSTING DOMAIN
        console.warn("Received message from untrusted origin:", event.origin);
        return;
    }

    const data = event.data;
    if (data.type === 'FIREBASE_AUTH_SUCCESS') {
        console.log("Auth success received from helper:", data.user);
        // Manually set the Firebase user state in the main app
        // This is a simplified way; a full solution might involve token exchange
        // For simple UI updates and basic auth state, this is often sufficient.
        // The onAuthStateChanged listener below will now trigger with this user.
        // NOTE: auth.currentUser might not immediately reflect the change,
        // but the onAuthStateChanged listener will eventually get the update.
        // For immediate actions, use the data.user
        alert(`Welcome, ${data.user.displayName || data.user.email}!`); // Debug: Show immediate confirmation
        auth.onAuthStateChanged(data.user); // Trigger onAuthStateChanged with the received user
    } else if (data.type === 'FIREBASE_AUTH_ERROR') {
        console.error("Auth error received from helper:", data.code, data.message);
        alert(`Authentication Error: ${data.message}`); // Inform the user
    }
});


// Listen for authentication state changes (this remains largely the same, but now reacts to postMessage)
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("Auth state changed: User is signed in", user.email);
    document.getElementById('signInButton').style.display = 'none';
    document.getElementById('signOutButton').style.display = 'block';
    document.getElementById('welcomeMessage').textContent = `Welcome, ${user.displayName || user.email}!`;

    if (user.email === "e.schodel3@gmail.com") {
      console.log("User is the admin email!");
      const firstAidContent = document.getElementById('firstAidContent');
      if (firstAidContent) {
        firstAidContent.style.display = 'block';
      }
      const firstAidMenuLink = document.querySelector('#menu-container a[href="/first-aid/fa-index.html"]');
      if (firstAidMenuLink) {
        firstAidMenuLink.style.display = 'block';
      }
    } else {
      console.log("User is not the admin email.");
      const firstAidContent = document.getElementById('firstAidContent');
      if (firstAidContent) {
        firstAidContent.style.display = 'none';
      }
      const firstAidMenuLink = document.querySelector('#menu-container a[href="/first-aid/fa-index.html"]');
      if (firstAidMenuLink) {
        firstAidMenuLink.style.display = 'none';
      }
    }

  } else {
    console.log("Auth state changed: User is signed out");
    document.getElementById('signInButton').style.display = 'block';
    document.getElementById('signOutButton').style.display = 'none';
    document.getElementById('welcomeMessage').textContent = ``;
    const firstAidContent = document.getElementById('firstAidContent');
    if (firstAidContent) {
      firstAidContent.style.display = 'none';
    }
    const firstAidMenuLink = document.querySelector('#menu-container a[href="/first-aid/fa-index.html"]');
    if (firstAidMenuLink) {
      firstAidMenuLink.style.display = 'none';
    }
  }
});

// Add event listeners to your buttons
document.addEventListener('DOMContentLoaded', () => {
  const signInButton = document.getElementById('signInButton');
  if (signInButton) {
    signInButton.addEventListener('click', signInWithGoogle);
  }

  const signOutButton = document.getElementById('signOutButton');
  if (signOutButton) {
    signOutButton.addEventListener('click', signOutUser);
  }

  // Initial check for menu link visibility on page load
  const firstAidMenuLink = document.querySelector('#menu-container a[href="/first-aid/fa-index.html"]');
  if (firstAidMenuLink && !auth.currentUser) {
    firstAidMenuLink.style.display = 'none';
  }
});
