import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from './SearchScreen';
import CategoriesScreen from './CategoriesScreen';

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} />
    </Stack.Navigator>
  );
};

export default Navigator;
