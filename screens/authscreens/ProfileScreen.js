import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import {
  collection,
  query,
  where,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { signOut, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../../firebaseConfig";
import { Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

const ProfileScreen = () => {
  const user = auth.currentUser;

  const [pickedPhoto, setPickedPhoto] = useState("");
  const [email, setEmail] = useState(user.email);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [emailVerified, setEmailVerified] = useState(user.emailVerified);
  const [emailAvailable, setEmailAvailable] = useState(true);
  const [displayNameAvailable, setDisplayNameAvailable] = useState(true);
  const [canSave, setCanSave] = useState(true);

  const usersRef = collection(db, "users");
  const qEmail = query(usersRef, where("email", "==", email));
  const qDisplayName = query(usersRef, where("displayName", "==", displayName));

  useEffect(() => {
    const unsubEmails = onSnapshot(qEmail, (querySnapshot) => {
      let userEmails = [];
      querySnapshot.docs.forEach((doc) => {
        if (doc.data().email !== user.email) {
          userEmails.push(doc.data().email);
        }
      });

      if (userEmails.length > 0) {
        setEmailAvailable(false);
      } else {
        setEmailAvailable(true);
      }
    });

    return unsubEmails;
  }, [email]);

  useEffect(() => {
    const unsubDisplayNames = onSnapshot(qDisplayName, (querySnapshot) => {
      let userDisplayNames = [];
      querySnapshot.docs.forEach((doc) => {
        if (doc.data().displayName !== user.displayName) {
          userDisplayNames.push(doc.data().displayName);
        }
      });

      if (userDisplayNames.length > 0) {
        setDisplayNameAvailable(false);
      } else {
        setDisplayNameAvailable(true);
      }
    });

    return unsubDisplayNames;
  }, [displayName]);

  // useEffect(() => {
  //   if (email === user.email || displayName === user.displayName) {
  //     setCanSave(true);
  //   } else {
  //     setCanSave(false);
  //   }
  // }, [email, displayName]);

  const selectProfilePic = async () => {
    try {
      // No permissions request is necessary for launching the image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        exif: false,
      });
      if (!result.cancelled) {
        setPickedPhoto(result.uri);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Trouble selecting profile pic",
      });
      console.error(
        error.code,
        "-- error selecting new profile pic --",
        error.message
      );
    }
  };

  const updateWithProfilePic = async () => {
    try {
      const fileName = pickedPhoto.replace(/^.*[\\\/]/, "");
      const imageRef = ref(storage, `users/${user.uid}/images/${fileName}`);

      // firebase storage only accepts array of bytes for image/file so we need to first fetch from
      // result.uri and then convert to bytes using .blob() function from firebase
      const img = await fetch(pickedPhoto);
      const bytes = await img.blob();
      await uploadBytes(imageRef, bytes).then(() => {
        getDownloadURL(imageRef).then(async (url) => {
          await updateProfile(user, {
            photoURL: url,
            displayName: displayName,
            email: email,
          })
            .then(async () => {
              const userRef = doc(db, "users", user.uid);
              await updateDoc(userRef, {
                email: email,
                displayName: displayName,
                photoURL: url,
              });
            })
            .then(() => {
              setPickedPhoto("");
              Toast.show({
                type: "success",
                text1: "Success!",
                text2: "Successfully updated profile",
              });
              // console.log("Profile was updated succesfully");
            });
        });
      });
    } catch (error) {
      console.error(
        error.code,
        "--- trouble signing up with profile pic ---",
        error.message
      );
      Toast.show({
        type: "error",
        text1: "Sorry!",
        text2: "Trouble updating profile",
      });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (!email || !displayName) {
        Toast.show({
          type: "error",
          text1: "Missing Info",
          text2: "Please make sure there is an email and display name",
        });
      } else if (email === user.email && displayName === user.displayName) {
        Toast.show({
          type: "info",
          text1: "Sorry",
          text2: "No changes to be saved",
        });
      } else {
        if (pickedPhoto) {
          updateWithProfilePic();
        } else {
          await updateProfile(user, {
            email: email,
            displayName: displayName,
          })
            .then(async () => {
              const userRef = doc(db, "users", user.uid);
              await updateDoc(userRef, {
                email: email,
                displayName: displayName,
              });
            })
            .then(() => {
              Toast.show({
                type: "success",
                text1: "Success!",
                text2: "Successfully updated profile",
              });
              // console.log("Profile was updated succesfully");
            });
        }
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Sorry!",
        text1: "Trouble updating profile",
      });
      console.error(error.code, "-- error updating profile --", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 36, fontWeight: "800" }}>Profile</Text>
      </View>
      <View style={styles.settingsBodyView}>
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          {!pickedPhoto ? (
            <>
              <Avatar source={{ uri: user.photoURL }} size={150} rounded />
              <Pressable onPress={selectProfilePic}>
                <View style={styles.removeAddPhotoBtn}>
                  <Ionicons name="add-circle" size={34} color="green" />
                </View>
              </Pressable>
            </>
          ) : (
            <>
              <Avatar source={{ uri: pickedPhoto }} size={150} rounded />
              <Pressable onPress={() => setPickedPhoto("")}>
                <View style={styles.removeAddPhotoBtn}>
                  <Ionicons name="remove-circle" size={34} color="tomato" />
                </View>
              </Pressable>
            </>
          )}
        </View>
        <View style={{ marginVertical: 20 }}>
          <View style={styles.credentialInputView}>
            <Text style={styles.credentialPropertyText}>Email: </Text>
            <TextInput
              value={email}
              placeholder={user.email}
              onChangeText={(text) => setEmail(text.toLowerCase())}
              style={styles.credentialInput}
            />
          </View>
          {!emailAvailable && (
            <View style={{ paddingRight: 10 }}>
              <Text
                style={{ color: "#e84118", fontSize: 14, textAlign: "right" }}
              >
                Email already in use
              </Text>
            </View>
          )}
          <View style={styles.credentialInputView}>
            <Text style={styles.credentialPropertyText}>Display Name: </Text>
            <TextInput
              value={displayName}
              placeholder={user.displayName}
              onChangeText={(text) => setDisplayName(text)}
              style={styles.credentialInput}
            />
          </View>
          {!displayNameAvailable && (
            <View style={{ paddingRight: 10 }}>
              <Text
                style={{ color: "#e84118", fontSize: 14, textAlign: "right" }}
              >
                Display Name Is Not Available
              </Text>
            </View>
          )}
          <View style={styles.credentialInputView}>
            <Text style={styles.credentialPropertyText}>Email Verified: </Text>
            {emailVerified ? (
              <Text style={styles.credentialPropertyText}>Yes</Text>
            ) : (
              <Text style={styles.credentialPropertyText}>No</Text>
            )}
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
          <Pressable
            onPress={handleUpdateProfile}
            // style={
            //   email === user.email || displayName === user.displayName
            //     ? styles.disabledSignUpBtn
            //     : styles.signUpBtn
            // }
            // disabled={
            //   email === user.email || displayName === user.displayName
            //     ? true
            //     : false
            // }
            style={
              !displayNameAvailable || !emailAvailable
                ? styles.disabledSignUpBtn
                : styles.signUpBtn
            }
            disabled={!emailAvailable || !displayNameAvailable ? true : false}
          >
            <Text style={{ margin: 10, fontSize: 24, color: "#34495e" }}>
              Save Changes
            </Text>
          </Pressable>
        </View>
      </View>
      <View
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Pressable onPress={() => signOut(auth)} style={styles.signOutBtn}>
          <Text style={{ margin: 10, fontSize: 24, color: "#fff" }}>
            Sign Out
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 5,
  },
  // profilePic: {
  //   elevation: 3,
  //   shadowOffset: { width: 2, height: 2 },
  //   shadowColor: "#333",
  //   shadowOpacity: 0.5,
  //   shadowRadius: 4,
  // },
  removeAddPhotoBtn: {
    position: "absolute",
    bottom: 0,
    right: -75,
    width: 34,
    height: 34,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  settingsBodyView: {
    // justifyContent: "center",
    // alignItems: "center",
  },
  credentialInputView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  credentialPropertyText: {
    fontSize: 18,
  },
  credentialInput: {
    width: "60%",
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    fontSize: 18,
  },
  signUpBtn: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#34495e",
    borderWidth: 1,
    width: 200,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#333",
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  disabledSignUpBtn: {
    backgroundColor: "#bdc3c7",
    borderRadius: 10,
    borderColor: "#34495e",
    borderWidth: 1,
    width: 200,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#333",
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  signOutBtn: {
    backgroundColor: "#22a6b3",
    borderRadius: 10,
    width: 200,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "flex-end",
    elevation: 3,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#333",
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
});
