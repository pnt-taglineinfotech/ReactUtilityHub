import { Form, Formik } from "formik";
import { ArrowLeft, ChevronUp, Delete, Divide, Dot, Minus, Plus, Radical, X } from "lucide-react";
import { useState } from "react";
import { Alert } from "../assets/components/PopUps";
import { useNavigate } from "react-router-dom";

export default function Calculator() {

	const [ alert, setAlert ] = useState( { show: false } );
	const navigate = useNavigate();

	return <main className="min-h-[88vh] pt-10">

		<button
			type="button"
			className="p-2 ms-50 bg-slate-600 hover:bg-slate-700 border border-slate-300 hover:border-slate-400 rounded-xl cursor-pointer"
			onClick={ () => navigate( '/', { replace: true } ) }
		>
			<ArrowLeft size={ 20 } color="white" />
		</button>

		<Formik
			initialValues={ {
				calc: '',
				history: ''
			} }
			onSubmit={ ( values, { setValues, setFieldValue, setSubmitting } ) => {

				setSubmitting( true );

				if ( !/^([-+]?\d+(?:\.\d+)?)([\+\-\×\÷\^\√])(\d+(?:\.\d+)?)$/.test( values.calc ) ) {

					setAlert( {
						show: true, 
						title: 'Failure',
						message: "Only Two Operands and One Operator is allowed!",
						variant: 'danger',
						buttontext: 'Ok',
						action: () => setAlert( { show: false } )
					} );
					return;

				}

				const operator = values.calc[ values.calc.search( /[\+\-\×\÷\^\√]/ ) ];
				const [ firstOperand, secondOperand ] = values.calc.split( /[\+\-\×\÷\^\√]/ ).slice( 0, 2 );

				const factor = 10 ** Math.max( ( firstOperand.split( '.' )[ 1 ] || '' ).length || 1, ( secondOperand.split( '.' )[ 1 ] || '' ).length || 1 );

				const firstNum = parseFloat( firstOperand ) * factor,
				secondNum = parseFloat( secondOperand ) * factor;
				
				if ( operator === '+' )
					setFieldValue( 'calc', String( ( firstNum + secondNum ) / factor ) );
				else if ( operator === '-' )
					setFieldValue( 'calc', String( ( firstNum - secondNum ) / factor ) );
				else if ( operator === '×' )
					setFieldValue( 'calc', String( ( firstNum * secondNum ) / ( factor ** 2 ) ) );
				else if ( operator === '÷' )
					setFieldValue( 'calc', String( firstNum / secondNum ) );
				else if ( operator === '^' )
					setFieldValue( 'calc', String( Math.pow( firstOperand, secondOperand ) ) );
				else if ( operator === '√' )
					setFieldValue( 'calc', String( Math.pow( secondOperand, ( 1 / firstOperand ) ) ) );

				setFieldValue( 'history', values.calc );
				setSubmitting( false );

			} }
		>

			{ ( { values, setFieldValue, setValues, isSubmitting } ) =>  <Form className="w-2/6 mx-auto p-5 bg-slate-400 border border-gray-400 rounded-xl">

				<section className="bg-white border border-gray-400 rounded-xl flex flex-col">

					<span className="ms-3 mt-3 text-gray-500 cursor-pointer" onClick={ () => setFieldValue( 'calc', values.history ) }>{ values.history || 'History' }</span>
					<input
						type="text"
						id="input-id-calc"
						name="calc"
						className="w-auto m-3 text-2xl text-end outline-none"
						value={ values.calc }
						onChange={ e => setFieldValue( 'calc', e.target.value.replace( '*', '×' ).replace( '/', '÷' ).replace( '××', '^' ) ) }
						readOnly={ isSubmitting }
					/>

				</section>

				<section className="mt-5 flex justify-end gap-5">

					<button
						type="button"
						className="w-20 h-13 cursor-pointer bg-white hover:bg-gray-300 border border-gray-400 rounded-xl flex justify-center items-center"
						onClick={ () => setFieldValue( 'calc', values.calc.slice( 0, -1 ) ) }
						disabled={ isSubmitting }
					><Delete strokeWidth={ 1.5 }/></button>

					<button
						type="button"
						className="w-20 h-13 cursor-pointer bg-white hover:bg-gray-300 border border-gray-400 rounded-xl"
						onClick={ () => setFieldValue( 'calc', '' ) }
						disabled={ isSubmitting }
					>Clear</button>

					<button
						type="button"
						className="w-20 h-13 cursor-pointer bg-white hover:bg-red-600 border border-gray-400 rounded-xl hover:text-white"
						onClick={ () => setValues( { calc: '', history: '' } ) }
						disabled={ isSubmitting }
					>AC</button>

				</section>

				<section className="mt-5 flex gap-5">

					<section className="w-2/3 grid grid-cols-3 gap-5 h-70">

						{ [ '7', '8', '9', '4', '5', '6', '1', '2', '3', '0' ].map( elt => <button
							key={ `button-${ elt }` }
							type="button"
							className={ `${ elt === '0' ? 'col-span-2' : '' } bg-blue-500 hover:bg-blue-600 border border-gray-400 rounded-xl text-white cursor-pointer` }
							onClick={ () => setFieldValue( 'calc', values.calc + elt ) }
							disabled={ isSubmitting }
						>{ elt }</button> ) }

						<button
							type="button"
							className="bg-blue-500 hover:bg-blue-600 border border-gray-400 rounded-xl cursor-pointer flex justify-center items-center"
							onClick={ () => setFieldValue( 'calc', values.calc ? values.calc + '.' : '0.' ) }
							disabled={ isSubmitting || values.calc.endsWith( '.' ) }
						><Dot color="white" strokeWidth={ 1.5 }/></button>

					</section>

					<section className="w-1/3 grid grid-cols-2 gap-5">

						<button
							type="button"
							className="bg-blue-500 hover:bg-blue-600 border border-gray-400 rounded-xl cursor-pointer flex justify-center items-center"
							onClick={ () => setFieldValue( 'calc', values.calc + '^' ) }
							disabled={ isSubmitting || values.calc.endsWith( '.' ) }
						><ChevronUp color="white" strokeWidth={ 1.5 }/></button>

						<button
							type="button"
							className="bg-blue-500 hover:bg-blue-600 border border-gray-400 rounded-xl cursor-pointer flex justify-center items-center"
							onClick={ () => setFieldValue( 'calc', values.calc + '√' ) }
							disabled={ isSubmitting || values.calc.endsWith( '.' ) }
						><Radical color="white" strokeWidth={ 1.5 }/></button>

						<button
							type="button"
							className="bg-blue-500 hover:bg-blue-600 border border-gray-400 rounded-xl cursor-pointer flex justify-center items-center"
							onClick={ () => setFieldValue( 'calc', values.calc + '×' ) }
							disabled={ isSubmitting || values.calc.endsWith( '.' ) }
						><X color="white" strokeWidth={ 1.5 }/></button>

						<button
							type="button"
							className="bg-blue-500 hover:bg-blue-600 border border-gray-400 rounded-xl cursor-pointer flex justify-center items-center"
							onClick={ () => setFieldValue( 'calc', values.calc + '÷' ) }
							disabled={ isSubmitting || values.calc.endsWith( '.' ) }
						><Divide color="white" strokeWidth={ 1.5 }/></button>

						<button
							type="button"
							className="bg-blue-500 hover:bg-blue-600 border border-gray-400 rounded-xl cursor-pointer flex justify-center items-center"
							onClick={ () => setFieldValue( 'calc', values.calc + '+' ) }
							disabled={ isSubmitting || values.calc.endsWith( '.' ) }
						><Plus color="white" strokeWidth={ 1.5 }/></button>

						<button
							type="button"
							className="bg-blue-500 hover:bg-blue-600 border border-gray-400 rounded-xl cursor-pointer flex justify-center items-center"
							onClick={ () => setFieldValue( 'calc', values.calc + '-' ) }
							disabled={ isSubmitting || values.calc.endsWith( '.' ) }
						><Minus color="white" strokeWidth={ 1.5 }/></button>

						<button
							type="submit"
							className="col-span-2 bg-blue-500 hover:bg-blue-600 border border-gray-400 rounded-xl text-white cursor-pointer"
							disabled={ isSubmitting || values.calc.endsWith( '.' ) }
						>Enter</button>

					</section>

				</section>

			</Form> }

		</Formik>
		
		{ alert.show && <Alert { ...alert } /> }

	</main>;

}