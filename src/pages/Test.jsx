import { ArrowLeft, FileQuestion, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {

	const navigate = useNavigate();

	return <main className="min-h-[87vh] bg-gray-50 font-sans py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center select-none">

		<div className="w-full max-w-md text-center">

			<div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100 p-8 sm:p-10 flex flex-col items-center">

				<div className="relative mb-6">

					<div className="size-24 bg-rose-50 rounded-3xl flex items-center justify-center border border-rose-100 shadow-sm">
						<FileQuestion size={ 48 } className="stroke-rose-500" />
					</div>

					<span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md">
						404
					</span>

				</div>

				<h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
					Page Not Found
				</h1>

				<p className="text-gray-500 text-sm mt-2 max-w-xs leading-relaxed">
					The page you are looking for doesn't exist or has been moved to another URL.
				</p>

				<div className="w-full flex flex-col sm:flex-row items-center gap-3 mt-8">

					<button
						type="button"
						className="w-full py-3 px-5 bg-rose-600 hover:bg-rose-700 rounded-xl shadow-lg shadow-rose-600/20 transition-all hover:shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer"
						onClick={ () => navigate( '/' ) }
					>

						<Home size={ 18 } className="stroke-white" />
						<span className="text-white font-semibold">Go to Home</span>

					</button>

					<button
						type="button"
						className="w-full py-3 px-5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
						onClick={ () => navigate( -1 ) }
					>

						<ArrowLeft size={ 18 } className="stroke-gray-700"/>
						<span className="text-gray-700 font-medium">Go Back</span>

					</button>

				</div>

			</div>

		</div>

	</main>;

}