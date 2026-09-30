import { ArrowLeft, ImageOff, Loader2, Search, Star, Vote, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MovieSearch() {

	const navigate = useNavigate();
	const [ search, setSearch ] = useState( '' );
	const [ result, setResult ] = useState( [] );
	const [ loading, setLoading ] = useState( false );
	const [ error, setError ] = useState( null );

	const [ dialog, setDialog ] = useState( { show: false } );

	async function getMovie() {

		setResult( [] );
		setError( null );
		setLoading( true );

		try {

			const res = await fetch( `https://www.omdbapi.com/?apikey=${ import.meta.env.VITE_MOVIE_API_KEY }&s=${ search }` );
			if ( !res.ok )
				throw new Error( `HTTP error!\nStatus:${ res.status }` );

			const { Search } = await res.json();

			if ( !Array.isArray( Search ) || Search.length <= 0 )
				throw new Error( 'No Match Result Found!' );

			setResult( Search );

		} catch ( error ) {
			setError( error.message );
		} finally {
			setLoading( false );
		}

	}

	return <main className="min-h-[88vh] pt-10">

		<button
			type="button"
			className="p-2 ms-50 bg-slate-600 hover:bg-slate-700 border border-slate-300 hover:border-slate-400 rounded-xl cursor-pointer"
			onClick={ () => navigate( '/', { replace: true } ) }
		>
			<ArrowLeft size={ 20 } color="white" />
		</button>

		<section className="w-3/7 mx-auto p-5 flex flex-col gap-5">

			<h1 className="text-3xl text-center font-semibold">Movie Search</h1>

			<section className="w-full p-5 border border-gray-300 rounded-xl">

				<label htmlFor="input-search" className="text-xs select-none">Movie Name</label>

				<section className="flex gap-5 items-center select-none">

					<input
						id="input-search"
						type="text"
						className="grow px-1 text-lg border-b border-gray-400 outline-none focus:border-b-2"
						value={ search }
						onChange={ e => setSearch( e.target.value ) }
						disabled={ false }
					/>

					<button
						className="p-2 bg-green-700 not-disabled:hover:bg-green-800 border border-green-400 not-disabled:hover:border-green-500 rounded-xl flex justify-center items-center cursor-pointer disabled:cursor-not-allowed"
						onClick={ getMovie }
						disabled={ loading || !search }
					>
						<Search size={ 25 } color="white" />
					</button>

				</section>

			</section>

		</section>

		{ loading && <section className="w-5/7 h-100 mt-5 mx-auto p-5 border border-gray-300 rounded-xl text-gray-600 text-center font-semibold flex justify-center items-center">

			<section className="flex flex-col justify-center">

				<Loader2 size={ 50 } color="#99a1af" className="animate-spin m-auto" />
				<span className="text-gray-400">Loading...</span>

			</section>

		</section> }

		{ ( result.length > 0 || !!error ) && <section className="w-4/5 max-h-[58vh] mx-auto p-5 overflow-y-scroll scrollbar-none">

			<section className="text-2xl text-center font-semibold">Search Result</section>

			{ !!error && <section className="mt-5 mx-auto p-5 border border-gray-300 rounded-xl text-gray-600 text-center font-semibold">{ error }</section> }

			{ ( !error && result.length > 0 ) && <section className="mt-5 flex gap-5">

				<section className="w-full mt-5 grid grid-cols-3 gap-5">

					{ result.map( ( movie, idx ) => {

						return <section key={ `movie-${ idx }` } className="p-5 border border-gray-300 rounded-xl flex flex-col gap-5">

							<Image src={ movie.Poster } />

							<section className="grow">

								<section className="font-semibold">{ movie.Title }</section>

								<section>
									<span className="font-semibold">Year:</span> { movie.Year }
								</section>

								<section>
									<span className="font-semibold">Type:</span> { movie.Type }
								</section>

							</section>

							<button
								type="button"
								className="w-2/7 p-2 self-center bg-blue-500 not-disabled:hover:bg-blue-600 border border-blue-400 not-disabled:hover:border-blue-500 rounded-xl cursor-pointer"
								onClick={ () => setDialog( { show: true, tt: movie.imdbID } ) }
							><span className="text-center text-white">View</span></button>

						</section>;

					} ) }

				</section>

			</section> }

		</section> }

		{ dialog.show && <Dialog tt={ dialog.tt } onDismiss={ () => setDialog( { show: false } ) } /> }

	</main>;

}

function Image( { src } ) {

	const [ imageError, setImageError ] = useState( false );

	return !imageError ?
		<img src={ src } className="w-full h-100" onError={ () => setImageError( true ) } />
		:
		<section className="h-100 bg-gray-200 flex justify-center items-center">
			<ImageOff size={ 50 } color="#99a1af" />
		</section>;

}

function Dialog( { tt, onDismiss } ) {

	const dialogRef = useRef( null );
	const [ loading, setLoading ] = useState( false );
	const [ result, setResult ] = useState( {} );
	const [ error, setError ] = useState( null );

	useEffect( () => {

		const controller = new AbortController();
		let isMounted = true;

		if ( isMounted )
			( async () => {

				dialogRef.current?.showModal();
				setLoading( true );

				try {

					const res = await fetch( `https://www.omdbapi.com/?apikey=${ import.meta.env.VITE_MOVIE_API_KEY }&plot=full&i=${ tt }`, { signal: controller.signal } );
					if ( !res.ok )
						throw new Error( `HTTP error!\nStatus:${ res.status }` );

					const data = await res.json();

					if ( !data )
						throw new Error( 'No Match Result Found!' );

					setResult( data );

				} catch ( error ) {

					if ( error.name !== 'AbortError' )
						setError( error.message );

				} finally {
					setLoading( false );
				}

			} )();

		return () => {

			isMounted = false;
			setLoading( false );
			setResult( {} );
			setError( null );
			controller.abort();

		}

	}, [] );

	return <dialog ref={ dialogRef } className="w-4/5 m-auto p-5 rounded-2xl">
			
		<section className="flex items-center">

			<h3 className="grow text-xl font-semibold">Movie Info</h3>
			<button
				type="button"
				className="p-2 hover:bg-red-100 rounded-full group"
				onClick={ () => {

					dialogRef.current?.close();
					onDismiss();

				} }
			><X size={ 25 } className="stroke-red-400 group-hover:stroke-red-600" /></button>

		</section>

		{ loading && <section className="mt-5 h-100 flex justify-center items-center">
			<Loader2 size={ 50 } color="#99a1af" className="animate-spin" />
		</section> }

		{ !!error && <section className="mt-5 h-100 flex justify-center items-center ">
			<span className="text-gray-600 text-center font-semibold">{ error }</span>
		</section> }

		{ !!result && <section className="mt-5 grid grid-cols-3 gap-5">

			<section className="col-span-2 max-h-100 overflow-y-scroll scrollbar-none hover:scrollbar-thin">

				<h4 className="text-4xl">{ result.Title }</h4>
				<p>{ result.Year } • { result.Language } • { result.Country }</p>

				<p className="mt-5">Directed by { result.Director }</p>
				<p>Written by { result.Writer }</p>

				<p className="mt-5">Starred by { result.Actors }</p>

				<p className="mt-5">{ result.Plot }</p>

				<p className="mt-5">Awards: { result.Awards }</p>

				<p className="mt-5">BoxOffice: { result.BoxOffice }</p>

				<p className="mt-5">Rating:</p>
				<ol>
					{ result.Ratings?.length > 0 ?
						result.Ratings.map( ( rating, idx ) => <li key={ `rating-list-${ idx + 1 }` }>{ rating.Source }: { rating.Value }</li> )
						:
						<li>No Rating</li>
					}
				</ol>

			</section>

			<section>
				<Image src={ result.Poster } />
			</section>

			<section className="col-span-full flex items-center gap-5">

				<section className="flex justify-center items-center gap-2"><Star size={ 20 } color="#99a1af"/> { result.imdbRating }</section>
				<section className="flex justify-center items-center gap-2"><Vote size={ 20 } color="#99a1af"/> { result.imdbVotes }</section>

			</section>

		</section> }

	</dialog>;

}