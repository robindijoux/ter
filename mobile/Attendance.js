import {
  View,
  Text,
  SafeAreaView,
  Button,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { Fragment } from "react";
import { baseUrl } from "./App";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

// const wsUrl = baseUrl + "/sheetUpdate";
const wsUrl = "https://de34-77-159-193-46.eu.ngrok.io" + "/sheetUpdate";

const socket = io.connect(wsUrl);

const Attendance = ({ navigation, route }) => {
  const [sheet, setSheet] = useState(route.params.createdSheet);

  const createdSheet = route.params.createdSheet;

  const stopAttendance = () => {
    console.log(`${baseUrl}/sheet/attendanceStop/${createdSheet.id}`);
    axios
      .post(baseUrl + "/sheet/" + createdSheet.id + "/attendanceStop", null)
      .then((r) => {
        console.log(r);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    console.log(wsUrl);

    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.on(createdSheet.id, (args) => {
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
          <Button
            onPress={stopAttendance}
            title="Stop Attendance"
            accessibilityLabel="Stop Attendance"
          />
        </Fragment>
      )}
    </SafeAreaView>
  );
};

export default Attendance;
