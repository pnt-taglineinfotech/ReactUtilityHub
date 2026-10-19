import { ArrowLeft, Copy, CopyCheck, Link2, FileCode2, RefreshCw, Layers, Database } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function URLParser() {

	const navigate = useNavigate();
	const [ loading, setLoading ] = useState( false );
	const [ string, setString ] = useState( '' );
	const [ tab, setTab ] = useState( 'parser' );
	const [ mode, setMode ] = useState( 'encode' );
	const [ parsedValue, setParsedValue ] = useState( null );
	const [ encodedValue, setEncodedValue ] = useState( '' );
	const [ copied, setCopied ] = useState( false );

	const handleTabChange = newTab => {

		setTab( newTab );
		setParsedValue( null );
		setEncodedValue( '' );

	};

	useEffect( () => {

		if ( tab === 'parser' ) {

			if ( !string.trim() ) {
				setParsedValue( null );
				return;
			}

			setLoading( true );
			try {

				const url = new URL( string.trim() );
				const params = {};
				url.searchParams.forEach( ( val, key ) => {
					params[ key ] = val;
				} );

				setParsedValue( {
					protocol: url.protocol,
					hostname: url.hostname,
					port: url.port || '(default)',
					pathname: url.pathname,
					hash: url.hash || '(none)',
					origin: url.origin,
					queryParams: params,
				} );

			} catch ( error ) {
				setParsedValue( null );
			} finally {
				setLoading( false );
			}

		}

		if ( tab === 'decoder' ) {

			if ( !string ) {

				setEncodedValue( '' );
				return;

			}

			setLoading( true );
			try {

				if ( mode === 'encode' ) {
					setEncodedValue( encodeURIComponent( string ).replace( /[!'()*]/g, c => `%${ c.charCodeAt( 0 ).toString( 16 ).toUpperCase() }` ) );
				} else if ( mode === 'decode' ) {
					setEncodedValue( decodeURIComponent( string ) );
				}

			} catch ( error ) {
				setEncodedValue( 'Invalid Input' );
			} finally {
				setLoading( false );
			}
		}

	}, [ tab, string, mode ] );

	const copyToClipboard = async text => {

		if ( !text )
			return;

		try {

			await navigator.clipboard.writeText( text );
			setCopied( true );
			setTimeout( () => setCopied( false ), 2000 );

		} catch ( err ) {
			console.error( err );
		}

	};

	const pathSegments = parsedValue?.pathname ? parsedValue.pathname.slice( 1 ).split( '/' ).filter( Boolean ) : [];

	return <main className="min-h-[86.1vh] bg-gray-50 text-gray-800 font-sans py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">

		<div className="w-full max-w-2xl">

			<div className="flex items-center justify-between mb-8">

				<button
					type="button"
					className="p-2 bg-white hover:bg-gray-100 shadow-sm border border-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
					onClick={ () => navigate( '/', { replace: true } ) }
					aria-label="Go back"
				>
					<ArrowLeft size={ 20 } className="stroke-gray-600" />
				</button>

				<h1 className="flex items-center gap-2">

					<Link2 size={ 26 } className="stroke-cyan-600" />
					<span className="text-2xl font-bold text-gray-900 tracking-tight">URL Parser & Encoder</span>

				</h1>

				<div className="w-9" />

			</div>

			<div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">

				<div className="p-6 sm:p-8 bg-cyan-50/40 border-b border-gray-100 flex flex-col gap-6">

					<div className="grid grid-cols-2 p-1.5 bg-gray-200/70 rounded-2xl gap-1">

						<button
							type="button"
							className={ `py-2.5 text-sm font-bold rounded-xl transition-all ${
								tab === 'parser' ?
									'bg-white text-cyan-900 shadow-sm'
								:
									'text-gray-600 hover:text-gray-900'
							}` }
							onClick={ () => handleTabChange( 'parser' ) }
						>
							URL Parser
						</button>

						<button
							type="button"
							className={ `py-2.5 text-sm font-bold rounded-xl transition-all ${
								tab === 'decoder' ?
									'bg-white text-cyan-900 shadow-sm'
								:
									'text-gray-600 hover:text-gray-900'
							}` }
							onClick={ () => handleTabChange( 'decoder' ) }
						>
							Encode / Decode
						</button>

					</div>

					<div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-cyan-500 transition-shadow">

						<div className="flex justify-between items-center mb-2">

							<label htmlFor="input-string" className="flex items-center gap-1.5">

								<FileCode2 size={ 14 } className="stroke-gray-500" />
								<span className="text-xs font-bold uppercase tracking-wider text-gray-500">Enter { tab === 'parser' ? 'URL' : 'String' }</span>

							</label>

							{ string && <button
								type="button"
								className="flex items-center gap-1 group"
								onClick={ () => setString( '' ) }
							>

								<RefreshCw size={ 12 } className="stroke-gray-400 group-hover:stroke-red-500 transition-colors" />
								<span className="text-xs text-gray-400 group-hover:text-red-500 transition-colors">Clear</span>

							</button> }

						</div>

						<textarea
							id="input-string"
							placeholder={ tab === 'parser' ? 'https://example.com/path?key=value#hash' : 'Type or paste text here...' }
							className="w-full text-base font-mono text-gray-800 bg-transparent outline-none resize-none min-h-17.5"
							value={ string }
							onChange={ e => setString( e.target.value ) }
							readOnly={ loading }
						/>

					</div>

				</div>

				<div className="p-6 sm:p-8">

					{ tab === 'parser' && <div>

						{ !parsedValue ? <div className="py-10 flex flex-col items-center gap-2">

								<Link2 size={ 40 } className="stroke-1 stroke-cyan-200" />
								<p className="text-sm text-center text-gray-400 font-medium">Enter a valid URL above to inspect its parameters and structure.</p>

							</div>
						:
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

								<div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80">

									<span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Protocol</span>
									<p className="text-base font-mono font-bold text-cyan-700 truncate mt-1">{ parsedValue.protocol || '--' }</p>

								</div>

								<div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80">

									<span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Hostname</span>
									<p className="text-base font-mono font-bold text-gray-800 truncate mt-1">{ parsedValue.hostname || '--' }</p>

								</div>

								<div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80">

									<span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Origin</span>
									<p className="text-base font-mono font-semibold text-gray-700 truncate mt-1">{ parsedValue.origin || '--' }</p>

								</div>

								<div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80">

									<span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Hash / Anchor</span>
									<p className="text-base font-mono font-semibold text-gray-700 truncate mt-1">{ parsedValue.hash || '(none)' }</p>

								</div>

								<div className="col-span-full bg-gray-50 p-5 rounded-2xl border border-gray-200/80">

									<div className="flex items-center gap-1.5 mb-3">

										<Layers size={ 14 } className="stroke-cyan-600" />
										<span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Path Segments ( { pathSegments.length } )</span>

									</div>

									{ pathSegments.length > 0 ?

										<div className="flex flex-col gap-2">

											{ pathSegments.map( ( path, idx ) => <div key={ `path-${ idx }` } className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-200/60 font-mono text-sm">

												<span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md">/{ idx + 1 }</span>
												<span className="text-gray-800 truncate">{ path }</span>

											</div> ) }

										</div>

									:
										<p className="text-sm text-gray-400 font-mono">/ (root path)</p>
									}

								</div>

								<div className="col-span-full bg-gray-50 p-5 rounded-2xl border border-gray-200/80">

									<div className="flex items-center justify-between mb-3">

										<div className="flex items-center gap-1.5">

											<Database size={ 14 } className="stroke-cyan-600" />
											<span className="text-xs font-bold uppercase tracking-wider text-gray-500">Query Parameters ({ Object.keys( parsedValue.queryParams || {} ).length })</span>

										</div>

									</div>

									{ Object.keys( parsedValue.queryParams || {} ).length > 0 ?
										<div className="flex flex-col gap-2">

											{ Object.entries( parsedValue.queryParams ).map( ( [ paramKey, paramVal ], idx ) => <div key={ `param-${ idx }` } className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-xl border border-gray-200/60 font-mono text-sm gap-1 sm:gap-4">

												<span className="font-bold text-cyan-700 shrink-0">{ paramKey }</span>
												<span className="text-gray-600 truncate bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">{ paramVal }</span>

											</div> ) }

										</div>
									:
										<p className="text-sm text-gray-400 font-mono">No query parameters found</p>
									}

								</div>

							</div>

						}

					</div> }

					{ tab === 'decoder' && <div className="flex flex-col gap-6">

						<div className="flex gap-4 p-1.5 bg-gray-100 rounded-xl w-fit">

							<button
								type="button"
								className={ `px-5 py-2 text-xs font-bold rounded-lg transition-all ${
									mode === 'encode' ? 'bg-cyan-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
								}` }
								onClick={ () => setMode( 'encode' ) }
							>
								Encode Component
							</button>

							<button
								type="button"
								className={ `px-5 py-2 text-xs font-bold rounded-lg transition-all ${
									mode === 'decode' ? 'bg-cyan-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
								}` }
								onClick={ () => setMode( 'decode' ) }
							>
								Decode Component
							</button>

						</div>

						<div className="bg-slate-900 p-5 rounded-2xl flex flex-col gap-3 relative overflow-hidden">

							<div className="flex items-center justify-between">

								<span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Result</span>

								{ ( encodedValue && encodedValue !== 'Invalid Input' ) && <button
									type="button"
									className="flex items-center gap-1.5 group"
									onClick={ () => copyToClipboard( encodedValue ) }
								>

									{ copied ?
										<CopyCheck size={ 14 } className="stroke-cyan-400 group-hover:stroke-cyan-300 transition-colors" />
									:
										<Copy size={ 14 } className="stroke-cyan-400 group-hover:stroke-cyan-300 transition-colors" />
									}
									<span className="text-xs text-cyan-400 group-hover:text-cyan-300 font-medium transition-colors">Co{ copied ? 'pied!' : 'py Result' }</span>

								</button> }

							</div>

							<div className="font-mono text-cyan-300 text-base break-all min-h-15">
								{ encodedValue || <span className="text-slate-600 italic">Result will appear here...</span> }
							</div>

						</div>

					</div> }

				</div>

			</div>

		</div>

	</main>;

}