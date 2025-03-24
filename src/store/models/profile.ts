import { UserProfile } from "@/domain/profile";
import type { RootModel } from ".";
import {
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "../../utilities";

import { createModel } from "@rematch/core";
import {
  UpdateProfileImagePayload,
} from "@/domain/dto/profile.input";

type ProfileState = {
  profile: UserProfile | null;
};

export const profile = createModel<RootModel>()({
  state: {
    profile: null,
    showBalance: true,
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
    async getUserProfile() {
      try {
        const response: any = await getRequest("/accounts/profile");

        if (response && response?.data) {
          dispatch.profile.setProfile(response?.data);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async updateUserProfile(payload) {
      try {
        const response: any = await patchRequest("/accounts/profile/update/", payload);

        if (response) {
          dispatch.profile.getUserProfile();
          dispatch.alert.setSuccessAlert(response?.data?.message);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
    async updateProfileImage(payload: UpdateProfileImagePayload) {
      try {
        const response: any = await patchRequest(
          "/accounts/profile/update/",
          payload,
          true
        );

        if (response) {
          dispatch.profile.getUserProfile();
          dispatch.alert.setSuccessAlert(response?.data?.message);
        }
      } catch (error: any) {
        dispatch.alert.setFailureAlert(error?.message);
      }
    },
  }),
});
