import "react-native-reanimated";
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@configs/redux';
import RootNavigator from '@navigation/RootNavigator';
import { ModalPortal } from 'react-native-modals';

export default function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<RootNavigator />
				<ModalPortal />
			</PersistGate>
		</Provider>
	);
}
