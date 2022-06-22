import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";

const SelectChatsListModal = ({ modalVisible, setModalVisible, chatWith }) => {
  return (
    <Modal
      animationType="slide"
      presentationStyle="formSheet"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <Pressable
        style={{ justifyContent: "center" }}
        onPress={() => setModalVisible(false)}
      >
        <Ionicons name="chevron-back" size={32} color="#9b59b6" />
      </Pressable>
      <View
        style={{ flex: 1, justifyContent: "center", paddingHorizontal: 10 }}
      >
        <FlatList
          data={chatWith}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "#9b59b6",
                borderRadius: 5,
                marginHorizontal: 3,
                marginBottom: 2,
                paddingHorizontal: 5,
                paddingVertical: 2,
                // maxWidth: "100%",
                // height: 25,
              }}
            >
              <Avatar source={{ uri: item.photoURL }} size="small" rounded />
              <View style={{ justifyContent: "center" }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "600",
                    color: "#fff",
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.displayName}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.userId}
          ListEmptyComponent={() => (
            <View>
              <Text>No one to chat with</Text>
            </View>
          )}
        />
      </View>
    </Modal>
  );
};

export default SelectChatsListModal;

const styles = StyleSheet.create({});
