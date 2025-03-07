import Button from "@/components/shared/button";
import {
  SESSION_PRICING_CATEGORIES,
  TICKET_PRICING_CATEGORIES,
} from "@/constants";
import { Currency } from "@/domain/dto/output";
import {
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
import { FC, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Modal, Box } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addCommaSeparators } from "../../../../utilities/helpers";
import { ModalID } from "@/domain/components";
import UniversalModal from "@/components/layout/modal/UniversalModal";
import TicketBookingSummary from "./ticketBookingSummary";
import { useThemeMode } from "@/lib/hooks/useTheme";

type TicketBookingProps = {
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
  setActiveModal: (modalId: ModalID) => void;
  modalId: ModalID;
};

const TicketBooking: FC<TicketBookingProps> = ({
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
  setActiveModal,
  modalId,
}) => {
  const [tickets, setTickets] = useState({
    earlyBird: 0,
    standard: 0,
    vip: 1,
    vvip: 0,
  });

  const dates = [
    {
      day: "Wednesday",
      month: "March",
      date: "20",
      time: "8:30 PM",
      active: true,
    },
    { day: "Thursday", month: "Feb", date: "27", time: "8:30 PM" },
    { day: "Friday", month: "Feb", date: "27", time: "8:30 PM" },
    { day: "Saturday", month: "Feb", date: "27", time: "8:30 PM" },
    { day: "Sunday", month: "Feb", date: "27", time: "8:30 PM" },
    { day: "Monday", month: "Feb", date: "27", time: "8:30 PM" },
  ];

  const [selectedPricing, setSelectedPricing] = useState<ProductPricing | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
  };

  useEffect(() => {
    setProductDetailsToCart({
      ...cartSummary,
      product_id: product?.id,
      product_title: product?.name,
      product_thumbnail: product?.image?.file,
      product_location: product?.locations[0]?.coordinates,
    } as CartSummary);
  }, []);

  const isMobile = useIsMobile();
  const { themeMode } = useThemeMode();

  return (
    <div className="md:border-t md:border-gray-400 pt-3 pb-0 md:pt-10 md:pb-10">
      <div className="px-0 md:px-4 py-0 md:py-6 bg-transaparent rounded-sm md:border md:border-gray-300">
        {/* Date Selection */}
        <div className="mb-6 rounded-sm md:border md:border-gray-300 md:p-3">
          <div className="flex justify-between items-center mb-3">
            <p className="text-black">Pick a date</p>
            <p
              className="text-primary cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              View more
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto w-full">
            {dates.map((d, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-center md:w-full min-w-[100px] md:min-w-[80px] h-28 md:h-36 p-2 rounded-lg border md:space-y-2 ${
                  d.active
                    ? "border-primary text-primary"
                    : "border-gray-500 text-gray-500"
                }`}
              >
                <span className="text-sm">{d.day}</span>
                <span className="text-xs">{d.month}</span>
                <div
                  className={`w-6 h-6 rounded-full text-center ${
                    d.active
                      ? "bg-primary text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  <span className="text-xs">{d.date}</span>
                </div>
                <span className="text-xs">{d.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MUI Modal for Date Picker */}
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={style}>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              inline
            />
          </Box>
        </Modal>

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

              return (
                <div
                  key={index}
                  className={`flex justify-between items-center p-4 rounded-lg cursor-pointer ${
                    (!selectedPricing && index === 0) ||
                    selectedPricing?.id === pricing.id
                      ? "border border-primary"
                      : "shadow"
                  }`}
                  onClick={() => setSelectedPricing(pricing)}
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
                      <p className="text-xs md:text-sm text-gray-500">
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
                      <p className="text-xs text-orange-500">3 tickets left</p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 ${
                      (!selectedPricing && index === 0) ||
                      selectedPricing?.id === pricing.id
                        ? "text-black"
                        : "text-gray-500"
                    }`}
                  >
                    <button
                      className={`p-1 md:p-2 border rounded ${
                        (!selectedPricing && index === 0) ||
                        selectedPricing?.id === pricing.id
                          ? "border-black"
                          : "border-gray-400"
                      }`}
                    >
                      <Minus />
                    </button>
                    <span className="">{tickets.earlyBird}</span>
                    <button
                      className={`p-1 md:p-2 border rounded ${
                        (!selectedPricing && index === 0) ||
                        selectedPricing?.id === pricing.id
                          ? "border-black"
                          : "border-gray-400"
                      }`}
                    >
                      <Plus />
                    </button>
                    {/* <span className="text-red-500 text-sm font-semibold">
                Sold Out
              </span> */}
                  </div>
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
            onClick={() => setActiveModal(ModalID.ticketBookingSummary)}
          >
            Continue
          </Button>
        </div>
      </div>
      {modalId === ModalID.ticketBookingSummary && (
        <UniversalModal
          theme={themeMode}
          open={true}
          content={
            <TicketBookingSummary
              selectedPricing={selectedPricing}
              selselectedDate={selectedDate}
            />
          }
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
