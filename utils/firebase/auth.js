import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    sendEmailVerification,
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    updateProfile,
    sendPasswordResetEmail,
} from "firebase/auth";


// @ 註冊用戶
export const registorWithMailAndPwd = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
    })
}


// @ 信箱驗證
export const verifyEmail = () => {
    const auth = getAuth();
    sendEmailVerification(auth.currentUser)
    .then(() => {
        // Email verification sent!
        // ...
    });
}


// @ 登入用戶
export const loginWithMailAndPwd = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}


//  @ 登入狀態
export const getUserAuthState = () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
            const uid = user.uid;
          // ...
        } else {
          // User is signed out
          // ...
        }
    })
}


// @ 檢查登入
export const isLogin = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    // ...
    } else {
    // No user is signed in.
    }
}


// @ 用戶資訊
export const getUserInfo = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user !== null) {
        user.providerData.forEach((profile) => {
            console.log("Sign-in provider: " + profile.providerId);
            console.log("  Provider-specific UID: " + profile.uid);
            console.log("  Name: " + profile.displayName);
            console.log("  Email: " + profile.email);
            console.log("  Photo URL: " + profile.photoURL);
        });
    }
}


// @ 更新資訊
export const updateUserInfo = () => {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
    displayName: "Jane Q. User", photoURL: "https://example.com/jane-q-user/profile.jpg"
    }).then(() => {
    // Profile updated!
    // ...
    }).catch((error) => {
    // An error occurred
    // ...
    });
}


// @ 重置密碼
export const resetPwd = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
    .then(() => {
        // Password reset email sent!
        // ..
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
    });
}