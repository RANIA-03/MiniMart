import {
  Box,
  Button,
  FilledInput,
  FormControl,
  IconButton,
  InputLabel,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React from "react";
import { useForm } from "react-hook-form";
import InputAdornment from "@mui/material/InputAdornment";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../App";
import { useContext } from "react";
export default function LogIn() {
  const { setIsSigned, setCurrentUser, setCount } = useContext(Context);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    fetch("http://localhost:3000/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
      .then((result) => result.json())
      .then((result) => {
        reset();
        if (result.status) {
          setIsSigned(true);
          setCurrentUser(result.data);

          // localStorage.setItem("isSigned", JSON.stringify(true));
          // localStorage.setItem("currentUser", JSON.stringify(result.data[0]));
          localStorage.setItem("token", result.token);
          if (JSON.parse(localStorage.getItem("cartItems"))) {
            let cartItems = JSON.parse(localStorage.getItem("cartItems"));
            setCount(cartItems.length);
          }
          navigate("/");
        } else {
          alert(result.msg);
        }
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "85vh",
        "& > *": {
          mb: "20px",
        },
      }}
    >
      <h2 style={{ color: "#1976cd" }}>Feel free to Sign In</h2>
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
            {...register("email", {
              required: "email is Required",
            })}
            sx={{ width: "100%" }}
            id="filled-basic"
            label="Email"
            variant="filled"
          />
          {errors.email && (
            <span className="error" style={{ color: "red", fontSize: "13px" }}>
              {errors.email.message}
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
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />{" "}
            {errors.pass && (
              <span
                className="error"
                style={{ color: "red", fontSize: "13px" }}
              >
                {errors.pass.message}
              </span>
            )}
          </FormControl>
          <h5 style={{ textAlign: "right", marginTop: "7px" }}>
            <Link style={{ textDecoration: "none" }} to={"/reset-password"}>
              Forgot your password?
            </Link>
          </h5>
          <Button
            type="submit"
            sx={{ width: "100%", mt: 2, background: "rgb(	255	,195,	0,0.8)" }}
          >
            Sign in
          </Button>
        </form>
      </Box>

      <h5 style={{ color: "grey" }}>New to MiniMart?</h5>
      <Button
        sx={{
          textTransform: "none",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          padding: "10px",
          width: "340px",
          maxWidth: "100%",
          background: "rgb(	255	,195,	0,0.8)",
        }}
      >
        <Link
          style={{ textDecoration: "none", color: "#1976cd" }}
          to="/user-reg"
        >
          Create your MiniMart account
        </Link>
      </Button>
    </Box>
  );
}
