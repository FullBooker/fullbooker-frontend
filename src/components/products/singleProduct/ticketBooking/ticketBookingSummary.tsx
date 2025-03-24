import React, { FC, useEffect, useState } from "react";
import Button from "@/components/shared/button";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { CartItem, CartSummary, Product } from "@/domain/product";
import { Mail, Phone, User, UserCheck } from "lucide-react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInputAuth from "@/components/auth/FormInputAuth";
import { connect } from "react-redux";
import { Dispatch, RootState } from "@/store";
import { addCommaSeparators, getToken } from "@/utilities";
import { AuthData, Currency } from "@/domain/dto/output";
import { Checkbox, CircularProgress } from "@mui/material";
import { ModalID } from "@/domain/components";
import { BookTicketPayload } from "@/domain/dto/ticket";
import {
  CustomeEvents,
  SESSION_PRICING_CATEGORIES,
  TICKET_PRICING_CATEGORIES,
} from "@/constants";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/domain/profile";

type TicketBookingSummaryProps = {
  productsRequestProcessing: boolean;
  product: Product;
  addToCart: (item: CartItem) => void;
  cart: Array<CartItem>;
  removeFromCart: (id: string) => void;
  currencies: Array<Currency>;
  cartSummary: CartSummary;
  clearCart: () => void;
  setFailureAlert: (message: string) => void;
  setProductDetailsToCart: (payload: CartSummary) => void;
  addUserDetailsToCart: (payload: CartItem) => Promise<void>;
  authData: AuthData;
  setActiveModal: (modalId: ModalID) => void;
  bookTicket: (payload: BookTicketPayload) => void;
  isProcessingRequest: boolean;
  isActivity: boolean;
  profile: UserProfile;
};

const TicketBookingSummary: FC<TicketBookingSummaryProps> = ({
  cart,
  cartSummary,
  addUserDetailsToCart,
  authData,
  setProductDetailsToCart,
  setActiveModal,
  bookTicket,
  isProcessingRequest,
  setFailureAlert,
  clearCart,
  isActivity,
  profile,
}) => {
  const router = useRouter();
  const defaultValues = {
    name: profile?.first_name
      ? `${profile?.first_name} ${profile?.last_name}`
      : "",
    id_number: "",
    phone_number: profile?.phone_number ? profile?.phone_number : "",
    email: profile?.email ? profile?.email : "",
  };

  interface FormData {
    name: string;
    id_number: string;
    phone_number: string;
    email: string;
  }

  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    id_number: yup.string().required("ID Number is required"),
    email: yup
      .string()
      .required("Email is required")
      .email("Provide a valid email address"),
    phone_number: yup.string().required("Phone number is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const authToken = getToken();
    if (!authToken) {
      setActiveModal(ModalID.login);
      return;
    }

    const { name, id_number, phone_number, email } = data;

    if (!cartSummary?.prefill_all_items_with_primary_user_details) {
      let hasMissingFields: boolean = false;
      cart
        ?.filter((i: CartItem, index: number) => {
          return index !== 0;
        })
        .map((item: CartItem) => {
          if (
            item.email === "" ||
            item.name === "" ||
            item.phone_number === ""
          ) {
            hasMissingFields = true;
            setFailureAlert("You need to fill out all missing fields");
            return;
          }
        });
      if (hasMissingFields) return;
    }

    bookTicket({
      product: cartSummary?.product_id,
      tickets: cartSummary?.prefill_all_items_with_primary_user_details
        ? cart.map((item: CartItem) => ({
            name: name,
            id_number: id_number,
            phone_number: phone_number,
            email: email,
            pricing: item.pricing_type_id,
            ...(isActivity && {
              start: cartSummary?.time,
            }),
          }))
        : cart.map((item: CartItem) => ({
            name: item?.name,
            id_number: id_number,
            phone_number: item?.phone_number,
            email: item?.email,
            pricing: item.pricing_type_id,
            ...(isActivity && {
              start: cartSummary?.time,
            }),
          })),
    } as BookTicketPayload);
  };

  const clearTicketSummary = async () => {
    clearCart();
  };

  useEffect(() => {
    document.addEventListener(
      CustomeEvents.successfullTicketBooking,
      async (event: any) => {
        clearTicketSummary().then(() => {
          setActiveModal(ModalID.none);
          router.push(`/product/booking/${event?.detail?.booking_id}`);
        });
      }
    );
  }, []);

  useEffect(() => {
    if (cart?.length > 0) {
      const { user } = authData || {};
      const firstItemInCart: CartItem = cart[0];
      addUserDetailsToCart({
        ...firstItemInCart,
        name: user ? `${user.first_name} ${user.last_name}` : "",
        id_number: user ? user.id_number : "",
        phone_number: user ? user.phone_number : "",
        email: user ? user.email : "",
      } as CartItem);
    }
  }, [authData]);

  return (
    <div>
      <div className="w-full space-x-0">
        {/* Pricing Summary */}
        <div className="bg-[#FBFBFB] p-2">
          <p className="text-lg font-medium">Summary</p>
          <p className="flex font-light text-sm">
            <span className="me-2">Date:</span>
            <span>{`${cartSummary?.selected_date || "N/A"} `}</span>
          </p>
          {isActivity && (
            <p className="flex items-center font-light text-sm">
              <span className="me-2">Session:</span>
              <span>{`${cartSummary?.time || "N/A"} `}</span>
            </p>
          )}
          <p className="flex justify-between font-light text-sm">
            <span>{cart?.length} Tickets</span>
            <span className="font-semibold">
              {cartSummary?.total_price
                ? addCommaSeparators(cartSummary?.total_price)
                : 0}
            </span>
          </p>
        </div>
        {/* Ticket Selection */}
        <div className="mt-4 w-full pb-1">
          <form
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            className=""
          >
            <div>
              {cart
                ?.filter((i: CartItem, index: number) => {
                  if (
                    !cartSummary?.prefill_all_items_with_primary_user_details
                  ) {
                    return true;
                  } else {
                    return index === 0;
                  }
                })
                .map((item: CartItem, index: number) => (
                  <div className="space-y-4 py-3" key={index}>
                    <p className="text-sm">
                      <strong>Ticket #{index + 1}</strong> -{" "}
                      {
                        TICKET_PRICING_CATEGORIES.concat(
                          SESSION_PRICING_CATEGORIES
                        ).find((p: any) => p.key === item?.pricing_type)?.title
                      }
                    </p>
                    {index === 0 ? (
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
                            onChange={(e) => {
                              addUserDetailsToCart({
                                ...item,
                                name: e.target.value,
                              } as CartItem);
                              onChange(e);
                            }}
                            value={value}
                            icon={
                              <User className="w-4 h-4 text-white fill-gray-500" />
                            }
                            error={errors?.name?.message}
                          />
                        )}
                      />
                    ) : (
                      <FormInputAuth
                        id={`name-${index}`}
                        name={`name-${index}`}
                        type="text"
                        placeholder="Name"
                        onChange={(e) => {
                          addUserDetailsToCart({
                            ...item,
                            name: e.target.value,
                          } as CartItem);
                        }}
                        icon={
                          <User className="w-4 h-4 text-white fill-gray-500" />
                        }
                      />
                    )}

                    {index === 0 && (
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
                            onChange={(e) => {
                              addUserDetailsToCart({
                                ...item,
                                id_number: e.target.value,
                              } as CartItem);
                              if (index === 0) {
                                onChange(e);
                              }
                            }}
                            value={value}
                            icon={
                              <UserCheck className="w-4 h-4 text-white fill-gray-500" />
                            }
                            error={errors?.id_number?.message}
                          />
                        )}
                      />
                    )}

                    {index === 0 ? (
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
                            onChange={(e) => {
                              addUserDetailsToCart({
                                ...item,
                                phone_number: e.target.value,
                              } as CartItem);
                              onChange(e);
                            }}
                            value={value}
                            icon={
                              <Phone className="w-4 h-4 text-white fill-gray-500" />
                            }
                            error={errors?.phone_number?.message}
                          />
                        )}
                      />
                    ) : (
                      <FormInputAuth
                        id={`phone_number-${index}`}
                        name={`phone_number-${index}`}
                        type="text"
                        placeholder="Phone Number"
                        onChange={(e) => {
                          addUserDetailsToCart({
                            ...item,
                            phone_number: e.target.value,
                          } as CartItem);
                        }}
                        icon={
                          <Phone className="w-4 h-4 text-white fill-gray-500" />
                        }
                      />
                    )}
                    {index === 0 ? (
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
                            onChange={(e) => {
                              addUserDetailsToCart({
                                ...item,
                                email: e.target.value,
                              } as CartItem);
                              if (index === 0) {
                                onChange(e);
                              }
                            }}
                            value={value}
                            icon={
                              <Mail className="w-4 h-4 text-white fill-gray-500" />
                            }
                            error={errors?.email?.message}
                          />
                        )}
                      />
                    ) : (
                      <FormInputAuth
                        id={`email-${index}`}
                        name={`email-${index}`}
                        type="email"
                        placeholder="Email"
                        onChange={(e) => {
                          addUserDetailsToCart({
                            ...item,
                            email: e.target.value,
                          } as CartItem);
                        }}
                        icon={
                          <Mail className="w-4 h-4 text-white fill-gray-500" />
                        }
                      />
                    )}
                  </div>
                ))}
            </div>
            <div className="flex justify-center items-center py-3 mt-2 rounded shadow bg-white">
              <p className="text-black text-sm">
                Do you want to enter each ticket's name one by one?
              </p>
              <span>
                <Checkbox
                  checked={
                    !cartSummary?.prefill_all_items_with_primary_user_details
                  }
                  onChange={() => {
                    setProductDetailsToCart({
                      ...cartSummary,
                      prefill_all_items_with_primary_user_details:
                        !cartSummary?.prefill_all_items_with_primary_user_details,
                    } as CartSummary);
                  }}
                />
              </span>
            </div>
            <div className="text-center">
              <Button
                width="w-full"
                bg="bg-primary"
                borderRadius="rounded"
                text="text-white font-base"
                padding="py-3"
                margin="mt-4"
                type="submit"
              >
                {isProcessingRequest ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Proceed to pay"
                )}
              </Button>
            </div>
          </form>
        </div>
        <div className=""></div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const isProcessingRequest = state.loading.effects.tickets.bookTicket;
  const { isLoggedIn, authData } = state.authentication;
  const { profile } = state.profile;
  const { cart, cartSummary } = state.products;
  const { message, type } = state.alert;
  const { currencies } = state.settings;
  return {
    isProcessingRequest,
    isLoggedIn,
    message,
    authData,
    type,
    cart,
    currencies,
    cartSummary,
    profile,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addToCart: (item: CartItem) => dispatch.products.addToCart(item),
  removeFromCart: (id: string) => dispatch.products.removeFromCart(id),
  clearCart: () => dispatch.products.clearCart(),
  setProductDetailsToCart: (payload: CartSummary) =>
    dispatch.products.setProductDetailsToCart(payload),
  setFailureAlert: (message: string) => dispatch.alert.setFailureAlert(message),
  addUserDetailsToCart: async (payload: CartItem) =>
    dispatch.products.addUserDetailsToCart(payload),
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
  bookTicket: (payload: BookTicketPayload) =>
    dispatch.tickets.bookTicket(payload),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TicketBookingSummary);
