import { ArrowDownUpIcon, ArrowLeft } from "lucide-react";
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

					const res = await fetch( `https://v6.exchangerate-api.com/v6/${ import.meta.env.VITE_CURRENCY_API_KEY }/codes`, { signal: controller.signal } );
					if ( !res.ok )
						throw new Error( `HTTP error!\nStatus:${ res.status }` );

					setCurrCode( ( await res.json() ).supported_codes );

				} catch ( error ) {

					if ( error.name !== 'AbortError' ) {

						console.error( error );
						setAlert( {
							show: true,
							title: 'Failure',
							message: "Can\'t fetch the Currency code!",
							variant: 'danger',
							buttontext: 'Ok',
							action: () => goto( '/' )
						} );

					}

				}

			} )();

		return () => {

			isMounted = false;
			setCurrCode( [] );
			controller.abort();

		};

	}, [] );

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

					const res = await fetch( `https://v6.exchangerate-api.com/v6/${ import.meta.env.VITE_CURRENCY_API_KEY }/pair/${ convert.from }/${ convert.to }/${ convert.amount }`, { signal: controller.signal } );
					if ( !res.ok )
						throw new Error( `HTTP error!\nStatus:${ res.status }` );

					const { conversion_result } = await res.json();
					setConvert( c => ( { ...c, value: conversion_result } ) );

				} catch ( error ) {

					console.error( error );
					setAlert( {
						show: true,
						title: 'Failure',
						message: "Can\'t fetch the Currency Exchange!",
						variant: 'danger',
						buttontext: 'Ok',
						action: () => navigate( '/' )
					} );

				} finally {
					setAnswerLoader( false );
				}
				
			return () => {

				setAnswerLoader( false );
				setConvert( { from: '', amount: '', to: '', value: '' } );
				controller.abort();

			}

			} )();

	}, [ convert.amount, convert.from, convert.to ] );

	return <main className="min-h-[88vh] pt-10">

		<button
			type="button"
			className="p-2 ms-50 bg-slate-600 hover:bg-slate-700 border border-slate-300 hover:border-slate-400 rounded-xl cursor-pointer"
			onClick={ () => navigate( '/', { replace: true } ) }
		>
			<ArrowLeft size={ 20 } color="white" />
		</button>

		<section className="w-3/7 mx-auto p-5 flex flex-col gap-5">

			<p className="text-3xl text-center font-semibold">Currency Converter</p>

			<button
				type="button"
				className="p-2 w-1/5 self-end bg-green-700 hover:bg-green-800 border border-green-300 hover:border-green-400 rounded-xl text-white cursor-pointer"
				onClick={ () => setConvert( { amount: '', from: '', to: '' } ) }
			>Clear</button>

			<section className="w-full p-5 border border-gray-300 rounded-xl flex flex-col">

				<label htmlFor="select-convert-from" className="text-xs">From</label>
				<section className="flex gap-5">

					<select
						id="select-convert-from"
						className="w-1/3"
						value={ convert.from }
						onChange={ e => setConvert( c => ( { ...c, from: e.target.value } ) ) }
					>

						<option value="" disabled hidden>Select Currency</option>
						{ currCode.map( ( code, idx ) =>
							<option key={ `from-currency-code-option-${ idx + 1 }` } value={ code[ 0 ] }>{ `${ code[ 0 ] } ( ${ code[ 1 ] } )` }</option>
						) }

					</select>
					<input
						type="number"
						className="grow text-lg text-end border-b border-gray-400 outline-none focus:border-b-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
						value={ convert.amount }
						onChange={ e => {

							const value = Number( e.target.value );

							if ( value === NaN )
								return;
							else if ( value <= 0 )
								setConvert( c => ( { ...c, amount: 0, value: 0 } ) );
							else
								setConvert( c => ( { ...c, amount: value } ) );

						} }
					/>

				</section>

			</section>

			<button
				type="button"
				className="w-fit p-2 self-center rounded-full not-disabled:hover:bg-blue-100 group cursor-pointer disabled:cursor-not-allowed"
				onClick={ () => setConvert( c => ( { ...c, from: c.to, to: c.from } ) ) }
				disabled={ !convert.from && !convert.to }
			>
				<ArrowDownUpIcon size={ 20 } className="group-not-disabled:group-hover:stroke-blue-600" />
			</button>

			<section className="w-full p-5 border border-gray-300 rounded-xl flex flex-col">

				<label htmlFor="select-convert-to" className="text-xs">To</label>
				<section className="flex gap-5">

					<select
						id="select-convert-to"
						className="w-1/3"
						value={ convert.to }
						onChange={ e => setConvert( c => ( { ...c, to: e.target.value } ) ) }
					>

						<option value="" disabled hidden>Select Currency</option>
						{ currCode.map( ( code, idx ) =>
							<option key={ `to-currency-code-option-${ idx + 1 }` } value={ code[ 0 ] }>{ `${ code[ 0 ] } ( ${ code[ 1 ] } )` }</option>
						) }

					</select>
					<span className="grow text-lg text-end border-b border-gray-400">{ answerLoader ? "Loading..." : ( convert?.value >= 0 ? convert.value : '' ) }</span>

				</section>

			</section>

		</section>

		{ alert.show && <Alert { ...alert } /> }

	</main>;

}