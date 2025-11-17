import { useAuth } from "@/hooks/useAuth";
import { Button, View } from "react-native";

export default function Index() {
  const { signOut } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>  
        <Button title="Sair" onPress={signOut} />
    </View>
  )
}