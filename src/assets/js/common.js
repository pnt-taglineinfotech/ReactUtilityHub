import { Calculator, Calendar, CloudSun, Coins, Dices, Film, Hourglass, KeyRound, Link2, Ruler, Timer } from "lucide-react";

export const utilities = [
    [ 'Calculator', '/calculator', Calculator ],
    [ 'Age Calculator', '/age-calculator', Calendar ],
    [ 'Unit Converter', '/unit-converter', Ruler ],
    [ 'Currency Converter', '/currency-converter', Coins ],
    [ 'Weather Forcast', '/weather-forcast', CloudSun ],
    [ 'Stopwatch', '/stopwatch', Timer ],
    [ 'Timer', '/timer', Hourglass ],
    [ 'Password Generator', '/password-generator', KeyRound ],
    [ 'Dice Roller', '/dice-roller', Dices ],
    [ 'URL Parser', '/url-parser', Link2 ],
    [ 'Movie Search', '/movie-search', Film ]
];

export const units = {
    Length: {
        Millimeter: 1,
        Centimeter: 10,
        Meter: 1000,
        Kilometer: 1000000,
        Mile: 1609344,
        Foot: 304.8,
        Inch: 25.4
    },
    Weight: {
        Gram: 1,
        Kilogram: 1000,
        Pound: 453.59237,
        Ounce: 28.349523125
    },
    Temperature: {
        Celsius: 1,
        Fahrenheit: 33.8,
        Kelvin: 274.15
    },
    Time: {
        Seconds: 1,
        Minutes: 60,
        Hours: 3600,
        Days: 86400
    }
};

const MovieAPI = new URL( 'https://www.omdbapi.com' );
MovieAPI.searchParams.append( 'apikey', import.meta.env.VITE_MOVIE_API_KEY );
export { MovieAPI };