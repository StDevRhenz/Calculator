import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import ScientificScreen from './screens/ScientificScreen';
import UnitConverterScreen from './screens/UnitConverterScreen';
import ProgrammerScreen from './screens/ProgrammerScreen';
import GraphingScreen from './screens/GraphingScreen';
import MatrixScreen from './screens/MatrixScreen';
import EquationSolverScreen from './screens/EquationSolverScreen';
import CreditPopup from './components/CreditPopup';
import { colors } from './constants/colors';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const [showCredit, setShowCredit] = useState(true);

  useEffect(() => {
    // Hide credit popup after 2 seconds
    const timer = setTimeout(() => {
      setShowCredit(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Scientific" component={ScientificScreen} />
          <Stack.Screen name="UnitConverter" component={UnitConverterScreen} />
          <Stack.Screen name="Programmer" component={ProgrammerScreen} />
          <Stack.Screen name="Graphing" component={GraphingScreen} />
          <Stack.Screen name="Matrix" component={MatrixScreen} />
          <Stack.Screen name="EquationSolver" component={EquationSolverScreen} />
        </Stack.Navigator>
        
        {/* Credit Popup */}
        <CreditPopup 
          visible={showCredit} 
          onHide={() => setShowCredit(false)} 
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;