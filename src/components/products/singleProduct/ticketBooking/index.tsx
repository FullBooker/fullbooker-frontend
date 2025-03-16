import { FC, useEffect, useState } from "react";
import Button from "@/components/shared/button";
import {
  SESSION_PRICING_CATEGORIES,
  TICKET_PRICING_CATEGORIES,
} from "@/constants";
import { Currency } from "@/domain/dto/output";
import {
  Availability,
  CartItem,
  CartSummary,
  Product,
  ProductPricing,
  SessionPricingCategory,
  TicketPricingCategory,
} from "@/domain/product";
import useIsMobile from "@/lib/hooks/useIsMobile";
import { RootState } from "@/store";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { connect } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import {
  addCommaSeparators,
  generateUUID,
} from "../../../../utilities/helpers";
import { ModalID } from "@/domain/components";
import UniversalModal from "@/components/layout/modal/UniversalModal";
import TicketBookingSummary from "./ticketBookingSummary";
import { useThemeMode } from "@/lib/hooks/useTheme";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import DateSlotSelector from "./dateSlotSelector";
import CustomTimePicker from "@/components/shared/customerTimePicker";
import CustomDatePicker from "@/components/shared/customDatePicker";

type TicketBookingProps = {
  product: Product;
  addToCart: (item: CartItem) => void;
  cart: Array<CartItem>;
  removeFromCart: (id: string) => void;
  currencies: Array<Currency>;
  cartSummary: CartSummary;
  clearCart: () => void;
  setFailureAlert: (message: string) => void;
  setProductDetailsToCart: (payload: CartSummary) => void;
  setActiveModal: (modalId: ModalID) => void;
  modalId: ModalID;
};

const TicketBooking: FC<TicketBookingProps> = ({
  product,
  addToCart,
  cart,
  removeFromCart,
  currencies,
  cartSummary,
  clearCart,
  setFailureAlert,
  setProductDetailsToCart,
  setActiveModal,
  modalId,
}) => {
  const isMobile = useIsMobile();
  const { themeMode } = useThemeMode();
  const [isEvent, setIsEvent] = useState<boolean>();
  const [isActivity, setIsActivity] = useState<any>();

  useEffect(() => {
    setProductDetailsToCart({
      ...cartSummary,
      product_id: product?.id,
      product_title: product?.name,
      product_thumbnail: product?.image?.file,
      product_location: product?.locations[0]?.coordinates,
    } as CartSummary);
  }, []);

  useEffect(() => {
    setIsEvent(
      !!product?.availability?.start_time && !!product?.availability?.end_time
    );
    setIsActivity(
      product?.availability?.open_days?.length > 0 &&
        product?.availability?.duration
    );
  }, []);

  const generateAvailableDates = (availability: Availability) => {
    if (!availability?.start || !availability?.end) return [];

    const startDate = new Date(availability.start);
    const endDate = new Date(availability.end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return [];

    const availableDates: Date[] = [];
    const isEvent = !!availability.start_time && !!availability.end_time;
    const isActivity =
      availability.open_days.length > 0 && availability.duration;

    if (isEvent) {
      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const formattedDate = d.toISOString().split("T")[0]; // Ensure proper format
        if (!availability.closed_dates.includes(formattedDate)) {
          availableDates.push(new Date(d)); // Push Date object, not string
        }
      }
    } else if (isActivity) {
      availability.open_days.forEach((openDay) => {
        let openDate = new Date(startDate);
        while (openDate <= endDate) {
          if (
            openDay.day_name.toLowerCase() ===
            openDate
              .toLocaleDateString("en-US", { weekday: "long" })
              .toLowerCase()
          ) {
            const formattedDate = openDate.toISOString().split("T")[0];
            if (!availability.closed_dates.includes(formattedDate)) {
              availableDates.push(new Date(openDate));
            }
          }
          openDate.setDate(openDate.getDate() + 1);
        }
      });
    }

    return availableDates;
  };

  const showTicketSummaryIfValid = () => {
    if (cart?.length === 0) {
      return setFailureAlert("You need to select atleast one ticket");
    }

    if (!cartSummary?.selected_date) {
      return setFailureAlert("You need to select a date to proceed");
    }

    if (isActivity && !cartSummary?.time) {
      return setFailureAlert("You need to select a session to proceed");
    }
    setActiveModal(ModalID.ticketBookingSummary);
  };

  const checkIfCartHasItemsWithPricingType = (
    pricingTypeId: string
  ): boolean => {
    return cart.some(
      (item: CartItem) => item.pricing_type_id === pricingTypeId
    );
  };

  const getTotalTicketsByPricingType = (pricingType: string): number => {
    return cart.filter((item: CartItem) => item.pricing_type_id === pricingType)
      .length;
  };

  const addItemToCartByPricingType = (pricing: ProductPricing): void => {
    const cost = parseInt(pricing?.cost) || 0;
    addToCart({
      id: generateUUID(),
      phone_number: "",
      email: "",
      id_number: "",
      name: "",
      pricing_type:
        pricing?.type === "ticket"
          ? pricing?.ticket_tier || ""
          : pricing?.type || "",
      pricing_type_id: pricing?.id || "",
      cost,
    } as CartItem);
  };

  const removeItemFromCartByPricingType = (pricing: ProductPricing): void => {
    const filteredCartItemsByPricingType: Array<CartItem> = cart.filter(
      (item: CartItem) => item.pricing_type_id === pricing?.id
    );

    if (filteredCartItemsByPricingType.length > 0) {
      removeFromCart(
        filteredCartItemsByPricingType[
          filteredCartItemsByPricingType.length - 1
        ]?.id
      );
    }
  };

  return (
    <div className="md:border-t md:border-gray-400 pt-3 pb-0 md:pt-10 md:pb-10">
      <div className="px-0 md:px-4 py-0 md:py-6 bg-transaparent rounded-sm md:border md:border-gray-300">
        {/* Date Selection */}
        <div className="mb-6 rounded-sm md:border md:border-gray-300 md:p-3">
          <div className="flex justify-between items-center mb-3">
            <p className="text-black">Pick a date</p>
            <div className="relative right-0">
              <CustomDatePicker
                onChange={(date) =>
                  setProductDetailsToCart({
                    ...cartSummary,
                    selected_date: moment(date).format("l"),
                  } as CartSummary)
                }
                customInput={
                  <p className="text-primary cursor-pointer text-right">
                    View more
                  </p>
                }
                placement={"bottom-start"}
                availableDates={generateAvailableDates(product?.availability)}
              />
            </div>
          </div>
          <DateSlotSelector availability={product?.availability} />
        </div>

        {isActivity && (
          <div
            className="flex justify-between items-center p-4 rounded-lg cursor-pointer
            border border-primary mb-6"
          >
            <div className="">
              <p className="text-black mb-2">Pick a session</p>
              <CustomTimePicker
                onChange={(time: any) =>
                  setProductDetailsToCart({
                    ...cartSummary,
                    time: time,
                  })
                }
              />
            </div>
          </div>
        )}

        {/* Available Tickets */}
        <div className="rounded-sm md:border md:border-gray-300 md:p-3">
          <div className="mb-3">
            <p className="text-black">Available tickets</p>
          </div>
          <div className="space-y-3">
            {product?.pricing?.map((pricing: ProductPricing, index: number) => {
              const title =
                pricing?.type === "ticket"
                  ? TICKET_PRICING_CATEGORIES.find(
                      (tCat: TicketPricingCategory) =>
                        tCat.key === pricing?.ticket_tier
                    )?.title
                  : SESSION_PRICING_CATEGORIES.find(
                      (spCat: SessionPricingCategory) =>
                        spCat.key === pricing?.type
                    )?.title;
              const isSelected = checkIfCartHasItemsWithPricingType(pricing.id);
              return (
                <div
                  key={index}
                  className={`flex justify-between items-center p-4 rounded-lg h-[80px] md:h-[88px] ${
                    isSelected ? "border border-primary" : "shadow"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="me-4">
                      <Image
                        alt="Ticket Type Profile"
                        src={`${
                          title === "Cost per Session" || title === "Early bird"
                            ? "/assets/grey-ticket.svg"
                            : title === "Standard" || title === "Day Pass"
                            ? "/assets/primary-ticket.svg"
                            : title === "VIP" ||
                              title === "Monthly Subscription"
                            ? "/assets/yellow-ticket.svg"
                            : title === "VVIP"
                            ? "/assets/brown-ticket.svg"
                            : "/assets/brown-ticket.svg"
                        }`}
                        width={isMobile ? 35 : 40}
                        height={isMobile ? 35 : 40}
                        unoptimized={true}
                      />
                    </div>
                    <div>
                      <span className="text-sm">{title}</span>
                      <p className="text-xs text-[#808080]">
                        {
                          currencies?.find(
                            (currency: Currency) =>
                              currency.id === pricing?.currency
                          )?.code
                        }{" "}
                        {addCommaSeparators(
                          Math.round(parseInt(pricing?.cost))
                        )}
                      </p>
                      {pricing?.remaining_tickets > 0 && (
                        <p
                          className={`text-xs ${
                            pricing?.remaining_tickets < 10
                              ? "text-orange-500"
                              : "text-[#808080]"
                          }`}
                        >
                          {pricing?.remaining_tickets} tickets left
                        </p>
                      )}
                    </div>
                  </div>

                  {pricing?.remaining_tickets === 0 ? (
                    <div className="flex justify-center items-center text-center">
                      <span className="text-red-500 text-sm">Sold Out</span>
                    </div>
                  ) : (
                    <div
                      className={`flex items-center gap-2 ${
                        isSelected ? "text-black" : "text-gray-500"
                      }`}
                    >
                      <button
                        className={`p-1 md:p-2 border rounded cursor-pointer ${
                          isSelected ? "border-black" : "border-gray-400"
                        }`}
                        disabled={cart.length === 0}
                        onClick={() => removeItemFromCartByPricingType(pricing)}
                      >
                        <Minus />
                      </button>
                      <span className="">
                        {getTotalTicketsByPricingType(pricing?.id)}
                      </span>
                      <button
                        className={`p-1 md:p-2 border rounded cursor-pointer ${
                          isSelected ? "border-black" : "border-gray-400"
                        }`}
                        disabled={
                          pricing?.remaining_tickets ===
                          getTotalTicketsByPricingType(pricing?.id)
                        }
                        onClick={() => addItemToCartByPricingType(pricing)}
                      >
                        <Plus />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            width="w-full md:w-[80%]"
            bg="bg-primary"
            borderRadius="rounded"
            text="text-white font-base"
            padding="py-2"
            margin="mt-4 md:mt-6 md:mb-6"
            onClick={() => showTicketSummaryIfValid()}
          >
            Continue
          </Button>
        </div>
      </div>
      {modalId === ModalID.ticketBookingSummary && (
        <UniversalModal
          theme={themeMode}
          content={<TicketBookingSummary isActivity={isActivity} />}
          fullScreen={true}
        />
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
  const { modalId } = state.components;
  return {
    loading,
    isLoggedIn,
    message,
    authData,
    type,
    cart,
    currencies,
    cartSummary,
    modalId,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  addToCart: (item: CartItem) => dispatch.products.addToCart(item),
  removeFromCart: (id: string) => dispatch.products.removeFromCart(id),
  clearCart: () => dispatch.products.clearCart(),
  setProductDetailsToCart: (payload: CartSummary) =>
    dispatch.products.setProductDetailsToCart(payload),
  setFailureAlert: (message: string) => dispatch.alert.setFailureAlert(message),
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
});

export default connect(mapStateToProps, mapDispatchToProps)(TicketBooking);
