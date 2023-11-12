import {Outlet} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';


const App = () => {
  return (
    <>
      <Header/>
      <main>
        <Outlet/>
      </main>
      <ToastContainer className="toast-position"/>
    </>
  )
}

export default App;