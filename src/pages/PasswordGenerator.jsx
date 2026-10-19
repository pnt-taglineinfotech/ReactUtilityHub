import { ArrowLeft, Copy, CopyCheck, KeyRound, RefreshCw, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "../assets/components/PopUps";

export default function PasswordGenerator() {

	const navigate = useNavigate();
	const [ options, setOptions ] = useState( { length: 12, upper: true, lower: true, number: true, symbol: false } );
	const [ password, setPassword ] = useState( '' );
	const [ loading, setLoading ] = useState( false );
	const [ copied, setCopied ] = useState( false );
	const [ alert, setAlert ] = useState( { show: false } );

	const generatePassword = () => {

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
		for ( let i = 0; i < options.length; i++ )
			answer += root.charAt( Math.floor( Math.random() * root.length ) );

		setPassword( answer );
		setLoading( false );

	};

	const strength = ( () => {

		if ( !password )
			return { label: 'None', color: 'bg-gray-200', text: 'text-gray-400', percent: 0, Icon: Shield };

		let score = 0;
		if ( options.length >= 12 )
			score += 1;
		if ( options.length >= 16 )
			score += 1;
		if ( options.upper && options.lower )
			score += 1;
		if ( options.number )
			score += 1;
		if ( options.symbol )
			score += 1;

		if ( score <= 2 )
			return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500', percent: 33, Icon: ShieldAlert, stroke: 'stroke-red-500' };

		if ( score <= 4 )
			return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-500', percent: 66, Icon: Shield, stroke: 'stroke-amber-500' };

		return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500', percent: 100, Icon: ShieldCheck, stroke: 'stroke-emerald-500' };

	} )();

	return <main className="min-h-[86.1vh] bg-gray-50 text-gray-800 font-sans py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">

		<div className="w-full max-w-2xl">

			<div className="flex items-center justify-between mb-8">

				<button
					type="button"
					className="p-2 bg-white hover:bg-gray-100 shadow-sm border border-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
					onClick={ () => navigate( '/', { replace: true } ) }
					aria-label="Go back"
				>
					<ArrowLeft size={ 20 } className="stroke-gray-600" />
				</button>

				<h1 className="flex items-center gap-2">

					<KeyRound size={ 24 } className="stroke-emerald-600" />
					<span className="text-2xl font-bold text-gray-900 tracking-tight">Password Generator</span>

				</h1>

				<div className="w-9" />

			</div>

			<div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">

				<div className="p-6 sm:p-8 bg-slate-900 flex flex-col gap-4 relative overflow-hidden">

					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

					<div className="flex items-center justify-between gap-4 relative z-10">

						<input
							type="text"
							id="output-password"
							placeholder="Generated Password"
							className="w-full text-xl sm:text-2xl font-mono text-emerald-400 bg-transparent outline-none placeholder-slate-600 tracking-wider truncate"
							value={ password }
							readOnly={ true }
						/>

						<button
							type="button"
							className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 rounded-xl transition-all shadow-md shadow-emerald-900/20 cursor-pointer disabled:cursor-not-allowed shrink-0 group"
							disabled={ !password || loading || copied }
							onClick={ async () => {

								if ( !password )
									return;

								try {

									await navigator.clipboard.writeText( password );
									setCopied( true );
									setTimeout( () => setCopied( false ), 2000 );

								} catch ( error ) {

									console.error( error );
									setAlert( {
										show: true,
										title: 'Failure',
										message: error.message,
										variant: 'danger',
										buttontext: 'Ok',
										action: () => setAlert( { show: false } )
									} );

								}

							} }
						>

							{ copied ?
								<CopyCheck size={ 18 } className="stroke-white" />
							:
								<Copy size={ 18 } className="stroke-white" />
							}
							<span className="hidden sm:inline text-white group-disabled:text-slate-600 font-medium">{ copied ? 'Copied!' : 'Copy' }</span>

						</button>

					</div>

					{ password && <div className="relative z-10 flex items-center justify-between gap-3 pt-2 border-t border-slate-800">

						<div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">

							<strength.Icon size={ 14 } className={ strength.stroke } />
							<span>Strength: <strong className={ strength.text }>{ strength.label }</strong></span>

						</div>

						<div className="w-28 sm:w-36 h-2 bg-slate-800 rounded-full overflow-hidden">
							<div
								className={ `h-full transition-all duration-300 ${ strength.color }` }
								style={ { width: `${ strength.percent }%` } }
							/>
						</div>

					</div> }

				</div>

				<div className="p-6 sm:p-8 flex flex-col gap-6">

					<div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/80">

						<div className="flex justify-between items-center mb-3">

							<label htmlFor="range-length" className="text-sm font-semibold text-gray-700">
								Password Length
							</label>

							<span className="text-lg font-mono font-bold text-emerald-600 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">
								{ options.length }
							</span>

						</div>

						<div className="flex items-center gap-3">

							<span className="text-xs font-bold text-gray-400">8</span>
							<input
								type="range"
								id="range-length"
								min={ 8 }
								max={ 64 }
								value={ options.length }
								className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
								onChange={ e => setOptions( opt => ( { ...opt, length: Number( e.target.value ) } ) ) }
							/>
							<span className="text-xs font-bold text-gray-400">64</span>

						</div>

					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

						{ [
							{ id: 'check-UpperCase', key: 'upper', label: 'Include Uppercase (A-Z)' },
							{ id: 'check-LowerCase', key: 'lower', label: 'Include Lowercase (a-z)' },
							{ id: 'check-Number', key: 'number', label: 'Include Numbers (0-9)' },
							{ id: 'check-Symbol', key: 'symbol', label: 'Include Symbols (!@#$)' }
						].map( item => <label
							key={ `password-options-${ item.id }` }
							htmlFor={ item.id }
							className={ `flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer select-none ${
								options[ item.key ] ?
									'bg-emerald-50/50 border-emerald-200 text-emerald-950 font-medium'
								:
									'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
							}` }
						>

							<input
								type="checkbox"
								id={ item.id }
								className="size-5 accent-emerald-600 rounded cursor-pointer"
								checked={ options[ item.key ] }
								onChange={ e => setOptions( opt => ( { ...opt, [ item.key ]: e.target.checked } ) ) }
							/>
							<span className="text-sm">{ item.label }</span>

						</label> ) }

					</div>

					<div className="flex items-center gap-3 pt-2">

						<button
							type="button"
							className="flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:shadow-emerald-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={ loading || options.length < 8 || options.length > 64 || ( !options.lower && !options.number && !options.symbol && !options.upper ) }
							onClick={ generatePassword }
						>

							<RefreshCw size={ 18 } className={ `stroke-white ${ loading ? 'animate-spin' : '' }` } />
							<span className="text-white font-semibold">{ `${ password ? 'Re-g' : 'G' }enerate Password` }</span>

						</button>

						{ password !== '' && <button
							type="button"
							className="p-3.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
							onClick={ () => {

								setOptions( { length: 12, upper: true, lower: true, number: true, symbol: false } );
								setPassword( '' );

							} }
							title="Clear"
						>
							Clear
						</button> }

					</div>

				</div>

			</div>

		</div>

		{ alert.show && <Alert { ...alert } /> }

	</main>;

}