// Get a reference to the Firebase Auth service
const auth = firebase.auth();

// Create an instance of the Google provider object
const provider = new firebase.auth.GoogleAuthProvider();

// Optional: You can specify additional OAuth 2.0 scopes
// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

// Add this *after* your Firebase initialization and 'auth' declaration
// This runs when the page loads, in case it's a redirect back from Google
auth.getRedirectResult()
  .then((result) => {
    if (result.credential) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = result.credential;
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log("Redirect sign-in successful. User:", user.displayName, user.email);
      // The onAuthStateChanged listener below will handle updating the UI
    } else {
      // No redirect result found, or user might have cancelled the sign-in.
      console.log("No redirect result or user not signed in yet.");
    }
  })
  .catch((error) => {
    console.error("Error getting redirect result:", error.message);
  });

// Function to handle Google Sign-in
function signInWithGoogle() {
  auth.signInWithRedirect(provider) // <-- Changed to redirect!
    .then(() => {
      // This part generally won't be reached after a redirect,
      // as the page fully reloads. The result is caught by getRedirectResult()
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = error.credential;
      console.error("Google Sign-in Error:", errorMessage);
    });
}

// Function to handle sign out
function signOutUser() {
  auth.signOut().then(() => {
    console.log("User signed out.");
    // Update UI or redirect
  }).catch((error) => {
    console.error("Sign out Error:", error);
  });
}

// Listen for authentication state changes (e.g., user signs in or signs out)
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    console.log("Auth state changed: User is signed in", user.email);
    // Update UI for signed-in user
    document.getElementById('signInButton').style.display = 'none';
    document.getElementById('signOutButton').style.display = 'block';
    document.getElementById('welcomeMessage').textContent = `Welcome, ${user.displayName || user.email}!`;

    // Here you can also check if the signed-in user's email matches yours
    if (user.email === "e.schodel3@gmail.com") { // Corrected email
      console.log("User is the admin email!");
      // Show restricted content links/data
      const firstAidContent = document.getElementById('firstAidContent');
      if (firstAidContent) {
        firstAidContent.style.display = 'block';
      }
    } else {
      console.log("User is not the admin email.");
      // Hide restricted content links/data
      const firstAidContent = document.getElementById('firstAidContent');
      if (firstAidContent) {
        firstAidContent.style.display = 'none';
      }
    }

  } else {
    // User is signed out
    console.log("Auth state changed: User is signed out");
    // Update UI for signed-out user
    document.getElementById('signInButton').style.display = 'block';
    document.getElementById('signOutButton').style.display = 'none';
    document.getElementById('welcomeMessage').textContent = ``;
    // Hide restricted content
    const firstAidContent = document.getElementById('firstAidContent');
    if (firstAidContent) {
      firstAidContent.style.display = 'none';
    }
  }
});

// Add event listeners to your buttons (assuming you have buttons with these IDs in your HTML)
document.addEventListener('DOMContentLoaded', () => {
  const signInButton = document.getElementById('signInButton');
  if (signInButton) {
    signInButton.addEventListener('click', signInWithGoogle);
  }

  const signOutButton = document.getElementById('signOutButton');
  if (signOutButton) {
    signOutButton.addEventListener('click', signOutUser);
  }
});
