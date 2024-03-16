import { useState } from 'react'
import axios from 'axios'
import spinner from './assets/spinner.svg'
import visit from './assets/goto.svg'
import arrow_up from './assets/arrow_up.svg'

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState('');
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      let response = await axios.post(BASE_URL, formData, {
        "Accept": "*/*",
        'Content-Type': 'multipart/form-data',
      });
      if (response.status === 200) {
        setResult(response.data);
      } else {
        setAlert('Something went wrong!');
      }
      setAlert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      setAlert('Failed to upload file');
    } finally {
      setTimeout(() => {
        setAlert('');
      }, 2000);
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-full bg-cyan-900'>
      <div className='min-h-svh max-w-4xl m-auto flex flex-col py-20 px-4 gap-4'>
        <div className='flex flex-col bg-cyan-800 text-cyan-200 border border-cyan-600 shadow-xl rounded-md'>
          <p className='font-bold text-xl font-sans p-5'>Upload the zip file downloaded from instagram</p>
        </div>
        <div className='z-30 sticky top-4 flex flex-col gap-4'>
          <div className='flex flex-col justify-center gap-2 p-8 bg-cyan-800 text-cyan-200 border border-cyan-600 shadow-xl rounded-md '>
            <input className=" text-sm text-cyan-200 file:shadow-lg file:mr-5 file:py-2 file:px-3 file:border-0 file:text-xs file:font-medium file:bg-cyan-900 file:text-cyan-200 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-cyan-900" type="file" accept=".zip" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!file} className='border border-cyan-500 px-3 py-1 hover:border-white hover:text-white'>Upload</button>
          </div>
          {result && <p className='p-4 bg-cyan-800 text-cyan-200 border border-cyan-600  rounded-md flex flex-row justify-between items-center shadow-xl '>
            <p>Total non-followers:</p>
            <p>{result?.length}</p>
          </p>}
        </div>
        <div className='flex flex-col gap-4'>
          {result?.map((item) => {
            return <a href={`https://instagram.com/${item}`} key={item} className='p-4 bg-cyan-800 text-cyan-200  rounded-md flex flex-row justify-between items-center shadow-md hover:scale-105 transition-all ease-in-out duration-500' target='_blank'>
              <p>{item}</p>
              <img src={visit} className="w-6 h-6" alt="visit" />
            </a>
          })}
        </div>
        {loading && <div className='absolute top-1/2 right-1/2 -translate-1/2 '>
          <img src={spinner} className="w-10 h-10 animate-spin" alt="spinner" />
        </div>}
      </div>
      {
        alert && <div className='fixed right-20 left-4 bottom-5 bg-cyan-200 w-auto min-h-10 flex justify-center items-center rounded-md shadow-xl'  >
          {alert}
        </div>
      }
      <div className='fixed bottom-5 right-5 p-3 bg-cyan-700 hover:bg-cyan-600 cursor-pointer shadow-xl rounded-full' onClick={
        () => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
        }
      }>
        <img src={arrow_up} className="w-5 h-5" alt="scroll to top"></img>
      </div>
    </div >
  );
}

export default App
