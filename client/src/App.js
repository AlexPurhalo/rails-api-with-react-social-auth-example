import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = { message: null };
	}

	componentDidMount() {
		const testUrl = window.location.href;

		axios.get(`${testUrl}/test_route`)
			.then(res => this.setState({ message: res.data.title }))
	}

  render() {
		const { message } = this.state;
    return <div className="App">{ message ? message : 'loading...' }</div>;
  }
}
