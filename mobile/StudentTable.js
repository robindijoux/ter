import React from "react";
import { View, Text } from "react-native";
import { DataTable } from "react-native-paper";

const StudentTable = ({ studentAndRemoteSignatureAndNfcSignatureList }) => {
  let cells = [];

  const getScore = (signedInRemote, signedInNfc) => {
    if (signedInRemote != signedInNfc) {
      return 2;
    } else if (!signedInNfc) {
      return 1;
    } else {
      return 0;
    }
  };

  studentAndRemoteSignatureAndNfcSignatureList.sort(
    (
      [studentIdA, signedInRemoteA, signedInNfcA],
      [studentIdB, signedInRemoteB, signedInNfcB]
    ) => {
      return (
        getScore(signedInRemoteB, signedInNfcB) -
        getScore(signedInRemoteA, signedInNfcA)
      );
    }
  );

  for (let [
    studentId,
    signedInRemote,
    signedInNfc,
  ] of studentAndRemoteSignatureAndNfcSignatureList) {
    cells.push(
      <DataTable.Row
        style={{
          backgroundColor:
            signedInRemote != signedInNfc
              ? "#ffb347"
              : signedInRemote
              ? "#77ddaa"
              : "#ff6961",
        }}
      >
        <DataTable.Cell
          style={{
            justifyContent: "center",
          }}
        >
          {studentId + ""}
        </DataTable.Cell>
        <DataTable.Cell
          style={{
            justifyContent: "center",
          }}
        >
          {signedInRemote + ""}
        </DataTable.Cell>
        <DataTable.Cell
          style={{
            justifyContent: "center",
          }}
        >
          {(signedInNfc != null ? signedInNfc : "undefined") + ""}
        </DataTable.Cell>
      </DataTable.Row>
    );
  }

  return (
    <View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title
            style={{
              justifyContent: "center",
            }}
          >
            Id
          </DataTable.Title>
          <DataTable.Title
            style={{
              justifyContent: "center",
            }}
          >
            Signed in remote
          </DataTable.Title>
          <DataTable.Title
            style={{
              justifyContent: "center",
            }}
          >
            Signed in NFC
          </DataTable.Title>
        </DataTable.Header>

        {cells}
      </DataTable>
    </View>
  );
};

export default StudentTable;
