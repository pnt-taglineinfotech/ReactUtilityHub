import { ArrowLeft, Pause, Play, Square } from "lucide-react";
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
			setTimeInterval( setInterval( () => {

				const { hours, minutes, seconds } = startTime.since( Temporal.Now.plainDateTimeISO(), { largestUnit: 'hours', smallestUnit: 'seconds' } );
				setTimer( { hours, minutes, seconds } );

				if ( !hours && !minutes && !seconds ) {

					setStatus( 'stop' );
					setAlert( true );
					return;

				}

				if ( hours <= 99 )
					return;

				setStatus( 'stop' );

			} ) );

		if ( status === 'stop' ) {
0
			setTimer( { hours: 0, minutes: 0, seconds: 0 } );
			setStartTime( null );
			clearInterval( timeInterval );
			setTimeInterval( null );

		}

	}, [ status ] );

	return <main className="min-h-[88vh] pt-10">

		<button
			type="button"
			className="p-2 ms-50 bg-slate-600 hover:bg-slate-700 border border-slate-300 hover:border-slate-400 rounded-xl cursor-pointer"
			onClick={ () => navigate( '/', { replace: true } ) }
		>
			<ArrowLeft size={ 20 } color="white" />
		</button>

		<section className="w-3/7 mx-auto p-5 flex flex-col gap-20">

			<p className="text-3xl text-center font-semibold">Timer</p>

			<section className="text-7xl grid grid-cols-3 gap-2">

				<input
					type="number"
					min={ 0 }
					max={ 99 }
					className="border border-gray-300 rounded-2xl text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
					value={ String( timer.hours ).padStart( 2, '0' ) }
					onChange={ e => {

						const num = Number( e.target.value );
						if ( num === NaN || e.target.readOnly )
							return;

						if ( num <= 99 )
							setTimer( t => ( { ...t, hours: num } ) );

					} }
					readOnly={ [ 'running', 'pause' ].includes( status ) }
				/>
				<input
					type="number"
					min={ 0 }
					max={ 59 }
					className="border border-gray-300 rounded-2xl text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
					value={ String( timer.minutes ).padStart( 2, '0' ) }
					onChange={ e => {

						const num = Number( e.target.value );
						if ( num === NaN || e.target.readOnly )
							return;

						if ( num <= 59 )
							setTimer( t => ( { ...t, minutes: num } ) );

					} }
					readOnly={ [ 'running', 'pause' ].includes( status ) }
				/>
				<input
					type="number"
					min={ 0 }
					max={ 59 }
					className="border border-gray-300 rounded-2xl text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
					value={ String( timer.seconds ).padStart( 2, '0' ) }
					onChange={ e => {

						const num = Number( e.target.value );
						if ( num === NaN || e.target.readOnly )
							return;

						if ( num <= 59 )
							setTimer( t => ( { ...t, seconds: num } ) );

					} }
					readOnly={ [ 'running', 'pause' ].includes( status ) }
				/>

			</section>

			<section className="flex justify-around items-center">

				{ [ 'running', 'pause' ].includes( status ) && <button
					className="size-15 bg-blue-400 hover:bg-blue-500 rounded-full flex justify-center items-center cursor-pointer"
					onClick={ () => setStatus( 'stop' ) }
				>
					<Square size={ 25 } color="white" fill="white" />
				</button> }

				{ status === 'running' && <button
					className="size-15 bg-blue-400 hover:bg-blue-500 rounded-full flex justify-center items-center cursor-pointer"
					onClick={ () => {

						setStatus( 'pause' );
						clearInterval( timeInterval );
						setTimeInterval( null );

					} }
				>
					<Pause size={ 25 } color="white" fill="white" />
				</button> }

				{ [ 'stop', 'pause' ].includes( status ) && <button
					className="size-15 bg-blue-400 disabled:bg-blue-300 not-disabled:hover:bg-blue-500 rounded-full flex justify-center items-center cursor-pointer disabled:cursor-not-allowed"
					disabled={ !timer.hours && !timer.minutes && !timer.seconds }
					onClick={ () => {

						setStartTime( Temporal.Now.plainDateTimeISO().add( timer ) );
						setStatus( 'running' );

					} }
				>
					<Play size={ 25 } color="white" fill="white" />
				</button> }

			</section>

		</section>

		{ alert && <Alert show={ alert } title="Info" message="Time's Up" action={ () => setAlert( false ) } /> }

	</main>;

}