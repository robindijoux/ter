import React, { Fragment, useEffect } from "react";
import { FlatList, Switch, View, Text } from "react-native";

const CELL_COLOR_CODE = {
  PRESENT_CODE: "#77ddaa",
  ABSENT_CODE: "#ff6961",
  WARNING_CODE: "#ffb347",
  PENDING_CODE: "#999999",
};

const StudentTable = ({ setParentForcedList, givenPresencePreview }) => {
  /**
   * presencePreview is a map of <studentId, cellValue>
   */

  const [presencePreview, setPresencePreview] = React.useState([]);

  const [editable, setEditable] = React.useState(false);

  /**
   * tableCells is an array of {
   *    studentId,
   *    color,
   *    switchValue
   * }
   */
  const [tableData, setTableData] = React.useState([]);

  /**
   * forcedList is a map of <studentId, cellValue>
   */
  const [forcedList, setForcedList] = React.useState({});

  const onToggleSwitch = (studentId) => {
    setPresencePreview((prevState) => ({
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
    let newTableData = Object.entries(presencePreview).map(
      ([studentId, colorAndValue]) => ({
        studentId,
        color: colorAndValue.color,
        switchValue: colorAndValue.switchValue,
      })
    );
    // console.log("newTableData", newTableData);
    setTableData(newTableData);
    setEditable(givenPresencePreview.editable);
  }, [presencePreview]);

  useEffect(() => {
    console.log("editable", editable);
  }, [editable]);

  useEffect(() => {
    setParentForcedList(forcedList);
    // console.log("child forcedList", forcedList);
  }, [forcedList]);

  useEffect(() => {
    /**
     * newPresencePreview is a map of <studentId, {
     *  color,
     *  switchValue
     * }>
     */
    let newPresencePreview = Object.fromEntries(
      Object.entries(givenPresencePreview)
        .filter(([key, value]) => key !== "editable")
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
    //   "newPresencePreview2",
    //   JSON.stringify(newPresencePreview, null, 2)
    // );
    setPresencePreview(newPresencePreview);
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
