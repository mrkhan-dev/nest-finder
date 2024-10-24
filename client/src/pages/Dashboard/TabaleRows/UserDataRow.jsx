import PropTypes from "prop-types";
import UpdateUserModal from "../../../components/Modal/UpdateUserModal";
import {useState} from "react";
import toast from "react-hot-toast";
import {useMutation} from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
const UserDataRow = ({user, refetch}) => {
  const [isOpen, setIsOpen] = useState(false);
  const axiosSecure = useAxiosSecure();
  const {mutateAsync} = useMutation({
    mutationFn: async (role) => {
      const {data} = await axiosSecure.patch(
        `/users/update/${user?.email}`,
        role
      );
      return data;
    },
    onSuccess: (data) => {
      refetch();
      setIsOpen(false);
      console.log(data);
      toast.success("User role updated successful.");
    },
  });

  const modalHandler = async (selected) => {
    console.log(selected);
    const userRole = {
      role: selected,
      status: "Verified",
    };
    try {
      await mutateAsync(userRole);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <tr>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{user?.email}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{user?.role}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {user?.status ? (
          <p
            className={`${
              user.status === "Verified" ? "text-green-500" : "text-rose-500"
            } whitespace-no-wrap`}
          >
            {user.status}
          </p>
        ) : (
          <p className="text-red-500 whitespace-no-wrap">Unavailable</p>
        )}
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <button
          onClick={() => setIsOpen(true)}
          className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
          ></span>
          <span className="relative">Update Role</span>
        </button>
        {/* Update User Modal */}
        <UpdateUserModal
          isOpen={isOpen}
          user={user}
          modalHandler={modalHandler}
          setIsOpen={setIsOpen}
          refetch={refetch}
        />
      </td>
    </tr>
  );
};

UserDataRow.propTypes = {
  user: PropTypes.object,
  refetch: PropTypes.func,
};

export default UserDataRow;
