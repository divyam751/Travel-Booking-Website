import { useBooking } from "../context/BookingContext";
import { useData } from "../context/DataContext";
import { useUser } from "../context/UserContext";

export const useResetAll = () => {
  const { resetBooking } = useBooking();
  const { resetUser } = useUser();
  const { resetData } = useData();

  const resetAll = () => {
    resetBooking();
    resetUser();
    resetData();
    sessionStorage.clear();
  };

  return resetAll;
};
