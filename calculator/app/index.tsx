import { ThemeContext } from "@react-navigation/native";
import { Text, View, Button } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Anghirap naman ito</Text>
      <Button title="Hello" onPress={() => alert('Button pressed!')} />
    </View>

    
  );
}
