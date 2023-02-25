import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "./global";
import { io } from "socket.io-client";
import Toast from "react-native-root-toast";
import NfcManager from "react-native-nfc-manager";
import MyNFCManager from "./MyNFCManager";
import NFCModal from "./NFCModal";

export default function StudentSpace({ route, navigation }) {
  const wsUrl = BASE_URL + "/attendanceStatusUpdate";
  const socket = io.connect(wsUrl);
  const studentData = route.params.userData;
  let [sheet, setSheet] = useState(undefined);
  let [attendanceStatus, setAttendanceStatus] = useState(null);
  let [isNFCRequestOn, setIsNFCRequestOn] = useState(false);
  let [isSheetSigned, setIsSheetSigned] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      // console.log("Connect on socket ID: ", socket.id);
    });

    socket.on("disconnect", () => {
      // console.log("Disconnect on socket ID: ", socket.id);
    });
  }, []);

  useEffect(() => {
    if(sheet === undefined) return;
    setAttendanceStatus(sheet.attendanceStatus);
    // listen to the future attendance status update
    socket.on(sheet.id, (attendanceStatusUpdate) => {
      // console.log("New sheet attendance update", attendanceStatusUpdate);
      setAttendanceStatus(attendanceStatusUpdate);
    });
  }, [sheet]);

  async function readSheetNfcOnTag() {
    try{
      setIsNFCRequestOn(true);
      const sheet = await MyNFCManager.readSheet();
      setIsNFCRequestOn(false);
      setSheet(sheet);
    }
    catch(e) {
      setIsNFCRequestOn(false);
    }
  }

  const verifySignature = async (sheetId) => {
    // console.log("Verify signature for sheet n°" + sheetId);
    try {
      const response = await axios.post(`${BASE_URL}/signature`, {
        personId: studentData.id,
        sheetId: sheetId,
        signature: "present",
      });
      //TODO: verify the response of the server (signature valid or not)
      console.log("Signature validée !", response.data);
      Toast.show("Signature validée !", {
        duration: Toast.durations.LONG,
      });
      setIsSheetSigned(true);
    } catch (error) {
      console.log("Not signed: ", error);
    }
  };

  async function writeSheetOnNfcTag() {
    sheet.signatures[studentData.id].signature = "present";
    try{
      setIsNFCRequestOn(true);
      await MyNFCManager.writeSheet(sheet);
      setIsNFCRequestOn(false);
    }
    catch(e) {
      setIsSheetSigned(false);
      setIsNFCRequestOn(false);
    }
  }

  const signSheet = async () => {
    await verifySignature(sheet.id);
    Toast.show("Signature validée ! Veuillez vous approchez du tag", {duration: Toast.durations.LONG,});
    await writeSheetOnNfcTag();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feuille de séance en cours</Text>
      {sheet !== undefined && (<Sheet
          key={sheet.id}
          sheet={sheet}
          attendanceStatus={attendanceStatus}
          sign={signSheet}
          isSigned={isSheetSigned}
        ></Sheet>)}
        <Button title={"Lire une feuille de présence"} onPress={readSheetNfcOnTag}></Button>
      <NFCModal isModalVisible={isNFCRequestOn} setModalVisible={setIsNFCRequestOn}/>
    </View>
  );
}

const Sheet = ({ sheet, attendanceStatus, sign, isSigned}) => {
  const startDate = new Date(sheet.courseStartDate);
  const endDate = new Date(sheet.courseEndDate);

  return (
    <View style={styles.sheet}>
      <Text style={styles.subtitle}>{sheet.courseLabel}</Text>
      <Text>
        Date du cours : {startDate.getDate()}/{startDate.getMonth()}/
        {startDate.getFullYear()}
      </Text>
      <Text>
        Heure du cours : {startDate.getHours()}:{startDate.getMinutes()} -{" "}
        {endDate.getHours()}:{endDate.getMinutes()}
      </Text>
      <Text>Statut: {attendanceStatus}</Text>
      {isSigned && <Text style={styles.signed}>Feuille signée</Text>}
      {!isSigned && attendanceStatus !== "CLOSED" && (
        <Button
          title={"Signer la feuille"}
          onPress={() => {
            sign();
          }}
          disabled={attendanceStatus !== "OPEN"}
        ></Button>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
    padding: 5,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "black",
  },
  title: {
    fontSize: 20,
    backgroundColor: "#1380ff",
    color: "white",
    paddingHorizontal: 5,
    paddingVertical: 2,
    margin: 10,
  },
  subtitle: {
    fontSize: 20,
    marginTop: 10,
  },
  sheet: {
    backgroundColor: "white",
    padding: 2,
    width: "100%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "black",
  },
  signed: {
    color: "white",
    backgroundColor: "green",
    paddingHorizontal: 10,
    marginTop: 10,
  },
});
