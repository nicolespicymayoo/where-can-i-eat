import * as React from 'react'
import { Link } from 'react-router-dom'
import './Components/DietItem'
import styled from 'styled-components'

type Props = {
  dietsSelected: dietNeedsObj,
  selectDiet: (dietType: keyof dietNeedsObj) => void 
}

type dietNeedsObj = {
  glutenFree: boolean,
  nutFree: boolean,
  vegetarian: boolean,
  vegan: boolean,
  keto: boolean
}

class DietSelectionPage extends React.Component<Props, {}> {
  render() {
    return (
    <Container>
        <DietList>
          <Title>Which diet options are you looking for?</Title>
          <DietItem isSelected={this.props.dietsSelected.glutenFree} onClick={() => this.props.selectDiet('glutenFree')}>
            gluten free
          </DietItem>
          <DietItem isSelected={this.props.dietsSelected.nutFree} onClick={() => this.props.selectDiet('nutFree')}>
            nut free
          </DietItem>
          <DietItem isSelected={this.props.dietsSelected.vegetarian} onClick={() => this.props.selectDiet('vegetarian')}>
            vegetarian
          </DietItem>
          <DietItem isSelected={this.props.dietsSelected.vegan} onClick={() => this.props.selectDiet('vegan')}>
            vegan
          </DietItem>
          <DietItem isSelected={this.props.dietsSelected.keto} onClick={() => this.props.selectDiet('keto')}>
            keto (low carb)
          </DietItem>
          <NextButton>
            <Link to="/location">next</Link>
          </NextButton>
        </DietList>
      </Container>
    )
  }
}

export default DietSelectionPage

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
`

const DietList = styled.div`
  box-sizing: border-box;
  margin-top: 100px;
`

export const Title = styled.div`
  font-size: 1.11em;
  margin-bottom: 50px;
`

export const DietItem = styled<{isSelected: boolean}, 'div'>('div')`
  padding: 12px;
  margin: 3px auto;
  border: 1px solid rgba(0,0,0,.2);
  border-radius: 50px;
  width: 150px;
  background-color: ${(props) => props.isSelected ? 'blueviolet' : 'white'};
  color: ${(props) => props.isSelected ? 'white' : 'black' }


`
const NextButton = styled.div`
  width: 150px;
  padding: 10px;
  margin: 30px auto 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  border-radius: 40px;
`