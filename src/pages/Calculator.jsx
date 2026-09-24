import { Form, Formik } from "formik";

export default function Calculator() {

	return <main className="min-h-[88vh] pt-10">

		<Formik
			initialValues = { {
				calc: '1 + 1',
				history: ''
			} }
		>

			{ ( { values, setFieldValue, setValues } ) =>

				<Form className="w-3/7 mx-auto p-5 border">

					<section className="border border-gray-400 rounded-xl flex flex-col">

						<span className="ms-3 mt-3 text-gray-500">{ values.history || 'History' }</span>
						<input
							type="text"
							id="input-id-calc"
							name="calc"
							className="w-auto m-3 text-2xl text-end outline-none"
							value={ values.calc }
							onChange={ e => setFieldValue( 'calc', e.target.value ) }
						/>

					</section>
				
					{/* <input type="text" className="w-full h-15 p-2 outline-none ring-2 ring-gray-300 focus:ring-gray-500 rounded-md text-end" /> */}

					<section className="mt-5 flex justify-end gap-5">

						<button
							type="button"
							className="w-20 h-13 cursor-pointer hover:bg-gray-300 border border-gray-400 rounded-xl"
							onClick={ e => setFieldValue( 'calc', values.calc.slice( 0, -1 ) ) }
						>{ '<-' }</button>
						<button
							type="button"
							className="w-20 h-13 cursor-pointer hover:bg-gray-300 border border-gray-400 rounded-xl"
							onClick={ e => setFieldValue( 'calc', '' ) }
						>Clear</button>

						<button
							type="button"
							className="w-20 h-13 cursor-pointer hover:bg-gray-300 border border-gray-400 rounded-xl"
							onClick={ e => setValues( { calc: '', history: '' } ) }
						>AC</button>

					</section>

					<section className="mt-5 flex gap-5">

						<section className="w-2/3 grid grid-cols-3 gap-5 h-70">
						
							<button
								type="button"
								className="border border-gray-400 rounded-xl cursor-pointer hover:bg-gray-300"
								onClick={ () => setFieldValue( 'calc', values.calc + '7' ) }
							>7</button>
							<button
								type="button"
								className="border border-gray-400 rounded-xl cursor-pointer hover:bg-gray-300"
								onClick={ () => setFieldValue( 'calc', values.calc + '8' ) }
							>8</button>
							<button
								className="border border-gray-400 rounded-xl cursor-pointer hover:bg-gray-300"
								onClick={ () => setFieldValue( 'calc', values.calc + '9' ) }
							>9</button>

							<button
								className="border border-gray-400 rounded-xl cursor-pointer hover:bg-gray-300"
								onClick={ () => setFieldValue( 'calc', values.calc + '4' ) }
							>4</button>
							<button
								type="button"
								className="border border-gray-400 rounded-xl cursor-pointer hover:bg-gray-300"
								onClick={ () => setFieldValue( 'calc', values.calc + '5' ) }
							>5</button>
							<button
								type="button"
								className="border border-gray-400 rounded-xl cursor-pointer hover:bg-gray-300"
								onClick={ () => setFieldValue( 'calc', values.calc + '6' ) }
							>6</button>

							<button
								type="button"
								className="border border-gray-400 rounded-xl cursor-pointer hover:bg-gray-300"
								onClick={ () => setFieldValue( 'calc', values.calc + '1' ) }
							>1</button>
							<button
								type="button"
								className="border border-gray-400 rounded-xl cursor-pointer hover:bg-gray-300"
								onClick={ () => setFieldValue( 'calc', values.calc + '2' ) }
							>2</button>
							<button
								type="button"
								className="border border-gray-400 rounded-xl cursor-pointer hover:bg-gray-300"
								onClick={ () => setFieldValue( 'calc', values.calc + '3' ) }
							>3</button>

							<button
								type="button"
								className="col-span-2 border border-gray-400 rounded-xl cursor-pointer hover:bg-gray-300"
								onClick={ () => setFieldValue( 'calc', values.calc + '0' ) }
							>0</button>
							<button
								type="button"
								className="border border-gray-400 rounded-xl cursor-pointer hover:bg-gray-300"
								onClick={ () => setFieldValue( 'calc', values.calc + '.' ) }
							>.</button>
						
						</section>
						<section className="w-1/3 grid grid-cols-2 gap-5">

							<button className="border border-gray-400 rounded-xl cursor-pointer hover:bg-gray-300">{ '(' }</button>
							<button className="border border-gray-400 rounded-xl cursor-pointer hover:bg-gray-300">{ ')' }</button>

							<button className="border border-gray-400 rounded-xl cursor-pointer hover:bg-gray-300">*</button>
							<button className="border border-gray-400 rounded-xl cursor-pointer hover:bg-gray-300">/</button>

							<button className="border border-gray-400 rounded-xl cursor-pointer hover:bg-gray-300">+</button>
							<button className="border border-gray-400 rounded-xl cursor-pointer hover:bg-gray-300">-</button>

							<button className="col-span-2 border border-gray-400 rounded-xl cursor-pointer hover:bg-gray-300">Enter</button>
						
						</section>

					</section>
				
				</Form>

			}

		</Formik>

	</main>;

}