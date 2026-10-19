import { Wrench } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {

	return <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
			
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

            <Link to="/" className="flex items-center gap-3 group transition-transform hover:-translate-y-0.5">

                <div className="p-2 bg-indigo-600 rounded-xl shadow-md shadow-indigo-600/20 group-hover:bg-indigo-500 transition-colors">
                    <Wrench size={ 20 } className="stroke-white" />
                </div>

                <h1 className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-cyan-500 tracking-tight">
                    React Utility Hub
                </h1>

            </Link>

        </div>

    </header>;

}