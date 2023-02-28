import React, { useEffect } from "react";
import { View, Text, Switch } from "react-native";
import { DataTable } from "react-native-paper";

const CELL_COLOR_CODE = {
  PRESENT_CODE: "#77ddaa",
  ABSENT_CODE: "#ff6961",
  WARNING_CODE: "#ffb347",
  PENDING_CODE: "#999999",
};

const StudentTable = ({ setParentForcedList, givenPresencePreview }) => {
  const [presencePreview, setPresencePreview] =
    React.useState(givenPresencePreview);

  const [tableCells, setTableCells] = React.useState([]);

  /**
   * forcedList is a map of <studentId, cellValue>
   */
  const [forcedList, setForcedList] = React.useState({});

  const [switchValues, setSwitchValues] = React.useState({});

  const onToggleSwitch = (studentId) => {
    let newState = JSON.parse(JSON.stringify(switchValues));
    console.log("before ToggleSwitch", studentId, newState);
    newState[studentId] = !newState[studentId];
    console.log("newState", JSON.stringify(newState, null, 2));
    setSwitchValues(newState);
    console.log("after ToggleSwitch", studentId, newState);
  };

  useEffect(
    (prev) => {
      // console.log("child prev switchValues", prev);
      // console.log("child new switchValues", switchValues);
    },
    [switchValues]
  );

  useEffect(() => {
    setParentForcedList(forcedList);
    console.log("child forcedList", forcedList);
  }, [forcedList]);

  useEffect(() => {
    console.log("child presencePreview", presencePreview);

    // construct the switch values
    let newSwitchValues = Object.fromEntries(
      Object.entries({
        absent: presencePreview.absent,
        present: presencePreview.present,
        conflict: presencePreview.conflict,
        pending: presencePreview.pending,
      })
        .map(([key, idsList]) => {
          // console.log("key", key, "idsList", idsList);
          if (!presencePreview.editable) {
            return idsList.map((studentId) => [studentId, undefined]);
          }
          switch (key) {
            case "pending":
              return idsList.map((studentId) => [studentId, false]);
            case "absent":
              return idsList.map((studentId) => [studentId, false]);
            case "present":
              return idsList.map((studentId) => [studentId, true]);
            case "conflict":
              return idsList.map((studentId) => [studentId, false]);
            default:
              return idsList.map((studentId) => [studentId, false]);
          }
        })
        .flat()
    );

    setSwitchValues(newSwitchValues);

    let newTableCells = [];
    let colorByStudentId = Object.entries(presencePreview)
      .filter(([key, value]) => key !== "editable")
      .map(([key, idList]) =>
        idList.map((studentId) => {
          let color;
          switch (key) {
            case "present":
              color = CELL_COLOR_CODE.PRESENT_CODE;
              break;
            case "absent":
              color = CELL_COLOR_CODE.ABSENT_CODE;
              break;
            case "conflict":
              color = CELL_COLOR_CODE.WARNING_CODE;
              break;
            case "pending":
              color = CELL_COLOR_CODE.PENDING_CODE;
              break;
            default:
              color = CELL_COLOR_CODE.WARNING_CODE;
              break;
          }
          return [studentId, color];
        })
      )
      .flat();

    console.log("colorByStudentId", colorByStudentId);
    for (let [studentId, color] of colorByStudentId) {
      newTableCells.push(
        <DataTable.Row
          key={studentId}
          style={{
            backgroundColor: color,
          }}
        >
          <DataTable.Cell
            style={{
              justifyContent: "center",
            }}
          >
            {studentId}
          </DataTable.Cell>
          <DataTable.Cell
            style={{
              justifyContent: "center",
            }}
          >
            {presencePreview.editable ? (
              // <Switch
              //   disabled={!presencePreview.editable}
              //   value={switchValues[studentId]}
              //   onValueChange={() => {
              //     let newVal = JSON.parse(JSON.stringify(switchValues));
              //     console.log("prev val", newVal);
              //     newVal[studentId] = !newVal[studentId];
              //     console.log("new val", newVal);
              //     setSwitchValues(newVal);
              //     // setToggleVal(!toggleVal);
              //   }}
              // />
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {
                  onToggleSwitch(studentId);
                }}
                value={switchValues[studentId]}
              />
            ) : (
              "|"
            )}
          </DataTable.Cell>
        </DataTable.Row>
      );
    }
    setTableCells(newTableCells);
  }, [presencePreview]);

  useEffect(() => {
    setPresencePreview(givenPresencePreview);
  }, []);

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
            Presence
          </DataTable.Title>
        </DataTable.Header>
        {tableCells}
      </DataTable>
    </View>
  );
};

export default StudentTable;
