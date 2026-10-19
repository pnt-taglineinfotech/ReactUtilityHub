import { ArrowLeft, Film, ImageOff, Loader2, Search, Star, Trophy, Users, Clapperboard, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MovieAPI } from "../assets/js/common";

export default function MovieSearch() {

	const navigate = useNavigate();
	const [ search, setSearch ] = useState( '' );
	const [ result, setResult ] = useState( [] );
	const [ loading, setLoading ] = useState( false );
	const [ error, setError ] = useState( null );

	const [ dialog, setDialog ] = useState( { show: false, tt: null } );

	async function getMovie( e ) {

		if ( e )
			e.preventDefault();

		if ( !search.trim() )
			return;

		setResult( [] );
		setError( null );
		setLoading( true );

		try {

			MovieAPI.searchParams.append( 's', search.trim() );
			const res = await fetch( MovieAPI );
			if ( !res.ok ) throw new Error( `HTTP error!\nStatus:${ res.status }` );

			const { Search } = await res.json();

			if ( !Array.isArray( Search ) || Search.length <= 0 )
				throw new Error( 'No matching movies found!' );

			setResult( Search );

		} catch ( err ) {
			setError( err.message );
		} finally {

			MovieAPI.searchParams.delete( 's' );
			setLoading( false );

		}

	}

	return <main className="min-h-[86.1vh] bg-gray-50 font-sans py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">

		<div className="w-full max-w-5xl">

			<div className="flex items-center justify-between mb-8">

				<button
					type="button"
					className="p-2 bg-white hover:bg-gray-100 shadow-sm border border-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
					onClick={ () => navigate( '/', { replace: true } ) }
					aria-label="Go back"
				>
					<ArrowLeft size={ 20 } className="stroke-gray-600" />
				</button>

				<h1 className="flex items-center gap-2">

					<Film size={ 26 } className="stroke-indigo-600" />
					<span className="text-2xl font-bold text-gray-900 tracking-tight">Movie Search</span>

				</h1>
				<div className="w-9" />

			</div>

			<div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100 p-6 mb-8">

				<form onSubmit={ getMovie } className="flex flex-col sm:flex-row gap-3">

					<div className="relative grow">

						<Search size={ 20 } className="absolute left-4 top-1/2 -translate-y-1/2 stroke-gray-400" />
						<input
							id="input-search"
							type="text"
							placeholder="Search movies, TV series (e.g. Inception, Batman)..."
							className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl font-medium text-gray-800 shadow-inner outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-400"
							value={ search }
							onChange={ e => setSearch( e.target.value ) }
						/>
						{ search && <button
							type="button"
							className="w-fit rounded-full group"
							onClick={ () => {

								setSearch( '' );
								setResult( [] );

							} }
						>
							<X size={ 20 } className="absolute right-4 top-1/2 -translate-y-1/2 stroke-gray-400 group-hover:stroke-gray-500" />
						</button> }

					</div>

					<button
						type="submit"
						className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
						disabled={ loading || !search.trim() }
					>

						{ loading ?
							<Loader2 size={ 20 } className="stroke-white animate-spin" />
						:
							<span className="text-white font-semibold">Search</span>
						}

					</button>

				</form>

			</div>

			{ loading && <div className="py-20 flex flex-col items-center justify-center gap-3">

				<Loader2 size={ 48 } className="stroke-indigo-600 animate-spin" />
				<p className="text-sm font-medium text-gray-500">Searching movie database...</p>

			</div> }

			{ ( !loading && !!error ) && <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm flex flex-col items-center gap-2">

				<Film size={ 40 } className="stroke-gray-300 stroke-1" />
				<p className="text-gray-600 text-center font-medium">{ error }</p>

			</div> }

			{ ( !loading && !error && result.length > 0 ) && <div>

				<div className="flex items-center justify-between mb-6">

					<h2 className="flex items-baseline gap-1">

						<span className="text-xl font-bold text-gray-900">Search Results</span>
						<span className="text-sm font-normal text-gray-500">({ result.length })</span>

					</h2>

				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

					{ result.map( ( movie, idx ) => <div 
						key={ `movie-${ idx }` } 
						className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
					>

						<div className="relative overflow-hidden aspect-2/3 bg-gray-100">

							<Image src={ movie.Poster } alt={ movie.Title } />
							<span className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
								{ movie.Type }
							</span>

						</div>

						<div className="p-5 flex flex-col grow justify-between gap-4">

							<div>

								<h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-indigo-600 transition-colors" title={ movie.Title }>
									{ movie.Title }
								</h3>
								<p className="text-xs font-semibold text-gray-400 mt-1">Year: { movie.Year }</p>

							</div>

							<button
								type="button"
								className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
								onClick={ () => setDialog( { show: true, tt: movie.imdbID } ) }
							>
								View Details
							</button>

						</div>

					</div> ) }

				</div>

			</div> }

		</div>

		{ dialog.show && <Dialog tt={ dialog.tt } onDismiss={ () => setDialog( { show: false, tt: null } ) } /> }

	</main>;

}

function Image( { src, alt } ) {

	const [ imageError, setImageError ] = useState( false );

	if ( !src || src === 'N/A' || imageError )
		return <div className="size-full min-h-62.5 bg-gray-100 flex flex-col items-center justify-center gap-2">

			<ImageOff size={ 36 } className="stroke-1 stroke-gray-400" />
			<span className="text-xs text-gray-400 font-medium">No Poster Available</span>

		</div>;

	return <img 
		src={ src } 
		alt={ alt || 'Movie poster' } 
		className="size-full object-cover transition-transform duration-500 group-hover:scale-105" 
		onError={ () => setImageError( true ) } 
	/>;

}

function Dialog( { tt, onDismiss } ) {

	const dialogRef = useRef( null );
	const [ loading, setLoading ] = useState( false );
	const [ result, setResult ] = useState( null );
	const [ error, setError ] = useState( null );

	useEffect( () => {

		const controller = new AbortController();
		let isMounted = true;

		if ( isMounted ) {
			( async () => {

				dialogRef.current?.showModal();
				setLoading( true );

				try {

					MovieAPI.searchParams.append( 'plot', 'full' );
					MovieAPI.searchParams.append( 'i', tt );
					const res = await fetch( MovieAPI, { signal: controller.signal } );
					if ( !res.ok )
						throw new Error( `HTTP error!\nStatus:${ res.status }` );

					const data = await res.json();
					if ( !data || data.Response === 'False' )
						throw new Error( 'Failed to load movie details.' );

					setResult( data );

				} catch ( err ) {

					if ( err.name !== 'AbortError' ) {

						setError( err.message );
						console.error( err );

					}

				} finally {

					MovieAPI.searchParams.delete( 'plot' );
					MovieAPI.searchParams.delete( 'i' );
					setLoading( false );

				}

			} )();

		}

		return () => {

			isMounted = false;
			MovieAPI.searchParams.delete( 'plot' );
			MovieAPI.searchParams.delete( 'i' );
			setLoading( false );
			setResult( null );
			setError( null );
			controller.abort();

		};

	}, [ tt ] );

	return <dialog 
		ref={ dialogRef } 
		className="w-full max-w-4xl p-0 rounded-3xl shadow-2xl backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm overflow-hidden border border-gray-100 m-auto"
		onClose={ onDismiss }
	>

		<div className="bg-white flex flex-col max-h-[90vh]">

			<div className="p-5 px-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">

				<h3 className="flex items-center gap-2">

					<Clapperboard size={ 20 } className="stroke-indigo-600" />
					<span className="text-lg font-bold text-gray-900">Movie Details</span>

				</h3>

				<button
					type="button"
					className="p-2 hover:bg-gray-100 rounded-full group transition-colors"
					onClick={ () => {

						dialogRef.current?.close();
						onDismiss();

					} }
				>
					<X size={ 20 } className="stroke-gray-500 group-hover:stroke-gray-900 transition-colors" />
				</button>

			</div>

			<div className="p-6 sm:p-8 overflow-y-auto">

				{ loading && <div className="py-20 flex flex-col items-center justify-center gap-3">

					<Loader2 size={ 44 } className="stroke-indigo-600 animate-spin" />
					<p className="text-sm font-medium text-gray-500">Loading film details...</p>

				</div> }

				{ !!error && <div className="py-12 text-center text-red-500 font-medium">{ error }</div> }

				{ ( !loading && !!result ) && <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

					<div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 aspect-2/3 max-w-70 mx-auto md:mx-0 w-full">
						<Image src={ result.Poster } alt={ result.Title } />
					</div>

					<div className="md:col-span-2 flex flex-col gap-5">

						<div>

							<h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{ result.Title }</h2>
							<p className="text-sm font-semibold text-indigo-600 mt-1">
								{ result.Year } • { result.Rated } • { result.Runtime } • { result.Genre }
							</p>

						</div>

						<div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">

							<div className="flex items-center gap-1.5 font-bold text-gray-800">

								<Star size={ 18 } className="stroke-amber-500 fill-amber-500" />
								<span>{ result.imdbRating } <span className="text-xs text-gray-400 font-normal">/10 ({ result.imdbVotes } votes)</span></span>

							</div>

							{ ( result.Metascore && result.Metascore !== 'N/A' ) && <div className="flex items-center gap-1.5 font-semibold text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
								Metascore: { result.Metascore }
							</div> }

						</div>

						<div>

							<h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Overview</h4>
							<p className="text-gray-700 leading-relaxed text-sm sm:text-base">{ result.Plot }</p>

						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">

							<div>

								<span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Director</span>
								<span className="font-semibold text-gray-800">{ result.Director }</span>

							</div>

							<div>

								<span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Box Office</span>
								<span className="font-semibold text-gray-800">{ result.BoxOffice || 'N/A' }</span>

							</div>

							<div className="sm:col-span-2">

								<section className="mb-0.5 flex items-center gap-1">

									<Users size={ 12 } className="stroke-gray-400" />
									<span className="text-xs font-bold uppercase tracking-wider text-gray-400">Starring</span>

								</section>
								<span className="font-medium text-gray-700">{ result.Actors }</span>

							</div>

							{ ( result.Awards && result.Awards !== 'N/A' ) && <div className="sm:col-span-2 bg-amber-50/60 border border-amber-200/60 p-3 rounded-xl flex items-center gap-2">

								<Trophy size={ 16 } className="stroke-amber-600 shrink-0" />
								<span className="text-amber-900 text-xs font-medium">{ result.Awards }</span>

							</div> }

						</div>

					</div>

				</div> }

			</div>

		</div>

	</dialog>;

}