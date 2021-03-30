import React, { useContext } from 'react';
import { BrowserRouter as Router ,Switch,Route} from 'react-router-dom'
import HomePage from './Components/HomePage'
import LoginPage from './Components/LoginPage'
import NavBar from './Components/Navbar/Navbar';
import RegisterPage from './Components/RegisterPage';
import { myContext } from './Context';
function App() {
  const userObject = useContext(myContext)
  console.log(userObject);
  
  return (
    <Router>
        <NavBar />
    <Switch>
    <Route exact path='/' component={HomePage} />
    <Route exact path='/login' component={LoginPage} />
    <Route exact path='/register' component={RegisterPage} />
    </Switch>
    </Router>
  );
}

export default App;
