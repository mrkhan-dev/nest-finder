import {useState} from "react";
import AddRoomForm from "../../../components/Form/AddRoomForm";
import useAuth from "../../../hooks/useAuth";
import {imageUpload} from "../../../api/utils";
import {Helmet} from "react-helmet-async";
import {useMutation} from "@tanstack/react-query";
import {axiosSecure} from "../../../hooks/useAxiosSecure";

const AddRoom = () => {
  const {user} = useAuth();
  const [imagePreview, setImagePreview] = useState();
  const [imageText, setImageText] = useState("Upload Image");
  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: null,
    key: "selection",
  });

  //Date range handler
  const handleDates = (item) => {
    setDates(item.selection);
  };

  const {mutateAsync} = useMutation({
    mutationFn: async (roomData) => {
      const {data} = await axiosSecure.post(`/room`, roomData);
      return data;
    },
    onSuccess: () => {
      console.log("data saved successfully");
    },
  });

  // form handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const location = form.location.value;
    const category = form.category.value;
    const title = form.title.value;
    const to = dates.endDate;
    const from = dates.startDate;
    const price = form.price.value;
    const guests = form.total_guest.value;
    const bathrooms = form.bathrooms.value;
    const description = form.description.value;
    const bedrooms = form.bathrooms.value;
    const image = form.image.files[0];
    const host = {
      name: user?.displayName,
      image: user?.photoURL,
      email: user?.email,
    };

    try {
      const image_url = await imageUpload(image);
      const roomData = {
        location,
        category,
        title,
        to,
        from,
        price,
        guests,
        host,
        bathrooms,
        bedrooms,
        description,
        image: image_url,
      };
      console.table(roomData);

      // post room data to server
      await mutateAsync(roomData);
    } catch (error) {
      console.log(error);
    }
  };

  // handle image change
  const handleImage = (image) => {
    setImagePreview(URL.createObjectURL(image));
    setImageText(image.name);
  };

  return (
    <>
      <Helmet>
        <title>Add Room | Dashboard</title>
      </Helmet>
      <AddRoomForm
        dates={dates}
        handleDates={handleDates}
        handleSubmit={handleSubmit}
        setImagePreview={setImagePreview}
        imagePreview={imagePreview}
        handleImage={handleImage}
        imageText={imageText}
      />
    </>
  );
};

export default AddRoom;
