import { Button, Card, Input } from "@heroui/react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userAuth from "../store/userAuth";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";

type FormDataType = {
  email: string;
  password: string;
};
const Login = () => {
  const { Login } = userAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
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
      const { email, password } = formData;
      const response = await Login(email, password);
      if (response) {
        return navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full flex justify-center md:mt-20 mt-28">
      <Card className="lg:w-2/6 md:w-3/6 w-full p-5 flex flex-col justify-center items-center">
        <form
          className="flex flex-col w-full gap-5"
          onSubmit={(e: React.FormEvent) => handleSubmit(e)}
        >
          <div>
            <p className="text-lg text-center font-semibold text-teal-700">
              Login form
            </p>
            <p className="text-sm text-center text-teal-700/65">
              Kindly enter correct details
            </p>
          </div>

          <Input
            label="email"
            placeholder="email"
            type="email"
            name="email"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e)
            }
          />
          <Input
            label="password"
            placeholder="password"
            type={showPassword ? "text" : "password"}
            name="password"
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
              Login...
            </Button>
          ) : (
            <Button
              type="submit"
              className="cursor-pointer h-12 bg-teal-700 mt-20 text-white"
            >
              Submit
            </Button>
          )}
        </form>
        <p className="text-[0.8rem] mt-2">
          Dont have an account?{" "}
          <Link
            className="underline underline-offset-2 font-semibold text-teal-700"
            to={"/"}
          >
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
