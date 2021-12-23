import ReactDOM from 'react-dom'
import App from './App'
import axios from 'axios'

axios.get('http://localhost:3001/persons').then(response => {
  const data = response.data
  ReactDOM.render(
    <App notes={data}/>, 
    document.getElementById('root')
  )
})



