import React from 'react'
import cities from "../lib/city.list.json";

export default function SearchBox() {
    const [ query, setQuery ] = React.useState("");
    const [ results, setResults ] = React.useState([]);

    const onChange = (e) => {
        const { value } = e.target;
        setQuery(value);

        let matchingCities = [];

        if (value.length > 3)  {
            for (let city of cities) {
                if (matchingCities.length >= 5) {
                    break;
                }
    
                const match = city.name.toLowerCase().startsWith(value.toLowerCase());
    
                if (match) {
                    matchingCities.push(city)
                }
            }
       }
    //    console.log(matchingCities);
       return setResults(matchingCities);
   
    }
    return (
        <div className='search'>
            <input 
              type="text"
              value={query}
              onChange={onChange}
            />

            {/*  */}
        </div>
    )
}
