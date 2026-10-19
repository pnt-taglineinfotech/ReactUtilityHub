import { useEffect, useRef } from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

const dialogVariant = {
	default: {
		bg: 'bg-white',
		border: 'border-indigo-100',
		text: 'text-indigo-600',
		iconBg: 'bg-indigo-50',
		iconColor: 'stroke-indigo-600',
		btn: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20',
		Icon: Info
	},
	success: {
		bg: 'bg-white',
		border: 'border-emerald-100',
		text: 'text-emerald-600',
		iconBg: 'bg-emerald-50',
		iconColor: 'stroke-emerald-600',
		btn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20',
		Icon: CheckCircle2
	},
	danger: {
		bg: 'bg-white',
		border: 'border-red-100',
		text: 'text-red-600',
		iconBg: 'bg-red-50',
		iconColor: 'stroke-red-600',
		btn: 'bg-red-600 hover:bg-red-700 shadow-red-600/20',
		Icon: XCircle
	},
	warning: {
		bg: 'bg-white',
		border: 'border-amber-100',
		text: 'text-amber-600',
		iconBg: 'bg-amber-50',
		iconColor: 'stroke-amber-600',
		btn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20',
		Icon: AlertTriangle
	}
};

export function Alert( { show = false, title, message, variant = 'default', buttontext = 'Ok', action = () => {} } ) {

	const dialogRef = useRef( null );

	useEffect( () => {

		if ( show )
			dialogRef.current?.showModal();
		else
			dialogRef.current?.close();

	}, [ show ] );

	const { text, btn, iconBg, iconColor, border, Icon } = dialogVariant[ variant ] || dialogVariant.default;

	return <dialog 
		ref={ dialogRef }
		className={ `m-auto p-0 border ${ border } rounded-3xl w-11/12 max-w-md bg-white shadow-2xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm select-none transition-all` }
	>

		{ show && <div className="p-6 sm:p-8 flex flex-col items-center text-center">

			<div className={ `p-3.5 rounded-2xl ${ iconBg } mb-4 shadow-sm` }>
				<Icon size={ 32 } className={ iconColor } />
			</div>

			<h3 className={ `text-xl font-bold tracking-tight ${ text } mb-2` }>
				{ title || 'Alert' }
			</h3>

			<p className="text-sm font-medium text-gray-500 leading-relaxed mb-6">
				{ message || 'This alert does not have a message.' }
			</p>

			<button
				type="button"
				className={ `w-full py-3 px-6 text-sm font-semibold text-white rounded-xl ${ btn } shadow-lg transition-all cursor-pointer focus:outline-none` }
				onClick={ () => {
					action();
					dialogRef.current?.close();
				} }
			>
				{ buttontext }
			</button>

		</div> }

	</dialog>;

}

export function Confirm( { show = false, title, message, variant = 'default', buttontext = 'Ok', action = () => {}, cancel = () => {} } ) {

	const dialogRef = useRef( null );

	useEffect( () => {

		if ( show )
			dialogRef.current?.showModal();
		else
			dialogRef.current?.close();

	}, [ show ] );

	const { text, btn, iconBg, iconColor, border, Icon } = dialogVariant[ variant ] || dialogVariant.default;

	return <dialog 
		ref={ dialogRef }
		className={ `m-auto p-0 border ${ border } rounded-3xl w-11/12 max-w-md bg-white shadow-2xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm select-none transition-all` }
	>

		{ show && <div className="p-6 sm:p-8 flex flex-col items-center text-center">

			<div className={ `p-3.5 rounded-2xl ${ iconBg } mb-4 shadow-sm` }>
				<Icon size={ 32 } className={ iconColor } />
			</div>

			<h3 className={ `text-xl font-bold tracking-tight ${ text } mb-2` }>
				{ title || 'Confirm Action' }
			</h3>

			<p className="text-sm font-medium text-gray-500 leading-relaxed mb-6">
				{ message || 'Are you sure you want to proceed with this action?' }
			</p>

			<div className="w-full flex items-center gap-3">

				<button
					type="button"
					className="flex-1 py-3 px-4 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors cursor-pointer focus:outline-none"
					onClick={ () => {

						cancel();
						dialogRef.current?.close();

					} }
				>
					Cancel
				</button>

				<button
					type="button"
					className={ `flex-1 py-3 px-4 text-sm font-semibold text-white rounded-xl ${ btn } shadow-lg transition-all cursor-pointer focus:outline-none` }
					onClick={ () => {

						action();
						dialogRef.current?.close();

					} }
				>
					{ buttontext }
				</button>

			</div>

		</div> }

	</dialog>;

}