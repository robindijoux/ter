import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from "axios";
import { BASE_URL } from "./global";
export default function SheetCreation({ route, navigation }) {
  let [data, setData] = useState([]);
  let [selectedCourse, setSelectedCourse] = useState(null);

  const teacherData = route.params.userData;
  // Invoking get method to perform a GET request to the API
  const getCourses = async () => {
    try {
      // console.log(JSON.stringify(teacherData));
      const response = await axios.get(
        `${BASE_URL}/course?teacherId=${teacherData.id}`
      );
      // console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("getCourses error", error);
    }
  };
  useEffect(() => {
    getCourses().then();
  }, []);

  //TODO: try to replace by the onChange component method
  function getSelectedCourseFromChildComponent(selectedCourseChild) {
    setSelectedCourse(selectedCourseChild);
    console.log("Selected course: " + JSON.stringify(selectedCourse));
  }

  function createSheet() {
    // console.log("--- Creating sheet ---");
    // console.log("Course id : " + selectedCourse.id);

    axios
      .post(`${BASE_URL}/sheet`, {
        courseId: selectedCourse.id,
      })
      .then((r) => {
        // console.log(r.data);
        navigation.push("Attendance", {
          createdSheet: r.data,
          teacherData,
        });
      });
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <DropdownComponent
        data={data}
        value={selectedCourse}
        pass={getSelectedCourseFromChildComponent}
      ></DropdownComponent>
      <View style={styles.display}>
        {selectedCourse != null ? (
          <Text style={styles.title}>{selectedCourse.label}</Text>
        ) : (
          <Text>No course selected</Text>
        )}
      </View>
      <Button
        title={"Create attendance sheet"}
        onPress={createSheet}
        color="#00b8ff"
      ></Button>
    </View>
  );
}
const DropdownComponent = (props) => {
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    // if (props.data || isFocus) {
    //   return (
    //     <Text style={[styles.label, isFocus && { color: "blue" }]}>
    //       Dropdown label
    //     </Text>
    //   );
    // }
    // return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={props.data}
        search
        maxHeight={300}
        labelField="label"
        valueField="id"
        placeholder={!isFocus ? "Select course" : "..."}
        searchPlaceholder="Search..."
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          props.pass(item);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? "blue" : "black"}
            name="Safety"
            size={20}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  display: {
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 8,
    marginHorizontal: 6,
    padding: 10,
  },
  title: {
    fontSize: 20,
  },
  wait: {
    fontSize: 16,
    color: "red",
    margin: 20,
  },
  container: {
    backgroundColor: "white",
    padding: 5,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
