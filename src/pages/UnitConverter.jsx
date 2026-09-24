import { ArrowDownUpIcon, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UnitConverter() {

	const units = {
		Length: {
			Millimeter: 1,
			Centimeter: 10,
			Meter: 1000,
			Kilometer: 1000000,
			Mile: 1609344,
			Foot: 304.8,
			Inch: 25.4
		},
		Weight: {
			Gram: 1,
			Kilogram: 1000,
			Pound: 453.59237,
			Ounce: 28.349523125
		},
		Temperature: {
			Celsius: 1,
			Fahrenheit: 33.8,
			Kelvin: 274.15
		},
		Time: {
			Seconds: 1,
			Minutes: 60,
			Hours: 3600,
			Days: 86400
		}
	};

	const [ convert, setConvert ] = useState( {
		measure: '',
		value: '',
		from: '',
		to: ''
	} );

	function convertUnit( value, measure, from, to ) {

		if ( from === to )
			return value;

		if ( measure === 'Temperature' ) {

			let celsius;
			if ( from === 'Celsius' )
				celsius = value;
			else if ( from === 'Fahrenheit' )
				celsius = ( ( value - 32 ) * 5 ) / 9;
			else if ( from === 'Kelvin' )
				celsius = value - 273.15;
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

		return ( value * unit[ from ] ) / unit[ to ];

	}

	const navigate = useNavigate();

	return <main className="min-h-[88vh] pt-10">

		<button
			type="button"
			className="p-2 ms-50 bg-slate-600 hover:bg-slate-700 border border-slate-300 hover:border-slate-400 rounded-xl cursor-pointer"
			onClick={ () => navigate( '/', { replace: true } ) }
		> <ArrowLeft size={ 20 } color="white" /></button>

		<section className="w-3/7 mx-auto p-5 flex flex-col gap-5">

			<p className="text-3xl text-center font-semibold">Unit Converter</p>

			<button
				type="button"
				className="p-2 w-1/5 self-end bg-green-700 hover:bg-green-800 border border-green-300 hover:border-green-400 rounded-xl text-white cursor-pointer"
				onClick={ () => setConvert( {
					measure: '',
					value: '',
					from: '',
					to: ''
				} ) }
			>Clear</button>

			<section className="w-full p-5 border border-gray-300 rounded-xl flex flex-col">

				<label htmlFor="dateOfBirth" className="text-xs">Measurement</label>
				<select
					value={ convert.measure }
					onChange={ e => setConvert( {
						measure: e.target.value,
						value: '',
						from: '',
						to: ''
					} ) }
				>

					<option value="" disabled hidden>Select Measures</option>
					{ Object.keys( units ).map( ( unit, idx ) => <option key={ `select-mesure-option-${ idx + 1 }` } value={ unit }>{ unit }</option> ) }

				</select>

			</section>

			<section className="w-full p-5 border border-gray-300 rounded-xl flex flex-col">

				<label htmlFor="" className="text-xs">From</label>
				<section className="flex gap-5">

					<select
						className="w-1/4 disabled:cursor-not-allowed"
						value={ convert.from }
						onChange={ e => setConvert( c => ( { ...c, from: e.target.value } ) ) }
						disabled={ !convert?.measure }
					>

						<option value="" disabled hidden>Select Unit</option>
						{ !!convert?.measure && Object.keys( units?.[ convert.measure ] ).map( ( unit, idx ) => <option key={ `unit-to-select-option-${ idx + 1 }` } value={ unit }>{ unit }</option> ) }

					</select>
					<input
						type="text"
						className="grow text-lg text-end border-b border-gray-400 outline-none focus:border-b-2"
						disabled={ !convert?.measure }
						value={ convert.value }
						onChange={ e => setConvert( c => ( { ...c, value: e.target.value } ) ) }
					/>

				</section>

			</section>

				<button
					type="button"
					className="w-fit p-2 self-center rounded-full not-disabled:hover:bg-blue-100 group cursor-pointer disabled:cursor-not-allowed"
					disabled={ !convert?.measure && !convert?.to && !convert?.from }
					onClick={ () => setConvert( c => ( { ...c, from: c.to, to: c.from } ) ) }
				>
					<ArrowDownUpIcon size={ 20 } className="group-not-disabled:group-hover:stroke-blue-600" />
				</button>

			<section className="w-full p-5 border border-gray-300 rounded-xl flex flex-col">

				<label htmlFor="" className="text-xs">To</label>
				<section className="flex gap-5">

					<select
						className="w-1/4 disabled:cursor-not-allowed"
						value={ convert.to }
						onChange={ e => setConvert( c => ( { ...c, to: e.target.value } ) ) }
						disabled={ !convert?.measure }
					>

						<option value="" disabled hidden>Select Unit</option>
						{ !!convert?.measure && Object.keys( units?.[ convert.measure ] ).map( ( unit, idx ) => <option key={ `unit-to-select-option-${ idx + 1 }` } value={ unit }>{ unit }</option> ) }

					</select>
					<span className="grow text-lg text-end border-b border-gray-400">{ ( !!convert?.measure && !!convert?.to && !!convert?.from && !!convert?.value ) ? convertUnit( convert.value, convert.measure, convert.from, convert.to ) : '' }</span>

				</section>

			</section>

		</section>

	</main>;

}