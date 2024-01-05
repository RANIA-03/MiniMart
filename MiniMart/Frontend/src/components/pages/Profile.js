import React, { useContext, useEffect, useState } from "react";
import MainNavSigned from "../layout/MainNavSigned";
import { Avatar, Box, Button, Input, TextField } from "@mui/material";
import { Context } from "../../App";
import "./Profile.css";
import { useForm } from "react-hook-form";
import AdminNav from "../layout/AdminNav";
import MainNav from "../layout/MainNav";
export default function Profile() {
  const { isSigned, currentUser, setCurrentUser } = useContext(Context);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: currentUser });
  useEffect(() => {
    reset(currentUser);
  }, [currentUser, reset]);
  const onSubmit = (data) => {
    const updatedData = {
      _id: currentUser._id,
      fullName: data.fullName,
      username: data.username,
      email: data.email,
    };

    if (
      data.fullName === currentUser.fullName &&
      data.username === currentUser.username &&
      data.email === currentUser.email
    ) {
      console.log("same");
    } else {
      fetch("http://localhost:3000/update-info", {
        method: "POST",
        body: JSON.stringify(updatedData),
        headers: { "Content-Type": "application/json" },
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.status) {
            setCurrentUser(result.result);
            alert("Updated Successfully");
            window.location.reload();
          } else {
            alert(result.msg);
            reset(currentUser);
          }
        });
    }
  };
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("No file Selected");
    } else {
      const formData = new FormData();
      formData.append("file", selectedFile);
      let r = await fetch("http://localhost:3000/uploads", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          if (result.status) {
            alert("Uploaded Successfully");
            window.location.reload();
            return result;
          }
        })
        .catch((error) => {
          console.error("Error uploading photo:", error);
        });

      fetch(`http://localhost:3000/update`, {
        method: "POST",
        body: JSON.stringify({ fileId: r.document._id, user: currentUser }),
        headers: { "Content-Type": "application/json" },
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.status) {
            const updatedUser = {
              ...currentUser,
              profilePhoto: r.document._id,
            };
            setCurrentUser(updatedUser);
          }
        });
    }
  };

  const [imgUrl, setImgUrl] = useState("");
  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const response = await fetch(`http://localhost:3000/download`, {
          method: "POST",
          body: JSON.stringify({ id: currentUser.profilePhoto }),
          headers: { "Content-Type": "application/json" },
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImgUrl(url);
      } catch (error) {
        console.error("Error fetching profile photo:", error);
      }
    };
    fetchProfilePhoto();
  }, [currentUser.profilePhoto, imgUrl]);
  const handleFileDownload = async () => {
    if (!currentUser.profilePhoto) {
      alert("You Don't have a Profile Photo");
    } else {
      try {
        const response = await fetch(`http://localhost:3000/download`, {
          method: "POST",
          body: JSON.stringify({ id: currentUser.profilePhoto }),
          headers: { "Content-Type": "application/json" },
        });
        const blob = await response.blob();
        const newPhotoUrl = URL.createObjectURL(blob);
        setCurrentUser((prevUser) => ({
          ...prevUser,
          profilePhotoUrl: newPhotoUrl,
        }));

        let a = document.createElement("a");
        a.href = newPhotoUrl;
        a.download = `${new Date()}.jpg`;
        a.click();
      } catch (error) {
        console.error("Error downloading profile photo:", error);
      }
    }
  };

  return (
    <>
      {currentUser.role === "admin" ? (
        <AdminNav />
      ) : !isSigned ? (
        <MainNav />
      ) : (
        <MainNavSigned />
      )}
      <Box
        sx={{
          m: 3,
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          border: "5px solid blue",
        }}
      >
        <h1>My Account Information</h1>
        <br />
        <br />
        <h2>Personal Details</h2>
        <br />
        {currentUser.profilePhoto && (
          <Avatar
            alt={imgUrl}
            src={imgUrl}
            sx={{ width: 100, height: 100, mt: 2 }}
          />
        )}
        <Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              sx={{ width: "100%", mt: 2 }}
              id="filled-basic"
              label="Full Name"
              variant="filled"
              {...register("fullName", {
                required: "Full Name is Required",
              })}
              InputLabelProps={{
                style: { fontSize: 12, marginTop: "-8px" },
              }}
            />
            {errors.fullName && (
              <span
                className="error"
                style={{ color: "red", fontSize: "13px" }}
              >
                {errors.fullName.message}
              </span>
            )}

            <TextField
              sx={{ width: "100%", mt: 2 }}
              id="filled-basic"
              label="Email"
              variant="filled"
              {...register("email", {
                required: "Email Address is Required",
              })}
              InputLabelProps={{
                style: { fontSize: 12, marginTop: "-8px" },
              }}
            />
            {errors.email && (
              <span
                className="error"
                style={{ color: "red", fontSize: "13px" }}
              >
                {errors.email.message}
              </span>
            )}
            <TextField
              sx={{ width: "100%", mt: 2 }}
              id="filled-basic"
              label="Username"
              variant="filled"
              {...register("username", {
                required: "Username is Required",
              })}
              InputLabelProps={{
                style: { fontSize: 12, marginTop: "-8px" },
              }}
            />
            {errors.username && (
              <span
                className="error"
                style={{ color: "red", fontSize: "13px" }}
              >
                {errors.username.message}
              </span>
            )}
            <Button
              type="submit"
              sx={{ width: "100%", mt: 2, background: "rgb(	255	,195,	0,0.8)" }}
            >
              Edit Account Info
            </Button>
          </form>
          <br />
          <h2 style={{ textAlign: "left" }}>Upload Profile Photo</h2>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Input
              type="file"
              onChange={handleFileChange}
              sx={{ width: "30%", mt: 2 }}
            />
            <Box sx={{ display: "flex", gap: "16px" }}>
              <Button
                onClick={handleFileUpload}
                sx={{
                  width: "30%",
                  mt: 2,
                  background: "rgba(255, 195, 0, 0.8)",
                }}
              >
                Upload Photo
              </Button>

              <Button
                onClick={handleFileDownload}
                sx={{
                  width: "30%",
                  mt: 2,
                  background: "rgba(255, 195, 0, 0.8)",
                }}
              >
                Download
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
