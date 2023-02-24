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
import MyNFCManager from "./MyNFCManager";
import Toast from "react-native-root-toast";
import StudentTable from "./StudentTable";

const wsUrl = BASE_URL + "/sheetUpdate";

const socket = io.connect(wsUrl);

const Attendance = ({ navigation, route }) => {
  const [sheet, setSheet] = useState(route.params.createdSheet);
  const [nfcSheet, setNfcSheet] = useState(undefined);
  const [attendanceStatus, setAttendanceStatus] = useState(
    route.params.createdSheet.attendanceStatus
  );

  const [teacherData, setTeacherData] = useState(route.params.teacherData);
  const [isNFCRequestOn, setIsNFCRequestOn] = useState(false);

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
  const stopAttendance = () => {
    if (isNFCRequestOn) {
      cancelNfcWriting().then(() =>
        console.log("NFC writing cancelled with stop attendance")
      );
    }
    console.log(`${BASE_URL}/sheet/attendanceStop/${sheet.id}`);
    axios
      .post(BASE_URL + "/sheet/" + sheet.id + "/attendanceStop", null)
      .then((r) => {
        setAttendanceStatus("INTERRUPTED");
        console.log(r);
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
        setAttendanceStatus("OPEN");
        console.log(r);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const signSheet = () => {
    if (nfcSheet != undefined) {
      let body = {
        teacherSignature: "Teacher Signature",
        studentsSignatures: Object.fromEntries(
          Object.entries(nfcSheet.signatures)
            .filter((s) => s[1].signature != null)
            .map((s) => [s[0], s[1].signature])
        ),
        whiteList: [],
      };
      console.log("attendanceEnd body:", JSON.stringify(body, null, 2));
      axios
        .post(BASE_URL + "/sheet/" + sheet.id + "/attendanceEnd", body)
        .then((r) => {
          navigation.push("SheetCreation", { userData: teacherData });
          console.log("R", r);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      Toast.show("La feuille NFC n'a pas été récupérée.", Toast.durations.LONG);
    }
  };

  async function readSheet() {
    let nfcSheet = await MyNFCManager.readSheet();
    // alert(JSON.stringify(nfcSheet));
    setNfcSheet(nfcSheet);
  }

  async function writeSheetOnNfcTag() {
    setIsNFCRequestOn(true);
    await MyNFCManager.writeSheet(sheet);
    setIsNFCRequestOn(false);
  }

  //TODO: trouver une meilleure solution pour annuler l'écriture, car pour l'instant, on a une erreur car writeSheetOnNfcTag() reste bloqué et donc génère une erreur
  async function cancelNfcWriting() {
    setIsNFCRequestOn(false);
    await MyNFCManager.cancelNfcRequest();
  }

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
        <View>
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
          <StudentTable
            studentAndRemoteSignatureAndNfcSignatureList={Object.entries(
              sheet.signatures
            ).map((s) => [
              s[0],
              s[1].signature != null,
              nfcSheet != undefined
                ? nfcSheet.signatures[s[0]].signature != null
                : null,
            ])}
          />
          {/* <Text
            style={{
              fontSize: 20,
              marginBottom: 5,
            }}
          >
            Remote student list
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
          <Text
            style={{
              fontSize: 20,
              marginBottom: 5,
            }}
          >
            NFC sheet student list
          </Text>
          {nfcSheet && (
            <FlatList
              data={Object.entries(nfcSheet.signatures)}
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
          )} */}
        </View>
      )}
      <View>
        <Button title="Read" onPress={readSheet} />
        {attendanceStatus === "OPEN" && (
          <Fragment>
            {!isNFCRequestOn && (
              <Button
                onPress={writeSheetOnNfcTag}
                title="Write sheet on NFC tag"
                accessibilityLabel="Write sheet on NFC tag"
              />
            )}
            {isNFCRequestOn && (
              <Button
                onPress={cancelNfcWriting}
                title="Cancel NFC writing"
                accessibilityLabel="Cancel NFC writing"
              />
            )}
            <Button
              onPress={stopAttendance}
              title="Stop Attendance"
              accessibilityLabel="Stop Attendance"
            />
          </Fragment>
        )}
        {attendanceStatus === "INTERRUPTED" && (
          <Fragment>
            <Button
              onPress={resumeAttendance}
              title="Resume Attendance"
              accessibilityLabel="Resume Attendance"
            />
            {nfcSheet && (
              <Button
                onPress={signSheet}
                title="Sign sheet"
                accessibilityLabel="Sign sheet"
              />
            )}
          </Fragment>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Attendance;
