import { ArrowDownUpIcon, ArrowLeft, RefreshCw, Ruler, Scale } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { units } from "../assets/js/common";

export default function UnitConverter() {

	const navigate = useNavigate();
	const [ convert, setConvert ] = useState( { measure: '', value: '', from: '', to: '' } );

	const result = ( convert.measure && convert.to && convert.from && convert.value !== '' ) ?
		( () => {

			const numValue = Number( convert.value );
			const { measure, from, to } = convert;

			if ( isNaN( numValue ) )
				return '';

			if ( from === to )
				return numValue;

			if ( measure === 'Temperature' ) {

				let celsius;
				if ( from === 'Celsius' )
					celsius = numValue;
				else if ( from === 'Fahrenheit' )
					celsius = ( ( numValue - 32 ) * 5 ) / 9;
				else if ( from === 'Kelvin' )
					celsius = numValue - 273.15;
				else
					return null;

				if ( to === 'Celsius' )
					return celsius;
				else if ( to === 'Fahrenheit' )
					return ( ( celsius * 9 ) / 5 ) + 32;
				else if ( to === 'Kelvin' )
					return celsius + 273.15;
				else
					return null;

			}

			const unit = units[ measure ];
			if ( !unit || !unit[ from ] || !unit[ to ] )
				return null;

			return ( numValue * unit[ from ] ) / unit[ to ];

		} )()
	:
		null;

	return <main className="min-h-[86.1vh] bg-gray-50 text-gray-800 font-sans py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">

		<div className="w-full max-w-2xl">

			<div className="flex items-center justify-between mb-8">

				<button
					type="button"
					className="p-2 bg-white hover:bg-gray-100 shadow-sm border border-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
					onClick={ () => navigate( '/', { replace: true } ) }
					aria-label="Go back"
				>
					<ArrowLeft size={ 20 } className="stroke-gray-600" />
				</button>
				<h1 className="flex items-center gap-2">

					<Ruler size={ 24 } className="stroke-indigo-600" />
					<span className="text-2xl font-bold text-gray-900 tracking-tight">Unit Converter</span>

				</h1>
				<div className="w-9" />

			</div>

			<div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100 relative">

				<div className="p-6 sm:p-8 bg-indigo-50/40 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

					<div className="w-full sm:w-2/3">

						<label htmlFor="select-measure" className="mb-2 flex items-center gap-1.5">

							<Scale size={ 14 } className="stroke-indigo-900/60" />
							<span className="text-xs font-bold uppercase tracking-wider text-indigo-900/60">Measurement Type</span>

						</label>
						<select
							id="select-measure"
							className="w-full p-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-800 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
							value={ convert.measure }
							onChange={ e => setConvert( { measure: e.target.value, value: '', from: '', to: '' } ) }
						>

							<option value="" disabled hidden>Select Category (e.g. Length, Weight)</option>
							{ Object.keys( units ).map( ( unit, idx )  =>
								<option key={ `select-measure-${ idx }` } value={ unit }>{ unit }</option>
							) }

						</select>

					</div>

					<button
						type="button"
						className="self-end sm:self-auto flex items-center gap-2 p-3 px-5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 whitespace-nowrap"
						onClick={ () => setConvert( { measure: '', value: '', from: '', to: '' } ) }
					>

						<RefreshCw size={ 16 } className="stroke-gray-700" />
						<span className="text-sm text-gray-700 font-medium">Reset</span>

					</button>

				</div>

				<div className="p-6 sm:p-8 flex flex-col relative gap-2">

					<div className={ `bg-gray-50 border rounded-2xl p-5 transition-all ${ !convert.measure ? 'opacity-50 pointer-events-none' : 'border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500' }` } >

						<label className="block text-sm font-semibold text-gray-500 mb-3">From</label>

						<div className="flex gap-4 items-center">

							<select
								className="w-1/3 sm:w-2/5 p-2 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
								value={ convert.from }
								onChange={ e => setConvert( c => ( { ...c, from: e.target.value } ) ) }
								disabled={ !convert.measure }
							>

								<option value="" disabled hidden>Select Unit</option>
								{ !!convert.measure && Object.keys( units[ convert.measure ] || {} ).map( ( unit, idx ) =>
									<option key={ `from-unit-${ idx }` } value={ unit } >{ unit }</option>
								) }

							</select>

							<div className="grow flex items-center bg-transparent">

								<input
									type="number"
									placeholder="0"
									className="w-full text-3xl font-bold text-right bg-transparent outline-none text-gray-900 placeholder-gray-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:cursor-not-allowed"
									disabled={ !convert.measure }
									value={ convert.value }
									onChange={ e => setConvert( c => ( { ...c, value: e.target.value } ) ) }
								/>

							</div>

						</div>

					</div>

					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-none w-full">

						<button
							type="button"
							className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-lg border-4 border-white transition-transform hover:scale-105 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300 pointer-events-auto"
							disabled={ !convert.measure || ( !convert.from && !convert.to ) }
							onClick={ () => setConvert( c => ( { ...c, from: c.to, to: c.from } ) ) }
							aria-label="Swap units"
						>
							<ArrowDownUpIcon size={ 20 } className="stroke-white" />
						</button>

					</div>

					<div className={ `bg-indigo-50/50 border rounded-2xl p-5 mt-2 transition-all ${ !convert.measure ? 'opacity-50' : 'border-indigo-100' }` }>

						<label className="block text-sm font-semibold text-gray-500 mb-3">To</label>

						<div className="flex gap-4 items-center">

							<select
								className="w-1/3 sm:w-2/5 p-2 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
								value={ convert.to }
								onChange={ e => setConvert( c => ( { ...c, to: e.target.value } ) ) }
								disabled={ !convert.measure }
							>

								<option value="" disabled hidden>Select Unit</option>
								{ !!convert.measure && Object.keys( units[ convert.measure ] || {} ).map( ( unit, idx ) =>
									<option key={ `to-unit-${ idx }` } value={ unit }>{ unit }</option>
								) }

							</select>

							<div className="grow overflow-hidden flex flex-col justify-center">

								<span className="text-3xl text-right font-bold text-indigo-700 truncate">
									{ result !== null ? ( typeof result === 'number' ? Number( result.toFixed( 6 ) ).toString() : result ) : '--' }
								</span>

							</div>

						</div>

					</div>

				</div>

			</div>

		</div>

	</main>;

}