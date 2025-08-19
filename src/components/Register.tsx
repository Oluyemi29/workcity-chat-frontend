import { addToast, Button, Card, Input } from "@heroui/react";
import React, { useState } from "react";
import { BackendURL } from "../hooks/apiLinks";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";

type FormDataType = {
  username: string;
  email: string;
  password: string;
};
const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { email, password, username } = formData;
      if (!email) {
        return addToast({
          title: "Error",
          color: "danger",
          description: "Email is required",
          timeout: 6000,
        });
      }
      if (!username) {
        return addToast({
          title: "Error",
          color: "danger",
          description: "Username is required",
          timeout: 6000,
        });
      }
      if (!password) {
        return addToast({
          title: "Error",
          color: "danger",
          description: "Password is required",
          timeout: 6000,
        });
      }
      const apiLink = BackendURL();

      const request = await fetch(`${apiLink}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, username, password }),
      });
      const response = await request.json();
      if (response.success) {
        addToast({
          title: "Done",
          description: response.message,
          color: "success",
          timeout: 6000,
        });
        setFormData((prevData) => {
          return {
            ...prevData,
            email: "",
            password: "",
            username: "",
          };
        });
        return navigate("/login");
      } else {
        addToast({
          title: "Error",
          description: response.message,
          color: "danger",
          timeout: 6000,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full flex justify-center md:mt-10 mt-20">
      <Card className="lg:w-2/6 md:w-3/6 w-full p-5 flex flex-col justify-center items-center">
        <form
          className="flex flex-col w-full gap-5"
          onSubmit={(e: React.FormEvent) => handleSubmit(e)}
        >
          <div>
            <p className="text-lg font-semibold text-teal-700 text-center">
              Registration form
            </p>
            <p className="text-sm text-teal-700/65 text-center">
              Kindly enter correct details
            </p>
          </div>

          <Input
            label="username"
            placeholder="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e)
            }
          />
          <Input
            label="email"
            placeholder="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e)
            }
          />
          <Input
            label="password"
            placeholder="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e)
            }
            endContent={
              showPassword ? (
                <IoEyeOff
                  className="cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <FaEye
                  className="cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )
            }
          />
          {loading ? (
            <Button
              disabled
              isLoading
              type="button"
              className="bg-teal-700/65 cursor-not-allowed h-12 mt-20 text-white"
            >
              Registering...
            </Button>
          ) : (
            <Button
              type="submit"
              className="cursor-pointer bg-teal-700 mt-20 h-12 text-white"
            >
              Submit
            </Button>
          )}
        </form>
        <p className="text-[0.8rem] mt-2">
          Already have an account?{" "}
          <Link
            className="underline underline-offset-2 font-semibold text-teal-700"
            to={"/login"}
          >
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;
