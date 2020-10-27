import React, { Component } from 'react'
import Index from '../../pages/index';

class ErrorHandler extends Component<{}, { hasError: boolean }> {

  constructor(props) {
    super(props)
  
    this.state = {
       hasError: false
    }
  }
  
  static getDerivedStateFromError(error) {
    console.log("Error boundry exe: " + error) 
    return {
      hasError: true
    }
  }

  render() {
    if(this.state.hasError) {
      console.log("error boundry exe");
      return <Index />
    }
    return this.props.children
  }
}

export default ErrorHandler
