import { useState, useEffect } from 'react'
import axios from 'axios'
import spinner from './assets/spinner.svg'
import visit from './assets/goto.svg'
import openMenu from './assets/down.svg'
import closeMenu from './assets/up.svg'
import arrow_up from './assets/arrow_up.svg'

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState('');
  const [menu, setMenu] = useState(false);
  const [tab, setTab] = useState('followers');
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  async function wakeUpServer() {
    await fetch(BASE_URL);
  }

  useEffect(() => {
    wakeUpServer();
  }, [])

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
      setAlert('File processed successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      setAlert('Failed to process file');
    } finally {
      setTimeout(() => {
        setAlert('');
      }, 2000);
      setLoading(false);
    }
  };

  function MenuItems() {
    return <>
      <div onClick={() => { setTab('followers') }} style={{ border: `${tab === 'followers' ? '1px solid white' : '1px solid transparent'}` }} className='flex flex-row gap-1 px-2 py-1 border border-transparent hover:border-cyan-400 hover:bg-cyan-900 hover:shadow-lg rounded-full cursor-pointer'>
        <p>Followers:</p>
        <p>{result?.followers.length}</p>
      </div>
      <div onClick={() => { setTab('followings') }} style={{ border: `${tab === 'followings' ? '1px solid white' : '1px solid transparent'}` }} className='flex flex-row gap-1 px-2 py-1 border border-transparent hover:border-cyan-400 hover:bg-cyan-900 hover:shadow-lg rounded-full cursor-pointer'>
        <p>Following:</p>
        <p>{result?.followings.length}</p>
      </div>
      <div onClick={() => { setTab('nonFollowers') }} style={{ border: `${tab === 'nonFollowers' ? '1px solid white' : '1px solid transparent'}` }} className='flex flex-row gap-1 px-2 py-1 border border-transparent hover:border-cyan-400 hover:bg-cyan-900 hover:shadow-lg rounded-full cursor-pointer'>
        <p>Non Followers:</p>
        <p>{result?.nonFollowers.length}</p>
      </div>
      <div onClick={() => { setTab('notFollowing') }} style={{ border: `${tab === 'notFollowing' ? '1px solid white' : '1px solid transparent'}` }} className='flex flex-row gap-1 px-2 py-1 border border-transparent hover:border-cyan-400 hover:bg-cyan-900 hover:shadow-lg rounded-full cursor-pointer'>
        <p>Not Following:</p>
        <p>{result?.notFollowing.length}</p>
      </div>
      <div onClick={() => { setTab('mutualFollowers') }} style={{ border: `${tab === 'mutualFollowers' ? '1px solid white' : '1px solid transparent'}` }} className='flex flex-row gap-1 px-2 py-1 border border-transparent hover:border-cyan-400 hover:bg-cyan-900 hover:shadow-lg rounded-full cursor-pointer'>
        <p>Mutual:</p>
        <p>{result?.mutualFollowers.length}</p>
      </div>
    </>
  }

  return (
    <div className='w-full h-full bg-cyan-900'>
      <div className='min-h-svh max-w-4xl m-auto flex flex-col py-20 px-4 gap-2'>
        <div className='z-30 sticky top-4 py-1 px-5 flex flex-row justify-between items-center bg-cyan-800 text-cyan-200 border border-cyan-600 shadow-xl rounded-full'>
          <p className='font-bold text-xl font-sans '>Instagram Analytic</p>
          {
            result && <div className='flex flex-col gap-1 md:hidden p-1 hover:bg-cyan-700 rounded-full' onClick={() => {
              setMenu(!menu)
            }}>
              {!menu ? <>
                <img src={openMenu} className="w-6 h-6 cursor-pointer" alt="open menu" />
              </>
                :
                <>
                  <img src={closeMenu} className="w-6 h-6 cursor-pointer" alt="close menu" />
                </>
              }
            </div>
          }
        </div>
        <div className='flex flex-row items-center bg-cyan-800 text-cyan-200 border border-cyan-600 shadow-xl rounded-md'>
          <p className='font-bold text-xl font-sans py-3 px-5'>Upload the zip file downloaded from instagram</p>
        </div>
        <div className='flex flex-col justify-center gap-2 p-6 bg-cyan-800 text-cyan-200 border border-cyan-600 shadow-xl rounded-md '>
          <input className=" text-sm text-cyan-200 file:shadow-lg file:mr-5 file:py-2 file:px-3 file:border-0 file:text-xs file:font-medium file:bg-cyan-900 file:text-cyan-200 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-cyan-900" type="file" accept=".zip" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={!file} className='border border-cyan-500 px-3 py-1 hover:border-white hover:text-white'>Upload</button>
        </div>
        <div className='z-30 sticky top-[70px] flex flex-col '>
          {result && <div className='hidden md:flex flex-col md:flex-row py-2 px-2 bg-cyan-800 text-cyan-200 border border-cyan-600  rounded-md justify-between items-center shadow-xl '>
            <MenuItems />
          </div>}
          {menu && result && <div className='flex md:hidden flex-col md:flex-row py-2 px-2 bg-cyan-800 text-cyan-200 border border-cyan-600  rounded-md justify-between items-center shadow-xl '>
            <MenuItems />
          </div>}
        </div>
        {!result && <div className=' p-8 bg-cyan-800 text-cyan-200 border border-cyan-600 shadow-xl rounded-md '>
          <p className='font-bold text-lg'>Instructions:</p>
          <ol className='list-disc list-inside'>
            <li>Download followers data from instagram</li>
            <li>Go to 'Download your information'</li>
            <li>Go to 'Download or transfer information'</li>
            <li>Go to 'Some of your information'</li>
            <li>Select 'Followers and following' then click 'Next'</li>
            <li>Select 'Download to device' and click 'Next'</li>
            <li>Filter 'Format' to 'JSON' and 'Date range' to 'All time'</li>
            <li>Click 'Create files'</li>
            <li>Now the JSON file will be available in 'Download your information' section</li>
            <li>Download it.</li>
            <li>Upload the JSON to this app and check your non-followers.</li>
          </ol>
        </div>
        }
        {!result && <div className=' p-8 bg-cyan-800 text-cyan-200 border border-cyan-600 shadow-xl rounded-md '>
          <p className='font-bold text-lg'>Features:</p>
          <ol className='list-disc list-inside'>
            <li>Followers</li>
            <li>Followings</li>
            <li>Users you don't follow</li>
            <li>Users who don't follow you</li>
            <li>Mutual followers</li>
          </ol>
        </div>
        }
        <div className='flex flex-col gap-4 mt-4'>
          {result?.[tab]?.map((item) => {
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
