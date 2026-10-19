import { ArrowLeft, RefreshCw, Calendar, Clock, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AgeCalculator() {

	const measure = [ 'years', 'months', 'days' ];

	const [ dob, setDob ] = useState( '' );
	const [ unit, setUnit ] = useState( '' );
	const [ tillNextDob, setTillNextDob ] = useState( null );

	useEffect( () => {

		if ( dob )
			setTillNextDob(
				dob.add( { years: dob.until( Temporal.Now.plainDateISO(), { largestUnit: 'years' } ).years + 1 } )
					.since( Temporal.Now.plainDateISO(), { largestUnit: 'years' } )
			);

	}, [ dob ] );

	const navigate = useNavigate();

	return <main className="min-h-[86vh] bg-gray-50 text-gray-800 font-sans py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center" >

		<div className="w-full max-w-2xl" >

			<div className="flex items-center justify-between mb-8" >

				<button
					type="button"
					className="p-2 bg-white hover:bg-gray-100 shadow-sm border border-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
					onClick={ () => navigate( '/', { replace: true } ) }
					aria-label="Go back"
				>
					<ArrowLeft size={ 20 } className="stroke-gray-600" />
				</button>
				<h1 className="text-2xl font-bold text-gray-900 tracking-tight">Age Calculator</h1>
				<div className="w-9" />

			</div>

			<div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">

				<div className="p-6 sm:p-8 bg-indigo-50/50 border-b border-gray-100">

					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">

						<div className="w-full">

							<label htmlFor="dateOfBirth" className="mb-1.5 flex items-center gap-2">

								<Calendar size={ 16 } className="stroke-indigo-500"/>
								<span className="text-sm font-medium text-gray-600">Date of Birth</span>

							</label>
							<input
								type="date"
								id="dateOfBirth"
								className="w-full text-lg p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
								value={ dob ? dob.toString() : '' }
								onChange={ e => setDob( Temporal.PlainDate.from( e.target.value ) ) }
							/>

						</div>

						<button
							type="button"
							className="flex items-center gap-2 p-3 px-6 mb-0.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 whitespace-nowrap"
							onClick={ () => {

								setDob( '' );
								setUnit( '' );
								setTillNextDob( null );

							} }
						>

							<RefreshCw size={ 18 } className="stroke-gray-700" />
							<span className="text-gray-700 font-medium">Reset</span>

						</button>

					</div>

					<div className="w-full flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">

						<div className="w-full sm:w-1/3">

							<select
								className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
								value={ unit }
								onChange={ e => setUnit( e.target.value ) }
							>

								<option value='' disabled hidden>Select Unit</option>
								{ measure.map( ( u, idx ) =>
									<option key={ `unit-select-${ idx }` } value={ u } className="capitalize">{ u }</option>
								) }

							</select>

						</div>

						<div className="w-full sm:w-2/3 sm:text-right flex justify-between sm:justify-end items-center gap-4">

							<span className="text-sm font-medium text-gray-500">Age in { unit || '...' }:</span>
							<span className="text-2xl font-bold text-indigo-600">
								{ ( dob && unit ) ? dob.until( Temporal.Now.plainDateISO(), { largestUnit: unit } )[ unit ] : '--' }
							</span>

						</div>

					</div>

				</div>

				<div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

					<div className="bg-linear-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100/50">

						<div className="flex items-center gap-2 mb-2">

							<Activity size={ 18 } className="stroke-emerald-600" />
							<h3 className="text-sm text-emerald-600 font-semibold uppercase tracking-wider">Total Days Lived</h3>

						</div>

						<p className="text-3xl font-bold text-gray-900 mt-2">
							{ dob ? dob.until( Temporal.Now.plainDateISO(), { largestUnit: 'days' } ).days.toLocaleString() : '--' }
						</p>

					</div>

					<div className="bg-linear-to-br from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-100/50">

						<div className="flex items-center gap-2 mb-2">

							<Clock size={ 18 } className="stroke-orange-600" />
							<h3 className="text-sm text-orange-600 font-semibold uppercase tracking-wider">Next Birthday</h3>

						</div>

						<p className="text-xl font-bold text-gray-900 mt-1">
							{ dob ? dob.add( { years: dob.until( Temporal.Now.plainDateISO(), { largestUnit: 'years' } ).years + 1 } ).toString() : '--' }
						</p>

						{ tillNextDob && <p className="text-sm font-medium text-gray-600 mt-2 bg-white/60 inline-block px-3 py-1 rounded-lg">
							In { tillNextDob.months }M, { tillNextDob.days }D
						</p> }

					</div>

				</div>

			</div>

		</div>

	</main>;

}