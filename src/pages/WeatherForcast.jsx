import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Search, RefreshCw, CloudSun, Droplets, Wind, Thermometer, AlertCircle } from "lucide-react";

export default function WeatherForcast() {

	const navigate = useNavigate();

	const [ weatherLoading, setWeatherLoading ] = useState( false );
	const [ city, setCity ] = useState( '' );
	const [ weatherData, setWeatherData ] = useState( null );
	const [ error, setError ] = useState( null );

	return <main className="min-h-[86.1vh] bg-gray-50 text-gray-800 font-sans py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
			
		<div className="w-full max-w-2xl">

			<div className="flex items-center justify-between mb-8">

				<button
					type="button"
					className="p-2 bg-white hover:bg-gray-100 shadow-sm border border-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
					onClick={ () => navigate( '/', { replace: true } ) }
					aria-label="Go back"
				>
					<ArrowLeft size={ 20 } className="stroke-gray-600" />
				</button>

				<h1 className="flex items-center gap-2">

					<CloudSun size={ 26 } className="stroke-sky-500" />
					<span className="text-2xl font-bold text-gray-900 tracking-tight">Weather Forecast</span>

				</h1>

				<div className="w-9" />

			</div>

			<div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">

				<div className="p-6 sm:p-8 bg-sky-50/50 border-b border-gray-100">

					<form
						onSubmit={ async e => {

							if ( e )
								e.preventDefault();

							if ( !city.trim() )
								return;

							try {

								setWeatherLoading( true );
								setError( null );

								const res = await fetch( `https://api.openweathermap.org/data/2.5/weather?appid=${ import.meta.env.VITE_WEATHER_API_KEY }&units=metric&q=${ city.trim() }`, {
										method: 'GET',
										cache: 'no-store'
									}
								);

								if ( !res.ok )
									throw new Error( 'City not found. Please try another location.' );

								const { weather: [ { main: condition, icon } ] = [], main, wind, name } = await res.json();
								setWeatherData( { main, wind, name, condition, icon } );

							} catch ( err ) {

								setError( err.message );
								setWeatherData( null );

							} finally {
								setWeatherLoading( false );
							}

						} }
						className="flex flex-col sm:flex-row gap-3"
					>

						<div className="relative grow">

							<Search size={ 18 } className="absolute left-3.5 top-1/2 -translate-y-1/2 stroke-gray-400" />
							<input
								type="text"
								id="search-city"
								placeholder="Search city (e.g. London, Tokyo)..."
								className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-800 shadow-sm outline-none focus:ring-2 focus:ring-sky-500 transition-all placeholder-gray-400"
								value={ city }
								onChange={ e => setCity( e.target.value ) }
							/>

						</div>

						<div className="flex gap-2">

							<button
								type="submit"
								className="grow sm:grow-0 px-6 py-3 bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
								disabled={ weatherLoading || !city.trim() }
							>

								{ weatherLoading ?
									<Loader2 size={ 18 } className="stroke-white animate-spin" />
								:
									<span className="text-white font-medium">Search</span>
								}

							</button>

							<button
								type="button"
								className="p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
								onClick={ () => {

									setWeatherLoading( false );
									setCity( '' );
									setWeatherData( null );
									setError( null );

								} }
								aria-label="Reset search"
								title="Clear"
							>
								<RefreshCw size={ 18 } className="stroke-gray-600" />
							</button>

						</div>

					</form>

				</div>

				<div className="p-6 sm:p-8 min-h-75 flex flex-col justify-center">

					{ ( !weatherLoading && !weatherData && !error ) && <div className="py-10 flex flex-col items-center gap-3">

						<CloudSun size={ 48 } className="stroke-1 stroke-sky-200" />
						<p className="text-base text-gray-400 text-center font-medium">Enter a city name above to check the current weather forecast.</p>

					</div> }

					{ weatherLoading && <div className="py-12 flex flex-col justify-center items-center gap-3">

						<Loader2 size={ 44 } className="stroke-sky-600 animate-spin" />
						<p className="text-sm font-medium text-gray-500">Fetching latest weather data...</p>

					</div> }

					{ ( !weatherLoading && !!weatherData ) && <div className="flex flex-col gap-6">

						<div className="bg-linear-to-br from-sky-500 to-blue-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-sky-500/20 text-center relative overflow-hidden">

							<div className="relative z-10">

								<h2 className="text-2xl sm:text-3xl font-bold tracking-wide">{ weatherData.name }</h2>

								<div className="my-2 flex items-center justify-center gap-2">

									<span className="text-6xl sm:text-7xl font-extrabold tracking-tighter">{ Math.round( weatherData.main.temp ) }°</span>

								</div>

								<div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium border border-white/20">

									<img 
										src={ `https://openweathermap.org/img/wn/${ weatherData.icon }.png ` } 
										alt={ weatherData.condition } 
										className="size-8 -my-2"
									/>
									<span className="capitalize">{ weatherData.condition }</span>

								</div>

							</div>

						</div>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

							<div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center">

								<div className="flex items-center gap-1.5 mb-2">

									<Thermometer size={ 16 } className="stroke-amber-500" />
									<span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Feels Like</span>

								</div>

								<span className="text-2xl font-bold text-gray-800">{ Math.round( weatherData.main.feels_like ) }°</span>

							</div>

							<div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center">

								<div className="flex items-center gap-1.5 mb-2">

									<Droplets size={ 16 } className="stroke-blue-500" />
									<span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Humidity</span>

								</div>

								<div>

									<span className="text-2xl font-bold text-gray-800">{ weatherData.main.humidity }</span>
									<span className="text-xs font-normal text-gray-500">%</span>

								</div>

							</div>

							<div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center">

								<div className="flex items-center gap-1.5 mb-2">

									<Wind size={ 16 } className="stroke-teal-500" />
									<span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Wind Speed</span>

								</div>

								<div>

									<span className="text-2xl font-bold text-gray-800">{ weatherData.wind.speed }</span>
									<span className="text-xs font-normal text-gray-500">km/h</span>

								</div>

							</div>

						</div>

					</div> }

					{ ( !weatherLoading && !!error ) && <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center gap-3">

						<AlertCircle size={ 20 } className="shrink-0 stroke-red-600" />
						<p className="text-sm font-medium text-red-600">{ error }</p>

					</div> }

				</div>

			</div>

		</div>

	</main>;

}