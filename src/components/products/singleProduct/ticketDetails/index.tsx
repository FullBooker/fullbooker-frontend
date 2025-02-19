import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/shared/button";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { CartItem, Product } from "@/domain/product";
import {
  ChevronDown,
  ChevronDownCircle,
  KeyRound,
  Mail,
  Phone,
  User,
  UserCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInputAuth from "@/components/auth/FormInputAuth";
import { connect } from "react-redux";
import { RootState } from "@/store";
import { generateUUID } from "@/utilities";

type TicketDetailsProps = {
  productsRequestProcessing: boolean;
  product: Product;
  addToCart: (item: CartItem) => void;
  cart: Array<CartItem>;
  removeFromCart: (id: string) => void;
};

const defaultValues = {
  name: "",
  id_number: "",
  phone_number: "",
  email: "",
};

export interface FormData {
  name: string;
  id_number: string;
  phone_number: string;
  email: string;
}

export const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  id_number: yup.string().required("ID Number is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Provide a valid email address"),
  phone_number: yup.string().required("Phone number is required"),
});

const TicketDetails: FC<TicketDetailsProps> = ({
  productsRequestProcessing,
  product,
  addToCart,
  cart,
  removeFromCart,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedDate, setSelectedDate] = useState<any>();

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const { phone_number, email, id_number, name } = data;
    addToCart({
      id: generateUUID(),
      phone_number: phone_number,
      email: email,
      id_number: id_number,
      quantity: 1,
      name: name,
      total: parseInt(product?.pricing[0].cost),
    } as CartItem);
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  console.log("ERROR: ", errors);
  return (
    <div>
      {productsRequestProcessing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 w-full space-x-0 md:space-x-6 animate-pulse">
          {/* Ticket Selection */}
          <div className="mt-6 w-full">
            <div className="h-6 w-32 bg-gray-300 rounded mb-2"></div>
            <div className="w-full border-gray-500 border-b pb-1">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
                <div className="h-4 w-28 bg-gray-300 rounded"></div>
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
                <div className="h-4 w-36 bg-gray-300 rounded"></div>
              </div>
              <div className="flex justify-end mt-2 mb-2">
                <div className="h-4 w-40 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="py-3">
              <div className="w-full h-[300px] bg-gray-300 rounded-lg"></div>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full">
            {/* Date Selection */}
            <div className="mt-6">
              <div className="h-6 w-32 bg-gray-300 rounded mb-2"></div>
              <div className="w-full h-48 bg-gray-300 rounded-2xl"></div>
            </div>

            {/* Pricing Summary */}
            <div className="mt-6 rounded-2xl shadow-lg p-4 bg-gray-100">
              <div className="flex justify-center">
                <div className="w-[190px] h-[55px] bg-gray-300 rounded"></div>
              </div>

              <div className="space-y-4 px-4 md:px-8 py-4">
                <div className="h-4 w-40 bg-gray-300 rounded"></div>
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
                <div className="h-4 w-28 bg-gray-300 rounded"></div>
                <div className="h-4 w-36 bg-gray-300 rounded"></div>
                <div className="h-10 w-full bg-gray-300 rounded-lg mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-t border-gray-400 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[60%_40%] w-full space-x-0 md:space-x-6">
            {/* Ticket Selection */}
            <div className="mt-4 w-full">
              <h3 className="text-lg font-semibold mb-3">Ticket Details</h3>
              <div className="w-full pb-1">
                <form
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit(onSubmit)}
                  className=""
                >
                  <div className="space-y-4 bg-white shadow-lg py-6 px-3">
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <FormInputAuth
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Name"
                          onChange={onChange}
                          value={value}
                          icon={
                            <User className="w-4 h-4 text-white fill-gray-500" />
                          }
                          error={errors?.name?.message}
                        />
                      )}
                    />
                    <Controller
                      name="id_number"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <FormInputAuth
                          id="id_number"
                          name="id_number"
                          type="text"
                          placeholder="ID/Passport Number"
                          onChange={onChange}
                          value={value}
                          icon={
                            <UserCheck className="w-4 h-4 text-white fill-gray-500" />
                          }
                          error={errors?.id_number?.message}
                        />
                      )}
                    />
                    <Controller
                      name="phone_number"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <FormInputAuth
                          id="phone_number"
                          name="phone_number"
                          type="text"
                          placeholder="Phone Number"
                          onChange={onChange}
                          value={value}
                          icon={
                            <Phone className="w-4 h-4 text-white fill-gray-500" />
                          }
                          error={errors?.phone_number?.message}
                        />
                      )}
                    />

                    <Controller
                      name="email"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <FormInputAuth
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Email"
                          onChange={onChange}
                          value={value}
                          icon={
                            <Mail className="w-4 h-4 text-white fill-gray-500" />
                          }
                          error={errors?.email?.message}
                        />
                      )}
                    />
                  </div>
                  <div className="text-center mt-4">
                    <Button
                      extraClasses=""
                      margin="mb-3"
                      borderRadius="rounded-lg"
                      text="font-medium"
                      type="submit"
                    >
                      Add more tickets +
                    </Button>
                  </div>
                </form>
              </div>
              <div className="mt-4 border border-primary py-4 px-3">
                <p className="text-center mb-3">Tikets Summary</p>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="font-medium border text-center py-3">
                        Name
                      </th>
                      <th className="font-medium  border">ID/Passport</th>
                      <th className="text-center font-medium  border py-3">
                        Phone No
                      </th>
                      <th className="text-center font-medium  border py-3">
                        Email
                      </th>
                      <th className="text-center font-medium  border py-3">
                        QTY
                      </th>
                      <th className="text-center font-medium  border py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart?.map((item: CartItem, index: number) => (
                      <tr key={index} className="border-b pb-4 mb-4">
                        <td className="py-3 text-sm border text-center">
                          {item?.name}
                        </td>
                        <td className="py-3 text-sm border text-center">
                          {item?.id_number}
                        </td>
                        <td className="py-3 text-sm border text-center">
                          {" "}
                          {item?.phone_number}
                        </td>
                        <td className="py-3 text-sm border text-center">
                          {item?.email}
                        </td>
                        <td className="py-3 text-sm border text-center">
                          {item?.quantity}
                        </td>
                        <td className="py-3 text-center">
                          <Button
                            bg="bg-primary"
                            text="text-sm"
                            padding="px-2"
                            onClick={() => removeFromCart(item?.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-center mt-6 mb-3">
                  <p className="text-center">More than 3 tickets?</p>
                  <Button
                    bg="bg-secondary"
                    borderRadius="rounded-lg"
                    type="submit"
                    text="text-sm"
                  >
                    Bulk Booking
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-full">
              {/* Date Selection */}
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Select Date</h3>
                  <div>
                    <ChevronDownCircle className="w-6 h-6 md:h-6 md:w-6" />
                  </div>
                </div>
                <div className="w-full">
                  <Calendar className="bg-white px-4 py-4 rounded-2xl shadow-lg w-full" />
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="mt-6 bg-white rounded-2xl shadow-lg space-y-4 px-4 md:px-8 py-4 pb-8">
                <div data-hide-on-theme="dark" className="flex justify-center">
                  <Image
                    src="/assets/logo.svg"
                    alt="Fullbooker Logo"
                    width={238}
                    height={39.29}
                    className="w-[190px] h-[55px]"
                  />
                </div>

                <div data-hide-on-theme="light" className="flex justify-center">
                  <Image
                    src="/assets/logo_dark.png"
                    alt="MowinBet Logo"
                    width={238}
                    height={39.29}
                    className="w-[190px] h-[55px]"
                  />
                </div>
                <p className="flex justify-between">
                  Ticket price:
                  <span className="font-semibold">
                    {product?.pricing[0]?.cost}
                  </span>
                </p>
                <p className="flex justify-between">
                  Number of Tickets: <span className="font-semibold">
                    {
                      cart.reduce(
                        (sum: number, cartItem: CartItem) =>
                          sum + cartItem.quantity,
                        0
                      )
                    }
                  </span>
                </p>
                <p className="flex justify-between">
                  TAX: <span className="font-semibold">0.00</span>
                </p>
                <p className="flex justify-between">
                  Total:{" "}
                  <span className="text-green-500 font-bold">{cart.reduce(
                      (sum: number, cartItem: CartItem) =>
                        sum + cartItem.total * cartItem.quantity,
                      0
                    )}</span>
                </p>
                <Link href={"/products/checkout"}>
                  <Button
                    extraClasses=""
                    margin="mt-4"
                    borderRadius="rounded-lg"
                    text="w-full font-medium"
                  >
                    Proceed to checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.authentication;
  const { isLoggedIn, authData } = state.authentication;
  const { cart } = state.products;
  const { message, type } = state.alert;
  return { loading, isLoggedIn, message, authData, type, cart };
};

const mapDispatchToProps = (dispatch: any) => ({
  addToCart: (item: CartItem) => dispatch.products.addToCart(item),
  removeFromCart: (id: string) => dispatch.products.removeFromCart(id),
});

export default connect(mapStateToProps, mapDispatchToProps)(TicketDetails);
