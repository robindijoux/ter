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
import NFCModal from "./NFCModal";

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
      // console.log("Connect on socket ID: ", socket.id);
    });

    socket.on(sheet.id, (args) => {
      console.log("New signature:", args);
      let [[studentId, signature]] = Object.entries(args);
      // let studentId = Object.entries(args)[0];
      // let signature = Object.entries(args)[1];
      console.log("Student ID:", studentId);
      console.log("Signature:", signature);
      let newSheet = { ...sheet };
      newSheet.signatures[studentId].signature = signature;
      console.log("New sheet:", newSheet);
      setSheet(newSheet);
    });

    socket.on("disconnect", () => {
      // console.log("Disconnect on socket ID: ",socket.id);
    });
  }, []);
  const stopAttendance = () => {
    // console.log(`${BASE_URL}/sheet/attendanceStop/${sheet.id}`);
    axios
      .post(BASE_URL + "/sheet/" + sheet.id + "/attendanceStop", null)
      .then((r) => {
        setAttendanceStatus("INTERRUPTED");
        // console.log(r);
      })
      .catch((e) => {
        console.log("Stop attendance error: ", e);
      });
  };

  const resumeAttendance = () => {
    // console.log(`${BASE_URL}/sheet/attendanceResume/${sheet.id}`);
    axios
      .post(BASE_URL + "/sheet/" + sheet.id + "/attendanceResume", null)
      .then((r) => {
        setAttendanceStatus("OPEN");
      })
      .catch((e) => {
        console.log("Resume attendance error: ", e);
      });
  };

  const signSheet = () => {
    if (nfcSheet !== undefined) {
      let body = {
        teacherSignature: "Teacher Signature",
        studentsSignatures: Object.fromEntries(
          Object.entries(nfcSheet.signatures)
            .filter((s) => s[1].signature != null)
            .map((s) => [s[0], s[1].signature])
        ),
        whiteList: [],
      };
      // console.log("attendanceEnd body:", JSON.stringify(body, null, 2));
      axios
        .post(BASE_URL + "/sheet/" + sheet.id + "/attendanceEnd", body)
        .then((r) => {
          navigation.push("SheetCreation", { userData: teacherData });
        })
        .catch((e) => {
          console.log("Sign sheet error", e);
        });
    } else {
      Toast.show("La feuille NFC n'a pas été récupérée.", {
        duration: Toast.durations.LONG,
      });
    }
  };

  async function readSheetOnNfcTag() {
    try {
      setIsNFCRequestOn(true);
      let nfcSheet = await MyNFCManager.readSheet();
      setIsNFCRequestOn(false);
      if (nfcSheet !== undefined) setNfcSheet(nfcSheet);
    } catch (e) {
      setIsNFCRequestOn(false);
    }
  }

  async function writeSheetOnNfcTag() {
    try {
      setIsNFCRequestOn(true);
      await MyNFCManager.writeSheet(sheet);
      setIsNFCRequestOn(false);
    } catch (e) {
      setIsNFCRequestOn(false);
    }
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
              nfcSheet !== undefined
                ? nfcSheet.signatures[s[0]].signature != null
                : null,
            ])}
          />
        </View>
      )}
      <View>
        <NFCModal
          isModalVisible={isNFCRequestOn}
          setModalVisible={setIsNFCRequestOn}
        />
        {attendanceStatus === "OPEN" && (
          <Fragment>
            <Button
              onPress={writeSheetOnNfcTag}
              title="Write sheet on NFC tag"
              accessibilityLabel="Write sheet on NFC tag"
            />
            <Button
              onPress={stopAttendance}
              title="Stop Attendance"
              accessibilityLabel="Stop Attendance"
            />
          </Fragment>
        )}
        {attendanceStatus === "INTERRUPTED" && (
          <Fragment>
            <Button title="Read" onPress={readSheetOnNfcTag} />
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
