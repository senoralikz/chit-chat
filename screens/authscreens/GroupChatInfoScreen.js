import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  FlatList,
} from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { auth, db } from "../../firebaseConfig";
import { useToast } from "react-native-toast-notifications";
import { Button } from "react-native-elements";
import { ListItem, Avatar } from "react-native-elements";

const GroupChatInfoScreen = ({ route, navigation, navigation: { goBack } }) => {
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
    });
  }, [navigation, route]);

  const MemberInfo = ({ friend }) => {
    return (
      <ListItem>
        <Avatar size="medium" source={{ uri: friend.photoURL }} rounded />
        <ListItem.Content>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ListItem.Title
              style={{
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              {friend.displayName}
            </ListItem.Title>
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };

  return (
    // <ScrollView>
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: "#bdc3c7",
          height: 100,
          width: 100,
          borderRadius: 50,
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontSize: 100,
          }}
        >
          {route.params.friendDisplayName.length}
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ borderBottomWidth: 1, justifyContent: "center" }}>
          <Text>
            {route.params.groupName
              ? route.params.groupName
              : route.params.friendDisplayName.join(", ")}
          </Text>
        </View>
        <Pressable>
          <AntDesign name="edit" size={24} color="black" />
        </Pressable>
      </View>
      <View style={{ width: "80%" }}>
        {/* {route.params.membersInfo.map((member) => (
            <View
              key={member.userId}
              style={{
                width: "100%",
                alignSelf: "center",
                borderBottomColor: "#dfe6e9",
                borderBottomWidth: 1,
              }}
            >
              <MemberInfo friend={member} />
            </View>
          ))} */}
        <FlatList
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: "100%",
                alignSelf: "center",
                borderBottomColor: "#dfe6e9",
                borderBottomWidth: 1,
              }}
            />
          )}
          data={route.params.membersInfo}
          renderItem={({ item }) => <MemberInfo friend={item} />}
          keyExtractor={(item) => item.userId}
          style={{
            borderRadius: 20,
          }}
        />
      </View>
      {/* <Button
        title="chat info"
        onPress={() =>
          console.log("checking group chat info:", route.params.chatInfo)
        }
      /> */}
    </View>
    // </ScrollView>
  );
};

export default GroupChatInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#ececec",
    // justifyContent: "center",
    alignItems: "center",
  },
});
