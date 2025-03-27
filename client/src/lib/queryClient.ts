import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Get auth token from localStorage if available
  const token = localStorage.getItem("token");
  
  // Prepare headers
  const headers: HeadersInit = {
    ...(data ? { "Content-Type": "application/json" } : {}),
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Get auth token from localStorage if available
    const token = localStorage.getItem("token");
    
    // Prepare headers
    const headers: HeadersInit = token 
      ? { "Authorization": `Bearer ${token}` }
      : {};

    const res = await fetch(queryKey[0] as string, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Interceptor to handle auth token
export function setupAuthInterceptor() {
  // Check for token on startup and set it in localStorage if needed
  const checkAuthToken = () => {
    // Logic to verify if token exists and is valid
    const token = localStorage.getItem("token");
    if (!token) {
      // Clear any user data if no token exists
      queryClient.setQueryData(["/api/auth/me"], null);
    }
  };

  // Call once on initialization
  checkAuthToken();

  // Add event listener for storage changes (for multi-tab support)
  window.addEventListener("storage", (e) => {
    if (e.key === "token") {
      if (!e.newValue) {
        // Token was removed in another tab
        queryClient.setQueryData(["/api/auth/me"], null);
      }
    }
  });
}
