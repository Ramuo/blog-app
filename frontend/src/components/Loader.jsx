import loader from '../img/loader.gif';

const Loader = () => {
  return (
    <div className='w-100 mt-20'>
        <img 
        width={180} 
        className='text-center mx-auto'
        src={loader} 
        alt='Loading...' 
        />
    </div>
  )
}

export default Loader