import { Code2 } from "lucide-react";

export default function Footer() {

	return <footer className="mt-auto border-t border-gray-200/80 bg-white/60 backdrop-blur-md py-6 px-4">
			
		<div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-medium">

			<p className="flex items-center gap-1.5">

				<Code2 size={ 16 } className="stroke-indigo-600 shrink-0" />
				<span className="text-gray-500">Created by</span>
				<span className="font-bold text-gray-800 hover:text-indigo-600 transition-colors">
					Pranav Tondlekar
				</span>

			</p>

			<p className="text-gray-400 flex items-center gap-1">

				<span>© { Temporal.Now.plainDateISO().year } React Utility Hub.</span>
				<span className="hidden sm:inline">• All rights reserved.</span>

			</p>

		</div>

	</footer>;

}