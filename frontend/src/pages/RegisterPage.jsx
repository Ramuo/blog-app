import {useState, useEffect} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import Loader from '../components/Loader';
import illustration from '../img/illustration.png';
import blog from '../img/blog.png';

import { useRegisterMutation } from '../slices/authApiSlice';
import {setCredentials} from '../slices/authSlice';



const RegisterPage = () => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, SetPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, {isLoading}] = useRegisterMutation();

  const {userInfo} = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if(userInfo){
        navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);


  //FUNCTIONS:
  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
        const res = await register({firstName, lastName, email, password}).unwrap();
        dispatch(setCredentials({...res, }));
        navigate(redirect);
    } catch (err) {
        toast.error(err?.data?.message || err.error)
  }
}


  //RENDERED ELEMENTS
  return (
    <section className="relative py-20 2xl:py-40 bg-gray-800 overflow-hidden">
      <div className="relative container px-4 mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full lg:w-1/2 px-4 mb-16 lg:mb-0">
              <div className="max-w-md">
                <img src={blog} alt="blog" />
              </div>
            </div>
            <div className="w-full lg:w-1/2 px-4">
              <div className="px-3 lg:px-20 py-6 lg:py-24 bg-gray-600 rounded-lg">
                <h3 className="mb-10 text-2xl text-white text-center font-bold font-heading">
                    S'inscrire
                </h3>
                <form onSubmit={submitHandler}>
                  {/* First name */}
                  <div className="pl-6 mb-3 bg-white rounded-full">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-4 pr-6 py-4 font-bold placeholder-gray-400 rounded-r-full focus:outline-none"
                      placeholder="Nom"
                    />
                  </div>
                  {/* Last name */}
                  <div className="pl-6 mb-3 bg-white rounded-full">
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full pl-4 pr-6 py-4 font-bold placeholder-gray-400 rounded-r-full focus:outline-none"
                      placeholder="Prenom"
                    />
                  </div>
                  {/* Email */}
                  <div className="pl-6 mb-3 bg-white rounded-full">
                    <input
                       type="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-4 pr-6 py-4 font-bold placeholder-gray-400 rounded-r-full focus:outline-none"
                      placeholder="E-mail"
                    />
                  </div>
                  <div className="pl-6 mb-3 bg-white rounded-full">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => SetPassword(e.target.value)}
                      className="w-full pl-4 pr-6 py-4 font-bold placeholder-gray-400 rounded-r-full focus:outline-none"
                      placeholder="Mot de passe"
                    />
                  </div>
                  
                  <div className="inline-flex mb-10"></div>

                  <button
                    type="submit"
                    className="py-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition duration-200"
                  >
                    Envoyer
                  </button>

                  {isLoading && <Loader/>}
                </form>

                <div className="flex items-center justify-between p-2">
                    <Link
                      to={redirect ? `/register?redirect=${redirect}` : '/register'}
                      className="font-medium text-white text-sm hover:text-cyan-300"
                    >
                     Se connecter
                    </Link>
                    <Link
                      to="/"
                      className="font-medium text-white text-sm hover:text-cyan-300"
                    >
                      Mot de passe oublier ?
                    </Link>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  };

export default RegisterPage;