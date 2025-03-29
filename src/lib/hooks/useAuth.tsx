import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getToken } from "@/utilities/auth.cookie";


function useAuth() {
    const { isLoggedIn } = useSelector((state: RootState) => state.authentication);
    const token = getToken();

    return {
        authenticated: isLoggedIn && !!token,
    };
}

export default useAuth;
