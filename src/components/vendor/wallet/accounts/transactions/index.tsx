import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HostAccount, Transaction } from "@/domain/vendor";
import { connect } from "react-redux";
import { Dispatch, RootState } from "@/store";
import { VendorAccountTransactionsFilters } from "@/domain/dto/input/vendor.input";
import { VendorAccountsAPIResponse } from "@/domain/dto/output";
import { VendorTransactionsAPIResponse } from "../../../../../domain/dto/output";

type AccountsTransactionsProps = {
  vendorAccounts: VendorAccountsAPIResponse;
  vendorAccountTransactions: VendorTransactionsAPIResponse;
  getAccountTransactions: (filters: VendorAccountTransactionsFilters) => void;
};

const AccountsTransactions: FC<AccountsTransactionsProps> = ({
  vendorAccounts,
  vendorAccountTransactions,
  getAccountTransactions,
}) => {
  const [activeTab, setActiveTab] = useState(
    vendorAccounts?.results?.length > 0
      ? vendorAccounts?.results[0]?.account?.id
      : "all"
  );
  useEffect(() => {
    if (activeTab && activeTab !== "all") {
      getAccountTransactions({
        page: 1,
        page_size: 3,
        account_id: activeTab,
      } as VendorAccountTransactionsFilters);
    }
  }, [activeTab]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Recent Transactions</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden p-2 md:p-4">
        {/* Tabs for each account + All */}
        <div className="border-b flex space-x-4 overflow-x-auto">
          {vendorAccounts?.results.map((account: HostAccount) => (
            <button
              key={account.id}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === account?.account?.id
                  ? "text-green-500 border-b-2 border-green-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(account?.account?.id)}
            >
              {account.account.name}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="divide-y">
          {vendorAccountTransactions?.results?.length > 0 ? (
            vendorAccountTransactions?.results?.map((tx: Transaction, index: number) => (
              <div
                key={index}
                className="p-4 flex justify-between items-center"
              >
                <div>
                  <div className="text-sm text-gray-500">{tx.type}</div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-medium ${
                      parseInt(tx.total_cost) < 0 ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    KES {tx.total_cost.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No transactions available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { vendorAccounts, vendorAccountTransactions } = state.vendor;
  return {
    vendorAccounts,
    vendorAccountTransactions,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getAccountTransactions: (filters: VendorAccountTransactionsFilters) =>
    dispatch.vendor.getAccountTransactions(filters),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountsTransactions);
