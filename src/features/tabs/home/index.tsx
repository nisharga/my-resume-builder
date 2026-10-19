import { Screen } from "@/components";
import { WelcomeGreeting } from "./components";
import { View } from "react-native";

const HomeScreen = () => {
  return (
    <Screen>
      <View className="mx-4!">
        <WelcomeGreeting welcomeLabel={"Nisharga Kabir"} />
      </View>
    </Screen>
  );
};

export default HomeScreen;
