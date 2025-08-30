import { Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { clsx } from "clsx";
export default function AuthLayout() {
  
  return (
   <SafeAreaProvider>
     <SafeAreaView
       className={clsx(
         "h-full gap-4 w-full"
       )}
     >
       <Slot />
     </SafeAreaView>
   </SafeAreaProvider>
  );
}
