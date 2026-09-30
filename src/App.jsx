import { Loader2 } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './assets/layout/Header';
import Footer from './assets/layout/Footer';

const Home = lazy( () => import( './pages/Home' ) );
const NotFound = lazy( () => import( './pages/NotFound' ) );
const Calculator = lazy( () => import( './pages/Calculator' ) );
const AgeCalculator = lazy( () => import( './pages/AgeCalculator' ) );
const UnitConverter = lazy( () => import( './pages/UnitConverter' ) );
const CurrencyConverter = lazy( () => import( './pages/CurrencyConverter' ) );
const WeatherForcast = lazy( () => import( './pages/WeatherForcast' ) );
const Stopwatch = lazy( () => import( './pages/Stopwatch' ) );
const Timer = lazy( () => import( './pages/Timer' ) );
const DiceRoller = lazy( () => import( './pages/DiceRoller' ) );
const MovieSearch = lazy( () => import( './pages/MovieSearch' ) );
const PasswordGenerator = lazy( () => import( './pages/PasswordGenerator' ) );
const URLParser = lazy( () => import( './pages/URLParser' ) );

export default function App() {

	return <Suspense fallback={ <section className="fixed inset-0 bg-black/50 flex items-center justify-center">
		<Loader2 size={ 50 } color="white" className="animate-spin" />
	</section> } >

		<BrowserRouter>

			<Header/>

			<Routes>

				<Route path="/" element={ <Home /> } />
				<Route path="/calculator" element={ <Calculator /> } />
				<Route path="/age-calculator" element={ <AgeCalculator /> } />
				<Route path="/unit-converter" element={ <UnitConverter /> } />
				<Route path="/currency-converter" element={ <CurrencyConverter /> } />
				<Route path="/weather-forcast" element={ <WeatherForcast /> } />
				<Route path="/stopwatch" element={ <Stopwatch /> } />
				<Route path="/timer" element={ <Timer /> } />
				<Route path="/dice-roller" element={ <DiceRoller /> } />
				<Route path="/movie-search" element={ <MovieSearch /> } />
				<Route path="/password-generator" element={ <PasswordGenerator /> } />
				<Route path="/url-parser" element={ <URLParser /> } />
				<Route path="*" element={ <NotFound /> } />

			</Routes>

			<Footer />

		</BrowserRouter>

	</Suspense>;

}