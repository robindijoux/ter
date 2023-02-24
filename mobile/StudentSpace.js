import React, { useEffect, useState } from "react";
import {
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

export default function StudentSpace({ route, navigation }) {
  const wsUrl = BASE_URL + "/attendanceStatusUpdate";
  const socket = io.connect(wsUrl);
  const studentData = route.params.userData;
  let [sheet, setSheet] = useState(null);
  let [attendanceStatus, setAttendanceStatus] = useState(null);

  useEffect(() => {
    // getSheets().then(() => console.log("Sheets loaded"));

    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.on("disconnect", () => {
      console.log(socket.id);
    });
  }, []);

  useEffect(() => {
    if(sheet === null) return;
    setAttendanceStatus(sheet.attendanceStatus);
    // listen to the future attendance status update
    socket.on(sheet.id, (attendanceStatusUpdate) => {
      console.log("New sheet attendance update", attendanceStatusUpdate);
      setAttendanceStatus(attendanceStatusUpdate);
    });
  }, [sheet]);

  async function readSheet() {
    const sheet = await MyNFCManager.readSheet();
    console.log("Read sheet on Student Space", sheet);
    setSheet(sheet);
  }

  // const getSheets = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${BASE_URL}/sheet?studentId=${studentData.id}`
  //     );
  //     console.log(response.data);
  //     setSheets(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  //TODO: use this function before writing the sheet on the NFC tag (signature: "présent")
  const signSheet = async (sheetId) => {
    console.log("Signing sheet n°" + sheetId);
    try {
      const response = await axios.post(`${BASE_URL}/signature`, {
        personId: studentData.id,
        sheetId: sheetId,
        signature: "présent",
      });
      console.log(response.data);
      Toast.show("Signature validée !", {
        duration: Toast.durations.LONG,
      });
      console.log("Need to send on NFC tag");
      // getSheets().then(() => console.log("Sheets reloaded"));
    } catch (error) {
      console.log("Not signed: ", error);
    }
  };

  //TODO: add a function to update and write the sheet on the NFC tag



  //TODO : add a function that process the entire signing procedure (sign the sheet, update it, write it on the NFC tag)

  const isSigned = (sheet) => {
    if (sheet.signatures[studentData.id].signature === "présent") {
      return true;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feuille de séance en cours</Text>
      {sheet !== null && (<Sheet
          key={sheet.id}
          sheet={sheet}
          attendanceStatus={attendanceStatus}
          sign={signSheet}
          isSigned={isSigned}
        ></Sheet>)}
        <Button title={"Lire une feuille de présence"} onPress={readSheet}></Button>
    </View>
  );
}

const Sheet = ({ sheet, attendanceStatus, sign, isSigned }) => {
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
      {isSigned(sheet) && <Text style={styles.signed}>Feuille signée</Text>}
      {!isSigned(sheet) && attendanceStatus !== "CLOSED" && (
        <Button
          title={"Signer la feuille"}
          onPress={() => {
            sign(sheet.id);
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
