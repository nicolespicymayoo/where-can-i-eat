import * as React from 'react'
import './App.css'

const logo = require('./logo.svg')

type State = {
  apiResult: string
}

class App extends React.Component<{}, State> {
  state: State = {
    apiResult: ''
  }

  componentDidMount() {
    fetch('/api')
      .then(response => response.text())
      .then(result => this.setState({apiResult: result}))
      .catch(error => error)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">GF Near Me</h1>
        </header>
        <div className="App-intro">
          {this.state.apiResult}
        </div>
      </div>
    )
  }
}

export default App
