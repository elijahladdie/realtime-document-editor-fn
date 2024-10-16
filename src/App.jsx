import React, { useEffect, useState } from "react";
import TextArea from "./components/TextArea";
// import TextEditor from "./components/TextEditor"; // Assuming this is your text editor component

const App = () => {
  const [isEditorVisible, setIsEditorVisible] = useState(false); // Track whether to show the editor
  const startedtyping = localStorage.getItem("startedTyping");
  useEffect(()=>{
    if(startedtyping){
      setIsEditorVisible(true)
    }
  },[])
 
  // Function to handle the button click
  const handleStartDocument = () => {
    setIsEditorVisible(true); // Show the text editor
  };

  return (
    <div className="app-container">
      {/* If the editor is not visible, show the landing page */}
      {!isEditorVisible ? (
        <div className="landing-page flex flex-col items-center justify-center h-screen bg-gray-100">
          <h1 className="text-4xl font-bold mb-6">
            Welcome to Your Realtime Collaboration Document
          </h1>
          <p className="text-xl mb-4">
            Are you ready to start Collaborating ?
          </p>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            onClick={handleStartDocument}
          >
            Quick Start
          </button>
        </div>
      ) : (<TextArea />)}
    </div>
  );
};

export default App;