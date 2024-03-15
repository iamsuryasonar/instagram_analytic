import { useState } from 'react'
import axios from 'axios'

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      let response = await axios.post('http://localhost:3000/', formData, {
        "Accept": "*/*",
        'Content-Type': 'multipart/form-data',
      });
      if (response.status === 200) {
        console.log(response.data)
        setResult(response.data);
      }
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    }
  };

  return (
    <div className='min-h-svh w-11/12 m-auto flex flex-col gap-4 p-6'>
      <div className=' flex flex-col '>
        <div className='flex flex-col justify-center gap-2 bg-slate-100 p-8 shadow-xl rounded-md'>
          <p className='font-bold text-xl font-sans pb-4'>Upload a Zip File</p>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={!file} className='border border-black px-3 py-1'>Upload</button>
        </div>
      </div>
      <div className='flex flex-col gap-4  m-2'>
        {result?.map((item) => {
          return <p key={item} className='p-4 bg-blue-100 shadow-md'>{item}</p>
        })}
      </div>
    </div>
  );
}

export default App
