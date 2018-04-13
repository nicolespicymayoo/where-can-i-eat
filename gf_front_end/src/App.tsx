import * as React from 'react'
import './App.css'
import { BrowserRouter, Route } from 'react-router-dom'
import DietSelectionPage from './DietSelectionPage'
import LocationSelection from './LocationSelection'
import RestaurantList from './RestaurantList'
import './styles/lato.css'
import './styles/openSans.css'

type State = {
  dietsSelected: dietNeedsObj
  places: Array<Place>
}

type dietNeedsObj = {
  glutenFree: boolean
  nutFree: boolean
  vegetarian: boolean
  vegan: boolean
  keto: boolean
}

export type Place = {
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  id: string
  name: string
  rating: number
  price_level: number
  opening_hours: {
    open_now: boolean
  }
  photos: Array<{
    photo_reference: string
  }>
  place_id: string
  vicinity: string
}

class App extends React.Component<{}, State> {
  state: State = {
    dietsSelected: {
      glutenFree: false,
      nutFree: false,
      vegetarian: false,
      vegan: false,
      keto: false
    },
    places: []
  }

  // componentDidMount() {
  //   fetch('/api/reverseGeocode/37.7739/-122.431297')
  //     .then(response => response.json())
  //     .then((res: ReverseGeocodeResponse) => {
  //       let readableAddress = res.results[0].formatted_address
  //       console.log(res)
  //       console.log(readableAddress)
  //       this.setState({address: readableAddress})
  //       console.log(res)
  //     })
  //     .catch(error => error)
  // }

  selectDiet = (dietType: keyof dietNeedsObj) => {
    console.log('diet item passed to function:', dietType)
    console.log('value of diet item passed', this.state.dietsSelected[dietType])
    let oldSelectedDiets = { ...this.state.dietsSelected }
    let newSelectedDiets = { ...oldSelectedDiets }
    let updatedSelectedDiets: dietNeedsObj = {
      ...newSelectedDiets,
      [dietType]: !newSelectedDiets[dietType]
    }
    this.setState({ dietsSelected: updatedSelectedDiets }, () => {
      console.log(this.state.dietsSelected)
    })
  }

  saveNearbyRestaurants = (nearbyAPIResults: Array<Place>) => {
    this.setState({ places: nearbyAPIResults })
  }

  clearSearchResults = () => {
    this.setState({places: []})
    console.log('clear search function called', this.state.places)
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route
            path="/"
            exact={true}
            render={props => (
              <DietSelectionPage
                dietsSelected={this.state.dietsSelected}
                selectDiet={this.selectDiet}
                {...props}
              />
            )}
          />
          <Route
            path="/location"
            exact={true}
            render={props => (
              <LocationSelection
                saveNearbyRestaurants={this.saveNearbyRestaurants}
                places={this.state.places}
              />
            )}
          />
          <Route
            path="/results"
            exact={true}
            render={props => <RestaurantList results={this.state.places} clearSearchResults={this.clearSearchResults}/>}
          />
        </div>
      </BrowserRouter>
    )
  }
}

export default App
