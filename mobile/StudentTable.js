import React, { Fragment, useEffect } from "react";
import { FlatList, Switch, View, Text } from "react-native";

const CELL_COLOR_CODE = {
  PRESENT_CODE: "#77ddaa",
  ABSENT_CODE: "#ff6961",
  WARNING_CODE: "#ffb347",
  PENDING_CODE: "#999999",
};

const StudentTable = ({
  setParentFinalAttendanceList,
  parentAttendancePreview,
  parentEditable,
}) => {
  /**
   * presencePreview is a map of <studentId, cellValue>
   */

  const [attendancePreview, setAttendancePreview] = React.useState([]);

  const [editable, setEditable] = React.useState(false);

  /**
   * tableCells is an array of {
   *    studentId,
   *    color,
   *    switchValue
   * }
   */
  const [tableData, setTableData] = React.useState([]);

  const onToggleSwitch = (studentId) => {
    setAttendancePreview((prevState) => ({
      ...prevState,
      [studentId]: {
        ...prevState[studentId],
        switchValue: !prevState[studentId].switchValue,
        color: !prevState[studentId].switchValue
          ? CELL_COLOR_CODE.PRESENT_CODE
          : CELL_COLOR_CODE.ABSENT_CODE,
      },
    }));
  };

  useEffect(() => {
    // console.log("re render");
  });

  useEffect(() => {
    console.log("child attendancePreview", attendancePreview);
    let newTableData = Object.entries(attendancePreview).map(
      ([studentId, colorAndValue]) => ({
        studentId,
        color: colorAndValue.color,
        switchValue: colorAndValue.switchValue,
      })
    );
    // console.log("newTableData", newTableData);
    setTableData(newTableData);
  }, [attendancePreview]);

  useEffect(() => {
    console.log("editable", editable);
  }, [editable]);

  useEffect(() => {
    console.log("tableData", tableData);
    let newAttendanceList = tableData.map((row) => ({
      studentId: row.studentId,
      isPresent: row.switchValue,
    }));
    console.log("newAttendanceList", newAttendanceList);
    setParentFinalAttendanceList(newAttendanceList);
  }, [tableData]);

  useEffect(() => {
    /**
     * newAttendancePreview is a map of <studentId, {
     *  color,
     *  switchValue
     * }>
     */
    let newAttendancePreview = Object.fromEntries(
      Object.entries(parentAttendancePreview)
        .map(([key, idList]) =>
          idList.map((studentId) => {
            let color, switchValue;
            switch (key) {
              case "present":
                color = CELL_COLOR_CODE.PRESENT_CODE;
                switchValue = true;
                break;
              case "absent":
                color = CELL_COLOR_CODE.ABSENT_CODE;
                switchValue = false;
                break;
              case "conflict":
                color = CELL_COLOR_CODE.WARNING_CODE;
                switchValue = false;
                break;
              case "pending":
                color = CELL_COLOR_CODE.PENDING_CODE;
                switchValue = false;
                break;
              default:
                color = CELL_COLOR_CODE.WARNING_CODE;
                switchValue = false;
                break;
            }
            return [studentId, { color, switchValue }];
          })
        )
        .flat()
    );
    // console.log(
    //   "newAttendancePreview",
    //   JSON.stringify(newAttendancePreview, null, 2)
    // );
    setAttendancePreview(newAttendancePreview);
    setEditable(parentEditable);
  }, []);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <Text>Student</Text>
        <Text>Presence</Text>
      </View>
      <FlatList
        data={tableData}
        renderItem={({ item }) => {
          return (
            <Item
              studentId={item.studentId}
              onToggleSwitch={() => onToggleSwitch(item.studentId)}
              switchValue={item.switchValue}
              color={item.color}
              showSwitchButton={editable}
            />
          );
        }}
        keyExtractor={(item) => item.studentId + "" + item.color}
      />
    </View>
  );
};

const Item = ({
  studentId,
  switchValue,
  color,
  onToggleSwitch,
  showSwitchButton,
}) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-around",
      borderTopColor: "black",
      borderTopWidth: 0.5,
      padding: 10,
      backgroundColor: color,
    }}
  >
    <Text
      style={{
        flex: 0.5,
      }}
    >
      {studentId}
    </Text>

    <Switch
      disabled={!showSwitchButton}
      trackColor={{ false: "#767577", true: "#81b0ff" }}
      ios_backgroundColor="#3e3e3e"
      onValueChange={() => {
        onToggleSwitch(studentId);
      }}
      value={switchValue}
    />
  </View>
);

export default StudentTable;
