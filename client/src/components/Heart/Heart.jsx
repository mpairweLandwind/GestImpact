import { useContext, useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { useMutation } from "react-query";
import UserDetailContext from "../../context/UserDetailContext";
import { checkFavourites, updateFavourites } from "../../utils/common";
import { toFav } from "../../utils/api";

const Heart = ({ id }) => {
  const [heartColor, setHeartColor] = useState("white");

  // Retrieve email and token from UserDetailContext
  const {
    userDetails: { favourites, token, email },
    setUserDetails,
  } = useContext(UserDetailContext);

  useEffect(() => {
    setHeartColor(() => checkFavourites(id, favourites));
  }, [favourites]);

  const { mutate } = useMutation({
    mutationFn: () => toFav(id, email, token), // Use email from UserDetailContext
    onSuccess: () => {
      setUserDetails((prev) => ({
        ...prev,
        favourites: updateFavourites(id, prev.favourites),
      }));
    },
  });

  const handleLike = () => {
    if (email) { // Ensure email is available before mutation
      mutate();
      setHeartColor((prev) => (prev === "#fa3e5f" ? "white" : "#fa3e5f"));
    } else {
      console.error("User is not logged in");
    }
  };

  return (
    <AiFillHeart
      size={24}
      color={heartColor}
      onClick={(e) => {
        e.stopPropagation();
        handleLike();
      }}
    />
  );
};

export default Heart;
