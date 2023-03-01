import {
  View,
  Text,
  SafeAreaView,
  Button,
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
  const [presencePreview, setPresencePreview] = useState({
    pending: [],
    present: [],
    absent: [],
    conflict: [],
  });
  const [editable, setEditable] = useState(false);
  const [finalAttendanceList, setFinalAttendanceList] = useState([]);

  useEffect(() => {
    console.log("parent finalAttendanceList", finalAttendanceList);
  }, [finalAttendanceList]);

  useEffect(() => {
    socket.on("connect", () => {
      // console.log("Connect on socket ID: ", socket.id);
    });

    socket.on(sheet.id, (args) => {
      console.log("New signature in socket:", args);
      let [[studentId, signature]] = Object.entries(args);
      // console.log("Student ID:", studentId);
      // console.log("Signature:", signature);
      let newSheet = { ...sheet };
      newSheet.signatures[studentId].signature = signature;
      console.log("New sheet in socket:", newSheet);
      setSheet(newSheet);
    });

    socket.on("disconnect", () => {
      // console.log("Disconnect on socket ID: ",socket.id);
    });
  }, []);

  useEffect(() => {
    console.log(
      "parent presencePreview",
      JSON.stringify(presencePreview, null, 2)
    );
  }, [presencePreview]);

  useEffect(() => {
    console.log("remote sheet", sheet);

    // set the presencePreview
    let newPresencePreview = {
      pending: Object.entries(sheet.signatures)
        .filter(([id, signature]) => signature.signature === undefined)
        .map(([id, signature]) => id),
      present: [],
      absent: [],
      conflict: Object.entries(sheet.signatures)
        .filter(([id, signature]) => signature.signature !== undefined)
        .map(([id, signature]) => id),
    };
    console.log("newPresencePreview", newPresencePreview);
    setPresencePreview(newPresencePreview);
  }, [sheet]);

  useEffect(() => {
    console.log("nfc sheet", nfcSheet);
    if (nfcSheet === undefined) return;

    // validate nfc signatures with back end
    let payloadSignatures = Object.fromEntries(
      Object.entries(nfcSheet.signatures)
        .filter(([id, signature]) => signature.signature != undefined)
        .map(([id, signature]) => [id, signature.signature])
    );
    let payload = {
      sheetId: nfcSheet.id,
      signatures: payloadSignatures,
    };
    // console.log("payload", JSON.stringify(payload, null, 2));
    axios
      .post(BASE_URL + "/signature/batch", payload)
      .then((r) => {
        // console.log("NFC signatures validation result", r.data);
        let newPresencePreview = {
          pending: [],
          present: r.data.success,
          absent: [
            ...r.data.failure,
            ...Object.entries(nfcSheet.signatures)
              .filter(([id, signature]) => signature.signature === undefined)
              .map(([id, signature]) => id),
          ],
          conflict: r.data.conflict,
        };

        // console.log("newPresencePreview", newPresencePreview);
        setPresencePreview(newPresencePreview);
        setEditable(true);
      })
      .catch((e) => {
        console.log("NFC signatures validation error", e);
      });
  }, [nfcSheet]);

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
    if (nfcSheet !== undefined && finalAttendanceList.length > 0) {
      let body = {
        teacherSignature: "Teacher Signature",
        studentsAttendance: Object.fromEntries(
          finalAttendanceList.map((studentAttendance) => [
            studentAttendance.studentId,
            studentAttendance.isPresent,
          ])
        ),
      };
      // console.log("attendanceEnd body:", JSON.stringify(body, null, 2));
      axios
        .post(BASE_URL + "/sheet/" + sheet.id + "/attendanceEnd", body)
        .then((r) => {
          navigation.push("SheetCreation", { userData: teacherData });
          Toast.show("Sheet successfully signed.", Toast.durations.LONG);
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
      if (nfcSheet !== undefined) {
        setNfcSheet(nfcSheet);
      }
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
            key={"studentTable" + JSON.stringify(presencePreview) + editable}
            setParentFinalAttendanceList={(newList) => {
              setFinalAttendanceList(newList);
            }}
            parentAttendancePreview={presencePreview}
            parentEditable={editable}
          />
        </View>
      )}
      <View>
        <NFCModal
          isModalVisible={isNFCRequestOn}
          setModalVisible={setIsNFCRequestOn}
        />
        {nfcSheet ? (
          <Button
            onPress={signSheet}
            title="Sign sheet"
            accessibilityLabel="Sign sheet"
            color="#00b8ff"
          />
        ) : (
          <Fragment>
            {attendanceStatus === "OPEN" && (
              <Button
                onPress={stopAttendance}
                title="Pause Attendance"
                accessibilityLabel="Stop Attendance"
                color="#00b8ff"
              />
            )}
            {attendanceStatus === "INTERRUPTED" && (
              <Button
                onPress={resumeAttendance}
                title="Resume Attendance"
                accessibilityLabel="Resume Attendance"
                color="#00b8ff"
              />
            )}
            <Button
              title="Read NFC tag"
              onPress={readSheetOnNfcTag}
              color="#00b8ff"
            />
            <Button
              onPress={writeSheetOnNfcTag}
              title="Write sheet on NFC tag"
              accessibilityLabel="Write sheet on NFC tag"
              color="#00b8ff"
            />
          </Fragment>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Attendance;
