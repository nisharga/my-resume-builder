import { Screen } from "@/components";
import { WelcomeGreeting } from "./components";

const HomeScreen = () => {
  return (
    <Screen className="px-4">
      <WelcomeGreeting welcomeLabel={"Nisharga Kabir"} />
    </Screen>
  );
};

export default HomeScreen;
