import Head from 'next/head';
import React from 'react'
import TodaysWeather from '../../components/TodaysWeather';
import cities from '../../lib/city.list.json'
import moment from 'moment-timezone'
import HourlyWeather from '../../components/HourlyWeather';
import WeeklyWeather from '../../components/WeeklyWeather';


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

    const hourlyWeather = getHourlyWeather(data.hourly, data.timezone);
    // console.log(hourlyWeather)
    return {
        props: {
            city: city,
            timezone: data.timezone,
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

const getHourlyWeather = (hourlyData, timezone) => {
     const endOfDay = moment().tz(timezone).endOf('day').valueOf();
     const eodTimeStamp = Math.floor(endOfDay / 1000)
    const todaysData = hourlyData.filter((data) => data.dt < eodTimeStamp)

    return todaysData;
}

export default function City({ 
    hourlyWeather,
    currentWeather, 
    dailyWeather,
    city,
    timezone
}) {
    console.log(hourlyWeather);
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
                  <TodaysWeather
                   city={city} 
                   weather={dailyWeather[0]}
                   timezone={timezone} />
                   <HourlyWeather hourlyWeather={hourlyWeather} timezone={timezone} />
                   <WeeklyWeather />
              </div>
          </div>
      </div>
    )
}
