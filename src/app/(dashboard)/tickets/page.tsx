"use client"
import React, { FC } from "react";
import ComingSoon from "@/components/vendor/products/shared/coming-soon";
import { ModalID } from "@/domain/components";
import { RootState } from "@/store";
import { connect } from "react-redux";

type MyTicketsPageProps = {};

const MyTicketsPage: FC<MyTicketsPageProps> = ({
    
}) => {
  return <ComingSoon />;
};

const mapStateToProps = (state: RootState) => {
  return {
    state,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
    setActiveModal: (modalId: ModalID) =>
        dispatch.components.setActiveModal(modalId),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyTicketsPage);
