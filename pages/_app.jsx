import { CookiesProvider } from 'react-cookie';
import app from 'store/app';
import { Provider } from 'react-redux';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
	return (
		<Provider store={app}>
			<CookiesProvider>
				<Component {...pageProps} />
			</CookiesProvider>
		</Provider>
	);
}

export default MyApp;
