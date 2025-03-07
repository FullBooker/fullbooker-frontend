import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/shared/button";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import {
  CartItem,
  CartSummary,
  Product,
  ProductPricing,
  SessionPricingCategory,
  TicketPricingCategory,
} from "@/domain/product";
import {
  CalendarClock,
  ChevronDownCircle,
  Mail,
  Phone,
  Ticket,
  User,
  UserCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { useForm, Controller, ErrorOption } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInputAuth from "@/components/auth/FormInputAuth";
import { connect } from "react-redux";
import { RootState } from "@/store";
import { addCommaSeparators, generateUUID } from "@/utilities";
import { Currency } from "@/domain/dto/output";
import useIsMobile from "@/lib/hooks/useIsMobile";
import {
  TICKET_PRICING_CATEGORIES,
  SESSION_PRICING_CATEGORIES,
} from "@/constants";
import Link from "next/link";

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
  selectedPricing: ProductPricing;
  selselectedDate: Date | null;
};

enum TicketType {
  singleTicket = "SINGLE_TICKET",
  bulkTickets = "BULK_TICKETS",
}

const defaultValues = {
  ticket_type: TicketType.singleTicket,
  name: "",
  id_number: "",
  phone_number: "",
  email: "",
  date: "",
  quantity: 0,
  pricing: "",
};

export interface FormData {
  ticket_type?: string;
  name: string;
  id_number: string;
  phone_number: string;
  email: string;
  date: string;
  quantity?: number;
  pricing: string;
}

export const schema = yup.object().shape({
  ticket_type: yup.string(),
  name: yup.string().required("Name is required"),
  id_number: yup.string().required("ID Number is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Provide a valid email address"),
  phone_number: yup.string().required("Phone number is required"),
  date: yup.string().required("Date is required"),
  quantity: yup
    .number()
    .min(1, "Quantity must be at least 1")
    .required("Quantity is required"),
  pricing: yup.string().required("Pricing is required"),
});

const TicketBookingSummary: FC<TicketBookingSummaryProps> = ({
  productsRequestProcessing,
  product,
  addToCart,
  cart,
  removeFromCart,
  currencies,
  cartSummary,
  clearCart,
  setFailureAlert,
  setProductDetailsToCart,
  selectedPricing,
  selselectedDate,
}) => {
  const isMobile = useIsMobile();
  const [selectedDate, setSelectedDate] = useState<any>();
  const {
    control,
    setError,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const {
      phone_number,
      email,
      id_number,
      name,
      quantity,
      pricing,
      ticket_type,
    } = data;
    const ticketQuantity = quantity ?? 0;
    const maxTickets = selectedPricing?.maximum_number_of_tickets ?? 0;
    if (ticket_type === TicketType.singleTicket && cart?.length === 3) {
      setFailureAlert(
        "For single ticket booking you can book a maximum of 3 tickets"
      );
      return;
    }
    if (ticket_type === TicketType.bulkTickets) {
      if (ticketQuantity > maxTickets) {
        setFailureAlert(
          `For this event you can book a maximum of ${selectedPricing?.maximum_number_of_tickets} tickets`
        );
        return;
      }

      if (
        cartSummary?.total_items === maxTickets ||
        cartSummary?.total_items > maxTickets ||
        cartSummary?.total_items + ticketQuantity > maxTickets
      ) {
        setFailureAlert(
          `For this event you can book a maximum of ${selectedPricing?.maximum_number_of_tickets} tickets`
        );
        return;
      }
    }

    const cost = product?.pricing?.find(
      (pType: ProductPricing) => pType?.id === pricing
    )?.cost;
    addToCart({
      id: generateUUID(),
      phone_number: phone_number,
      email: email,
      id_number: id_number,
      quantity: quantity || 1,
      name: name,
      total: parseInt(cost as string) * (quantity as number),
      product_id: product?.id,
      product_thumbnail: product?.image?.file,
      pricing_type: pricing,
    } as CartItem);
  };

  useEffect(() => {
    const ticketType = getValues("ticket_type");
    if (ticketType === TicketType.singleTicket) {
      setValue("quantity", 1);
      setValue("date", "");
    } else {
      setValue("quantity", 0);
      setValue("date", "");
    }
  }, [watch("ticket_type")]);

  useEffect(() => {
    setProductDetailsToCart({
      ...cartSummary,
      product_id: product?.id,
      product_title: product?.name,
      product_thumbnail: product?.image?.file,
      product_location: product?.locations[0]?.coordinates,
    } as CartSummary);
  }, []);

  return (
    <div>
      <div className="border-">
        <div className="w-full space-x-0">
          {/* Pricing Summary */}
          <div className="bg-[#FBFBFB] p-2">
            <p className="text-lg">Summary</p>
            <p className="flex justify-between text-gray-500 text-sm">
              Ticket price:
              <span className="font-semibold">
                {addCommaSeparators(
                  parseInt(cartSummary?.product_base_price)
                ) || 0}
              </span>
            </p>
            <p className="flex justify-between text-gray-500 text-sm">
              Number of Tickets:{" "}
              <span className="font-semibold">
                {cartSummary?.total_items || 0}
              </span>
            </p>
            <p className="flex justify-between text-black font-semibold">
              Total:
              <span>
                <span className="me-1">
                  {
                    currencies?.find(
                      (currency: Currency) =>
                        currency.id === product?.pricing[0]?.currency
                    )?.code
                  }
                </span>
                <span>{addCommaSeparators(cartSummary?.total_price) || 0}</span>
              </span>
            </p>
          </div>
          {/* Ticket Selection */}
          <div className="mt-4 w-full">
            <p className="text-sm"><strong>Ticket #1</strong> -Per session</p>
            <div className="w-full pb-1">
              <form
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
                className=""
              >
                <div className="space-y-4 py-3">
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
                  {/* Date Selection Mobile */}
                  {isMobile && (
                    <Controller
                      name="date"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <FormInputAuth
                          id="date"
                          name="date"
                          type="date"
                          placeholder="Date"
                          onChange={onChange}
                          value={value}
                          icon={
                            <CalendarClock className="w-4 h-4 text-white fill-gray-500" />
                          }
                          error={errors?.date?.message}
                        />
                      )}
                    />
                  )}
                  {watch("ticket_type") === TicketType.bulkTickets && (
                    <Controller
                      name="quantity"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <FormInputAuth
                          id="quantity"
                          name="quantity"
                          type="number"
                          placeholder="Number of tickets"
                          onChange={(e) => {
                            if (
                              selectedPricing &&
                              parseInt(e.target.value) >
                                selectedPricing?.maximum_number_of_tickets
                            ) {
                              setError("quantity", {
                                message: `You can book a maximum of ${selectedPricing?.maximum_number_of_tickets} tickets`,
                              } as ErrorOption);
                            } else {
                              setError("quantity", {
                                message: "",
                              } as ErrorOption);
                            }
                            onChange(e);
                          }}
                          value={value?.toString()}
                          icon={
                            <Ticket className="w-4 h-4 text-white fill-gray-500" />
                          }
                          error={errors?.quantity?.message}
                        />
                      )}
                    />
                  )}
                </div>
                <div className="flex justify-center items-center py-2 mt-2 rounded shadow bg-white">
                  <p className="text-black text-sm">
                    Do you want to enter each ticket’s name one by one?
                  </p>
                </div>
                <div className="text-center">
                  <Button
                    width="w-full"
                    bg="bg-primary"
                    borderRadius="rounded"
                    text="text-white font-base"
                    padding="py-2"
                    margin="mt-4"
                  >
                    Proceed to pay
                  </Button>
                </div>
              </form>
            </div>
          </div>
          <div className=""></div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.authentication;
  const { isLoggedIn, authData } = state.authentication;
  const { cart, cartSummary } = state.products;
  const { message, type } = state.alert;
  const { currencies } = state.settings;
  return {
    loading,
    isLoggedIn,
    message,
    authData,
    type,
    cart,
    currencies,
    cartSummary,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  addToCart: (item: CartItem) => dispatch.products.addToCart(item),
  removeFromCart: (id: string) => dispatch.products.removeFromCart(id),
  clearCart: () => dispatch.products.clearCart(),
  setProductDetailsToCart: (payload: CartSummary) =>
    dispatch.products.setProductDetailsToCart(payload),
  setFailureAlert: (message: string) => dispatch.alert.setFailureAlert(message),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TicketBookingSummary);
