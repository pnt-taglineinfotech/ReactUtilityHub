import { ArrowDownUpIcon, ArrowLeft, RefreshCw, Coins } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "../assets/components/PopUps";

export default function CurrencyConverter() {

	const navigate = useNavigate();

	const [ currCode, setCurrCode ] = useState( [] );
	const [ convert, setConvert ] = useState( { from: '', amount: '', to: '', value: '' } );

	const [ answerLoader, setAnswerLoader ] = useState( false );
	const [ alert, setAlert ] = useState( { show: false } );

	useEffect( () => {

		const controller = new AbortController();
		let isMounted = true;

		if ( isMounted )
			( async () => {

				try {

					const res = await fetch( `https://v6.exchangerate-api.com/v6/${ import.meta.env.VITE_CURRENCY_API_KEY }/codes`, {
						method: 'GET',
						cache: 'no-store',
						signal: controller.signal
					} );

					if ( !res.ok )
						throw new Error( `HTTP error!\nStatus:${ res.status }` );

					setCurrCode( ( await res.json() ).supported_codes );

				} catch ( error ) {

					if ( error.name !== 'AbortError' ) {

						console.error( error );
						setAlert( {
							show: true,
							title: 'Failure',
							message: "Can't fetch the Currency code!",
							variant: 'danger',
							buttontext: 'Ok',
							action: () => navigate( '/' )
						} );

					}

				}

			} )();

		return () => {

			isMounted = false;
			setCurrCode( [] );
			controller.abort();

		};

	}, [ navigate ] );

	useEffect( () => {

		const controller = new AbortController();

		if ( convert?.amount && convert?.from && convert?.to )
			( async () => {

				setAnswerLoader( true );

				if ( convert.from === convert.to || convert.amount === 0 ) {

					setConvert( c => ( { ...c, value: c.amount } ) );
					setAnswerLoader( false );
					return;

				}

				try {

					const res = await fetch( `https://v6.exchangerate-api.com/v6/${ import.meta.env.VITE_CURRENCY_API_KEY }/pair/${ convert.from }/${ convert.to }/${ convert.amount }`, {
						method: 'GET',
						cache: 'no-store',
						signal: controller.signal
					} );

					if ( !res.ok )
						throw new Error( `HTTP error!\nStatus:${ res.status }` );

					const { conversion_result } = await res.json();
					setConvert( c => ( { ...c, value: conversion_result } ) );

				} catch ( error ) {

					if ( error.name !== 'AbortError' ) {

						console.error( error );
						setAlert( {
							show: true,
							title: 'Failure',
							message: "Can't fetch the Currency Exchange!",
							variant: 'danger',
							buttontext: 'Ok',
							action: () => navigate( '/' )
						} );

					}

				} finally {
					setAnswerLoader( false );
				}

			} )();

		return () => {

			setAnswerLoader( false );
			controller.abort();

		};

	}, [ convert.amount, convert.from, convert.to, navigate ] );

	return <main className="min-h-[86.1vh] bg-gray-50 text-gray-800 font-sans py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">

		<div className="w-full max-w-2xl">

			<div className="flex items-center justify-between mb-8">

				<button
					type="button"
					className="p-2 bg-white hover:bg-gray-100 shadow-sm border border-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
					onClick={ () => navigate( '/', { replace: true } ) }
					aria-label="Go back"
				>
					<ArrowLeft size={ 20 } className="stroke-gray-600" />
				</button>
				<h1 className="flex items-center gap-2">

					<Coins size={ 24 } className="stroke-blue-600" />
					<span className="text-2xl font-bold text-gray-900 tracking-tight">Currency Converter</span>

				</h1>
				<div className="w-9" />

			</div>

			<div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100 relative">

				<div className="flex justify-end p-4 border-b border-gray-50 bg-gray-50/50">

					<button
						type="button"
						className="flex items-center gap-2 p-2 px-4 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						onClick={ () => setConvert( { amount: '', from: '', to: '', value: '' } ) }
					>

						<RefreshCw size={ 16 } className="stroke-gray-700" />
						<span className="text-sm text-gray-700 font-medium">Reset</span>

					</button>

				</div>

				<div className="p-6 sm:p-8 flex flex-col relative gap-2">

					<div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-shadow">

						<label htmlFor="select-convert-from" className="block text-sm font-semibold text-gray-500 mb-3">You Send</label>
						<div className="flex gap-4 items-center">

							<select
								id="select-convert-from"
								className="w-1/3 sm:w-1/4 p-2 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
								value={ convert.from }
								onChange={ e => setConvert( c => ( { ...c, from: e.target.value } ) ) }
							>

								<option value="" disabled hidden>Currency</option>
								{ currCode.map( ( code, idx ) => <option key={ `from-currency-${ idx }` } value={ code[ 0 ] } >
									{ code[ 0 ] } - { code[ 1 ] }
								</option> ) }

							</select>

							<div className="grow flex items-center bg-transparent">

								<input
									type="number"
									placeholder="0.00"
									className="w-full text-3xl font-bold text-right bg-transparent outline-none text-gray-900 placeholder-gray-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
									value={ convert.amount }
									onChange={ e => {

										const value = Number( e.target.value );
										if ( isNaN( value ) )
											return;

										if ( value <= 0 )
											setConvert( c => ( { ...c, amount: 0, value: 0 } ) );
										else
											setConvert( c => ( { ...c, amount: value } ) );

									} }
								/>

							</div>

						</div>

					</div>

					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-none w-full">

						<button
							type="button"
							className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg border-4 border-white transition-transform hover:scale-105 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300 pointer-events-auto"
							onClick={ () => setConvert( c => ( { ...c, from: c.to, to: c.from } ) ) }
							disabled={ !convert.from && !convert.to }
							aria-label="Swap currencies"
						>
							<ArrowDownUpIcon size={ 20 } className="stroke-white" />
						</button>

					</div>

					<div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mt-2">

						<label htmlFor="select-convert-to" className="block text-sm font-semibold text-gray-500 mb-3">You Get</label>

						<div className="flex gap-4 items-center">

							<select
								id="select-convert-to"
								className="w-1/3 sm:w-1/4 p-2 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
								value={ convert.to }
								onChange={ e => setConvert( c => ( { ...c, to: e.target.value } ) ) }
							>

								<option value="" disabled hidden>Currency</option>
								{ currCode.map( ( code, idx ) => <option key={ `to-currency-${ idx }` } value={ code[ 0 ] } >
									{ code[ 0 ] } - { code[ 1 ] }
								</option> ) }

							</select>

							<div className="grow text-right overflow-hidden flex flex-col justify-center" >

								{ answerLoader ?
									<span className="text-xl font-medium text-blue-400 animate-pulse" >Calculating...</span>
								:
									<span className="text-3xl font-bold text-blue-700 truncate" >
										{ ( convert?.value >= 0 && convert.value !== '' ) ? Number( convert.value ).toLocaleString( undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 } ) : '0.00' }
									</span>
								}

							</div>

						</div>

					</div>

				</div>

			</div>

		</div>

		{ alert.show && <Alert { ...alert } /> }

	</main>;

}