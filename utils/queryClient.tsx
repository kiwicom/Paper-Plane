import { QueryClient } from "react-query";
import { createToast } from "@kiwicom/orbit-components/lib/Toast";
import Alert from "@kiwicom/orbit-components/lib/icons/Alert";

const defaultErrorHandler = (error: unknown) => {
  createToast(`Failed to fetch the data: ${error}`, { icon: <Alert /> });
  // eslint-disable-next-line no-console
  console.log(error);
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: defaultErrorHandler,
    },
    mutations: {
      onError: defaultErrorHandler,
    },
  },
});

export default queryClient;
