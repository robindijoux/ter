import {
  View,
  Text,
  SafeAreaView,
  Button,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { Fragment } from "react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { BASE_URL } from "./global";
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';
import Toast from 'react-native-simple-toast';



const wsUrl = BASE_URL + "/sheetUpdate";

const socket = io.connect(wsUrl);

const Attendance = ({ navigation, route }) => {
  const [sheet, setSheet] = useState(route.params.createdSheet);
  const [readyToSign, setReadyToSign] = useState(false);

  const [teacherData, setTeacherData] = useState(route.params.teacherData);
  const [isNFCActive, setIsNFCActive] = useState(false);

  const stopAttendance = () => {
    console.log(`${BASE_URL}/sheet/attendanceStop/${sheet.id}`);
    axios
      .post(BASE_URL + "/sheet/" + sheet.id + "/attendanceStop", null)
      .then((r) => {
        setReadyToSign(true);
        // console.log(r);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const resumeAttendance = () => {
    console.log(`${BASE_URL}/sheet/attendanceResume/${sheet.id}`);
    axios
      .post(BASE_URL + "/sheet/" + sheet.id + "/attendanceResume", null)
      .then((r) => {
        setReadyToSign(false);
        // console.log(r);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const signSheet = () => {
    console.log(`${BASE_URL}/signature`);
    axios
      .post(BASE_URL + "/signature", {
        personId: teacherData.id,
        sheetId: sheet.id,
        signature: "j'ai signé",
      })
      .then((r) => {
        navigation.navigate("SheetCreation", { userData: teacherData });
        // console.log(r);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //TODO: ask for NFC permission
  async function writeSheetOnNfcTag() {
    let result = false;
    setIsNFCActive(true);
    try {
      // STEP 1
      //Need to request Ndef technology before writing on NFC tag
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const bytes = Ndef.encodeMessage([Ndef.textRecord(sheet.toString())]);
      if (bytes) {
        await NfcManager.ndefHandler // STEP 2
            .writeNdefMessage(bytes); // STEP 3
        result = true;
        Toast.show("Feuille écrite sur le tag NFC", Toast.LONG);
      }
    } catch (e) {
      // console.warn("NFC error: ", e);
      Toast.show('Réponse mock, mais voici l\'erreur : '+e, Toast.LONG);
    } finally {
      // STEP 4
      await NfcManager.cancelTechnologyRequest();
    }

    return result;
  }

  //TODO: trouver une meilleure solution pour annuler l'écriture, car pour l'instant, on a une erreur car writeSheetOnNfcTag() reste bloqué et donc génère une erreur
  async function cancelNfcWriting() {
    setIsNFCActive(false);
    await NfcManager.cancelTechnologyRequest();
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.on(sheet.id, (args) => {
      console.log("New sheet:", args);
      setSheet(args);
    });

    socket.on("disconnect", () => {
      console.log(socket.id);
    });
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "space-between",
        height: "100%",
        width: "100%",
      }}
    >
      {!sheet && (
        <Fragment>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginVertical: 10,
              }}
            >
              Waiting for sheet to load...
            </Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </Fragment>
      )}
      {sheet && (
        <Fragment>
          <Text
            style={{
              fontSize: 25,
              marginBottom: "10%",
            }}
          >
            <Text>Attendance for course </Text>
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              {sheet ? sheet.courseLabel : "..."}
            </Text>
          </Text>
          <Text
            style={{
              fontSize: 20,
              marginBottom: 5,
            }}
          >
            Student list
          </Text>
          {sheet && (
            <FlatList
              data={Object.entries(sheet.signatures)}
              renderItem={({ item }) => {
                return (
                  <Text
                    style={{
                      backgroundColor: item[1].signature
                        ? "#77ddaa"
                        : "#ff6961",
                      fontSize: 20,
                      marginHorizontal: 5,
                      width: "20%",
                      textAlign: "center",
                    }}
                  >
                    {item[0]}
                  </Text>
                );
              }}
              keyExtractor={(item) => item[0]}
              ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
              numColumns={4}
              style={{
                width: "100%",
              }}
            />
          )}
          {!isNFCActive && (<Button
              onPress={writeSheetOnNfcTag}
              title="Write sheet on NFC tag"
              accessibilityLabel="Write sheet on NFC tag"
          />)}
          {isNFCActive && (<Button
              onPress={cancelNfcWriting}
              title="Cancel NFC writing"
              accessibilityLabel="Cancel NFC writing"
          />)}
          {!readyToSign && (
            <Button
              onPress={stopAttendance}
              title="Stop Attendance"
              accessibilityLabel="Stop Attendance"
            />
          )}
          {readyToSign && (
            <Fragment>
              <Button
                onPress={signSheet}
                title="Sign sheet"
                accessibilityLabel="Sign sheet"
              />
              <Button
                onPress={resumeAttendance}
                title="Resume Attendance"
                accessibilityLabel="Resume Attendance"
              />
            </Fragment>
          )}
        </Fragment>
      )}
    </SafeAreaView>
  );
};

export default Attendance;
