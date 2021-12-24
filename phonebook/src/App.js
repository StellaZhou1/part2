import React, { useState,useEffect } from 'react'
import axios from 'axios'
import * as personService from './services/persons'

const Filter = ({newFilter,setNewFilter}) => {
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }
  return <div>filter shown with <input value={newFilter} onChange={handleFilterChange}/></div>
}

const PersonForm = ({persons,newName,newNumber,setPersons,setNewName,setNewNumber}) => {
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personToChange=persons.find((person)=>person.name===newName)
    const newPerson = {
      name: newName,
      number:newNumber
    }
    const confirmation=window.confirm(newName+ ' is already added to phonebook, replace the old number with a new one?')
    if(confirmation){
      personService.update(personToChange,newPerson)
      .then(changedPerson=>{setPersons(persons.map(p => changedPerson.id !== p.id ? p : changedPerson))
      setNewName('')
      setNewNumber('')})
    }
    else{
      personService.create(newPerson).then(returnedPerson =>{
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        })
    }
  }
  return (<form>
    <div>name: <input value={newName} onChange={handleNameChange}/></div>
    <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
    <div>
      <button type="submit" onClick={addPerson}>add</button>
    </div>
  </form>)
}

const deletePerson = (personToDelete,persons,setPersons)=> {
  let confirmation=window.confirm(`Delete ${personToDelete.name}?`)
  if (confirmation)
  {
    personService.deletePerson(personToDelete)
    .then(deletedPerson=>{
    setPersons(persons.filter(p => {return p.id!==personToDelete.id}))
  })
  }
  else
  {
    console.log("cancel")
  }
}

const Persons = ({persons,newFilter,setPersons}) => {
  const personsToShow = persons.filter(person=>{
    return person.name.toLowerCase().includes(newFilter.toLowerCase())})
  return <div>
    {personsToShow.map(person=><div key={person.name}>{person.name} {person.number}
      <button type="button" onClick={()=>deletePerson(person,persons,setPersons)}>delete</button></div>)}
  </div>
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [ newFilter, setNewFilter ] = useState('')

  const hook = () => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }
  
  useEffect(hook, [])
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} setNewFilter={setNewFilter}/>
      <h2>Add a new</h2>
      <PersonForm persons={persons} newName={newName} newNumber={newNumber} setPersons={setPersons} setNewName={setNewName}
       setNewNumber={setNewNumber}/>
      <h2>Numbers</h2>
      <Persons persons={persons} newFilter={newFilter} setPersons={setPersons}/>
    </div>
  )
}

export default App
