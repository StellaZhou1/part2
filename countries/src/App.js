import React, { useState, useEffect} from 'react'
import axios from 'axios'

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

const CountriesToShow = ({inputText,allCountries,countryToDisplay,setCountryToDisplay}) => {
  const handleShowClick = ({country})=> {
    return ()=> {
      setCountryToDisplay([country])}
  }
  const countries=allCountries.filter(country => 
    {
      const nameLowercase=country.name.toLowerCase()
      return nameLowercase.includes(inputText.toLowerCase())
    })
  if(countries.length>10){
    return <div>Too many countries, specify another filter</div>
  }
  else if (countries.length===1){
    return <Country country={countries[0]}/>
  }
  else{
    if (countryToDisplay.length===0){
      return(<div>
      {countries.map(country=><div key={country.name}>{country.name} 
      <button type='button' onClick={handleShowClick({country})}>show</button></div>)}
      </div>)
    }
    else{
      return(<div>
      {countries.map(country=><div key={country.name}>{country.name} <button type='button' onClick={handleShowClick({country})}>show</button></div>)}
      <Country country={countryToDisplay[0]}/>
      </div>)
    }

  }
}

const App = () => {
  const [inputText,setInputText]=useState('')
  const [allCountries,setAllCountries]=useState([])
  const [countryToDisplay,setCountryToDisplay]=useState([])
  const handleInputChange = (event) => {
    setInputText(event.target.value)
    setCountryToDisplay([])
  }
  const hook = ()=> {
    const promise=axios.get('https://restcountries.com/v2/all')
    promise.then(response=>{setAllCountries(response.data)})
  }
  useEffect(hook,[])
  
  return (
  <form>
      <div>find countries 
        <input value={inputText} onChange={handleInputChange}/>
        <CountriesToShow inputText={inputText} allCountries={allCountries} setCountryToDisplay={setCountryToDisplay} countryToDisplay={countryToDisplay}/>
      </div>
    </form>)
}

export default App
