import { useEffect, useRef } from "react";

const dialogVariant = {
    default: {
        bg: 'bg-indigo-50 shadow-indigo-300',
        text: 'text-indigo-600',
        btn: 'bg-indigo-400 hover:bg-indigo-500'
    },
    success: {
        bg: 'bg-green-50 shadow-green-300',
        text: 'text-green-600',
        btn: 'bg-green-400 hover:bg-green-500'
    },
    danger: {
        bg: 'bg-red-50 shadow-red-300',
        text: 'text-red-600',
        btn: 'bg-red-400 hover:bg-red-500'
    },
    warning: {
        bg: 'bg-orange-50 shadow-orange-300',
        text: 'text-orange-600',
        btn: 'bg-orange-400 hover:bg-orange-500'
    }
};

export function Alert( { show = false, title, message, variant = 'default', buttontext = 'Ok', action = () => {} } ) {

    const dialogRef = useRef( null );

    useEffect( () => show ? dialogRef.current?.showModal() : dialogRef.current?.close(), [ show ] );

    const { text, btn, bg } = dialogVariant[ variant ] || dialogVariant.default;

    return <dialog className={ `m-auto p-5 border border-gray-300 rounded-3xl md:w-2/5 ${ bg } backdrop:backdrop-blur-xs select-none shadow-2xl` } ref={ dialogRef }>

        { show && <>

            <div className={ `text-3xl font-semibold text-center ${ text }` }>{ title || 'Alert' }</div>
            <div className="p-5">{ message || 'This alert do\'nt have a message.' }</div>
            <button
                className={ `block mx-auto text-lg ${ btn } text-white rounded-2xl px-4 py-2 cursor-pointer` }
                onClick={ () => {

                    action();
                    dialogRef.current?.close();
                
                } }
            >{ buttontext }</button>

        </> }

    </dialog>;

}

export function Confirm( { show = false, title, message, variant = 'default', buttontext = 'Ok', action = () => {}, cancel = () => {} } ) {

    const dialogRef = useRef( null );

    useEffect( () => show ? dialogRef.current?.showModal() : dialogRef.current?.close(), [ show ] );

    const { text, btn, bg } = dialogVariant[ variant ] || dialogVariant.default;

    return <dialog className={ `m-auto p-5 border border-gray-300 rounded-3xl md:w-2/5 ${ bg }` } ref={ dialogRef }>

        { show && <>

            <div className={ `text-3xl font-semibold text-center ${ text }` }>{ title || 'Alert' }</div>
            <div className="p-5">{ message || 'This alert do\'nt have a message.' }</div>
            <div className="w-full flex justify-around">

                <button
                    className="text-lg bg-gray-400 hover:bg-gray-500 text-white rounded-2xl px-4 py-2 cursor-pointer"
                    onClick={ () => {
                        
                        cancel();
                        dialogRef.current?.close();
                    
                    } }
                >Cancel</button>

                <button
                    className={ `text-lg ${ btn } text-white rounded-2xl px-4 py-2 cursor-pointer` }
                    onClick={ () => {

                        action();
                        dialogRef.current?.close();

                    } }
                >{ buttontext }</button>

            </div>

        </> }

    </dialog>;

}