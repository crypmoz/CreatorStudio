import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    // Try to parse response as JSON first
    try {
      const errorData = await res.json();
      throw new Error(errorData.message || `${res.status}: ${res.statusText}`);
    } catch (e) {
      // If JSON parsing fails, use text
      const text = (await res.text()) || res.statusText;
      throw new Error(`${res.status}: ${text}`);
    }
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<any> {
  const headers: HeadersInit = {
    ...(data ? { "Content-Type": "application/json" } : {})
  };

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // Important for cookie-based sessions
  });

  await throwIfResNotOk(res);
  
  // For requests that don't return content (e.g., DELETE)
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return null;
  }
  
  // Parse the JSON response
  return await res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include", // Important for cookie-based sessions
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
      refetchOnWindowFocus: true, // Enable to refresh data when window gets focus
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
    mutations: {
      retry: false,
    },
  },
});

// Session-based auth doesn't need token interceptors
export function setupAuthInterceptor() {
  // For session-based auth, we rely on cookies managed by the browser
  // We can simply check if the user is authenticated by querying the /api/user endpoint
  // This is handled by the useAuth hook
}
