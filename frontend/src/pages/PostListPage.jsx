import {FaThumbsDown, FaThumbsUp, FaEye} from 'react-icons/fa';
import { Link } from "react-router-dom";
import Loader from '../components/Loader';
import {toast} from 'react-toastify';


import {
    useGetpostsQuery,
    useLikepostMutation
} from '../slices/postApiSlice';
import {
    useGetCategoriesQuery
} from '../slices/categoryApiSlice';


export default function PostsListPage() {
    const {
        data: postlist,
        isLoading,
        error,
    } = useGetpostsQuery();


    
    const {
        data: categoryList,
        isLoadingCategory,
        isError,
        refetch
    } = useGetCategoriesQuery();

    const [likepost, {isLoadingPost}] = useLikepostMutation();

    

    // const likePost = async (id) => {
    //     try {
    //         await likepost(id);    
    //     } catch (err) {
    //         toast.error(err?.data?.message || err.message);
    //     };
    // }

    return (
    <>
        <section>
        <div class="py-20 bg-gray-900 min-h-screen radius-for-skewed">
            <div class="container mx-auto px-4">
            <div class="mb-16 flex flex-wrap items-center">
                <div class="w-full lg:w-1/2">
                <span class="text-green-600 font-bold">
                    Dernières Publications de nos internautes
                </span>
                <h2 class="text-4xl text-gray-300 lg:text-5xl font-bold font-heading">
                    Dernières Publications
                </h2>
                </div>
                <div class=" block text-right w-1/2">
                {/* View All */}
                <button class="inline-block py-2 px-6 rounded-l-xl rounded-t-xl bg-green-600 hover:bg-green-700 text-gray-50 font-bold leading-loose transition duration-200">
                    Voir toutes les Publications
                </button>
                </div>
            </div>
            <div class="flex flex-wrap -mx-3">
                <div class="mb-8 lg:mb-0 w-full lg:w-1/4 px-3">
                <div class="py-4 px-6 bg-gray-600 shadow rounded">
                    <h4 class="mb-4 text-gray-500 font-bold uppercase">
                        Categories
                    </h4>
                    <ul>
                        {isLoadingCategory ? (
                            <Loader/>
                        ): isError ? (
                            <h2 className="text-center text-3xl text-red-600">
                                Une erreur s'est produite, Aucune  Categorie trouvée
                            </h2>
                        ): categoryList?.length <= 0 ? (
                            <h2 className="text-center text-3xl text-green-800">
                                    Aucune  Categorie trouvée
                            </h2>
                        ):(
                            categoryList?.map(category => (
                                <li key={category._id}>
                                    <p className="block cursor-pointer py-2 px-3 mb-4 rounded text-yellow-500 font-bold bg-gray-500">
                                        {category?.title}
                                    </p>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
                </div>
                <div class="w-full lg:w-3/4 px-3">
                {isLoading ? (
                    <Loader/>
                ): error ? (
                    <h2 className="text-center text-3xl text-red-600">
                         Une erreur s'est produite, Aucune  publication trouvée
                    </h2>
                ) : postlist?.length <= 0 ? (
                    <h2 className="text-center text-3xl text-green-800">
                        Aucune  Categorie trouvée
                    </h2>
                ) : ( postlist.map(post => (
                <div key={post._id} class="flex flex-wrap bg-gray-900 -mx-3  lg:mb-6">
                    <div class="mb-10  w-full lg:w-1/4 px-3">
                    <Link>
                        {/* Post image */}
                        <img
                        class="w-full h-full object-cover rounded"
                        src={post?.image}
                        alt=""
                        />
                    </Link>
                    {/* Likes, views dislikes */}
                    <div className="flex flex-row bg-gray-300 justify-center w-full  items-center ">
                        {/* Likes */}
                        <div className="flex flex-row justify-center items-center ml-4 mr-4 pb-2 pt-1">
                        {/* Togle like  */}
                        <div className="">
                            <FaThumbsUp 
                            onClick={() => likepost(post?._id)}
                            className="h-7 w-7 text-indigo-600 cursor-pointer" 
                            />
                        </div>
                        <div className="pl-2 text-gray-600">
                            {post?.likes?.lenght}
                            {/* {post?.likes?.lenght ? post?.likes?.lenght : 0} */}
                        </div>
                        </div>
                        {/* Dislike */}
                        <div className="flex flex-row  justify-center items-center ml-4 mr-4 pb-2 pt-1">
                        <div>
                            <FaThumbsDown className="h-7 w-7 cursor-pointer text-gray-600" />
                        </div>
                        <div className="pl-2 text-gray-600">
                            {post?.disLikes?.lenght ? post?.disLikes?.lenght : 0}
                        </div>
                        </div>
                        {/* Views */}
                        <div className="flex flex-row justify-center items-center ml-4 mr-4 pb-2 pt-1">
                        <div>
                            <FaEye className="h-7 w-7  text-gray-400" />
                        </div>
                        <div className="pl-2 text-gray-600">
                            {post?.numViews}
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="w-full lg:w-3/4 px-3">
                    <Link class="hover:underline">
                        <h3 class="mb-1 text-2xl text-green-400 font-bold font-heading">
                        {/* {capitalizeWord(post?.title)} */} 
                        {post?.title}
                        </h3>
                    </Link>
                    <p class="text-gray-300">{post.description}</p>
                    {/* Read more */}
                    <Link className="text-indigo-500 hover:underline">
                        En savoir plus...
                    </Link>
                    {/* User Avatar */}
                    <div className="mt-6 flex items-center">
                        <div className="flex-shrink-0">
                        <Link>
                            <img
                            className="h-10 w-10 rounded-full"
                            src={post?.user?.profilePhoto}
                            alt=""
                            />
                        </Link>
                        </div>
                        <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                            <Link className="text-yellow-400 hover:underline ">
                                {post?.user?.firstName} {post?.user?.lastName}
                            </Link>
                        </p>
                        <div className="flex space-x-1 text-sm text-green-500">
                            <time>
                            {/* <DateFormatter date={post?.createdAt} /> */}
                            {post?.createdAt.substring(0, 10)}
                            </time>
                            <span aria-hidden="true">&middot;</span>
                        </div>
                        </div>
                    </div>
                    {/* <p class="text-gray-500">
                            Quisque id sagittis turpis. Nulla sollicitudin rutrum
                            eros eu dictum...
                        </p> */}
                    </div>
                </div>
                )))}
                </div>
            </div>
            </div>
        </div>
        <div className="bg-gray-900">
            <div class="skew bg-green-500 skew-bottom mr-for-radius">
            <svg
                class="h-8 md:h-12 lg:h-10 w-full text-gray-900"
                viewBox="0 0 10 10"
                preserveAspectRatio="none"
            >
                <polygon fill="currentColor" points="0 0 10 0 0 10"></polygon>
            </svg>
            </div>
            <div class="skew bg-gray-500  skew-bottom ml-for-radius">
            <svg
                class="h-8 bg-gray-500 md:h-12 lg:h-20 w-full text-gray-900"
                viewBox="0 0 10 10"
                preserveAspectRatio="none"
            >
                <polygon fill="currentColor" points="0 0 10 0 10 10"></polygon>
            </svg>
            </div>
        </div>
        </section>
    </>
    );
}
