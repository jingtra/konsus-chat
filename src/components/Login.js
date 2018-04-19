import React from "react";
import Header from "./Header";
import connect from "react-redux/es/connect/connect";
import FormControl from "react-bootstrap/es/FormControl";
import Button from "react-bootstrap/es/Button";
import Alert from "react-bootstrap/es/Alert";
import {login} from "../store/actions";

class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {value: ""};
  }


  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  submit(){
    if(this.state.value.length<1){
      this.setState({error: "Username not typed"});
    }else{
      this.setState({error: null});
      return this.props.login(this.state.value)
        .then(session=>{
          this.props.router.push('/')
        })
    }
  }


  render() {
    return <div>
      <Header/>
      <div className="container">
        <br/>
        <h1>Login</h1>
        Login with "Jing", "Erna" or "Robert"
        <br/>
        <FormControl
          style={{width: 200}}
          type="text"
          value={this.state.value}
          placeholder="Username"
          onChange={this.handleChange.bind(this)}
        />
        <br/>
        {this.state.error && <Alert bsStyle="danger" style={{width: 200}}>{this.state.error}</Alert>}
        <Button bsStyle="primary" onClick={this.submit.bind(this)}>Log in</Button>

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
    login: (username)=>dispatch(login(username))
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
