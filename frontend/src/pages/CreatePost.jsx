import {useState} from 'react';
import Dropzone from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import Loader from '../components/Loader';
import CategorySelect from '../components/CategorySelect';

import {useCreatepostMutation} from '../slices/postApiSlice'


export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');

    const navigate = useNavigate();

    const [createpost, {isLoading}] = useCreatepostMutation();

    //FUNCTIONS:
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createpost({title, description, category}).unwrap;
            toast.success('Publication créée avec succès');
            navigate('/');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }
    //RENDERED ELEMENTS:
    return (
      <>
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
              Créer une Publication
            </h2>
  
            <p className="mt-2 text-center text-sm text-gray-600">
              <p className="font-medium text-green-600 hover:text-indigo-500">
                Partagez vos idées avec le reste du monde
              </p>
            </p>
          </div>
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form 
              onSubmit={handleSubmit }
              className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Titre
                  </label>
                  <div className="mt-1">
                    {/* Title */}
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      autoComplete="titre"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  
                  </div>
                </div>
                {/* Category input goes here */}
                <CategorySelect 
                type="text"
                value={category}
                onClick={(e) => setCategory(e.target.value)}
                />
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  {/* Description */}
                  <textarea
                    rows="5"
                    cols="10"
                    className="rounded-lg appearance-none block w-full py-3 px-3 text-base text-center leading-tight text-gray-600 bg-transparent focus:bg-transparent  border border-gray-200 focus:border-gray-500  focus:outline-none"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                  {/* Img goes here */}
                  <p>img upload</p>
                </div>
                <div>
                  {/* Submit btn */}
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Envoyer
                  </button>
                </div>
                {isLoading && <Loader/>}
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }