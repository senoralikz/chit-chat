import { useEffect } from "react";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { SocialIcon } from "react-native-elements";

WebBrowser.maybeCompleteAuthSession();

const GoogleSignInBtn = () => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId:
      "222411167592-a3d60vq19ouqusba6ecrvqlopqj567hn.apps.googleusercontent.com",
    expoClientId:
      "222411167592-bcur0kqlcuc6asbhcfl0ned6q2i4qgqv.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).then(() =>
        addUserToCollection(auth.currentUser)
      );
    }
  }, [response]);

  const addUserToCollection = async (user) => {
    try {
      await setDoc(doc(db, `users/${user.uid}`), {
        email: user.email,
        photoURL: user.photoURL,
        displayName: user.displayName,
        userId: user.uid,
      });
    } catch (error) {
      console.error(
        error.code,
        "--- trouble adding user to collection ---",
        error.message
      );
      Alert.alert(error.code, error.message, { text: "Ok" });
    }
  };

  return (
    <SocialIcon
      type="google"
      title="Sign In With Google"
      fontStyle={{ fontSize: 20 }}
      button={true}
      disabled={!request}
      onPress={() => {
        promptAsync();
      }}
      // onPress={() => alert("signing in with google")}
      style={{ width: 200, borderRadius: 10 }}
    />
  );
};

export default GoogleSignInBtn;
