import { Navigation } from "react-native-navigation";
import { Provider } from "react-redux";

import AuthScreen from "./src/screens/Auth/Auth";
import CartScreen from "./src/screens/CartScreen/CartScreen";
import FindPlaceScreen from "./src/screens/FindPlace/FindPlace";
import PlaceDetailScreen from "./src/screens/PlaceDetail/PlaceDetail";
import SideDrawer from "./src/screens/SideDrawer/SideDrawer";
import SuccessPage from "./src/screens/SuccessPage/SuccessPage";
import CampaignPage from "./src/screens/Campaign/Campaign";
import OrdersPage from './src/screens/OrdersPage/OrdersPage';

import configureStore from './src/store/configureStore';

const store = configureStore();

// Register Screens
Navigation.registerComponent("awesome-places.AuthScreen", () => AuthScreen, store, Provider);
Navigation.registerComponent("awesome-places.CartScreen", () => CartScreen, store, Provider);
Navigation.registerComponent("awesome-places.FindPlaceScreen", () => FindPlaceScreen, store, Provider);
Navigation.registerComponent("awesome-places.PlaceDetailScreen", () => PlaceDetailScreen, store, Provider);
Navigation.registerComponent("awesome-places.SideDrawer", () => SideDrawer, store, Provider);
Navigation.registerComponent("awesome-places.SuccessPage", () => SuccessPage, store, Provider);
Navigation.registerComponent("awesome-places.CampaignPage", () => CampaignPage, store, Provider);
Navigation.registerComponent("awesome-places.OrdersPage", () => OrdersPage, store, Provider);


// Start a App
Navigation.startSingleScreenApp({
    screen: {
        screen: "awesome-places.AuthScreen",
        title: "Login"
    }
});
export default () => Navigation.startSingleScreenApp({
    screen: {
        screen: "awesome-places.AuthScreen",
        title: "Login"
    }
});