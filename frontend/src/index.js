import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store'
import './index.css';
// import ThemeProvider from './components/context/ThemeProvider';
import App from './App';

//Protected routes
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

//PAGES
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import NewCategoryPage from './pages/NewCategoryPage';
import CategoryListPage from './pages/CategoryListPage';
import UpdateCategoryPage from './pages/UpdateCategoryPage';
import CreatePost from './pages/CreatePost';
import PostsListPage from './pages/PostListPage';
import ProfilePage from './pages/ProfilePage';


//ROUTES

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App/>}>
      <Route index={true} path="/" element={<HomePage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/postlist' element={<PostsListPage/>}/>
      
  
      {/* Private Route */}
      <Route path='' element={<PrivateRoute/>}>
        <Route path='/createpost' element={<CreatePost/>}/>
        <Route path='/profile/:id' element={<ProfilePage/>}/>
       
      </Route>

      {/* Admin Route */}
      <Route path='' element={<AdminRoute/>}>
        <Route path='/category' element={<NewCategoryPage/>}/>
        <Route path='/categoryList' element={<CategoryListPage/>}/>
        <Route path='/category/:id/edit' element={<UpdateCategoryPage/>}/>
      </Route>

      <Route path="*" element={<h1 style={{textAlign:'center' }}>Not Found 404</h1>}/>
    </Route>

    
    
  )
);




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/> 
    </Provider>
  </React.StrictMode>
);

