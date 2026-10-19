import { Link } from 'react-router-dom';
import { ArrowRight, Wrench } from 'lucide-react';
import { utilities } from '../assets/js/common';

export default function Home() {

	return <main className="min-h-screen bg-gray-50 text-gray-800 font-sans py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center select-none">

		<div className="w-full max-w-5xl">

			<header className="text-center mb-12 flex flex-col items-center">

				<div className="p-3 bg-indigo-50 rounded-2xl mb-4 border border-indigo-100 shadow-sm">
					<Wrench size={ 32 } className="stroke-indigo-600"/>
				</div>

				<h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
					Utility Toolbox
				</h1>

				<p className="text-gray-500 mt-2 text-base max-w-md">
					Everyday tools, calculators, and converters organized in one place.
				</p>

			</header>

			<section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

				{ utilities.map( ( utility, idx ) => {

					const Icon = utility[ 2 ];

					return <Link
						key={ `utility-${ idx + 1 }` }
						to={ utility[ 1 ] }
						className="group bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
					>

						<div>

							<div className="flex items-center justify-between mb-4">

								<div className="p-3 bg-gray-50 group-hover:bg-indigo-50 rounded-2xl transition-colors">
									<Icon size={ 24 } className="stroke-gray-600 group-hover:stroke-indigo-600 transition-colors" />
								</div>

								<ArrowRight 
									size={ 18 } 
									className="stroke-gray-300 group-hover:stroke-indigo-600 group-hover:translate-x-1 transition-all" 
								/>

							</div>

							<h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{ utility[ 0 ] }</h2>

						</div>

						<div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">

							<span className="text-xs font-semibold text-gray-400 group-hover:text-indigo-500 uppercase tracking-wider transition-colors">
								Open Tool
							</span>

						</div>

					</Link>;

				} ) }

			</section>

		</div>

	</main>;

}