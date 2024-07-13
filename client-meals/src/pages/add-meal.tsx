import { useState } from "react";
import ComponentTitle from "../component/component-title/ComponentTitle";
import { useMutation } from "@tanstack/react-query";
import { post } from "../services/api";
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
            const errorMessage = error.response.data.message; // Adjust based on your API response structure
            toast.error(errorMessage);
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

  return (
    <>
      <ComponentTitle pageName="meal" />
      <form className="form-item" onSubmit={handleSubmit}>
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium !text-black dark:text-white">Name</h3>
          </div>
          <div className="flex flex-col gap-5.5 p-6.5">
            <div>
              <label className="mb-3 block !text-black dark:text-white">
                Default Input
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Default Input"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 !text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

           <MultiSelect id="multi" options={options} setOptions={setOptions}/>

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
