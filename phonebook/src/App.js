import React, { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const addContact = (event) => {
    event.preventDefault()
    const personToAdd=persons.find((person)=>person.name===newName)
    if (personToAdd){
      window.alert(`${newName} is already added to phonebook`)
    }
    else{
      const newPerson ={name:newName,number:newNumber}
      setPersons(persons.concat(newPerson))
      setNewName("")
      setNewNumber("")
    }

  }

  const handleNameChange = (event) =>{
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const personsToShow = persons.filter(person=>{
    return person.name.toLowerCase().includes(newFilter.toLowerCase())})
    

  return (
    <div>
      <h2>Phonebook</h2>
      <div> filter shown with <input value={newFilter} onChange={handleFilterChange}/> </div>
      <h2>add a new</h2>
      <form>
        <div>name: <input value={newName} onChange={handleNameChange}/></div>
        <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
        <div>
          <button type="submit" onClick={addContact}>add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personsToShow.map(person=><div key={person.name}>{person.name} {person.number}</div>)}
    </div>
  )
}

export default App
