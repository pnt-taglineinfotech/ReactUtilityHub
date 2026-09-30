import { ArrowLeft, Copy, CopyCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "../assets/components/PopUps";

export default function PasswordGenerator() {

	const navigate = useNavigate();
	const [ options, setOptions ] = useState( { length: 8, upper: false, lower:true, number: false, symbol: false } );
	const [ password, setPassword ] = useState( '' );
	const [ loading, setLoading ] = useState( false );
	const [ copied, setCopied ] = useState( false );
	const [ alert, setAlert ] = useState( { show: false } );

	return <main className="min-h-[88vh] pt-10">

		<button
			type="button"
			className="p-2 ms-50 bg-slate-600 hover:bg-slate-700 border border-slate-300 hover:border-slate-400 rounded-xl cursor-pointer"
			onClick={ () => navigate( '/', { replace: true } ) }
		>
			<ArrowLeft size={ 20 } color="white" />
		</button>

		<section className="w-3/7 mx-auto p-5 flex flex-col gap-5">

			<h1 className="text-3xl text-center font-semibold">Password Generator</h1>

			<section className="w-full p-5 border border-gray-300 rounded-xl flex flex-col">

				<label htmlFor="output-password" className="text-xs">Password</label>
				<section className="flex flex-row gap-2 items-center">

				<input
					type="text"
					id="output-password"
					className="grow text-lg border-b border-gray-400 outline-none focus:border-b-2"
					value={ password }
					readOnly={ true }
				/>

				<button
					type="button"
					className="p-2 bg-green-700 disabled:bg-green-500 not-disabled:hover:bg-green-800 border border-green-500 not-disabled:hover:border-green-600 rounded-lg cursor-pointer disabled:cursor-not-allowed"
					disabled={ !password || loading || copied }
					onClick={ async () => {

						if ( !password ) return;

						await navigator.clipboard.writeText( password ).then( () => {

							setCopied( true );
							setTimeout( () => setCopied( false ), 2000 );

						} ).catch( error => {

							console.error( error );
							setAlert( {
								show: true,
								title: 'Failure',
								message: error.message,
								variant: 'danger',
								buttontext: 'Ok',
								action: () => setAlert( { show: false } )
							} );

						} );

					} }
				>{ copied ? <CopyCheck size={ 20 } color="white"/> : <Copy size={ 20 } color="white"/> } </button>

				</section>

			</section>

			<section className="w-full p-5 border border-gray-300 rounded-xl grid grid-cols-2 gap-y-5">

				<section className="col-span-2 flex flex-col gap-1">

					<span className="grow cursor-pointer">Length: { options.length }</span>

					<section className="flex flex-row gap-1 items-center">

						<span className="p-2">8</span>
						<input
							type="range"
							id="range-length"
							min={ 8 }
							max={ 64 }
							value={ options.length }
							className="grow cursor-pointer"
							onChange={ e => setOptions( opt => ( { ...opt, length: e.target.value } ) ) }
						/>
						<span className="p-2">64</span>

					</section>

				</section>

				<section className="flex flex-row gap-5 items-center">

					<input
						type="checkbox"
						id="check-UpperCase"
						className="size-5 cursor-pointer"
						checked={ options.upper }
						onChange={ e => setOptions( opt => ( { ...opt, upper: e.target.checked } ) ) }
					/>
					<label htmlFor="check-UpperCase" className="grow cursor-pointer">Upper Case</label>

				</section>

				<section className="flex flex-row gap-5 items-center">

					<input
						type="checkbox"
						id="check-LowerCase"
						className="size-5 cursor-pointer"
						checked={ options.lower }
						onChange={ e => setOptions( opt => ( { ...opt, lower: e.target.checked } ) ) }
					/>
					<label htmlFor="check-LowerCase" className="grow cursor-pointer">Lower Case</label>

				</section>

				<section className="flex flex-row gap-5 items-center">

					<input
						type="checkbox"
						id="check-Number"
						className="size-5 cursor-pointer"
						checked={ options.number }
						onChange={ e => setOptions( opt => ( { ...opt, number: e.target.checked } ) ) }
					/>
					<label htmlFor="check-Number" className="grow cursor-pointer">Number</label>

				</section>

				<section className="flex flex-row gap-5 items-center">

					<input
						type="checkbox"
						id="check-Symbol"
						className="size-5 cursor-pointer"
						checked={ options.symbol }
						onChange={ e => setOptions( opt => ( { ...opt, symbol: e.target.checked } ) ) }
					/>
					<label htmlFor="check-Symbol" className="grow cursor-pointer">Symbol</label>

				</section>

				<section className="col-span-2 flex justify-around items-center">

					{ password !== '' && <button
						type="button"
						className="w-1/4 p-2 bg-green-700 disabled:bg-green-500 not-disabled:hover:bg-green-800 rounded-lg text-white cursor-pointer disabled:cursor-not-allowed"
						disabled={ loading }
						onClick={ () => {

							setOptions( {
								length: 8,
								upper: false,
								lower:true,
								number: false,
								symbol: false
							} );
							setPassword( '' );

						} }
					>Clear</button> }

					<button
						type="button"
						className="w-1/4 p-2 bg-green-700 disabled:bg-green-500 not-disabled:hover:bg-green-800 rounded-lg text-white cursor-pointer disabled:cursor-not-allowed"
						disabled={ loading || options.length < 8 || options.length > 64 || ( !options.lower && !options.number && !options.symbol && !options.upper ) }
						onClick={ () => {

							setLoading( true );

							let root = '';
							if ( options.upper )
								root += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
							if ( options.lower )
								root += 'abcdefghijklmnopqrstuvwxyz';
							if ( options.number )
								root += '0123456789';
							if ( options.symbol )
								root += '!@#$%^&*()_+-=[]{}|;:,.<>?';

							if ( root === '' ) {

								setPassword( '' );
								setLoading( false );
								return;

							}

							let answer = '';
							for ( let i = 0; i <= options.length; i++ )
								answer += root.charAt( Math.floor( Math.random() * root.length ) );

							setPassword( answer );
							setLoading( false );

						} }
					>{ password ? 'Re-generate' : 'Generate' }</button>
				
				</section>

			</section>

		</section>

		{ alert.show && <Alert { ...alert } /> }

	</main>;

}