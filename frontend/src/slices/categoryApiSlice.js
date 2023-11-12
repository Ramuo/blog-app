import {CATEGORY_URL} from '../constants';
import {apiSlice} from './apiSlice';




export const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //Create Category
        addCategory: builder.mutation({
            query: (data) => ({
                url: CATEGORY_URL,
                method: 'post',
                body: data
            }),
        }),
        //Get Categories
        getCategories: builder.query({
            query: () => ({
                url: CATEGORY_URL,
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Categories']
        }),
        //Get category By ID
        getCategoryById: builder.query({
            query: (categoryId) => ({
                url: `${CATEGORY_URL}/${categoryId}`,
            }),
            keepUnusedDataFor: 5
        }),
        //Update Category
        updateCategory: builder.mutation({
            query: (data) => ({
                url: `${CATEGORY_URL}/${data.categoryId}`,
                method: 'PUT',
                body: data,
            })
        }),
        //Delete category
        deleteCategory: builder.mutation({
            query: (categoryId) => ({
                url: `${CATEGORY_URL}/${categoryId}`,
                method: 'DELETE'
            }),
        }),
    }),
});


export const {
    useAddCategoryMutation,
    useGetCategoriesQuery,
    useGetCategoryByIdQuery,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} = categoryApiSlice; 