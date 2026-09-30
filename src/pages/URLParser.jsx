import { ArrowLeft } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function URLParser() {

	const navigate = useNavigate();
	const [ loading, setLoading ] = useState( false );
	const [ string, setString ] = useState( '' );
	const [ tab, setTab ] = useState( 'parser' );
	const [ mode, setMode ] = useState( 'encode' );
	const [ value, setValue ] = useState( null );

	useEffect( () => {

		setValue( null );

		if ( tab === 'parser' && string !== '' ) {

			setMode( 'encode' );
			setLoading( true );

			try {

				const url = new URL( string.trim() );

				const params = {};
				url.searchParams.forEach( ( value, key ) => {
					params[ key ] = value;
				} );
				setValue( {
					protocol: url.protocol,
					hostname: url.hostname,
					port: url.port || '(default)',
					pathname: url.pathname,
					hash: url.hash || '(none)',
					origin: url.origin,
					queryParams: params,
				} );

			} catch ( error ) {
				console.error( error );
			} finally {
				setLoading( false );
			}

		}

		if ( tab === 'decoder' ) {

			setLoading( true );

			try {

				if ( mode === 'encode' )
					setValue( encodeURIComponent( string ).replace( /[!'()*]/g,  c => `%${ c.charCodeAt( 0 ).toString( 16 ).toUpperCase() }` ) );
				else if ( mode === 'decode' )
					setValue( decodeURIComponent( string ) );
				else
					throw new Error();

			} catch ( error ) {

				console.error( error );
				setValue( 'Invalid' );

			} finally {
				setLoading( false );
			}

		}

	}, [ tab, string, mode ] );

	return <main className="min-h-[88vh] pt-10">

		<button
			type="button"
			className="p-2 ms-50 bg-slate-600 hover:bg-slate-700 border border-slate-300 hover:border-slate-400 rounded-xl cursor-pointer"
			onClick={ () => navigate( '/', { replace: true } ) }
		>
			<ArrowLeft size={ 20 } color="white" />
		</button>

		<section className="w-3/7 mx-auto p-5 flex flex-col gap-5">

			<h1 className="text-3xl text-center font-semibold">URL Parser</h1>

			<section className="w-full p-5 border border-gray-300 rounded-xl flex flex-col">

				<label htmlFor="input-string" className="text-xs select-none">{ tab === 'parser' ? 'URL' : 'String' }</label>
				<textarea
					id="input-string"
					className="text-lg border-b border-gray-400 outline-none focus:border-b-2 field-sizing-content min-h-6 resize-none overflow-hidden"
					value={ string }
					onChange={ e => setString( e.target.value ) }
					readOnly={ loading }
				/>

				{ !!string && <button className="w-fit mt-1 cursor-pointer hover:text-blue-600" onClick={ () => setString( '' ) }>clear</button> }

			</section>

			<section className="w-full grid grid-cols-2 gap-5">

				<input
					type="radio"
					id="radio-parser"
					className="sr-only"
					checked={ tab === 'parser' }
					onChange={ e => { if ( e.target.checked ) setTab( 'parser' ); } }
				/>

				<label
					htmlFor="radio-parser"
					className={ `p-2 rounded-md select-none text-white ${ tab === 'parser' ? 'bg-blue-500' : 'bg-blue-300 hover:bg-blue-400' } cursor-pointer select-none` }
				>Parser</label>

				<input
					type="radio"
					id="radio-decoder"
					className="sr-only"
					checked={ tab === 'decoder' }
					onChange={ e => { if ( e.target.checked ) setTab( 'decoder' ); } }
				/>

				<label
					htmlFor="radio-decoder"
					className={ `p-2 rounded-md select-none text-white ${ tab === 'decoder' ? 'bg-blue-500' : 'bg-blue-300 hover:bg-blue-400' } cursor-pointer select-none` }
				>Decoder</label>

			</section>

			<section className="p-5 border border-gray-300 rounded-xl grid grid-cols-2 gap-5">

				{ tab === 'parser' && <>

					<section className="p-2 border border-gray-300 rounded-lg flex flex-col">

						<span className="text-xs text-gray-600 select-none">Protocol / Scheme</span>
						<span className="text-lg min-h-7 wrap-break-word">{ value?.protocol }</span>

					</section>

					<section className="p-2 border border-gray-300 rounded-lg flex flex-col">

						<span className="text-xs text-gray-600 select-none">Hostname / Domain</span>
						<span className="text-lg min-h-7 wrap-break-word">{ value?.hostname }</span>

					</section>

					<section className="p-2 border border-gray-300 rounded-lg flex flex-col">

						<span className="text-xs text-gray-600 select-none">Path Length</span>
						<span className="text-lg min-h-7 wrap-break-word">{ value?.pathname?.slice( 1 ).split( '/' ).length }</span>

					</section>

					<section className="p-2 border border-gray-300 rounded-lg flex flex-col">

						<span className="text-xs text-gray-600 select-none">Query Params Count</span>
						<span className="text-lg min-h-7 wrap-break-word">{ value?.queryParams && Object.keys( value.queryParams ).length }</span>

					</section>

					<section className="p-2 border border-gray-300 rounded-lg flex flex-col">

						<span className="text-xs text-gray-600 select-none">Hash / Anchor</span>
						<span className="text-lg min-h-7 wrap-break-word">{ value?.hash }</span>

					</section>

					<section className="p-2 border border-gray-300 rounded-lg flex flex-col">

						<span className="text-xs text-gray-600 select-none">Calculated Origin</span>
						<span className="text-lg min-h-7 wrap-break-word">{ value?.origin }</span>

					</section>

					<section className="col-span-full p-2 border border-gray-300 rounded-lg flex flex-col">

						<span className="text-xs text-gray-600 select-none">Paths</span>
						{ value?.pathname?.slice( 1 ).split( '/' ).map( ( path, idx ) => <section key={ `path-${ idx + 1 }` } className="flex">

							<span className="w-1/12 text-lg wrap-break-word">{ `${ idx + 1 })` }</span>
							<span className="grow text-lg wrap-break-word">{ path }</span>

						</section> ) || <span className="min-h-7"/> }

					</section>

					<section className="col-span-full p-2 border border-gray-300 rounded-lg grid grid-cols-3">

						<span className="col-span-full mb-2 text-xs text-gray-600 select-none">Query Parameters</span>
						{ value?.queryParams ? Object.entries( value.queryParams ).map( ( param, idx ) => <Fragment key={ `path-${ idx + 1 }` }>

							<span className="text-lg text-blue-500">{ param[ 0 ] }</span>
							<span className="col-span-2 text-lg min-h-7">{ param[ 1 ] }</span>

						</Fragment> ) : <span className="min-h-7"/> }

					</section>

				</> }

				{ tab === 'decoder' && <>

					<section className="flex gap-5 items-center">

						<input
							type="radio"
							id="radio-encode"
							className="size-5 cursor-pointer"
							checked={ mode === 'encode' }
							onChange={ e => { if ( e.target.checked ) setMode( 'encode' ); } }
						/>
						<label htmlFor="radio-encode" className="grow cursor-pointer select-none">Encode</label>

					</section>

					<section className="flex gap-5 items-center">

						<input
							type="radio"
							id="radio-decode"
							className="size-5 cursor-pointer"
							checked={ mode === 'decode' }
							onChange={ e => { if ( e.target.checked ) setMode( 'decode' ); } }
						/>
						<label htmlFor="radio-decode" className="grow cursor-pointer select-none">Decode</label>

					</section>

					<section className="col-span-full flex flex-col">

						<label htmlFor="input-string" className="text-xs select-none">Answer</label>
						<textarea
							id="Answer"
							className="text-lg border-b border-gray-400 outline-none focus:border-b-2 field-sizing-content min-h-6 resize-none overflow-hidden"
							value={ value || '' }
							readOnly={ true }
						/>

					</section>

				</> }
			
			</section>

		</section>

	</main>;

}