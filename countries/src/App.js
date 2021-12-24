import React, { useState, useEffect} from 'react'
import axios from 'axios'


const Weather = ({country,weather}) => {
  if (country.length===0){
    return (<div></div>)
  }
  else{
    const uri="http://openweathermap.org/img/w/"+weather.weather[0].icon+".png"
    return (<div>
    <h2>Weather in {country.capital}</h2>
    <div>
    <strong>temperature:</strong> {weather.main.temp} Celcius
    </div>
    <img src={uri} width={100} alt='weather icons'/>
    <div>
      <strong>wind:</strong> {weather.wind.speed} meter/sec direction {weather.wind.deg}
    </div>
  </div>)
  }
}

const Country = ({country}) => {
  return (<div>
    <h1>{country.name}</h1>
    <div>capital {country.capital}</div>
    <div>population {country.population}</div>
    <h2>languages</h2>
    <ul>
      {country.languages.map(language=><li key={language.name}>{language.name}</li>)}
    </ul>
    <img src={country.flag} width={100} alt='Flag'/>
  </div>)
}

const CountriesToShow = ({countries,countryToDisplay,setCountryToDisplay,weather}) => {
  
  const handleShowClick = ({country})=> {
    return ()=> {
      setCountryToDisplay([country])}
  }

  if(countries.length>10){
    return <div>Too many countries, specify another filter</div>
  }
  else if (countries.length===1){
    if(weather.main===undefined){
      return (<div>
      <Country country={countries[0]}/>
    </div>)
    }
    else{
      return (<div>
        <Country country={countries[0]}/>
        <Weather country={countries[0]} weather={weather}/>
      </div>)
    }
  }
  else{
    if (countryToDisplay.length===0){
      return(<div>
      {countries.map(country=><div key={country.name}>{country.name} 
      <button type='button' onClick={handleShowClick({country})}>show</button></div>)}
      </div>)
    }
    else{
      if(weather.main===undefined){
        return(<div>
          {countries.map(country=><div key={country.name}>{country.name} <button type='button' onClick={handleShowClick({country})}>show</button></div>)}
          <Country country={countryToDisplay[0]}/>
          </div>)
      }
      else{
        return(<div>
        {countries.map(country=><div key={country.name}>{country.name} <button type='button' onClick={handleShowClick({country})}>show</button></div>)}
        <Country country={countryToDisplay[0]}/>
        <Weather country={countryToDisplay[0]} weather={weather}/>
        </div>)
      }
    }
  }
}

const App = () => {
  const [inputText,setInputText]=useState('')
  const [allCountries,setAllCountries]=useState([])
  const [countryToDisplay,setCountryToDisplay]=useState([])
  const [weather,setWeather]=useState([])
  const handleInputChange = (event) => {
    setInputText(event.target.value)
    setCountryToDisplay([])
  }
  const countries=allCountries.filter(country => 
    {
      const nameLowercase=country.name.toLowerCase()
      return nameLowercase.includes(inputText.toLowerCase())
    })
  const hook = ()=> {
    const promise=axios.get('https://restcountries.com/v2/all')
    promise.then(response=>{setAllCountries(response.data)})
  }
  const api_key = process.env.REACT_APP_API_KEY
  useEffect(hook,[])
   const hookWeather = ()=> {
    if(countryToDisplay.length>0){
      const site=`https://api.openweathermap.org/data/2.5/weather?q=${countryToDisplay[0].capital}&units=metric&appid=${api_key}`
      const promise = axios.get(site)
      promise.then(response=>{
        setWeather(response.data)
        })
    }
    else if(countries.length===1){
      const site=`https://api.openweathermap.org/data/2.5/weather?q=${countries[0].capital}&units=metric&appid=${api_key}`   
      const promise = axios.get(site)
      promise.then(response=>{
        setWeather(response.data)})
    }
  }
  useEffect(hookWeather,[countryToDisplay])
 
  return (
  <form>
      <div>find countries 
        <input value={inputText} onChange={handleInputChange}/>
        <CountriesToShow countries={countries} inputText={inputText} allCountries={allCountries} 
        setCountryToDisplay={setCountryToDisplay} countryToDisplay={countryToDisplay}
        weather={weather}/>
      </div>
    </form>)
}

export default App