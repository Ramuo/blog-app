
import Select from 'react-select';
import Loader from './Loader';

import { 
    useGetCategoriesQuery,
    // useDeleteCategoryMutation 
  } from '../slices/categoryApiSlice';


// const options = [
//     { value: 'chocolate', label: 'Chocolate' },
//     { value: 'strawberry', label: 'Strawberry' },
//     { value: 'vanilla', label: 'Vanilla' }
// ]

const CategorySelect = (props) => {
    

    const {
        data: categoryList, 
        isLoading, 
        error,
        // refetch
      } = useGetCategoriesQuery();


     const allCategories = categoryList?.map(category => {
        return {
            label: category?.title,
            value: category?._id
        }
     })

    
  return (
    
    <div style={{margin: "1rem 0" }}>
        {isLoading ? (
            <Loader/>
        ): (
            <Select 
            options={allCategories }
            value={props?.value?.label}
            id="category"
            />
        )}
        {error && (
            <div style={{ color: "red", marginTop: ".5rem" }}>{props?.error}</div>
        )}
    </div>
  );
};

export default CategorySelect