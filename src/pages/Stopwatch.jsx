import { ArrowLeft, FlagTriangleRight, Pause, Play, Square } from "lucide-react";
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
			setTimeInterval( setInterval( () => {

				const duration = startTime.until( Temporal.Now.plainDateTimeISO(), { largestUnit: 'hours', smallestUnit: 'milliseconds' } );
				setStopwatch( duration );

				if ( duration.hours <= 99 )
					return;

				setStatus( 'stop' );

			} ) );

		if ( status === 'stop' ) {

			clearInterval( timeInterval );
			setStopwatch( Temporal.Duration.from( { milliseconds: 0 } ) );
			setTimeInterval( null );
			setStartTime( null );

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

			<p className="text-3xl text-center font-semibold">Stopwatch</p>

			<span className="text-7xl text-center content-center">{ `${ stopwatch.hours }`.padStart( 2, '0' ) }:{ `${ stopwatch.minutes }`.padStart( 2, '0' ) }:{ `${ stopwatch.seconds }`.padStart( 2, '0' ) }:{ `${ stopwatch.milliseconds }`.padStart( 3, '0' ) }</span>

			<section className="flex justify-around items-center">

				{ status === 'pause' && <button
					className="size-15 bg-blue-400 hover:bg-blue-500 rounded-full flex justify-center items-center cursor-pointer"
					onClick={ () => setStatus( 'stop' ) }
				>
					<Square size={ 25 } color="white" fill="white" />
				</button> }

				{ status === 'running' && <>

					<button
						className="size-15 bg-blue-400 hover:bg-blue-500 rounded-full flex justify-center items-center cursor-pointer"
						onClick={ () =>
							setFlag( f => ( [ ...f, startTime.until( Temporal.Now.plainDateTimeISO(), { largestUnit: 'hours', smallestUnit: 'milliseconds' } ) ] ) )
						}
					>
						<FlagTriangleRight size={ 25 } color="white" fill="white" />
					</button>

					<button
						className="size-15 bg-blue-400 hover:bg-blue-500 rounded-full flex justify-center items-center cursor-pointer"
						onClick={ () => {

							clearInterval( timeInterval );
							setTimeInterval( null );
							setStatus( 'pause' );

						} }
					>
						<Pause size={ 25 } color="white" fill="white" />
					</button>

				</> }

				{ [ 'stop', 'pause' ].includes( status ) && <button
					className="size-15 bg-blue-400 hover:bg-blue-500 rounded-full flex justify-center items-center cursor-pointer"
					onClick={ () => {

						if ( status === 'stop' )
							setFlag( [] );

						setStartTime( Temporal.Now.plainDateTimeISO().subtract( stopwatch ) );
						setStatus( 'running' );

					} }
				>
					<Play size={ 25 } color="white" fill="white" />
				</button> }

			</section>

			{ flag.length > 0 && <section className="max-h-80 p-5 border border-gray-300 rounded-xl overflow-y-scroll scrollbar-none" >

				<section className="text-center font-semibold">Flag</section>

				<section className="mt-5 flex flex-col-reverse gap-5">

					{ flag.map( ( f, idx ) => <span key={ `flag-${ idx + 1 }` } className="flex gap-2">

						<span className="w-1/6">#{ idx + 1 }</span>
						<span className="grow">{ `${ f.hours }`.padStart( 2, '0' ) }:{ `${ f.minutes }`.padStart( 2, '0' ) }:{ `${ f.seconds }`.padStart( 2, '0' ) }:{ `${ f.milliseconds }`.padStart( 3, '0' ) }</span>

					</span> ) }

				</section>

			</section> }

		</section>

	</main>;

}