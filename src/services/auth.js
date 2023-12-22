import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const signUp = async (name, phone, email, password, address, role) => {
  try {
    if (!name || !phone || !email || !password || !address || !role) {
      throw new Error("Please enter all required data");
    }

    const userCredential = await auth().createUserWithEmailAndPassword(
      email.trim(),
      password
    );

    const user = userCredential.user;

    await user.updateProfile({
      displayName: name,
    });

    await firestore().collection('USERS').doc(user.uid).set({
      name,
      phone,
      email,
      password, 
      address,
      role,
    });

    return user.uid;
  } catch (error) {
    console.error('Error signing up:', error.message);
    throw error; 
  }
};

const signIn = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error("Please enter email and password");
    }

    const userCredential = await auth().signInWithEmailAndPassword(
      email.trim(),
      password
    );

    const user = userCredential.user;
    console.log('User signed in successfully:', user.uid);

    return user.uid;
  } catch (error) {
    console.error('Error signing in:', error.message);
    throw error; // Propagate the error for handling in the calling code.
  }
};

const signOut = async () => {
  try {
    await auth().signOut();
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error.message);
    throw error; // Propagate the error for handling in the calling code.
  }
};

const Auth = {
  signUp,
  signIn,
  signOut,
  
  // Add other Auth methods if needed
};

export default Auth;
