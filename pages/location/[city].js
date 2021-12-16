import Head from 'next/head';
import React from 'react'
import TodaysWeather from '../../components/TodaysWeather';
import cities from '../../lib/city.list.json'


export async function getServerSideProps(context) {
    const city = getCity(context.params.city);

    // console.log(city)
    if (!city) {
        return {
            notFound: true,
        };
    }
    // console.log(process.env.API_KEY)
     
    const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${process.env.API_KEY}&exclude=minutely&units=metric`)

    const data = await res.json();

    if (!data) {
        return {
          notFound: true,
        };
      }

    // console.log(data);

    // const slug = context.params.city;

    const hourlyWeather = getHourlyWeather(data.hourly);
    // console.log(hourlyWeather)
    return {
        props: {
            city: city,
            currentWeather: data.current,
            dailyWeather: data.daily,
            hourlyWeather: hourlyWeather,
        },
    };
}
const getCity = param => {
    const cityParam = param.trim();
    // get the id of the city
    const splitCity = cityParam.split("-");
    // console.log(splitCity);
    const id = splitCity[splitCity.length -1];
    // console.log(id)

    if (!id) {
        return null;
    }

    const city = cities.find((city) => city.id.toString() == id);

    if (city) {
        return city;
    } else {
        return null;
    }
}

const getHourlyWeather = (hourlyData) => {
    const current = new Date();
    current.setHours(current.getHours(), 0, 0, 0);
    const tomorrow = new Date(current);
    tomorrow.setHours(0,0,0,0);

    // divide by 1000 to gey timeStamp in seconds
    const currentTimeStamp = Math.floor(current.getTime()/1000);
    const tomorrowTimeStamp = Math.floor(tomorrow.getTime()/ 1000);

    const todaysData = hourlyData.filter((data) => data.dt < tomorrowTimeStamp)

    return todaysData;
}



export default function City({ 
    hourlyWeather,
    currentWeather, 
    dailyWeather,
    city }) {
    // console.log(hourlyWeather);
    // console.log(currentWeather)
    // console.log(city)
    // console.log(dailyWeather)
    return (
      <div>
          <Head>
              <title>{city.name} Next Weather</title>
          </Head>
          <div className="page-wrapper">
              <div className="container">
                  <TodaysWeather city={city} weather={dailyWeather[0]} />
              </div>
          </div>
      </div>
    )
}
