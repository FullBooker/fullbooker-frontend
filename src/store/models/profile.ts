import { UserProfile } from "@/domain/profile";
import type { RootModel } from ".";
import { getRequest, putRequest } from "../../utilities";

import { createModel } from "@rematch/core";

type ProfileState = {
  profile: UserProfile | null;
};

export const profile = createModel<RootModel>()({
  state: {
    profile: null,
    showBalance: true
  } as ProfileState,
  reducers: {
    setProfile(state: ProfileState, profile: UserProfile) {
      return {
        ...state,
        profile,
      };
    },
    toggleBalanceVisibility(state: ProfileState, showBalance: boolean) {
      return {
        ...state,
        showBalance,
      };
    },
  },
  effects: (dispatch: any) => ({
    async getUserProfile(payload, rootState) {
      try {
        const response: any = await getRequest("/accounts/profile");

        if (response && response?.data) {
          dispatch.profile.setProfile(response?.data);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async updateUserProfile(payload, rootState) {
      try {
        const response: any = await putRequest(
          "/api/v1/user/auth/profile",
          payload
        );

        if (response && response?.data?.success) {
          dispatch.alert.setSuccessAlert(response?.data?.message);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
  }),
});
