import * as React from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { Title } from './DietSelectionPage'

type PlacesResponse = {
  results: Array<Place>
}

type Place = {
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

type ReverseGeocode = {
  formatted_address: string
}

type PlacePrediction = {
  description: string
}

type AutoCompleteResponse = {
  predictions: Array<PlacePrediction>
}

// latitude & longistude coordinates into a readable address
type ReverseGeocodeResponse = {
  results: Array<ReverseGeocode>
}

type GeocodeResponse = {
  results: Array<Geocode>
}

type Geocode = {
  geometry: {
    location: {
      lat: 37.4224764
      lng: -122.0842499
    }
  }
}

// function that takes the array of nearby restaurants from API call and sets them to the 'places' state in parent
type Props = {
  saveNearbyRestaurants: (nearbyAPIResults: Array<Place>) => void
  places: Array<Place>
}

type State = {
  address: string
  coords: {
    lat: number
    lng: number
  }
  searchBoxValue: string
  savedSearchBoxValue: string
  predictedPlaces: Array<PlacePrediction>
  displayPredictedPlaces: boolean
  downArrowCount: number
}

class LocationSelection extends React.Component<Props, State> {
  state: State = {
    address: '',
    coords: {
      lat: 37.7739,
      lng: -122.431297
    },
    searchBoxValue: '',
    savedSearchBoxValue: '',
    predictedPlaces: [],
    displayPredictedPlaces: false,
    downArrowCount: -1
  }

  findMyCoords = () => {
    console.log(this.state.coords.lat, this.state.coords.lng)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        let lat = position.coords.latitude
        let lng = position.coords.longitude

        this.setCoords(lat, lng)
      })
    } else {
      window.alert(
        'please allow geolocation on your device to find food near you'
      )
    }

    this.searchLocation()
  }

  setCoords = (lat: number, lng: number) => {
    this.setState({ coords: { ...this.state.coords, lat: lat, lng: lng } })
  }

  searchLocation = () => {
    let lat = this.state.coords.lat
    let lng = this.state.coords.lng

    fetch('/api/currentLocation/' + lat + '/' + lng)
      .then(response => response.json())
      .then((data: PlacesResponse) => {
        this.props.saveNearbyRestaurants(data.results)
      })
      .catch(error => {
        console.log(error)
      })
  }

  // turns coordinates into readable address
  reverseGeocode = () => {
    let lat = this.state.coords.lat
    let lng = this.state.coords.lng

    fetch('/api/reverseGeocode/' + lat + '/' + lng)
      .then(response => response.json())
      .then((res: ReverseGeocodeResponse) => {
        let readableAddress = res.results[0].formatted_address
        console.log(res)
        console.log(readableAddress)
        this.setState({ address: readableAddress })
        console.log(res)
      })
      .catch(error => error)
  }

  updateSearchValue = (value: string) => {
    this.setState({ searchBoxValue: value })
    this.setState({ savedSearchBoxValue: value })
    this.requestAutoComplete(value)
    if (value.length === 0) {
      this.setState({ displayPredictedPlaces: false })
    }
  }

  requestAutoComplete = (input: string) => {
    fetch('/api/autocomplete/' + input)
      .then(response => response.json())
      .then((res: AutoCompleteResponse) => {
        console.log(res.predictions)
        if (res.predictions.length > 0) {
          this.setState({ displayPredictedPlaces: true })
        }
        this.setState({ predictedPlaces: res.predictions })
      })
      .catch(error => console.log(error))
  }

  handleKeyDown = (keyCode: number) => {
    // esc key
    if (keyCode === 27) {
      this.setState({ displayPredictedPlaces: false })
      this.setState({ downArrowCount: -1 })
      this.setState({ predictedPlaces: []})
      this.setState({searchBoxValue: this.state.savedSearchBoxValue})
    }
    // down arrow
    if (keyCode === 40 && this.state.predictedPlaces.length > 0) {
      this.setState(
        state => {
          if (
            this.state.downArrowCount >=
            this.state.predictedPlaces.length - 1
          ) {
            return {
              downArrowCount: 0
            }
          } else {
            return {
              downArrowCount: state.downArrowCount + 1
            }
          }
        },
        () => {
          let index = this.state.downArrowCount
          let currentSelectedPrediction = this.state.predictedPlaces[index]
            .description
          this.setState({ searchBoxValue: currentSelectedPrediction })
        }
      )
      console.log('down arrow:', this.state.downArrowCount)
    }
    // up arrow
    if (keyCode === 38 && this.state.predictedPlaces.length > 0) {
      this.setState(
        state => {
          if (state.downArrowCount < 1) {
            return {
              downArrowCount: state.predictedPlaces.length - 1
            }
          } else {
            return {
              downArrowCount: state.downArrowCount - 1
            }
          }
        },
        () => {
          let index = this.state.downArrowCount
          let currentSelectedPrediction = this.state.predictedPlaces[index]
            .description
          this.setState({ searchBoxValue: currentSelectedPrediction })
          console.log('up arrow:', this.state.downArrowCount)
        }
      )
    }
    // enter key
    if (keyCode === 13) {
      let index = this.state.downArrowCount
      let currentSelectedPrediction = this.state.predictedPlaces[index]
        .description

      this.searchPredictedPlace(currentSelectedPrediction)
    }
  }

  searchPredictedPlace = (address: string) => {
    this.setState({ searchBoxValue: address })
    let formattedAddress = address.split(' ').join('+')

    fetch('/api/geocode/' + formattedAddress)
      .then(response => response.json())
      .then((response: GeocodeResponse) => {
        console.log(response)
        let lat = response.results[0].geometry.location.lat
        let lng = response.results[0].geometry.location.lng
        this.setCoords(lat, lng)
        this.searchLocation()
      })
      .catch(error => console.log(error))
  }

  render() {
    return (
      <Container>
        <Content>
          <PageTitle>Where do you want to eat?</PageTitle>
          <CurrentLocationButton onClick={this.findMyCoords}>
            near my current location
          </CurrentLocationButton>
          <SearchBoxTitle>Somewhere else:</SearchBoxTitle>
          <Searchbox
            value={this.state.searchBoxValue}
            onChange={e => this.updateSearchValue(e.target.value)}
            onKeyDown={e => this.handleKeyDown(e.keyCode)}
          />
          {this.state.displayPredictedPlaces ? (
            <AutocompleteDropdown>
              {this.state.predictedPlaces.map((place, index) => (
                <PredictedPlace
                  isSelected={
                    this.state.downArrowCount === index ? true : false
                  }
                  key={index}
                  onClick={e => this.searchPredictedPlace(place.description)}
                >
                  {place.description}
                </PredictedPlace>
              ))}
            </AutocompleteDropdown>
          ) : (
            <div />
          )}
          {this.props.places.length > 0 ? <Redirect to="/results" /> : <div />}
        </Content>
      </Container>
    )
  }
}

export default LocationSelection

const Container = styled.div`
  margin: 100px auto 0;
  text-align: center;
`

const Content = styled.div`
  margin: auto;
  display: inline-block;
  ${`to make this div the size of its content`};
`

const PageTitle = styled(Title)`
  margin-bottom: 40px;
`

const CurrentLocationButton = styled.button`
  padding: 12px;
  margin: 10px auto;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 50px;
  width: 200px;
  font-size: 0.86em;
  &:active {
    background-color: rgba(0, 0, 0, 0.02);
    color: blueviolet;
    box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.08);
  }
  &:focus {
    outline: none;
  }
`

const SearchBoxTitle = styled.div`
  padding: 40px 0 20px;
  text-align: left;
  font-size: 13px;
  width: 350px;
  margin: auto;
`

const Searchbox = styled.input`
  border: 1px solid rgba(0, 0, 0, 0.4);
  height: 40px;
  width: 350px;
  border-radius: 5px;
  &:focus {
    outline: none;
    border: 2px solid rgba(138, 42, 226, 0.2);
  }
`

const AutocompleteDropdown = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
`

const PredictedPlace = styled<{ isSelected: boolean }, 'div'>('div')`
  background-color: ${props =>
    props.isSelected ? 'rgba(138,42,226,.2)' : 'white'};
`
