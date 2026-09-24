import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AgeCalculator() {

	const measure = [ 'years', 'months', 'days',  ];

	const [ dob, setDob ] = useState( '' );
	const [ unit, setUnit ] = useState( '' );
	const [ tillNextDob, setTillNextDob ] = useState( null );

	useEffect( () => {

		if ( dob )
			setTillNextDob( dob.add( { years: dob.until( Temporal.Now.plainDateISO(), { largestUnit: 'years' } ).years + 1 } ).since( Temporal.Now.plainDateISO(), { largestUnit: 'years' } ) )

	}, [ dob ] );

	const navigate = useNavigate();

	return <main className="min-h-[88vh] pt-10">

		<button
			type="button"
			className="p-2 ms-50 bg-slate-600 hover:bg-slate-700 border border-slate-300 hover:border-slate-400 rounded-xl cursor-pointer"
			onClick={ () => navigate( '/', { replace: true } ) }
		> <ArrowLeft size={ 20 } color="white" /></button>

		<section className="w-3/7 mx-auto p-5 flex flex-col gap-5">

			<p className="text-3xl text-center font-semibold">Age Calculator</p>

			<button
				type="button"
				className="p-2 w-1/5 self-end bg-green-700 hover:bg-green-800 border border-green-300 hover:border-green-400 rounded-xl text-white cursor-pointer"
				onClick={ () => {

					setDob( '' );
					setUnit( '' );
					setTillNextDob( null );

				} }
			>Clear</button>

			<section className="w-full p-5 border border-gray-300 rounded-xl flex flex-col">

				<label htmlFor="dateOfBirth" className="text-xs">Date of Birth</label>
				<input type="date" id="dateOfBirth" className="text-lg" value={ dob.toString() } onChange={ e => setDob( Temporal.PlainDate.from( e.target.value ) ) } />

			</section>

			<section className="w-full p-5 border border-gray-300 rounded-xl flex gap-5">

				<select className="w-1/4" value={ unit } onChange={ e => setUnit( e.target.value ) }>

					<option value='' disabled hidden>Select Unit</option>
					{ measure.map( ( unit, idx ) => <option key={ `unit-select-option-${ idx + 1 }` } value={ unit }>{ unit }</option> ) }

				</select>
				<span className="grow text-lg text-end">{ ( dob && unit ) ? dob.until( Temporal.Now.plainDateISO(), { largestUnit: unit } )[ unit ] : '--' }</span>

			</section>

			<section className="w-full p-5 border border-gray-300 rounded-xl flex flex-col">

				<label className="text-xs">Total Number of Days lived</label>
				<span className="text-lg">{ dob ? dob.until( Temporal.Now.plainDateISO(), { largestUnit: 'days' } ).days : '--' }</span>

			</section>

			<section className="w-full p-5 border border-gray-300 rounded-xl flex flex-col">

				<label className="text-xs">Next Birthday</label>
				<span className="text-lg">{ dob ? dob.add( { years: dob.until( Temporal.Now.plainDateISO(), { largestUnit: 'years' } ).years + 1 } ).toString() : '--' }</span>
				{ tillNextDob && <span className="text-lg"> { tillNextDob.years } Years, { tillNextDob.months } Months & { tillNextDob.days } Days </span> }

			</section>

		</section>

	</main>;

}