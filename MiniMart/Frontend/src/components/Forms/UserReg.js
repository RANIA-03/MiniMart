import {
  Box,
  Button,
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import MainNav from "../layout/MainNav";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
export default function UserReg() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const navigate = useNavigate();
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    fetch("http://localhost:3000/addUser", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
      .then((result) => result.json())
      .then((result) => {
        reset();

        if (result.status) {
          navigate("/signIn");
        } else alert(result.msg);
      });
  };

  return (
    <>
      <MainNav />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "90vh",
          "& > *": {
            mb: "15px",
          },
        }}
      >
        <h2 style={{ color: "#1976cd" }}>User Registration</h2>
        <Box
          sx={{
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            width: "300px",
            maxWidth: "100%",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              sx={{ width: "100%", mt: 2 }}
              id="filled-basic"
              label="Full Name"
              variant="filled"
              {...register("fullName", {
                required: "Full Name is Required",
              })}
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
              label="Email Address"
              variant="filled"
              type="email"
              {...register("email", {
                required: "Email Address is Required",
              })}
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
            />
            {errors.username && (
              <span
                className="error"
                style={{ color: "red", fontSize: "13px" }}
              >
                {errors.username.message}
              </span>
            )}
            <FormControl sx={{ width: "100%", mt: 2 }} variant="filled">
              <InputLabel htmlFor="filled-adornment-password">
                Password
              </InputLabel>
              <FilledInput
                {...register("pass", {
                  required: "Password is Required",
                })}
                id="filled-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {errors.pass && (
                <span
                  className="error"
                  style={{ color: "red", fontSize: "13px" }}
                >
                  {errors.pass.message}
                </span>
              )}
            </FormControl>
            <FormControl sx={{ width: "100%", mt: 2 }} variant="filled">
              <InputLabel htmlFor="filled-adornment-password">
                Confirm Password
              </InputLabel>
              <FilledInput
                {...register("cpass", {
                  required: "Required",
                })}
                id="filled-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>{" "}
            {errors.cpass && (
              <span
                className="error"
                style={{ color: "red", fontSize: "13px" }}
              >
                {errors.cpass.message}
              </span>
            )}
            <Button
              type="submit"
              sx={{ width: "100%", mt: 2, background: "rgb(	255	,195,	0,0.8)" }}
            >
              Create Account
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
}
