import { useEffect, useState } from "react";
import axios from "axios";
import { UseDispatch, useDispatch, useSelector } from "react-redux";
import { setAuth } from "../store/authSlice";
export function useLoadingWithRefresh() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/refresh`,
          {
            withCredentials: true,
          }
        );
        dispatch(setAuth(data));
        setLoading(false);
        console.log(data);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    })();
  }, []);
  return { loading };
}
