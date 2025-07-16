import Question from "@/components/question/Question";
import { SafeAreaView, StatusBar, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1, backgroundColor: '#424242' }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Question />
    </View>
  );
}
