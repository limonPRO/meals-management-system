import React, { useState } from 'react';
import { useMutation, useQuery } from "@tanstack/react-query";
import { get, post } from "../../services/api";
import CalenderIcon from "../../assets/icons/Calender";
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setId } from '../../features/commonSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../lib/store';

const MealTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(""); // State to store selected date
const dispatch = useDispatch()

 const {id} = useSelector((state:RootState)=>state.common)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["items"],
    queryFn: () => get("/meal"),
  });

  const addMutation = useMutation({
    mutationFn: ({ meal_id, scheduled_date }:any) => post('/meal/schedule-meal', { meal_id, scheduled_date }),
    onSuccess: () => {
      toast.success("Meal scheduled successfully");
      setShowModal(false);
      dispatch(setId("")) // Close modal after successful scheduling
      refetch(); // Refetch data after scheduling to update the UI
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const selectedBirthday = formData.get('birthday');
    
    // Example meal_id and scheduled_date; replace with actual values
    const meal_id = 1; // Replace with actual meal_id
    addMutation.mutate({
      meal_id:id,
      scheduled_date: selectedBirthday,
    });
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium !text-black  xl:pl-11">
                Name
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium !text-black  dark:text-white">
                Items
              </th>
              <th className="py-4 px-4 font-medium !text-black  dark:text-white">
                Make Schedule
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              data &&
              data?.data?.map((item: any, index: any) => (
                <tr key={index}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <p className="text-sm">{item.name}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="!text-black dark:text-white">
                      {item.item_names}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button
                        onClick={() => {
                          dispatch(setId(item.id))
                          setShowModal(true)
                        }}
                        className="hover:text-primary"
                      >
                        <CalenderIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none w-[500px]">
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Schedule </h3>
                  <button
                    className="p-1 ml-auto  border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="!text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                    X 
                    </span>
                  </button>
                </div>
                <form className="p-4" onSubmit={handleSubmit}>
                  <input
                    className="w-full"
                    type="date"
                    id="birthday"
                    name="birthday"
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Schedule Meal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </div>
  );
};

export default MealTable;
