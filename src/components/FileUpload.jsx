import React, { useState } from 'react';
import { httpAxios } from '@/lib/httpHelper';
import { useDropzone } from 'react-dropzone';
import { AiOutlineFilePdf, AiOutlineFileImage } from 'react-icons/ai';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [extractedText, setExtractedText] = useState('');

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setUploadError(null);
    } else {
      setUploadError('Unsupported file type. Please upload a valid PDF or image file.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await httpAxios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setLoading(false);
      setFileUrl(response.data.filePath);
      setExtractedText(response.data.extractedText);
    } catch (error) {
      setLoading(false);
      setUploadError('Failed to upload file. Please try again.');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
    },
  });

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-md shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Upload Your File to Extract Text from it
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed border-gray-300 p-6 text-center rounded-md cursor-pointer ${
              selectedFile ? 'border-green-500 bg-green-50' : ''
            }`}
          >
            <input {...getInputProps()} />
            {selectedFile ? (
              <div className="flex flex-col items-center space-y-2">
                {selectedFile.type.includes('image') ? (
                  <AiOutlineFileImage className="text-4xl text-blue-500" />
                ) : (
                  <AiOutlineFilePdf className="text-4xl text-red-500" />
                )}
                <p className="text-sm text-gray-700">
                  Selected File: <span className="font-medium">{selectedFile.name}</span>
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500">Drag & drop your file here or</p>
                <button type="button" className="mt-2 text-blue-600 underline">
                  Browse Files
                </button>
              </div>
            )}
          </div>

          {!selectedFile && (
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mt-4">
                Or choose a file (PDF or Image)
              </label>
              <input
                type="file"
                id="file"
                name="file"
                accept=".pdf, image/*"
                onChange={handleFileChange}
                className="mt-2 p-2 border border-gray-300 rounded w-full"
              />
            </div>
          )}

          {uploadError && <div className="text-red-500 text-sm">{uploadError}</div>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>

        {fileUrl && (
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-medium mb-2">Uploaded File</h3>
            <p className="text-sm text-gray-500">
              File URL:{' '}
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                View File
              </a>
            </p>

            {extractedText && (
              <div>
                <h4 className="font-semibold text-lg">Extracted Text:</h4>
                <p className="text-sm text-gray-700">{extractedText}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;





// import React, { useState } from 'react';
// // import axios from 'axios';
// import { httpAxios } from '@/lib/httpHelper';
// import { useDropzone } from 'react-dropzone';
// import { AiOutlineFilePdf, AiOutlineFileImage } from 'react-icons/ai';

// const FileUpload = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [uploadError, setUploadError] = useState(null);
//   const [fileUrl, setFileUrl] = useState('');
//   const [extractedText, setExtractedText] = useState('');

//   const handleDrop = (acceptedFiles) => {
//     setSelectedFile(acceptedFiles[0]);
//     setUploadError(null);
//   };

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//     setUploadError(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedFile) return;
  
//     setLoading(true);
  
//     const formData = new FormData();
//     formData.append('file', selectedFile);
  
//     try {
//       const response = await httpAxios.post('/api/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
  
//       setLoading(false);
//       setFileUrl(response.data.filePath);
//       setExtractedText(response.data.extractedText);
//     } catch (error) {
//       setLoading(false);
//       setUploadError('Failed to upload file. Please try again.');
//     }
//   };



//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop: handleDrop,
//     accept: '.pdf, image/*',
//   });

//   return (
//     <div className="container mx-auto p-4">
//       <div className="max-w-xl mx-auto bg-white p-8 rounded-md shadow-md">
//         <h1 className="text-2xl font-semibold text-center mb-6">
//           Upload Your File to Extract Text from it
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Drag-and-drop or file selection */}
//           <div
//             {...getRootProps()}
//             className={`border-2 border-dashed border-gray-300 p-6 text-center rounded-md cursor-pointer ${
//               selectedFile ? 'border-green-500 bg-green-50' : ''
//             }`}
//           >
//             <input {...getInputProps()} />

//             {selectedFile ? (
//               <div className="flex flex-col items-center space-y-2">
//                 {selectedFile.type.includes('image') ? (
//                   <AiOutlineFileImage className="text-4xl text-blue-500" />
//                 ) : (
//                   <AiOutlineFilePdf className="text-4xl text-red-500" />
//                 )}
//                 <p className="text-sm text-gray-700">
//                   Selected File: <span className="font-medium">{selectedFile.name}</span>
//                 </p>
//               </div>
//             ) : (
//               <div>
//                 <p className="text-sm text-gray-500">Drag & drop your file here or</p>
//                 <button
//                   type="button"
//                   className="mt-2 text-blue-600 underline"
//                 >
//                   Browse Files
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* File picker fallback */}
//           {!selectedFile && (
//             <div>
//               <label
//                 htmlFor="file"
//                 className="block text-sm font-medium text-gray-700 mt-4"
//               >
//                 Or choose a file (PDF or Image)
//               </label>
//               <input
//                 type="file"
//                 id="file"
//                 name="file"
//                 accept=".pdf, image/*"
//                 onChange={handleFileChange}
//                 className="mt-2 p-2 border border-gray-300 rounded w-full"
//               />
//             </div>
//           )}

//           {uploadError && (
//             <div className="text-red-500 text-sm">{uploadError}</div>
//           )}

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none"
//             disabled={loading}
//           >
//             {loading ? 'Uploading...' : 'Upload'}
//           </button>
//         </form>

//         {fileUrl && (
//           <div className="mt-6 space-y-4">
//             <h3 className="text-xl font-medium mb-2">Uploaded File</h3>
//             <p className="text-sm text-gray-500">
//               File URL:{' '}
//               <a
//                 href={fileUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600"
//               >
//                 View File
//               </a>
//             </p>

//             {extractedText && (
//               <div>
//                 <h4 className="font-semibold text-lg">Extracted Text:</h4>
//                 <p className="text-sm text-gray-700">{extractedText}</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FileUpload;