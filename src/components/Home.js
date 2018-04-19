import React from "react";
import Header from "./Header";
import connect from "react-redux/es/connect/connect";

class Home extends React.Component{
  componentWillMount(){
    if(!this.props.session.id){
      this.props.router.push('/login')
    }
  }
  render() {
    return <div>
      <Header/>
      <div className="container">
        <br/>
        <h1>Welcome {this.props.session.name}</h1>
        <h3>This is the dashboard</h3>
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
)(Home);
