import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import ChatListItem from "../../components/ChatListItem.js";

const SelectChatsListModal = ({
  modalVisible,
  setModalVisible,
  groups,
  navigation,
}) => {
  return (
    <Modal
      animationType="slide"
      presentationStyle="formSheet"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomWidth: 1,
        }}
      >
        <Pressable
          style={{ justifyContent: "center" }}
          onPress={() => setModalVisible(false)}
        >
          <Ionicons name="chevron-back" size={32} color="#9b59b6" />
        </Pressable>
        <Text style={{ fontSize: 36, fontWeight: "800", padding: 10 }}>
          Existing Chats
        </Text>
      </View>
      <View
        style={{ flex: 1, justifyContent: "center", paddingHorizontal: 10 }}
      >
        <Button
          title="Create New Chat"
          icon={() => <Ionicons name="add" size={24} color="#fff" />}
          containerStyle={{ marginTop: 10 }}
          onPress={() => console.log("creating a new chat")}
        />
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
          data={groups}
          renderItem={({ item }) => (
            <ChatListItem
              chat={item}
              navigation={navigation}
              setModalVisible={setModalVisible}
            />
          )}
          keyExtractor={(item) => item.groupId}
        />
      </View>
      <StatusBar style="inverted" />
    </Modal>
  );
};

export default SelectChatsListModal;

const styles = StyleSheet.create({});
