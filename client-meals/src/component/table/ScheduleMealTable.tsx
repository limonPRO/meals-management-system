import { useSelector } from "react-redux";
import { RootState } from "../../lib/store";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { deleteApi, fetchPosts, get } from "../../services/api";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import moment from "moment";


const ScheduleMealTable = () => {
 
  const { data , isLoading , refetch} = useQuery({
    queryKey: ["items"],
    queryFn: () => get("/meal/schedule-meal"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteApi(`/item/${id}`),
    onSuccess: () => {
      // Invalidate and refetch
      refetch();
      Swal.fire("Deleted!", "The item has been deleted.", "success");
    },
    onError: () => {
      Swal.fire("Error!", "An error occurred while deleting the item.", "error");
    },
  });

  const handleDelete = (id:string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id as any);
      }
    });
  };
   
 

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium !text-black  xl:pl-11">
                Meal Name
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium !text-black  dark:text-white">
               category
              </th>
              {/* moment().format("MMM Do YY"); */}
            </tr>
          </thead>
          <tbody>
            {(!isLoading && data) && data?.data?.map((item:any, index:any) => (
              <tr key={index}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <p className="text-sm">{item.meal_name}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="!text-black dark:text-white">
                  {moment(item.scheduled_date).format("MMM Do YY")}
                  </p>
                </td>
         
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleMealTable;
