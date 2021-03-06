import { useEffect, useState, useRef, useLayoutEffect } from "react";
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
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { signOut, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../../firebaseConfig";
import { Avatar, Button } from "react-native-elements";
import { Ionicons, Entypo, FontAwesome, Feather } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Camera, CameraType } from "expo-camera";
import { useToast } from "react-native-toast-notifications";
import UpdateEmailModal from "./UpdateEmailModal";
import ChangePasswordModal from "./ChangePasswordModal";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

const ProfileScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const toast = useToast();
  let cameraRef = useRef();

  const [pickedPhoto, setPickedPhoto] = useState("");
  const [email, setEmail] = useState(user.email);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [emailVerified, setEmailVerified] = useState(user.emailVerified);
  const [displayNameAvailable, setDisplayNameAvailable] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [savingChangesSpinner, setSavingChangesSpinner] = useState(false);
  const [savingChangesDisabled, setSavingChangesDisabled] = useState(false);
  const [canEditEmail, setCanEditEmail] = useState(false);
  const [canEditDisplayName, setCanEditDisplayName] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  const usersRef = collection(db, "users");
  const qEmail = query(usersRef, where("email", "==", email));
  const qDisplayName = query(usersRef, where("displayName", "==", displayName));

  // useEffect(() => {
  //   // (async () => {
  //   //   const { status } = await Camera.requestCameraPermissionsAsync();
  //   //   setHasPermission(status === "granted");
  //   // })();
  //   checkCameraPermission();
  // }, []);

  const checkCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  // if (hasPermission === null) {
  //   return <View />;
  // }
  // if (hasPermission === false) {
  //   return <Text>No access to camera</Text>;
  // }

  // useEffect(() => {
  //   const unsubEmails = onSnapshot(qEmail, (querySnapshot) => {
  //     let userEmails = [];
  //     querySnapshot.docs.forEach((doc) => {
  //       if (doc.data().email !== user.email) {
  //         userEmails.push(doc.data().email);
  //       }
  //     });

  //     if (userEmails.length > 0) {
  //       setEmailAvailable(false);
  //     } else {
  //       setEmailAvailable(true);
  //     }
  //   });

  //   return unsubEmails;
  // }, [email]);

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

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <Text style={{ fontSize: 36, fontWeight: "800" }}>Profile</Text>
      ),
      headerRight: () => (
        <Button
          title="Sign Out"
          onPress={() => signOut(auth)}
          // raised={true}
          // buttonStyle={{ backgroundColor: "#22a6b3" }}
          titleStyle={{ fontSize: 24, color: "#22a6b3" }}
          type="clear"
        />
      ),
    });
  }, [navigation, user.photoURL]);

  const selectProfilePic = async () => {
    try {
      // Ask the user for the permission to access the media library
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        toast.show(
          "You denied permission to allow this app to access your photos",
          {
            type: "danger",
          }
        );
        return;
      }

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
      toast.show("Trouble selecting profile pic", {
        type: "danger",
      });
      console.error(
        error.code,
        "-- error selecting new profile pic --",
        error.message
      );
    }
  };

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      toast.show("Camera permissions are currently denied", {
        type: "danger",
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    // console.log(result);

    if (!result.cancelled) {
      setPickedPhoto(result.uri);
      // console.log(result.uri);
    }
  };

  const handleUpdateProfilePic = async () => {
    try {
      setSavingChangesSpinner(true);
      setSavingChangesDisabled(true);

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
          })
            .then(async () => {
              const userRef = doc(db, "users", user.uid);
              await updateDoc(userRef, {
                photoURL: url,
              });
            })
            .then(() => {
              setSavingChangesSpinner(false);
              setSavingChangesDisabled(false);
              setPickedPhoto("");
              toast.show("Successfully updated profile picture", {
                type: "success",
              });
              // console.log("Profile was updated succesfully");
            });
        });
      });
    } catch (error) {
      setSavingChangesSpinner(false);
      setSavingChangesDisabled(false);
      console.error(
        error.code,
        "--- error updating profile picture ---",
        error.message
      );
      toast.show("Error updating profile pricture", {
        type: "danger",
      });
    }
  };

  const handleUpdateDisplayName = async () => {
    try {
      setSavingChangesSpinner(true);
      setSavingChangesDisabled(true);

      await updateProfile(user, {
        displayName: displayName,
      })
        .then(async () => {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
            displayName: displayName,
          });
        })
        .then(() => {
          setSavingChangesSpinner(false);
          setSavingChangesDisabled(false);
          toast.show("Successfully updated display name", {
            type: "success",
          });
          // console.log("Display Name was updated succesfully");
        });
    } catch (error) {
      setSavingChangesSpinner(false);
      setSavingChangesDisabled(false);
      toast.show("Error updating display name", {
        type: "danger",
      });
      console.error(
        error.code,
        "-- error updating display name --",
        error.message
      );
    }
  };

  const handleUpdateProfile = () => {
    try {
      if (!email || !displayName) {
        toast.show("Please enter email and display name", {
          type: "danger",
        });
      } else if (
        email === user.email &&
        displayName === user.displayName &&
        !pickedPhoto
      ) {
        toast.show("No changes to be saved", {
          type: "warning",
        });
      } else if (!displayNameAvailable) {
        toast.show("Display Name is not available", {
          type: "danger",
        });
      } else {
        if (email !== user.email) {
          setModalVisible(true);
        }
        if (pickedPhoto) {
          handleUpdateProfilePic();
        }
        if (displayName !== user.displayName) {
          handleUpdateDisplayName();
        }
      }
    } catch (error) {
      toast.show("Trouble updating profile", {
        type: "danger",
      });
      console.error(error.code, "-- error updating profile --", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingsBodyView}>
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          {!pickedPhoto ? (
            <>
              <Avatar source={{ uri: user.photoURL }} size={150} rounded />
              {/* <Pressable onPress={selectProfilePic}>
                <View style={styles.removeAddPhotoBtn}>
                  <Ionicons name="add-circle" size={34} color="green" />
                </View>
              </Pressable> */}
              <Menu>
                <MenuTrigger>
                  <View style={styles.removeAddPhotoBtn}>
                    <Ionicons
                      name="add-circle"
                      size={34}
                      color="green"
                      style={{ bottom: 2 }}
                    />
                  </View>
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption
                    onSelect={selectProfilePic}
                    style={{ marginVertical: 5 }}
                  >
                    <View style={{ flexDirection: "row", paddingLeft: 5 }}>
                      <FontAwesome name="picture-o" size={20} color="#000" />
                      <View style={{ alignSelf: "center", marginLeft: 5 }}>
                        <Text style={{ fontSize: 18 }}>Select Photo</Text>
                      </View>
                    </View>
                  </MenuOption>
                  <MenuOption
                    style={{ marginVertical: 5 }}
                    onSelect={openCamera}
                  >
                    <View style={{ flexDirection: "row", paddingLeft: 5 }}>
                      <Feather name="camera" size={20} color="#000" />
                      <View style={{ alignSelf: "center", marginLeft: 5 }}>
                        <Text style={{ fontSize: 18 }}>Camera</Text>
                      </View>
                    </View>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </>
          ) : (
            <>
              <Avatar source={{ uri: pickedPhoto }} size={150} rounded />
              <Pressable onPress={() => setPickedPhoto("")}>
                <View style={styles.removeAddPhotoBtn}>
                  <Ionicons
                    name="remove-circle"
                    size={34}
                    color="tomato"
                    style={{ position: "relative", bottom: 2 }}
                  />
                </View>
              </Pressable>
            </>
          )}
        </View>
        <View
          style={{
            marginVertical: 20,
            // alignItems: "center",
            // backgroundColor: "green",
            // justifyContent: "space-between",
          }}
        >
          <View style={styles.credentialInputView}>
            <Text style={styles.credentialPropertyText}>Email:</Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-end",
                // backgroundColor: "blue",
                // width: 400,
              }}
            >
              <TextInput
                value={email}
                placeholder={user.email}
                onChangeText={(text) => setEmail(text.toLowerCase())}
                style={
                  canEditEmail
                    ? styles.credentialInput
                    : [styles.credentialInput, { backgroundColor: "#ececec" }]
                }
                editable={canEditEmail}
              />
              {/* <View style={{ marginLeft: 30 }}> */}
              {user.providerData[0].providerId === "password" ? (
                <Pressable
                  onPress={() => setCanEditEmail(!canEditEmail)}
                  style={{ alignSelf: "center", paddingLeft: 10 }}
                >
                  <Feather name="edit-2" size={20} color="black" />
                </Pressable>
              ) : (
                <View style={{ marginLeft: 30 }} />
              )}
              {/* </View> */}
            </View>
          </View>
          <View style={styles.credentialInputView}>
            <Text style={styles.credentialPropertyText}>Display Name:</Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-end",
                // backgroundColor: "blue",
                // width: 400,
              }}
            >
              <TextInput
                value={displayName}
                placeholder={user.displayName}
                onChangeText={(text) => setDisplayName(text)}
                style={
                  canEditDisplayName
                    ? styles.credentialInput
                    : [styles.credentialInput, { backgroundColor: "#ececec" }]
                }
                editable={canEditDisplayName}
              />
              <Pressable
                onPress={() => setCanEditDisplayName(!canEditDisplayName)}
                style={{ alignSelf: "center", paddingLeft: 10 }}
              >
                <Feather name="edit-2" size={20} color="black" />
              </Pressable>
            </View>
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
        {user.providerData[0].providerId === "password" && (
          <View
            style={{
              flexDirection: "row",
              alignSelf: "flex-end",
            }}
          >
            <View style={{ justifyContent: "center" }}>
              <Text
                onPress={() => setPasswordModalVisible(true)}
                style={{
                  paddingLeft: 10,
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                Change Password
              </Text>
              <ChangePasswordModal
                passwordModalVisible={passwordModalVisible}
                setPasswordModalVisible={setPasswordModalVisible}
              />
            </View>
            <Entypo name="chevron-small-right" size={24} color="black" />
          </View>
        )}
      </View>
      <View style={{ alignItems: "center" }}>
        {/* <Pressable
          onPress={handleUpdateProfile}
          style={
            !displayNameAvailable ? styles.disabledUpdateBtn : styles.updateBtn
          }
          disabled={!displayNameAvailable ? true : false}
        >
          <Text style={{ margin: 10, fontSize: 24, color: "#34495e" }}>
            Save Changes
          </Text>
        </Pressable> */}
        <Button
          title="Save Changes"
          titleStyle={{ fontSize: 24 }}
          onPress={handleUpdateProfile}
          buttonStyle={{ backgroundColor: "#22a6b3" }}
          containerStyle={{ width: 200, marginVertical: 20 }}
          loading={savingChangesSpinner}
          disabled={savingChangesDisabled}
          disabledStyle={{ backgroundColor: "#b2bec3" }}
          raised={true}
        />
        <UpdateEmailModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          email={email}
          user={user}
        />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  settingsBodyView: {
    // backgroundColor: "red",
    // width: "100%",
    // justifyContent: "space-around",
  },
  removeAddPhotoBtn: {
    position: "absolute",
    bottom: 5,
    right: -70,
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: "#fff",
    // backgroundColor: "red",
  },
  credentialInputView: {
    // backgroundColor: "blue",
    flexDirection: "row",
    // alignSelf: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    // paddingHorizontal: 10,
  },
  credentialPropertyText: {
    fontSize: 18,
    alignSelf: "center",
  },
  credentialInput: {
    // backgroundColor: "red",
    width: 200,
    height: 30,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    fontSize: 18,
    padding: 5,
  },
  updateBtn: {
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
  disabledUpdateBtn: {
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
    width: 100,
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
