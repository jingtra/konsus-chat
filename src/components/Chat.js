import React from "react";
import Header from "./Header";
import connect from "react-redux/es/connect/connect";
import ChatApp from "./chat/ChatApp.react"

class Chat extends React.Component{
  componentWillMount(){
    if(!this.props.session.id){
      this.props.router.push('/login')
    }
  }
  render() {
    return <div>
      <Header/>
      <div className="container">
        <ChatApp/>
        <br/>
      </div>
    </div>
  }
}


const mapStateToProps = (state) => {
  return {
    session: state.session
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat)
