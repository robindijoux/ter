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

const wsUrl = BASE_URL + "/sheetUpdate";

const socket = io.connect(wsUrl);

const Attendance = ({ navigation, route }) => {
  const [sheet, setSheet] = useState(route.params.createdSheet);
  const [readyToSign, setReadyToSign] = useState(false);

  const [teacherData, setTeacherData] = useState(route.params.teacherData);

  const stopAttendance = () => {
    console.log(`${BASE_URL}/sheet/attendanceStop/${sheet.id}`);
    axios
      .post(BASE_URL + "/sheet/" + sheet.id + "/attendanceStop", null)
      .then((r) => {
        setReadyToSign(true);
        console.log(r);
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
        signature: teacherData.name,
      })
      .then((r) => {
        navigation.navigate("SheetCreation", { userData: teacherData });
        console.log(r);
      })
      .catch((e) => {
        console.log(e);
      });
  };

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
          {!readyToSign && (
            <Button
              onPress={stopAttendance}
              title="Stop Attendance"
              accessibilityLabel="Stop Attendance"
            />
          )}
          {readyToSign && (
            <Button
              onPress={signSheet}
              title="Sign sheet"
              accessibilityLabel="Sign sheet"
            />
          )}
        </Fragment>
      )}
    </SafeAreaView>
  );
};

export default Attendance;
