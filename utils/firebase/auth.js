import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    sendEmailVerification,
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    updateProfile,
    sendPasswordResetEmail,
} from "firebase/auth";
import { useAuthStore } from '@/stores/authStore';


// @ 註冊用戶
export const registorWithMailAndPwd = async (email,password) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // TODO remove user console
        console.log(userCredential,'userCredential')
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorCode+' ' + errorMessage)
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
export const loginWithMailAndPwd = (email, password) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        console.log(userCredential)
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
            // const uid = user.uid;
            const userInfoObj = {
                uid:user.uid,
                email:user.email,
                displayName:user.displayName
            }
            useAuthStore().toggleAuthState(true)
            useAuthStore().updateLoginInfo(userInfoObj)
            // TODO remove user console
            console.log(user,'isLogin',useAuthStore().isAuth)
          // ...
        } else {
            useAuthStore().toggleAuthState(false)
            console.log('notLogin',useAuthStore().isAuth)
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