import React, { ChangeEvent, useState } from "react";
import Processing from "../src/components/Processing";
import ToastError from "../src/components/ToastError";
import ToastSucess from "../src/components/ToastSucess";
import useCreateCollection from "../src/hooks/useCreateCollection";
import { useMoralis } from "react-moralis";

const CreateCollection = () => {
  //State to save the IPFS url of the image.
  const [imgUrl, setImgUrl] = useState("");
  //state to save the inputs of the user
  const [formInput, updateFormInput] = useState({
    name: "Name",
    description: "",
    fee: "",
  });
  //Moralis authentication hook.
  const { isAuthenticated, authenticate } = useMoralis();
  //Success toast
  const [isSuccess, setisSuccess] = useState(false);
  //Error toast
  const [isError, setisError] = useState(false);
  //Processing modal overlay
  const [processing, setProcessing] = useState(false);
  //useCreateCollection functions = saveFile : function to save files on ipfs
  //                                create : deploy the nft contract. i.e. the NFT collection
  const [saveFile, create] = useCreateCollection();

  //call the custom hook function
  const submitCollection = async () => {
    const { name, description, fee } = formInput;
    //open authentication case the user didnt authenticate yet
    if (!isAuthenticated) authenticate();
    setProcessing(true);
    //call the custom hook with the necessary parameters
    const result = await create({
      name,
      description,
      imgUrl,
      fee,
      //the callback is the function that is executed when the process is finished.
      callback: success,
    });
    if (!result) {
      //if we got a result we close the locking modal.
      setProcessing(false);
      //if we got a error then we open the error toast and close it after 5 seconds.
      if (!isError) {
        setisError(true);
        setTimeout(function () {
          setisError(false);
        }, 5000);
      }
    }
  };
  //the success funcion is the callback that the custom hook will call when the process is finished
  const success = () => {
    //clean the input form.
    setImgUrl("");
    updateFormInput({ name: "", description: "", fee: "" });
    //close the locking modal.
    setProcessing(false);
    //open the success toast and close it after 5 seconds.
    if (!isSuccess) {
      setisSuccess(true);
      setTimeout(function () {
        setisSuccess(false);
      }, 5000);
    }
  };
  return (
    <div className="w-full mx-auto xl:w-10/12 ">
      <div className="w-11/12 md:w-10/12 lg:w-3/4 mx-auto mt-10 text-center bg-[#1E1E1E] rounded-xl">
        <div className="justify-center w-full p-8">
          <p className="mb-10 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl text-secondary">Create Collection</p>
          <div className="flex flex-wrap mb-6 -mx-3">
            <div className="w-full px-3 mb-6 sm:w-1/2 sm:mb-0">
              <label className="formLabel">Collection Name</label>
              <input 
                className="formInput" 
                type="text" 
                placeholder="Cool Collection Name"
                onChange={(e) =>
                  updateFormInput({ 
                    ...formInput, 
                    name: e.target.value })
                }/>
            </div>
            <div className="w-full px-3 sm:w-1/2">
              <label className="formLabel">Royalty (%)</label>
              <input 
                className="formInput"  
                type="text" 
                placeholder="2.5"
                onChange={(e) =>
                  updateFormInput({
                    ...formInput,
                    fee: Math.round(parseFloat(e.target.value) * 10).toString(),
                  })
              }/>
            </div>
          </div>
          <div className="flex flex-wrap mb-6 -mx-3">
            <div className="w-full px-3">
              <label className="formLabel">Description</label>
              <textarea 
                className="h-32 lg:h-60 formInput" 
                placeholder="Tell us about your awesome collection..."
                onChange={(e) =>
                  updateFormInput({
                    ...formInput,
                    description: e.target.value,
                  })
              }/>
            </div>
          </div>
          <button
              className="p-2 text-black rounded-lg bg-secondary hover:bg-primary hover:scale-110"
              onClick={submitCollection}>
              Create
          </button>      
        </div>
      </div>
      <Processing isOpen={processing} />
      {isSuccess && <ToastSucess isOpen={isSuccess} toggle={setisSuccess} />}
      {isError && <ToastError isOpen={isError} toggle={setisError} />}
    </div>
  );
};

export default CreateCollection;
