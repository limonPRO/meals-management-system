import { useSelector } from "react-redux";
import { RootState } from "../../lib/store";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { deleteApi, fetchPosts, get } from "../../services/api";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isEditing, setId } from "../../features/commonSlice";

const UserTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["items"],
    queryFn: () => get("/users"),
  });





  const handleEdit = (id: any) => {
    dispatch(setId(id));
    dispatch(isEditing());
    navigate("/add-user");
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium !text-black  xl:pl-11">
                name
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium !text-black  dark:text-white">
                category
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium !text-black  dark:text-white">
                Status
              </th>
              <th className="py-4 px-4 font-medium !text-black  dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              data &&
              data?.data?.map((item: any, index: any) => (
                <tr key={index}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <p className="text-sm">{item.email}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="!text-black dark:text-white">{item.role}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="!text-black dark:text-white">
                      {item.is_banned ? "banned" : "not banned"}
                    </p>
                  </td>

                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                     
                      <button onClick={() => handleEdit(item.id)}>
            
                        <svg
                        className="w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="100"
                          height="100"
                          viewBox="0 0 50 50"
                        >
                          <path d="M 46.574219 3.425781 C 45.625 2.476563 44.378906 2 43.132813 2 C 41.886719 2 40.640625 2.476563 39.691406 3.425781 C 39.691406 3.425781 39.621094 3.492188 39.53125 3.585938 C 39.523438 3.59375 39.511719 3.597656 39.503906 3.605469 L 4.300781 38.804688 C 4.179688 38.929688 4.089844 39.082031 4.042969 39.253906 L 2.035156 46.742188 C 1.941406 47.085938 2.039063 47.453125 2.292969 47.707031 C 2.484375 47.898438 2.738281 48 3 48 C 3.085938 48 3.171875 47.988281 3.257813 47.964844 L 10.746094 45.957031 C 10.917969 45.910156 11.070313 45.820313 11.195313 45.695313 L 46.394531 10.5 C 46.40625 10.488281 46.410156 10.472656 46.417969 10.460938 C 46.507813 10.371094 46.570313 10.308594 46.570313 10.308594 C 48.476563 8.40625 48.476563 5.324219 46.574219 3.425781 Z M 45.160156 4.839844 C 46.277344 5.957031 46.277344 7.777344 45.160156 8.894531 C 44.828125 9.222656 44.546875 9.507813 44.304688 9.75 L 40.25 5.695313 C 40.710938 5.234375 41.105469 4.839844 41.105469 4.839844 C 41.644531 4.296875 42.367188 4 43.132813 4 C 43.898438 4 44.617188 4.300781 45.160156 4.839844 Z M 5.605469 41.152344 L 8.847656 44.394531 L 4.414063 45.585938 Z"></path>
                        </svg>
                      
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
