import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import * as actions from '../actions/';
import { Link } from 'react-router';
import LoadingCircle from '../components/LoadingCircle'
import YelpCard from './YelpCard'
import MenuItem from 'material-ui/MenuItem'
import { RadioButton } from 'material-ui/RadioButton'
import {
  Checkbox,
  RadioButtonGroup,
  SelectField,
  TextField,
  Toggle,
  Slider
} from 'redux-form-material-ui'

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {distanceSlider: 0}
    this.onSubmit = this.onSubmit.bind(this);
    this.renderCards = this.renderCards.bind(this)
  }
  componentDidMount(){
    const { yelpData } = this.props;
    if (yelpData.lastCity && yelpData.lastCity !== 'undefined'){
      this.props.getYelp(yelpData.lastCity)
    }
  }

  onSubmit(props){
    // extract the value city from Redux-form and pass it to Action-Creator
    const { city } = props;
    // const { userEmail } = this.props
    this.props.getYelp(city)
  }

  renderCards({name, display_phone, location, image_url, isCurrentUserReserved, snippet_text, id, url}){
    let address = location.address[0];
    if(!snippet_text){
      snippet_text = 'No reviews at the moment'
    } else{
      snippet_text = `"${snippet_text}"`
    }
    return(
      <YelpCard
        key={id}
        clubID={id}
        name={name}
        address={address}
        image_url={image_url || 'http://al3qarat.com/images/sorry_not_available.gif'}
        snippet_text={snippet_text}
        display_phone={display_phone}
        url={url}
        isCurrentUserReserved={isCurrentUserReserved}
        />
    )
  }

  render() {
    const { handleSubmit, pristine, reset, submitting, yelpData, userName } = this.props;
    //isFetching helps sync correctly to load loader-image while fetching data from Yelp
    return (
      <div>
        <h1>Welcome {userName || 'Guest'} !</h1>
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <Field name="city" component={TextField} hintText="Enter Your City"/>
          <div>
            <button type="submit" disabled={yelpData.isFetching}>Submit</button>
            <button type="button" disabled={pristine || yelpData.isFetching} onClick={reset}>Clear</button>
          </div>
        </form>
        <div className="my-container">
          {yelpData.isFetching ? (<LoadingCircle />) : (yelpData.data.map(this.renderCards))}
        </div>
      </div>
    )
  }
}


Home = reduxForm({
  form: 'myForm'
})(Home)

function mapStateToProps(state){
  return {
    yelpData: state.yelpData,
    isReserved: state.yelpData.isReserved,
    userName: state.auth.userName,
    userEmail: state.auth.email
  }
}

export default Home = connect(mapStateToProps, actions)(Home)

// <Field
//   name="distance"
//   component={Slider}
//   min={1}
//   max={25}
//   format={null}
//   defaultValue={10}
//   step={1}
//  />
