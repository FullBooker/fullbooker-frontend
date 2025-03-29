import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  return (
    <button
      className="w-full flex justify-between py-4 px-5 border border-inputBorderColor bg-gradient-to-br from-[#121211] to-[#21211F] rounded-full hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-mainColor"
      onClick={() => router.push("/login")}
    >
      <span className="text-whiteColor">Logut</span>
      <LogOut className="text-whiteColor" width={22} height={22} />
    </button>
  );
};

export default LogoutButton;
