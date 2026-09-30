import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Search } from "lucide-react";

export default function WeatherForcast() {

	const navigate = useNavigate();

	const [ weatherLoading, setWeatherLoading ] = useState( false );
	const [ city, setCity ] = useState( '' );
	const [ weatherData, setWeatherData ] = useState( null );
	const [ error, setError ] = useState( null );

	return <main className="min-h-[88vh] pt-10">

		<button
			type="button"
			className="p-2 ms-50 bg-slate-600 hover:bg-slate-700 border border-slate-300 hover:border-slate-400 rounded-xl cursor-pointer"
			onClick={ () => navigate( '/', { replace: true } ) }
		>
			<ArrowLeft size={ 20 } color="white" />
		</button>

		<section className="w-3/7 mx-auto p-5 flex flex-col gap-5">

			<p className="text-3xl text-center font-semibold">Weather Forecast</p>

			<button
				type="button"
				className="p-2 w-1/5 self-end bg-green-700 hover:bg-green-800 border border-green-300 hover:border-green-400 rounded-xl text-white cursor-pointer"
				onClick={ () => {

					setWeatherLoading( false );
					setCity( '' );
					setWeatherData( null );
					setError( null );

				} }
			>Clear</button>

			<section className="p-5 border border-gray-300 rounded-xl flex flex-col">

				<label htmlFor="search-city" className="text-xs">City</label>
				<section className="flex gap-2">

					<input
						type="text"
						id="search-city"
						placeholder="Search City"
						className="grow py-2 outline-none border-b border-gray-400 focus:border-b-2"
						value={ city }
						onChange={ e => setCity( e.target.value ) }
					/>

					<button
						type="button"
						className="size-10 bg-gray-400 disabled:bg-gray-300 not-disabled:hover:bg-gray-500 border border-gray-400 disabled:border-gray-300 rounded-lg cursor-pointer disabled:cursor-not-allowed"
						disabled={ weatherLoading || !city }
						onClick={ async () => {

							if ( !city )
								return;

							try {

								setWeatherLoading( true );
								setError( null );

								const response = await fetch( `http://api.openweathermap.org/data/2.5/weather?appid=${ import.meta.env.VITE_WEATHER_API_KEY }&units=metric&q=${ city }` );
								
								if ( !response.ok ) {
									throw new Error( 'City not found!' );
								}

								const { weather: [ { main: condition, icon }, ..._ ] = [], main, wind, name } = await response.json();
								setWeatherData( { main, wind, name, condition, icon } );

							} catch ( error ) {

								setError( error.message );
								setWeatherData( null );

							} finally {
								setWeatherLoading( false );
							}

						} }
					>
						<Search size={ 20 } color="white" className="m-auto" />
					</button>

				</section>

			</section>

			{ weatherLoading && <section className="h-85.5 p-5 border border-gray-300 rounded-xl flex justify-center items-center">
				<Loader2 size={ 40 } color="#6a7282" className="animate-spin" />
			</section> }

			{ ( !weatherLoading && !!weatherData ) && <section className="p-5 bg-blue-200 border border-gray-300 rounded-xl flex flex-col" >

				<span className="text-3xl text-center">{ weatherData.name }</span>
				<span className="p-5 text-8xl text-center content-center font-extralight" title="Temperature">{ `${ Math.round( weatherData.main.temp ) }°` }</span>
				<section className="flex justify-center items-center gap-2" title="Weather Condition">
					<img src={ `https://openweathermap.org/img/wn/${ weatherData.icon }@2x.png` } className="size-20 rounded-full" /> <span className="font-bold content-center">{ weatherData.condition }</span>
				</section>

				<section className="mt-5 grid grid-cols-3 gap-5" >

					<section className="h-30 p-5 bg-white border border-gray-300 rounded-xl flex flex-col" title="Feels-like Temperature">

						<label className="text-xs truncate">Feels-like Temperature</label>
						<span className="grow text-3xl text-center content-center">{ `${ Math.round( weatherData.main.feels_like ) }°` }</span>

					</section>

					<section className="h-30 p-5 bg-white border border-gray-300 rounded-xl flex flex-col" title="Humidity">

						<label className="text-xs truncate">Humidity</label>
						<span className="grow text-3xl text-center content-center">{ `${ weatherData.main.humidity }%` }</span>

					</section>

					<section className="h-30 p-5 bg-white border border-gray-300 rounded-xl flex flex-col" title="Wind Speed (km/h)">

						<label className="text-xs truncate">Wind Speed (km/h)</label>
						<span className="grow text-3xl text-center content-center">{ weatherData.wind.speed }</span>

					</section>

				</section>

			</section> }

			{ ( !weatherLoading && !!error ) && <section className="h-85.5 p-5 border border-gray-300 rounded-xl flex justify-center items-center" >
				<span className="text-gray-500">{ error }</span>
			</section> }

		</section>

	</main>;

}