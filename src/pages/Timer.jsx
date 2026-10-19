import { ArrowLeft, Hourglass, Pause, Play, Square } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "../assets/components/PopUps";

export default function Timer() {

	const navigate = useNavigate();

	const [ timer, setTimer ] = useState( { hours: 0, minutes: 0, seconds: 0 } );
	const [ status, setStatus ] = useState( 'stop' );
	const [ startTime, setStartTime ] = useState( null );
	const [ timeInterval, setTimeInterval ] = useState( null );
	const [ alert, setAlert ] = useState( false );

	useEffect( () => {

		if ( status === 'running' )
			setTimeInterval(
				setInterval( () => {

					const { hours, minutes, seconds } = startTime.since( Temporal.Now.plainDateTimeISO(), { 
						largestUnit: 'hours', 
						smallestUnit: 'seconds' 
					} );

					setTimer( { hours, minutes, seconds } );

					if ( !hours && !minutes && !seconds ) {

						setStatus( 'stop' );
						setAlert( true );
						return;

					}

					if ( hours <= 99 )
						return;
					setStatus( 'stop' );

				}, 100 )
			);

		if ( status === 'stop' ) {

			setTimer( { hours: 0, minutes: 0, seconds: 0 } );
			setStartTime( null );
			if ( timeInterval )
				clearInterval( timeInterval );
			setTimeInterval( null );

		}

		return () => {

			if ( timeInterval )
				clearInterval( timeInterval );

		};

	}, [ status, startTime ] );

	const handleInput = ( val, max, field ) => {

		const num = Number( val );
		if ( Number.isNaN( num ) )
			return;
		if ( num <= max )
			setTimer( t => ( { ...t, [ field ]: num } ) );

	};

	const isEditable = status === 'stop';

	return <main className="min-h-[86.1vh] bg-gray-50 text-gray-800 font-sans py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">

		<div className="w-full max-w-xl">

			<div className="flex items-center justify-between mb-8">

				<button
					type="button"
					className="p-2 bg-white hover:bg-gray-100 shadow-sm border border-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
					onClick={ () => navigate( '/', { replace: true } ) }
					aria-label="Go back"
				>
					<ArrowLeft size={ 20 } className="stroke-gray-600" />
				</button>

				<h1 className="flex items-center gap-2">

					<Hourglass size={ 24 } className="stroke-teal-600" />
					<span className="text-2xl font-bold text-gray-900 tracking-tight">Timer</span>

				</h1>

				<div className="w-9" />

			</div>

			<div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">

				<div className="p-8 sm:p-12 bg-slate-900 flex justify-center items-center relative overflow-hidden">

					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/20 blur-3xl rounded-full pointer-events-none" />

					<div className="relative z-10 flex items-center justify-center gap-2 sm:gap-4 font-mono">

						<div className="flex flex-col items-center gap-2">

							<input
								type="number"
								min={ 0 }
								max={ 99 }
								className={ `w-20 sm:w-28 text-5xl sm:text-7xl font-light text-center rounded-2xl tabular-nums transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
									isEditable ?
										'bg-slate-800/80 text-white border border-slate-600 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 outline-none py-2' 
									:
										'bg-transparent text-white border-transparent py-2'
								}` }
								value={ String( timer.hours ).padStart( 2, '0' ) }
								onChange={ e => handleInput( e.target.value, 99, 'hours' ) }
								readOnly={ !isEditable }
							/>
							<span className="text-slate-400 text-xs sm:text-sm font-bold tracking-widest uppercase">Hours</span>

						</div>

						<span className="text-4xl sm:text-6xl font-light text-slate-500 pb-6">:</span>

						<div className="flex flex-col items-center gap-2">

							<input
								type="number"
								min={ 0 }
								max={ 59 }
								className={ `w-20 sm:w-28 text-5xl sm:text-7xl font-light text-center rounded-2xl tabular-nums transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
									isEditable 
										? 'bg-slate-800/80 text-white border border-slate-600 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 outline-none py-2' 
										: 'bg-transparent text-white border-transparent py-2'
								}` }
								value={ String( timer.minutes ).padStart( 2, '0' ) }
								onChange={ e => handleInput( e.target.value, 59, 'minutes' ) }
								readOnly={ !isEditable }
							/>
							<span className="text-slate-400 text-xs sm:text-sm font-bold tracking-widest uppercase">Min</span>

						</div>

						<span className="text-4xl sm:text-6xl font-light text-slate-500 pb-6">:</span>

						<div className="flex flex-col items-center gap-2">

							<input
								type="number"
								min={ 0 }
								max={ 59 }
								className={ `w-20 sm:w-28 text-5xl sm:text-7xl font-light text-center rounded-2xl tabular-nums transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
									isEditable ?
										'bg-slate-800/80 text-white border border-slate-600 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 outline-none py-2' 
									:
										'bg-transparent text-teal-400 border-transparent py-2 drop-shadow-md'
								}` }
								value={ String( timer.seconds ).padStart( 2, '0' ) }
								onChange={ e => handleInput( e.target.value, 59, 'seconds' ) }
								readOnly={ !isEditable }
							/>
							<span className="text-slate-400 text-xs sm:text-sm font-bold tracking-widest uppercase">Sec</span>

						</div>

					</div>

				</div>

				<div className="p-8 flex justify-center items-center gap-6 sm:gap-8 bg-white">

					{ [ 'running', 'pause' ].includes( status ) && <button
						className="size-16 bg-gray-100 hover:bg-gray-200 rounded-full flex justify-center items-center shadow-sm transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
						onClick={ () => setStatus( 'stop' ) }
						title="Cancel"
					>
						<Square size={ 24 } className="stroke-gray-600 fill-gray-600" />
					</button> }

					{ status === 'running' ? 
						<button
							className="size-20 bg-amber-500 hover:bg-amber-600 rounded-full flex justify-center items-center shadow-lg shadow-amber-500/30 transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-300"
							onClick={ () => {

								setStatus( 'pause' );
								if ( timeInterval )
									clearInterval( timeInterval );
								setTimeInterval( null );

							} }
							title="Pause"
						>
							<Pause size={ 32 } className="stroke-white fill-white" />
						</button>
					:
						<button
							className="size-20 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:hover:scale-100 disabled:shadow-none rounded-full flex justify-center items-center shadow-lg shadow-teal-500/30 transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300 cursor-pointer disabled:cursor-not-allowed"
							disabled={ !timer.hours && !timer.minutes && !timer.seconds }
							onClick={ () => {
								setStartTime( Temporal.Now.plainDateTimeISO().add( timer ) );
								setStatus( 'running' );
							} }
							title={ status === 'pause' ? 'Resume' : 'Start' }
						>
							<Play size={ 32 } className="ml-1 stroke-white fill-white" />
						</button>
					}

				</div>

			</div>

		</div>

		{ alert && <Alert 
			show={ alert } 
			title="Time's Up!" 
			message="Your timer has finished." 
			action={ () => setAlert( false ) } 
		/> }

	</main>;

}