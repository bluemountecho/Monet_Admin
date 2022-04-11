import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const VerifyCode = React.lazy(() => import('./views/pages/verifycode/VerifyCode'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const baseURL = 'http://localhost'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isFetching: true
    }

    this.response = 0
  }

  componentDidMount() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'text/html' },
      body: ''
    };

    fetch(baseURL + '/checkSession', requestOptions)
    .then((res) => res.text())
    .then((res) => {
      this.response = res
      this.setState({isFetching: false})
    })
    .catch((err) => {
      this.response = 0
      this.setState({isFetching: false})
    })
  }

  render() {
    return (
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            {this.state.isFetching == false && this.response == 2 &&
            <Route path="*" name="Home" element={<DefaultLayout />} />}
            {this.state.isFetching == false && this.response == 0 &&
            <Route path="*" name="Home" element={<Login />} />}
            {this.state.isFetching == false && this.response == 1 &&
            <Route path="*" name="Home" element={<VerifyCode />} />}
          </Routes>
        </Suspense>
      </HashRouter>
    )
  }
}

export default App
