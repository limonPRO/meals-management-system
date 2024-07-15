import { useEffect, useState } from "react";
import ComponentTitle from "../component/component-title/ComponentTitle";
import { useMutation, useQuery } from "@tanstack/react-query";
import { get, post } from "../services/api";
import { useNavigate } from "react-router-dom";
import MultiSelect from "../component/component-title/MultiSelect";
import toast from "react-hot-toast";

interface Option {
    value: number;
    text: string;
  }

const AddMeal = () => {
  const [name, setName] = useState<string>("");
  const [options, setOptions] = useState<Option[]>([]);
  const navigate = useNavigate();
  const [intialData, setInitailData] = useState<any[]>([]);
  const selectedItems = options
  .filter((item:any) => item.selected)
  .map(item => ({ id: Number(item.value) }));


  const addMutation = useMutation({
    mutationFn: (newItem) => post(`/meal/add`, newItem),
    onSuccess: () => {
      // Invalidate and refetch
      toast.success("added items")
      // Add any refetch logic if needed
      navigate("/meal")
    },
    onError: (error:any) => {
        if (error.response && error.response.data) {
          console.log(error.response.data)
            const errorMessage = error.response.data.message; // Adjust based on your API response structure
            toast.error(errorMessage || "select at least 3 items");
          } else {
            toast.error("Failed to add item. Please try again.");
          }
      },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate({
      name ,
      items:selectedItems,
    });
  };

  const { data , isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: () => get("/item"),
  });

useEffect(()=>{
if(!isLoading && data){
    setInitailData(data?.data)
}
}, [data ,isLoading ])
  return (
    <>
      <ComponentTitle pageName="meal" />
      <form className="form-item" onSubmit={handleSubmit}>
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4">
   
          <div className="flex flex-col gap-5.5 p-6.5">
            <div>
              <label className="mb-3 block !text-black dark:text-white">
               name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Default Input"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 !text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
            <label className="mb-3 block !text-black dark:text-white">
               items
              </label>
           <MultiSelect id="multi" options={options} setOptions={setOptions} intialData={intialData}/>
           </div>
            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-primary py-3 px-5 text-black hover:bg-primary-dark"
            >
              Add Item
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddMeal;
