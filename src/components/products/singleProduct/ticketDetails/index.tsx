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

type TicketDetailsProps = {
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

const TicketDetails: FC<TicketDetailsProps> = ({
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
}) => {
  const isMobile = useIsMobile();
  const [selectedDate, setSelectedDate] = useState<any>();
  const [selectedPricing, setSelectedPricing] = useState<ProductPricing | null>(
    null
  );

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
                    <div>
                      <Controller
                        name="pricing"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <select
                            className="w-full border-none outline-none font-thin text-sm rounded-sm bg-gray-100 shadow-md text-gray-500 px-2 py-3 "
                            value={value}
                            onChange={(e) => {
                              if (e.target.value !== "") {
                                const pricing = product?.pricing?.find(
                                  (p: ProductPricing) => p.id === e.target.value
                                ) as ProductPricing;
                                setSelectedPricing(pricing);
                                setProductDetailsToCart({
                                  ...cartSummary,
                                  base_currency: pricing?.currency,
                                  product_base_price: pricing?.cost,
                                } as CartSummary);
                              } else {
                                setProductDetailsToCart({
                                  ...cartSummary,
                                  product_base_price: "0",
                                } as CartSummary);
                              }
                              onChange(e);
                            }}
                          >
                            <option value="">Select Pricing Type</option>
                            {product?.pricing?.map(
                              (pricing: ProductPricing, idx: number) => (
                                <option key={idx} value={pricing.id}>
                                  {pricing?.type === "ticket"
                                    ? TICKET_PRICING_CATEGORIES.find(
                                        (tCat: TicketPricingCategory) =>
                                          tCat.key === pricing?.ticket_tier
                                      )?.title
                                    : SESSION_PRICING_CATEGORIES.find(
                                        (spCat: SessionPricingCategory) =>
                                          spCat.key === pricing?.type
                                      )?.title}
                                </option>
                              )
                            )}
                          </select>
                        )}
                      />
                      {errors?.pricing && (
                        <p className="text-red-500 text-sm font-thin mt-2">
                          {errors?.pricing?.message}
                        </p>
                      )}
                    </div>

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
                <p className="text-center mb-3">Tickets Summary</p>
                <div className="overflow-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="font-medium border text-center py-3 px-3">
                          Name
                        </th>
                        <th className="font-medium border text-center py-3 px-3">
                          ID/Passport
                        </th>
                        <th className="text-center font-medium  border py-3 px-3">
                          Phone No
                        </th>
                        <th className="text-center font-medium  border py-3 px-3">
                          Email
                        </th>
                        <th className="text-center font-medium  border py-3 px-3">
                          QTY
                        </th>
                        <th className="text-center font-medium  border py-3 px-3">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart &&
                        cart?.map((item: CartItem, index: number) => (
                          <tr key={index} className="border-b pb-4 mb-4">
                            <td className="py-3 px-3 text-sm border text-center">
                              {item?.name}
                            </td>
                            <td className="py-3 px-3 text-sm border text-center">
                              {item?.id_number}
                            </td>
                            <td className="py-3 px-3 text-sm border text-center">
                              {" "}
                              {item?.phone_number}
                            </td>
                            <td className="py-3 px-3 text-sm border text-center">
                              {item?.email}
                            </td>
                            <td className="py-3 px-3 text-sm border text-center">
                              {item?.quantity}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <Button
                                bg="bg-primary"
                                text="text-sm"
                                padding="px-3"
                                onClick={() => removeFromCart(item?.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {cart?.length === 0 && (
                    <div className="px-2 py-6 text-center">
                      <p className="text-sm w-full md:text-center">
                        Tickets will appear here when added
                      </p>
                    </div>
                  )}
                </div>
                <div className="text-center mt-6 mb-3">
                  <p className="text-center">
                    {watch("ticket_type") === TicketType.bulkTickets
                      ? "Less than 3 tickets?"
                      : "More than 3 tickets?"}
                  </p>
                  <Button
                    bg="bg-secondary"
                    borderRadius="rounded-lg"
                    type="button"
                    text="text-sm"
                    onClick={async () => {
                      if (cart?.length > 0) {
                        clearCart();
                      }
                      const newTicketType =
                        watch("ticket_type") === TicketType.bulkTickets
                          ? TicketType.singleTicket
                          : TicketType.bulkTickets;

                      await setValue("ticket_type", newTicketType, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                    }}
                  >
                    {watch("ticket_type") === TicketType.bulkTickets
                      ? "Single ticket booking"
                      : "Bulk booking"}
                  </Button>
                </div>
              </div>
            </div>
            <div className="">
              {/* Date Selection Desktop */}
              {!isMobile && (
                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Select Date</h3>
                    <div>
                      <ChevronDownCircle className="w-6 h-6 md:h-6 md:w-6" />
                    </div>
                  </div>

                  <div className="w-full">
                    <Calendar
                      className="bg-white px-4 py-4 rounded-2xl shadow-lg !w-full !text-[10px] md:!text-[12px] lg:!text-[16px]"
                      onChange={(date) => {
                        setSelectedDate(date);
                        setValue("date", date.toString());
                      }}
                    />
                    {errors?.date && (
                      <p className="text-red-500 font-light mt-2">
                        {errors?.date?.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

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
                    alt="Fullbooker Logo"
                    width={238}
                    height={39.29}
                    className="w-[190px] h-[55px]"
                  />
                </div>
                <p className="flex justify-between">
                  Ticket price:
                  <span className="font-semibold">
                    {addCommaSeparators(
                      parseInt(cartSummary?.product_base_price)
                    ) || 0}
                  </span>
                </p>
                <p className="flex justify-between">
                  Number of Tickets:{" "}
                  <span className="font-semibold">
                    {cartSummary?.total_items || 0}
                  </span>
                </p>
                <p className="flex justify-between text-green-500 font-bold">
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
                    <span>
                      {addCommaSeparators(cartSummary?.total_price) || 0}
                    </span>
                  </span>
                </p>
                {cart?.length == 0 ? (
                  <Button
                    extraClasses=""
                    margin="mt-4"
                    borderRadius="rounded-lg"
                    text="w-full font-medium"
                    onClick={() =>
                      setFailureAlert(
                        "You need to add tickets inorder to proceed to checkout"
                      )
                    }
                  >
                    Proceed to checkout
                  </Button>
                ) : (
                  <Link href="/product/checkout">
                    <Button
                      extraClasses=""
                      margin="mt-4"
                      borderRadius="rounded-lg"
                      text="w-full font-medium"
                    >
                      Proceed to checkout
                    </Button>
                  </Link>
                )}
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

export default connect(mapStateToProps, mapDispatchToProps)(TicketDetails);
