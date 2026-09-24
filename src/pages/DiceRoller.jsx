import { ArrowLeft, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DiceRoller() {

	const navigate = useNavigate();
	const [ dice, setDice ] = useState( 1 );
	const [ status, setStatus ] = useState( 'start' );
	const [ result, setResult ] = useState( [] );
	const [ diceLoader, setDiceLoader ] = useState( 1 );
	const [ loaderInterval, setLoaderInterval ] = useState( null );

	useEffect( () => {

		if ( status === 'rolling' ) {

			setLoaderInterval( setInterval( () => setDiceLoader( l => ( l <= 5 ? l + 1 : 1 ) ) , 100 ) );
			setResult( [] );

			for( let i = 1; i <= dice; i++ )
				setTimeout( () => setResult( r => ( [ ...r, ( Math.floor( Math.random() * 6 ) + 1 ) ] ) ), ( 5000 * i ) );

		}

		if ( status === 'start' ) {

			setDice( 1 );
			setResult( [] );
			setDiceLoader( 1 );
			setLoaderInterval( null );

		}

		if ( status === 'rolled' ) {

			clearInterval( loaderInterval );
			setLoaderInterval( null );

		}

	}, [ status ] );

	useEffect( () => setStatus( s => result.length === dice ? 'rolled' : s ), [ result ] );

	function getDice( num, idx = 0 ) {

		switch ( num ) {

			case 1:
				return <Dice1 key={ `dice-result-${ idx + 1 }` } size={ 120 } color="white" className="m-auto fill-red-600"/>;

			case 2:
				return <Dice2 key={ `dice-result-${ idx + 1 }` } size={ 120 } color="white" className="m-auto fill-blue-600"/>;

			case 3:
				return <Dice3 key={ `dice-result-${ idx + 1 }` } size={ 120 } color="white" className="m-auto fill-emerald-600"/>;

			case 4:
				return <Dice4 key={ `dice-result-${ idx + 1 }` } size={ 120 } color="white" className="m-auto fill-purple-600"/>;

			case 5:
				return <Dice5 key={ `dice-result-${ idx + 1 }` } size={ 120 } color="white" className="m-auto fill-amber-600"/>;

			case 6:
				return <Dice6 key={ `dice-result-${ idx + 1 }` } size={ 120 } color="white" className="m-auto fill-sky-600"/>;

			default:
				return null;

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

			<h1 className="text-3xl text-center font-semibold">Dice Roller</h1>

			<section className="w-full p-5 border border-gray-300 rounded-xl flex flex-col">

				<label htmlFor="select-convert-from" className="text-xs">Number of Dice</label>
				<input
					type="number"
					min={ 1 }
					className="grow text-lg text-end border-b border-gray-400 outline-none focus:border-b-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
					value={ dice }
					onChange={ e => {

						const value = Number( e.target.value );

						if ( value === NaN && value < 1 )
							return;

						setDice( value );

					} }
					disabled={ status === 'rolling' }
				/>

			</section>

			<section className="flex flex-row justify-around items-center" >

				{ [ 'rolling', 'rolled' ].includes( status ) &&<button
					type="button"
					className="p-2 w-1/5 bg-green-700 disabled:bg-green-600 not-disabled:hover:bg-green-800 border border-green-300 not-disabled:hover:border-green-400 rounded-xl text-white cursor-pointer disabled:cursor-not-allowed"
					onClick={ () => setStatus( 'start' ) }
					disabled={ status === 'rolling' }
				>Clear</button> }

				<button
					className="p-2 w-1/5 bg-blue-500 disabled:bg-blue-400 not-disabled:hover:bg-blue-600 border border-blue-300 not-disabled:hover:border-blue-400 rounded-xl text-white cursor-pointer disabled:cursor-not-allowed"
					onClick={ () => setStatus( 'rolling' ) }
					disabled={ status === 'rolling' }
				>{ status === 'start' ? 'Roll' : 'Roll Again' }</button>
			
			</section>

			{ [ 'rolling', 'rolled' ].includes( status ) && <section className="w-full p-5 border border-gray-300 rounded-xl">

				<h2 className="text-2xl text-center font-semibold">Dices</h2>

				<section className="mt-5 grid grid-cols-3">

					{ result.map( ( r, idx ) => getDice( r, idx ) ) }

					{ status === 'rolling' && getDice( diceLoader ) }

				</section>

			</section> }

		</section>

	</main>;

}