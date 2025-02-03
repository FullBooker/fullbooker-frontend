import React, { FC, useState } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import NavigationButtons from "./navigationButtons";
import { ProductType } from "@/domain/constants";

type ProductPricingProps = {
  productType: ProductType;
};

const ProductPricing: FC<ProductPricingProps> = ({ productType }) => {
  return (
    <div>
      {productType === ProductType.event ? (
        <p className="font-base mt-4 mb-3 mr-1 md:mr-6 text-right">
          Cost per ticket category
        </p>
      ) : (
        <p className="font-base mt-4 ml-0 md:ml-5 lg:ml-5 mb-3 xl:ml-5 text-center">
          How will you charge for your Activity?
        </p>
      )}
      <div className="gap-4">
        {productType === ProductType.event ? (
          <div className="px-1 md:px-6 bg-white space-y-6">
            <div className="flex items-center pb-4 border border-primary px-4 p-2">
              <p className="text-lg font-semibold me-3">
                Select a currency for this event
              </p>
              <select className="border p-1">
                <option value="KES">KES</option>
                <option value="USD">USD</option>
              </select>
            </div>

            {/* Select Ticket Categories */}
            <div className="grid grid-cols-2 gap-6 pb-6 ">
              <div className="border border-primary px-4 p-2">
                <h3 className="text-lg font-bold">Select ticket categories</h3>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Select all</span>
                  </label>
                  {[
                    "Early Bird Ticket",
                    "Standard Ticket",
                    "Standard At the gate",
                    "Last-Minute Ticket",
                    "VIP Ticket",
                    "VVIP Ticket",
                  ].map((category) => (
                    <label
                      key={category}
                      className="flex items-center space-x-2"
                    >
                      <input type="checkbox" className="rounded" />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border border-primary px-4 p-2">
                <h3 className="text-lg font-bold">
                  Provide the price per ticket per category
                </h3>
                <div className="space-y-2 mt-2">
                  {[
                    "Early Bird Ticket",
                    "Standard Ticket",
                    "Standard At the gate",
                    "Last-Minute Ticket",
                    "VIP Ticket",
                    "VVIP Ticket",
                  ].map((category) => (
                    <div key={category} className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 w-full">
                        <input type="checkbox" className="rounded" />
                        <span className="w-1/2">{category}</span>
                      </label>
                      <select className="border rounded-md p-2 w-1/2">
                        <option value="KES">KES</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Maximum Tickets and Discounts */}
            <div className="grid grid-cols-2 gap-6">
              <div className="border border-primary px-4 p-2">
                <h3 className="text-lg font-bold">
                  Provide the maximum number of tickets per category
                </h3>
                <div className="space-y-2 mt-2">
                  {[
                    "Early Bird Ticket",
                    "Standard Ticket",
                    "Standard At the gate",
                    "Last-Minute Ticket",
                    "VIP Ticket",
                    "VVIP Ticket",
                  ].map((category) => (
                    <div key={category} className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 w-full">
                        <input type="checkbox" className="rounded" />
                        <span className="w-1/2">{category}</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Max tickets"
                        className="border rounded-md p-2 w-1/2"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-primary px-4 p-2">
                <h3 className="text-lg font-bold">
                  Enter the discount per category (optional)
                </h3>
                <div className="space-y-2 mt-2">
                  {[
                    "Early Bird Ticket",
                    "Standard Ticket",
                    "Standard At the gate",
                    "Last-Minute Ticket",
                    "VIP Ticket",
                    "VVIP Ticket",
                  ].map((category) => (
                    <div key={category} className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 w-full">
                        <input type="checkbox" className="rounded" />
                        <span className="w-1/2">{category}</span>
                      </label>
                      <select className="border rounded-md p-2 w-1/2">
                        <option value="KES">KES</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-1 md:px-6 bg-white space-y-6">
            <div className="flex items-center pb-4">
              <h2 className="text-xl font-semibold me-3">
                Select a currency for this event
              </h2>
              <select className="border rounded-none p-2">
                <option value="KES">KES</option>
                <option value="USD">USD</option>
              </select>
            </div>

            {/* Section A: Cost per session */}
            <div className="space-y-4 pb-6 col-span-1 grid md:grid-flow-col w-full gap-4">
              <div className="flex border-b border-primary pb-3 md:pb-12">
                <h3 className="flex items-center justify-center w-6 h-6 p-5 md:w-12 lg:w-12 xl:w-12 md:h-12 lg:h-12 xl:h-12 bg-black text-primary text-lg font-bold rounded-full shadow-lg me-4">
                  A
                </h3>
                <div className="space-y-2">
                  <p className="font-medium">Cost per session</p>
                  <label className="flex justify-between">
                    <p className="font-light">
                      Please enter the price per person per session
                    </p>
                    <input
                      type="number"
                      className="block w-full border p-2 mt-2"
                    />
                  </label>
                  <label className="flex justify-between">
                    <p className="font-light">
                      Bulk booking discounts (Optional)
                    </p>
                    <input
                      type="number"
                      className="block w-full border p-2 mt-2"
                    />
                  </label>
                  <label className="flex justify-between">
                    <p className="font-light">
                      Maximum number of tickets per session
                    </p>
                    <input
                      type="number"
                      className="block w-full border p-2 mt-2"
                    />
                  </label>
                </div>
              </div>
              <div className="border border-primary px-6 py-4">
                <h4 className="font-semibold">
                  TOTAL CHARGEABLE (PER SESSION)
                </h4>
                <ul className="space-y-1">
                  <li className="flex justify-between">
                    <p>Amount:</p> <span>3,000.00</span>
                  </li>
                  <li className="flex justify-between">
                    <p> Discount:</p> <span>0.00</span>
                  </li>
                  <li className="flex justify-between">
                    <p>Service fee (5%):</p> <span>150.00</span>
                  </li>
                  <li className="font-bold text-green-600 flex justify-between">
                    <p>Total:</p> <span>3,630.00</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Section B: Day Pass */}
            <div className="space-y-4 pb-6 col-span-1 grid md:grid-flow-col gap-4 w-full">
              <div className="flex border-b border-primary pb-3 md:pb-12">
                <h3 className="flex items-center justify-center w-6 h-6 p-5 md:w-12 lg:w-12 xl:w-12 md:h-12 lg:h-12 xl:h-12 bg-black text-primary text-lg font-bold rounded-full shadow-lg me-4">
                  B
                </h3>
                <div className="space-y-2">
                  <p className="font-medium">Day Pass</p>
                  <label className="flex justify-between">
                    <p>Is there a day pass for this activity?</p>
                    <div className="flex space-x-4 mt-1">
                      <button className="px-4 py-2 border">Yes</button>
                      <button className="px-4 py-2 border">No</button>
                    </div>
                  </label>
                  <label className="flex justify-between">
                    <p className="font-light">
                      Please enter the price per person per day pass
                    </p>
                    <input
                      type="number"
                      className="block w-full border p-2 mt-2"
                    />
                  </label>
                  <label className="flex justify-between">
                    <p className="font-light">Any bulk booking discounts?</p>
                    <input
                      type="number"
                      className="block w-full border p-2 mt-2"
                    />
                  </label>
                  <label className="flex justify-between">
                    <p className="font-light">
                      Maximum number of tickets per day pass
                    </p>
                    <input
                      type="number"
                      className="block w-full border p-2 mt-2"
                    />
                  </label>
                </div>
              </div>
              <div className="border border-primary px-6 py-4">
                <h4 className="font-semibold">TOTAL CHARGEABLE (DAY PASS)</h4>
                <ul className="space-y-1">
                  <li className="flex justify-between">
                    <p> Amount:</p> <span>5,000.00</span>
                  </li>
                  <li className="flex justify-between">
                    <p>Discount:</p> <span>0.00</span>
                  </li>
                  <li className="flex justify-between">
                    <p>Service fee (5%):</p> <span>250.00</span>
                  </li>
                  <li className="font-bold text-green-600 flex justify-between">
                    <p>Total: </p> <span>6,090.00</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Section C: Monthly subscription */}
            <div className="space-y-4 col-span-1 grid md:grid-flow-col mb-6">
              <div className="flex">
                <h3 className="flex items-center justify-center w-6 h-6 p-5 md:w-12 lg:w-12 xl:w-12 md:h-12 lg:h-12 xl:h-12 bg-black text-primary text-lg font-bold rounded-full shadow-lg me-4">
                  C
                </h3>
                <div className="space-y-2">
                  <p className="font-medium">Monthly Subscription</p>
                  <label className="flex justify-between">
                    <p className="font-light">
                      Please enter the price per person per subscription
                    </p>
                    <input
                      type="number"
                      className="block w-full border p-2 mt-2"
                    />
                  </label>
                  <label className="flex justify-between">
                    <p className="font-light">Any bulk booking discounts?</p>
                    <input
                      type="number"
                      className="block w-full border p-2 mt-2"
                    />
                  </label>
                  <label className="flex justify-between">
                    <p className="font-light">
                      Maximum number of tickets per subscription
                    </p>
                    <input
                      type="number"
                      className="block w-full border p-2 mt-2"
                    />
                  </label>
                </div>
              </div>
              <div className="border border-primary px-6 py-4">
                <h4 className="font-semibold">
                  TOTAL CHARGEABLE (MONTHLY SUBSCRIPTION)
                </h4>
                <ul className="space-y-1">
                  <li className="flex justify-between">
                    <p>Amount:</p> <span>5,000.00</span>
                  </li>
                  <li className="flex justify-between">
                    <p>Discount:</p> <span>0.00</span>
                  </li>
                  <li className="flex justify-between">
                    <p>Service fee (5%):</p> <span>250.00</span>
                  </li>
                  <li className="font-bold text-green-600 flex justify-between">
                    <p>Total:</p> <span>6,090.00</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="px-2 md:px-10 mt-4 md:mt-10">
        <NavigationButtons />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { productType } = state.vendor;
  return {
    productType,
  };
};

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ProductPricing);
