import {Link} from 'react-router-dom'
import Loader from '../components/Loader'
import { FaEdit, FaTrash } from 'react-icons/fa';
import {toast} from 'react-toastify';

 
import { 
  useGetCategoriesQuery,
  useDeleteCategoryMutation 
} from '../slices/categoryApiSlice';


const CategoryListPage = () => {
    const {
      data: categoryList, 
      isLoading, 
      error,
      refetch
    } = useGetCategoriesQuery();

    const [
      deleteCategory,
      {isLoading: isLoadingDelete}
    ] = useDeleteCategoryMutation();
   
    //FUNCTION
    const deleteHandler = async (id) => {
      if(window.confirm("Êtes-vous sûr de supprimer cet élément ?")){
        try {
          await deleteCategory(id);
          toast.success('Supprimé avec succès');
          refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.message);
        };
      };
    }

    //RENDERED ELEMENTS:
    return (
      <>
        {isLoadingDelete && <Loader/>}
        {isLoading ? (
            <Loader/>
        ) : error ? (
            <h2 className="text-center text-3xl text-red-600">
                Une erreur s'est produite, Aucune  Categorie trouvée
            </h2>
        ) : categoryList?.length <= 0 ? (
          <h2 className="text-center text-3xl text-green-800">
                Aucune  Categorie trouvée
          </h2>
        ) : (
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Auteur
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Titre
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Data de creation
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Éditer
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Supprimer
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryList?.map(category => (
                        <tr className="bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={category?.user?.profilePhoto}
                                  alt="category profile"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {category?.user?.firstName}{" "}
                                  {category?.user?.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {category?.user?.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {category.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {category?.createdAt.substring(0, 10)}
                          </td>
                          <td>
                          <Link to={`/category/${category._id}/edit`}>
                            <div className="px-8 py-4 whitespace-nowrap text-sm text-gray-500">
                              <FaEdit className="h-5 text-indigo-500" />
                            </div>
                          </Link>
                          </td>
                          <td>
                          <button 
                          type='button'
                          onClick={() => deleteHandler(category._id)}
                          className="px-12 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            <FaTrash className="h-5 text-red-500" />
                          </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
};

export default CategoryListPage;



