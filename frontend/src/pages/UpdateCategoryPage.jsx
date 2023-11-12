import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom'
import { 
    FaBookOpen,
    FaRegEdit,
} from 'react-icons/fa';
import {toast} from 'react-toastify';
import Loader from '../components/Loader';

import { 
    useUpdateCategoryMutation,
    useGetCategoryByIdQuery
} from '../slices/categoryApiSlice';



const UpdateCategoryPage = () => {
    const navigate = useNavigate();
    const {id: categoryId} = useParams();

    const [title, setTitle] = useState('');

    const {
        data: category,
        isLoading,
        refetch,
        // error
    } = useGetCategoryByIdQuery();

    const [updateCategory, {isLoading: loadingUpdate}] = useUpdateCategoryMutation();

    //FUNCTIONS:
    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            await updateCategory({
                categoryId,
                title
            });
            toast.success('Catégorie  éditée avec succès');
            refetch();
            navigate('/categoryList')
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    useEffect(() => {
        if(category){
            setTitle(category.title);
        }
    }, [category])

    //REBDERED ELEMENTS
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <FaBookOpen className="mx-auto h-12 w-auto" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Mettre à jour la categorie selectionnée
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              <p className="font-medium text-indigo-600 hover:text-indigo-500">
                Mettez à jour la catégorie  ci-dessous
              </p>
            </p>
          </div>

          {loadingUpdate && <Loader/>}

          {isLoading ? (
             <Loader/> 
          ):(
          <form 
          onSubmit={submitHandler}
          className="mt-8 space-y-6"
          >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Nom
                </label>
                {/* Title */}
                <input
                  type="text"
                  autoComplete="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center focus:z-10 sm:text-sm"
                  placeholder="Categorie"
                />
              </div>
            </div>
  
            <div>
              <div>
                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    < FaRegEdit
                      className="h-5 w-5 text-white group-hover:text-indigo-400"
                      aria-hidden="true"
                    />
                  </span>
                    Envoyer
                </button>
              </div>
            </div>
            {isLoading && <Loader/>}
          </form>
          )}
        </div>
      </div>
    );
  };
  
  export default UpdateCategoryPage;