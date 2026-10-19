import { ArrowLeft, Dices, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, RefreshCw, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DiceRoller() {

	const navigate = useNavigate();
	const [ dice, setDice ] = useState( 1 );
	const [ status, setStatus ] = useState( 'start' );
	const [ result, setResult ] = useState( [] );
	const [ diceLoader, setDiceLoader ] = useState( 1 );
	const [ loaderInterval, setLoaderInterval ] = useState( null );

	const startRolling = () => {

		setResult( [] );
		setStatus( 'rolling' );

	};

	useEffect( () => {

		if ( status === 'rolling' ) {

			const interval = setInterval( () => setDiceLoader( l => ( l <= 5 ? l + 1 : 1 ) ), 100 );
			setLoaderInterval( interval );

			for ( let i = 1; i <= dice; i++ )
				setTimeout( () => 
					setResult( r => [ ...r, Math.floor( Math.random() * 6 ) + 1 ] )
				, 600 * i );

		}

		if ( status === 'start' ) {

			setDice( 1 );
			setResult( [] );
			setDiceLoader( 1 );
			if ( loaderInterval )
				clearInterval( loaderInterval );
			setLoaderInterval( null );

		}

		if ( status === 'rolled' ) {

			if ( loaderInterval )
				clearInterval( loaderInterval );
			setLoaderInterval( null );

		}

	}, [ status ] );

	useEffect( () => {

		if ( result.length === dice && status === 'rolling' )
			setStatus( 'rolled' );

	}, [ result, dice, status ] );

	useEffect( () => {

		return () => {

			if ( loaderInterval )
				clearInterval( loaderInterval );

		};

	}, [ loaderInterval ] );

	function renderDiceIcon( num, idx = 0 ) {

		const diceMap = {
			1: { Icon: Dice1, color: "text-red-500 fill-red-50 border-red-200" },
			2: { Icon: Dice2, color: "text-blue-500 fill-blue-50 border-blue-200" },
			3: { Icon: Dice3, color: "text-emerald-500 fill-emerald-50 border-emerald-200" },
			4: { Icon: Dice4, color: "text-purple-500 fill-purple-50 border-purple-200" },
			5: { Icon: Dice5, color: "text-amber-500 fill-amber-50 border-amber-200" },
			6: { Icon: Dice6, color: "text-indigo-500 fill-indigo-50 border-indigo-200" },
		};

		const { Icon, color } = diceMap[ num ] || diceMap[ 1 ];

		return <div 
			key={ `dice-${ idx }` }
			className={ `flex flex-col items-center justify-center p-4 bg-white rounded-2xl border ${ color } shadow-sm transition-all duration-300 transform scale-100 hover:scale-105` }
		>
			<Icon size={ 72 } className="drop-shadow-sm" />
		</div>;

	}

	const totalSum = result.reduce( ( acc, curr ) => acc + curr, 0 );

	return <main className="min-h-[86.1vh] bg-gray-50 font-sans py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
			
		<div className="w-full max-w-2xl">

			<div className="flex items-center justify-between mb-8">

				<button
					type="button"
					className="p-2 bg-white hover:bg-gray-100 shadow-sm border border-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
					onClick={ () => navigate( '/', { replace: true } ) }
					aria-label="Go back"
				>
					<ArrowLeft size={ 20 } className="stroke-gray-600" />
				</button>

				<h1 className="flex items-center gap-2">

					<Dices size={ 26 } className="text-violet-600" />
					<span className="text-2xl font-bold text-gray-900 tracking-tight">Dice Roller</span>

				</h1>

				<div className="w-9" />

			</div>

			<div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">

				<div className="p-6 sm:p-8 bg-violet-50/50 border-b border-gray-100 flex flex-col gap-6">

					<div>

						<label htmlFor="dice-count" className="block text-xs font-bold uppercase tracking-wider text-violet-900/60 mb-2">
							Number of Dice
						</label>
						
						<div className="flex flex-wrap items-center gap-2">

							{ [ 1, 2, 3, 4, 5, 6 ].map( num => <button
								key={ `preset-${ num }` }
								type="button"
								className={ `px-4 py-2 rounded-xl text-sm font-bold transition-all ${
									dice === num && status !== 'rolling' ?
										'bg-violet-600 text-white shadow-md shadow-violet-500/20'
									:
										'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
								} disabled:opacity-50 disabled:cursor-not-allowed` }
								onClick={ () => setDice( num ) }
								disabled={ status === 'rolling' }
							>
								{ num } { num === 1 ? 'Dice' : 'Dice' }
							</button> ) }

							<input
								id="dice-count"
								type="number"
								min={ 1 }
								max={ 12 }
								className="w-20 p-2 text-center bg-white border border-gray-200 rounded-xl font-bold text-gray-800 shadow-sm outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
								value={ dice }
								onChange={ e => {

									const val = Math.max( 1, Math.min( 12, Number( e.target.value ) || 1 ) );
									setDice( val );

								} }
								disabled={ status === 'rolling' }
							/>

						</div>

					</div>

					<div className="flex items-center gap-3">

						<button
							type="button"
							className="flex-1 py-3.5 px-6 bg-violet-600 hover:bg-violet-700  rounded-xl shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={ startRolling }
							disabled={ status === 'rolling' }
						>

							<Play size={ 18 } className="stroke-white fill-white" />
							<span className="text-white font-semibold">{ status === 'start' ? 'Roll Dice' : 'Roll Again' }</span>

						</button>

						{ [ 'rolling', 'rolled' ].includes( status ) && <button
							type="button"
							className="p-3.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
							onClick={ () => setStatus( 'start' ) }
							disabled={ status === 'rolling' }
						>

							<RefreshCw size={ 18 } className="stroke-gray-700" />
							<span className="text-gray-700 font-medium">Reset</span>

						</button> }

					</div>

				</div>

				<div className="p-6 sm:p-8 min-h-70 flex flex-col justify-center">

					{ status === 'start' && <div className="text-center py-10 text-gray-400 flex flex-col items-center gap-3">

						<Dices size={ 48 } className="stroke-1 text-violet-200" />
						<p className="text-base font-medium">Select the number of dice and click Roll to start.</p>

					</div> }

					{ [ 'rolling', 'rolled' ].includes( status ) && <div className="flex flex-col gap-6">

						{ status === 'rolled' && result.length > 0 && <div className="bg-linear-to-r from-violet-500 to-indigo-600 rounded-2xl p-4 text-white flex items-center justify-between px-6 shadow-md shadow-violet-500/10">

							<span className="text-sm font-semibold uppercase tracking-wider text-violet-100">Total Sum</span>
							<span className="text-3xl font-extrabold tracking-tight">{ totalSum }</span>

						</div> }

						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

							{ result.map( ( r, idx ) => renderDiceIcon( r, idx ) ) }

							{ status === 'rolling' && <div className="flex flex-col items-center justify-center p-4 bg-violet-50/50 rounded-2xl border border-dashed border-violet-300 animate-pulse">

								<div className="animate-spin">{ renderDiceIcon( diceLoader, 99 ) }</div>
								<span className="mt-2 text-xs font-semibold text-violet-600">Rolling...</span>

							</div> }

						</div>

					</div> }

				</div>

			</div>

		</div>

	</main>;

}