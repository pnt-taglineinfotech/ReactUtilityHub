import { ArrowLeft, Flag, Pause, Play, Square, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Stopwatch() {

	const navigate = useNavigate();

	const [ status, setStatus ] = useState( 'stop' );
	const [ startTime, setStartTime ] = useState( null );
	const [ stopwatch, setStopwatch ] = useState( Temporal.Duration.from( { milliseconds: 0 } ) );
	const [ timeInterval, setTimeInterval ] = useState( null );
	const [ flag, setFlag ] = useState( [] );

	useEffect( () => {

		if ( status === 'running' )
			setTimeInterval(
				setInterval( () => {

					const duration = startTime.until( Temporal.Now.plainDateTimeISO(), { 
						largestUnit: 'hours', 
						smallestUnit: 'milliseconds' 
					} );
					setStopwatch( duration );

					if ( duration.hours <= 99 )
						return;
					setStatus( 'stop' );

				}, 10 )
			);

		if ( status === 'stop' ) {

			if ( timeInterval )
				clearInterval( timeInterval );
			setStopwatch( Temporal.Duration.from( { milliseconds: 0 } ) );
			setTimeInterval( null );
			setStartTime( null );

		}

		return () => {

			if ( timeInterval )
				clearInterval( timeInterval );

		};

	}, [ status, startTime ] );

	const formatTime = ( val, pad = 2 ) => `${ val || 0 }`.padStart( pad, '0' );

	return <main className="min-h-[86.1vh] bg-gray-50 text-gray-800 font-sans py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
			
		<div className="w-full max-w-xl">

			<div className="flex items-center justify-between mb-8">

				<button
					type="button"
					className="p-2 bg-white hover:bg-gray-100 shadow-sm border border-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
					onClick={ () => navigate( '/', { replace: true } ) }
					aria-label="Go back"
				>
					<ArrowLeft size={ 20 } className="stroke-gray-600" />
				</button>

				<h1 className="flex items-center gap-2">

					<Timer size={ 26 } className="stroke-rose-600" />
					<span className="text-2xl font-bold text-gray-900 tracking-tight">Stopwatch</span>

				</h1>

				<div className="w-9" />

			</div>

			<div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">

				<div className="p-8 sm:p-12 bg-slate-900 flex justify-center items-center relative overflow-hidden">

					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 bg-rose-500/20 blur-3xl rounded-full pointer-events-none" />
					
					<div className="relative z-10 flex items-baseline font-mono drop-shadow-lg tabular-nums">

						<span className="text-5xl sm:text-7xl text-white font-light tracking-tight">
							{ formatTime( stopwatch.hours ) }:{ formatTime( stopwatch.minutes ) }:{ formatTime( stopwatch.seconds ) }
						</span>

						<span className="text-2xl sm:text-4xl font-bold text-rose-400 ml-2">
							.{ formatTime( stopwatch.milliseconds, 3 ).slice( 0, 2 ) }
						</span>

					</div>

				</div>

				<div className="p-8 border-b border-gray-100 flex justify-center items-center gap-6 sm:gap-8">

					{ status === 'pause' && <button
						className="size-16 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex justify-center items-center shadow-sm transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
						onClick={ () => setStatus( 'stop' ) }
						title="Reset"
					>
						<Square size={ 24 } className="stroke-gray-600 fill-current" />
					</button> }

					{ status === 'running' && <button
						className="size-16 bg-slate-100 hover:bg-slate-200 rounded-full flex justify-center items-center shadow-sm transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-400"
						onClick={ () => setFlag( f => [ ...f, startTime.until( Temporal.Now.plainDateTimeISO(), { largestUnit: 'hours', smallestUnit: 'milliseconds' } ) ] ) }
						title="Lap / Flag"
					>
						<Flag size={ 24 } className="stroke-slate-700 fill-current" />
					</button> }

					{ status === 'running' ?
						<button
							className="size-20 bg-amber-500 hover:bg-amber-600 rounded-full flex justify-center items-center shadow-lg shadow-amber-500/30 transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-300"
							onClick={ () => {

								clearInterval( timeInterval );
								setTimeInterval( null );
								setStatus( 'pause' );

							} }
							title="Pause"
						>
							<Pause size={ 32 } className="stroke-white fill-current" />
						</button>
					:
						<button
							className="size-20 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex justify-center items-center shadow-lg shadow-rose-600/30 transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-rose-400"
							onClick={ () => {

								if ( status === 'stop' )
									setFlag( [] );
								setStartTime( Temporal.Now.plainDateTimeISO().subtract( stopwatch ) );
								setStatus( 'running' );

							} }
							title={ status === 'pause' ? 'Resume' : 'Start' }
						>
							<Play size={ 32 }  className="ml-1 stroke-white fill-current" />
						</button>
					}

				</div>

				{ flag.length > 0 && <div className="bg-gray-50 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

					<div className="p-4 border-b border-gray-200 sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10 flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500">

						<span>Lap</span>
						<span>Time</span>

					</div>

					<div className="flex flex-col-reverse">

						{ flag.map( ( f, idx ) => <div 
							key={ `flag-${ idx + 1 }` } 
							className="flex justify-between items-center p-4 border-b border-gray-100 bg-white hover:bg-rose-50/50 transition-colors"
						>

							<span className="text-gray-500 font-medium w-1/4">#{ formatTime( idx + 1 ) }</span>
							<span className="font-mono text-lg font-semibold text-gray-800 tabular-nums">
								{ formatTime( f.hours ) }:{ formatTime( f.minutes ) }:{ formatTime( f.seconds ) }<span className="text-gray-400 text-sm">.{ formatTime( f.milliseconds, 3 ).slice( 0, 2 ) }</span>
							</span>

						</div> ) }

					</div>

				</div> }

			</div>

		</div>

	</main>;

}