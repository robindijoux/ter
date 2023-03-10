import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import Modal from "react-native-modal";
import MyNFCManager from "./MyNFCManager";

const NFCModal = ({ isModalVisible, setModalVisible }) => {
  const cancelModal = async () => {
    console.log("Cancel modal");
    await MyNFCManager.cancelNfcRequest();
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {/*<Button title="Show modal" onPress={toggleModal} />*/}

      <Modal isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            borderColor: "rgba(0, 0, 0, 0.1)",
            marginVertical: 200,
            marginHorizontal: 40,
          }}
        >
          <Text>Get close to the NFC tag...</Text>

          <Button title="Cancel" onPress={cancelModal} color="#00b8ff" />
        </View>
      </Modal>
    </View>
  );
};

export default NFCModal;
