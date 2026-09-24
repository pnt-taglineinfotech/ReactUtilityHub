import {} from 'react';
import { utilities } from '../assets/js/common';
import { Link } from 'react-router-dom';

export default function Home() {

	return <main className="min-h-[88vh] pt-10">

		<section className="mx-auto w-4/5 border p-5 grid grid-cols-1 md:grid-cols-3 gap-5">

			{ utilities.map( ( utility, idx ) => <Link
				key={ `utility-${ idx + 1 }` }
				to={ utility[ 1 ] }
				className="h-35 border border-gray-400 rounded-2xl text-center content-center hover:-translate-y-0.5 shadow-xl hover:shadow-gray-400 cursor-pointer"
			>{ utility[ 0 ] }</Link> ) }

		</section>

	</main>;

}