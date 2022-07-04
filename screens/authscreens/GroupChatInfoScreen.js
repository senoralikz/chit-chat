import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  FlatList,
  TextInput,
} from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import { Ionicons, AntDesign, FontAwesome, Feather } from "@expo/vector-icons";
import { auth, db, storage } from "../../firebaseConfig";
import { useToast } from "react-native-toast-notifications";
import { Button, ListItem, Avatar } from "react-native-elements";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { updateDoc, doc, onSnapshot } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import GroupChatMemberInfo from "../../components/GroupChatMemberInfo";

const GroupChatInfoScreen = ({ route, navigation, navigation: { goBack } }) => {
  const [groupChatPhoto, setGroupChatPhoto] = useState("");
  const [groupChatName, setGroupChatName] = useState("");
  const [pickedPhoto, setPickedPhoto] = useState("");
  const [canEdit, setCanEdit] = useState(false);

  const user = auth.currentUser;
  const toast = useToast();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Group Info",
      headerLeft: () => (
        <View style={{ alignSelf: "center" }}>
          <Pressable onPress={() => goBack()}>
            <Ionicons name="chevron-back" size={32} color="#9b59b6" />
          </Pressable>
        </View>
      ),
      headerRight: () => (
        <Button
          title="Save Changes"
          onPress={handleUpdateGroupChatInfo}
          type="clear"
          disabled={!pickedPhoto && !groupChatName ? true : false}
          titleStyle={{ fontSize: 20 }}
        />
      ),
    });
  }, [navigation, route, pickedPhoto, groupChatName]);

  useEffect(() => {
    const groupRef = doc(db, "groups", route.params.groupId);
    // const groupRef = doc(db, "groups", route.params.chatInfo?.groupId);

    const unsubChatDetails = onSnapshot(groupRef, (doc) => {
      console.log(doc.data());
      setGroupChatPhoto(doc.data().groupPhotoUrl);
      // setGroupChatName(doc.data().groupName);
    });

    return unsubChatDetails;
  }, []);

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
      toast.show(error.message, {
        type: "danger",
      });
      console.error(
        error.code,
        "-- error selecting new profile pic --",
        error.message
      );
    }
  };

  const handleUpdateGroupPhoto = async () => {
    try {
      const fileName = pickedPhoto.replace(/^.*[\\\/]/, "");
      const imageRef = ref(storage, `users/${user.uid}/images/${fileName}`);

      // firebase storage only accepts array of bytes for image/file so we need to first fetch from
      // result.uri and then convert to bytes using .blob() function from firebase
      const img = await fetch(pickedPhoto);
      const bytes = await img.blob();
      await uploadBytes(imageRef, bytes).then(() => {
        getDownloadURL(imageRef).then(async (url) => {
          const groupRef = doc(db, "groups", route.params.groupId);
          // const groupRef = doc(db, "groups", route.params.chatInfo.groupId);
          await updateDoc(groupRef, {
            groupPhotoUrl: url,
          }).then(() => {
            setPickedPhoto("");
            toast.show("Successfully updated group chat picture", {
              type: "success",
            });
            // console.log("Profile was updated succesfully");
          });
        });
      });
    } catch (error) {
      console.error(
        error.code,
        "--- error updating group chat picture ---",
        error.message
      );
      toast.show(error.message, {
        type: "danger",
      });
    }
  };

  const handleUpdateGroupChatName = async () => {
    try {
      const groupRef = doc(db, "groups", route.params.groupId);
      // const groupRef = doc(db, "groups", route.params.chatInfo.groupId);
      await updateDoc(groupRef, {
        groupName: groupChatName,
      }).then(() => {
        setCanEdit(false);
        toast.show("Successfully updated group chat name", {
          type: "success",
        });
        // console.log("Display Name was updated succesfully");
      });
    } catch (error) {
      toast.show(error.message, {
        type: "danger",
      });
      console.error(
        error.code,
        "-- error updating display name --",
        error.message
      );
    }
  };

  const handleUpdateGroupChatInfo = () => {
    if (groupChatPhoto) {
      handleUpdateGroupPhoto();
    }
    if (groupChatName) {
      handleUpdateGroupChatName();
    }
  };

  return (
    <View style={styles.container}>
      {!groupChatPhoto && !pickedPhoto && (
        <>
          <View
            style={{
              backgroundColor: "#bdc3c7",
              height: 150,
              width: 150,
              borderRadius: 75,
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontSize: 125,
              }}
            >
              {route.params.friendDisplayName.length}
            </Text>
          </View>
          <Menu>
            <MenuTrigger>
              <View style={styles.removeAddPhotoBtn}>
                <Ionicons name="add-circle" size={34} color="green" />
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
                onSelect={() => alert(`Opening camera`)}
                // onSelect={() => {
                //   setType(
                //     type === CameraType.back
                //       ? CameraType.front
                //       : CameraType.back
                //   );
                // }}
                // onSelect={checkCameraPermission}
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
      )}

      {!!pickedPhoto ? (
        <>
          <Avatar source={{ uri: pickedPhoto }} size={150} rounded />
          <Pressable onPress={() => setPickedPhoto("")}>
            <View style={styles.removeAddPhotoBtn}>
              <Ionicons name="remove-circle" size={34} color="tomato" />
            </View>
          </Pressable>
        </>
      ) : (
        !!groupChatPhoto && (
          <>
            <Avatar source={{ uri: groupChatPhoto }} size={150} rounded />
            <Menu>
              <MenuTrigger>
                <View style={styles.removeAddPhotoBtn}>
                  <Ionicons name="add-circle" size={34} color="green" />
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
                  onSelect={() => alert(`Opening camera`)}
                  // onSelect={() => {
                  //   setType(
                  //     type === CameraType.back
                  //       ? CameraType.front
                  //       : CameraType.back
                  //   );
                  // }}
                  // onSelect={checkCameraPermission}
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
        )
      )}

      <View style={{ flexDirection: "row", width: "90%" }}>
        <View style={{ justifyContent: "center", marginRight: 5 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Chat Name: </Text>
        </View>
        <TextInput
          value={groupChatName}
          placeholder={
            route.params.groupName
              ? route.params.groupName
              : route.params.friendDisplayName.join(", ")
          }
          // inputContainerStyle={{
          //   alignContent: "flex-end",
          //   alignSelf: "flex-end",
          //   alignItems: "flex-end",
          //   justifyContent: "flex-end",
          //   // backgroundColor: "red",
          // }}
          style={{
            width: "65%",
            borderBottomWidth: 1,
            marginVertical: 20,
            fontSize: 20,
          }}
          onChangeText={(text) => setGroupChatName(text)}
          editable={canEdit}
          autoFocus={true}
        />
        {/* <View> */}
        <Pressable
          onPress={() => setCanEdit(!canEdit)}
          style={{ alignSelf: "center", paddingLeft: 10 }}
        >
          <Feather name="edit-2" size={24} color="black" />
        </Pressable>
        {/* </View> */}
      </View>

      <Text
        style={{
          textAlign: "center",
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Group Chat Members
      </Text>
      <View style={{ borderBottomWidth: 1, width: "100%" }} />
      <FlatList
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: "100%",
              borderBottomColor: "#dfe6e9",
              borderBottomWidth: 1,
            }}
          />
        )}
        data={route.params.membersInfo}
        renderItem={({ item }) => <GroupChatMemberInfo friend={item} />}
        keyExtractor={(item) => item.userId}
        style={{
          width: "100%",
        }}
      />
      {/* <Button
        title="chat id"
        onPress={() =>
          console.log("checking group chat id:", route.params.groupId)
        }
      /> */}
      {/* <Button
        title="chat info"
        onPress={() =>
          console.log("checking group chat info:", route.params.chatInfo)
        }
      /> */}
    </View>
  );
};

export default GroupChatInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // backgroundColor: "#ececec",
    // justifyContent: "center",
    // justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
  },
  removeAddPhotoBtn: {
    position: "absolute",
    bottom: 5,
    right: -70,
    width: 34,
    height: 34,
    borderRadius: 20,
    backgroundColor: "#fff",
    // backgroundColor: "#ececec",
  },
});
