"use client";

import React, { FC } from "react";
import { RootState } from "@/store";
import { withAuth } from "@/components/views/dash/authGuard";
import { connect } from "react-redux";
import VendorLayout from "../layout";
import ComingSoon from "@/components/vendor/products/shared/coming-soon";

export type SettingsPageProps = {};

const SettingsPage: FC<SettingsPageProps> & { layout: any } = ({}) => {
  return (
    <div className="bg-white">
      <ComingSoon />
    </div>
  );
};

SettingsPage.layout = VendorLayout;

const mapStateToProps = (state: RootState) => {
  return {};
};

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuth(SettingsPage));
