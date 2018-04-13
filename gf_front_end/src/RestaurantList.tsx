import * as React from 'react'
import { Place } from './App'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'

type Props = {
  results: Array<Place>,
  clearSearchResults: () => void
}

class RestaurantList extends React.Component<Props, {}> {
  componentWillUnmount() {

    this.props.clearSearchResults()

  }
  render() {
    return (
      <Container>
        <List>
          { this.props.results.length < 1 ?
          //  <div>we didn't find any restaurants w/ that criteria</div>
           <Redirect to="/" />
           :
          this.props.results.map(restaurantItem => (
            <RestaurantItem>{restaurantItem.name}</RestaurantItem>
          ))}
        </List>
      </Container>
    )
  }
}

export default RestaurantList

const Container = styled.div`
  display: flex;
  justify-content: center;
`

const List = styled.div`
  border: 1px solid rgba(0,0,0,.1);
  padding: 30px 50px;
  margin-top: 10%;
`

const RestaurantItem = styled.div`
  padding: 20px 0;
  text-align: left;
  font-size: 1em;
`