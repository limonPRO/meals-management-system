import { useState } from "react";
import ComponentTitle from "../component/component-title/ComponentTitle";
import { useMutation } from "@tanstack/react-query";
import { post } from "../services/api";
import { useNavigate } from "react-router-dom";

const AddItems = () => {
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const navigate = useNavigate();
  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  const addMutation = useMutation({
    mutationFn: (newItem) => post(`/item/add`, newItem),
    onSuccess: () => {
      // Invalidate and refetch
      // Add any refetch logic if needed
      navigate("/item")
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate({
      name ,
      category,
    });
  };

  return (
    <>
      <ComponentTitle pageName="Items" />
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

            <div>
              <label className="mb-3 block !text-black dark:text-white">
                Select Category
              </label>

              <div className="relative z-20 bg-white dark:bg-form-input">
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    changeTextColor();
                  }}
                  className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
                    isOptionSelected ? "!text-black dark:text-white" : ""
                  }`}
                >
                  <option
                    value=""
                    disabled
                    className="text-body dark:text-bodydark"
                  >
                    Select Category
                  </option>
                  <option
                    value="Starch"
                    className="text-body dark:text-bodydark"
                  >
                    Starch
                  </option>
                  <option
                    value="Protein"
                    className="text-body dark:text-bodydark"
                  >
                    Protein
                  </option>
                  <option value="Veg" className="text-body dark:text-bodydark">
                    Veg
                  </option>
                  <option
                    value="Salads"
                    className="text-body dark:text-bodydark"
                  >
                    Salads
                  </option>
                  <option
                    value="Others"
                    className="text-body dark:text-bodydark"
                  >
                    Others
                  </option>
                </select>

                <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.8">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                        fill="#637381"
                      ></path>
                    </g>
                  </svg>
                </span>
              </div>
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

export default AddItems;
