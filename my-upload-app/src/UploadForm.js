import React, { useState, useRef } from 'react';
import AWS from 'aws-sdk';

// Get environment variables
const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
const REGION = process.env.REACT_APP_REGION;

console.log(S3_BUCKET);
console.log(REGION);

AWS.config.update({
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

const UploadForm = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [submitState, setSubmitState] = useState('Upload');
  const fileInputRef = useRef(); // Use useRef instead of createRef

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitState("Uploading...");

    const params = {
      ACL: 'private',
      Body: file,
      Bucket: S3_BUCKET,
      Key: `${Date.now()}_${file.name}`,
    };

    myBucket.putObject(params)
      .on('httpUploadProgress', (evt) => {
        console.log("Progress:", evt.loaded, "of", evt.total);
      })
      .send(async (err) => {
        if (err) {
          console.log(err);
          alert("Error uploading file.");
          setSubmitState("Upload");
        } else {
          console.log("Successfully uploaded");
          alert("Successfully uploaded");

          const apiUrl = process.env.REACT_APP_API_URL;
          console.log(apiUrl);
          const s3FilePath = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${params.Key}`;
          console.log(s3FilePath);

          const requestData = {
            input_text: text,
            s3_file_path: s3FilePath,
          };

          try {
            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestData),
            });

            if (response.ok) {
              const data = await response.json();
              alert(`Data saved successfully: ${data.message}`);
            } else {
              const error = await response.json();
              alert(`Error saving data: ${error.message}`);
            }
          } catch (error) {
            console.error('Error saving data:', error);
            alert('Error saving data');
          }

          setText('');
          setFile(null);
          fileInputRef.current.value = ''; // Clear the file input value
          setSubmitState("Upload");
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Text:</label>
        <input type="text" value={text} onChange={handleTextChange} />
      </div>
      <div>
        <label>File:</label>
        <input type="file" onChange={handleFileChange} ref={fileInputRef} />
      </div>
      <button type="submit">{submitState}</button>
    </form>
  );
};

export default UploadForm;
