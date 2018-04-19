import React from "react";
import connect from "react-redux/es/connect/connect";
import Link from "react-router/es/Link";
import {getAllThreads} from "../store/actions";

class Header extends React.Component{
  componentDidMount(){
    this.props.getAllThreads();
  }

  render(){
    var unread = Object.keys(this.props.messages).map(key=>this.props.messages[key]).filter(m=>!m.isRead).length;

    return <header className={"navbar r-navbar r-header"} style={{borderBottom: '1px solid #eee'}}>
      <div className="container">
        <div className="navbar-header">
          <Link className="navbar-brand r-header__logo" to="/">
            <img src={require('./../images/konsus.png')} width="100" alt="Konsus" />
          </Link>
        </div>
        {this.props.session.id && <ul style={{float: 'right', marginTop: 10}}>
         <Link to="/chat">Inbox({unread})</Link>
          &nbsp;
          Logged in as {this.props.session.name}

        </ul>}
      </div>
    </header>

  }

}

const mapStateToProps = (state) => {
  return {
    session: state.session,
    messages: state.message
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAllThreads: ()=>dispatch(getAllThreads())
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
