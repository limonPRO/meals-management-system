import React, { useState, useEffect } from "react";
import ComponentTitle from "../component/component-title/ComponentTitle";
import { useMutation, useQuery } from "@tanstack/react-query";
import { get, post, put } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { isNotEditing, setId } from "../features/commonSlice";


const AddUsers = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [is_banned, setIsBanned] = useState<number>(0); // Assuming 0 means not banned by default
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { editing, id } = useSelector((state: RootState) => state.common);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  const addMutation = useMutation({
    mutationFn: (newUser) => post(`/users/add`, newUser),
    onSuccess: () => {
        toast.success("added success fully")
      navigate("/users");
    },
    onError:() => {
        toast.error("something went wrong")

    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedUser) => put(`/users/update/${id}`, updatedUser),
    onSuccess: () => {
        dispatch(setId(""))
        dispatch(isNotEditing())
        toast.success("updated success fully")
      navigate("/users");
    },
    onError:() => {
        toast.error("something went wrong")

    },
  });

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => get(`/users/${id}`),
    enabled: editing, // Fetch data only if editing mode is enabled
  });


  useEffect(() => {
    if (editing && data) {
      setEmail(data?.data?.email);
      setRole(data?.data?.role);
      setIsBanned(data?.data?.is_banned);
      // Password field is not set here to hide it during editing
    }
  }, [editing, data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (editing) {
            updateMutation.mutate({
              email,
              role,
              is_banned,
            });
          } else {
            addMutation.mutate({
              email,
              password,
              role,
            });
          }
    } catch (error) {
        // console.log(error)
        toast.error("something went wrong")
    }
   
  };

  return (
    <>
      <ComponentTitle pageName={editing ? "Edit User" : "Add User"} />
      <form className="form-item" onSubmit={handleSubmit}>
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium !text-black dark:text-white">User Details</h3>
          </div>
          <div className="flex flex-col gap-5.5 p-6.5">
            <div>
              <label className="mb-3 block !text-black dark:text-white">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 !text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        
              />
            </div>

            {!editing && ( // Show password field only when not editing
              <div>
                <label className="mb-3 block !text-black dark:text-white">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 !text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            )}

            <div>
              <label className="mb-3 block !text-black dark:text-white">Select Role</label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  changeTextColor();
                }}
                className={`w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
                  isOptionSelected ? "!text-black dark:text-white" : ""
                }`}
              >
                <option value="" disabled className="text-body dark:text-bodydark">
                  Select Role
                </option>
                <option value="General" className="text-body dark:text-bodydark">
                  General
                </option>
                <option value="Admin" className="text-body dark:text-bodydark">
                  Admin
                </option>
              </select>
            </div>
{editing  &&  <div>
              <label className="mb-3 block !text-black dark:text-white">Select Status</label>
              <select
                value={is_banned}
                onChange={(e) => {
                  setIsBanned(Number(e.target.value));
                  changeTextColor();
                }}
                className={`w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
                  isOptionSelected ? "!text-black dark:text-white" : ""
                }`}
              >
                   <option value="" disabled className="text-body dark:text-bodydark">
                  Select status
                </option>
                <option value={0} className="text-body dark:text-bodydark">
                  Not Banned
                </option>
                <option value={1} className="text-body dark:text-bodydark">
                  Banned
                </option>
              </select>
            </div>}
           

            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-primary py-3 px-5 text-black hover:bg-primary-dark"
            >
              {editing ? "Update User" : "Add User"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddUsers;
