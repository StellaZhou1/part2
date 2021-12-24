import React, { useState,useEffect } from 'react'
import axios from 'axios'
import * as personService from './services/persons'

const Notification = ({message,success}) => {
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
    const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message===null)
  {
    return null
  }
  if (success)
    return (<div style={successStyle}>
    {message}</div>)
  else
    return (<div style={errorStyle}>
      {message}
      </div>)
}

const Filter = ({newFilter,setNewFilter}) => {
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }
  return <div>filter shown with <input value={newFilter} onChange={handleFilterChange}/></div>
}

const PersonForm = ({persons,newName,newNumber,setPersons,setNewName,setNewNumber,setMessage,setSuccess}) => {
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
    if (personToChange)
    {
      const confirmation=window.confirm(newName+ ' is already added to phonebook, replace the old number with a new one?')
      if(confirmation){
        personService.update(personToChange,newPerson)
        .then(changedPerson=>{setPersons(persons.map(p => changedPerson.id !== p.id ? p : changedPerson))
        setNewName('')
        setNewNumber('')
        setMessage('Changed '+changedPerson.name)
        setSuccess(true)
        setTimeout(() => {setMessage(null)}, 5000)})
        .catch(error => {
          setSuccess(false)
          setMessage(`Information of ${personToChange.name} has already been removed from the server`)
          setTimeout(() => {setMessage(null)}, 5000)
        })
      }
    }
    else{
      personService.create(newPerson).then(returnedPerson =>{
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setMessage('Added '+returnedPerson.name)
        setSuccess(true)
        setTimeout(() => {setMessage(null)}, 5000)
        })
        .catch(error => {
          setSuccess(false)
          setMessage(error.response.data.error)
          setTimeout(() => {setMessage(null)}, 5000)
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

const deletePerson = (personToDelete,persons,setPersons,setSuccess,setMessage)=> {
  let confirmation=window.confirm(`Delete ${personToDelete.name}?`)
  if (confirmation)
  {
    personService.deletePerson(personToDelete)
    .then(deletedPerson=>{
    setPersons(persons.filter(p => {return p.id!==personToDelete.id}))
    setMessage('Deleted '+personToDelete.name)
    setSuccess(true)
    setTimeout(() => {setMessage(null)}, 5000)
    })
    .catch(error => {
      setSuccess(false)
      setMessage(`Information of ${personToDelete.name} has already been removed from the server`)
      setTimeout(() => {setMessage(null)}, 5000)
    })
  }
  else
  {
    console.log("cancel")
  }
}

const Persons = ({persons,newFilter,setPersons,setSuccess,setMessage}) => {
  const personsToShow = persons.filter(person=>{
    return person.name.toLowerCase().includes(newFilter.toLowerCase())})
  return <div>
    {personsToShow.map(person=><div key={person.name}>{person.name} {person.number}
      <button type="button" onClick={()=>deletePerson(person,persons,setPersons,setSuccess,setMessage)}>delete</button></div>)}
  </div>
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [ message,setMessage ] = useState('')
  const [ success,setSuccess ] = useState(true)

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
      <Notification message={message} success={success}/>
      <Filter newFilter={newFilter} setNewFilter={setNewFilter}/>
      <h2>Add a new</h2>
      <PersonForm persons={persons} newName={newName} newNumber={newNumber} setPersons={setPersons} setNewName={setNewName}
       setNewNumber={setNewNumber} setMessage={setMessage} setSuccess={setSuccess}/>
      <h2>Numbers</h2>
      <Persons persons={persons} newFilter={newFilter} setPersons={setPersons} setMessage={setMessage} setSuccess={setSuccess}/>
    </div>
  )
}

export default App
