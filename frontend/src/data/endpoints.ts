export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type AuthType = "none" | "bearer" | "admin";

export interface Param {
  name: string;
  in: "query" | "path" | "body";
  type: string;
  required: boolean;
  description: string;
}

export interface Endpoint {
  id: string;
  method: HttpMethod;
  path: string;
  summary: string;
  description?: string;
  auth: AuthType;
  params?: Param[];
  bodyFields?: Param[];
  responses: { code: number; description: string }[];
}

export interface ApiSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  endpoints: Endpoint[];
}

const BASE = "/api/v1";

export const apiSections: ApiSection[] = [
  // ── AUTH ──────────────────────────────────────────────────────────
  {
    id: "auth",
    title: "Authentication",
    description: "Register, login, manage profile & sessions.",
    icon: "🔐",
    color: "#4f6ef7",
    endpoints: [
      {
        id: "auth-register",
        method: "POST",
        path: `${BASE}/auth/register`,
        summary: "Register a new user account",
        description: "Creates a new user and returns JWT tokens. Rate-limited.",
        auth: "none",
        bodyFields: [
          {
            name: "email",
            in: "body",
            type: "string",
            required: true,
            description: "Valid email address",
          },
          {
            name: "password",
            in: "body",
            type: "string",
            required: true,
            description: "Min 8 characters",
          },
          {
            name: "firstName",
            in: "body",
            type: "string",
            required: true,
            description: "User first name",
          },
          {
            name: "lastName",
            in: "body",
            type: "string",
            required: true,
            description: "User last name",
          },
          {
            name: "phoneNumber",
            in: "body",
            type: "string",
            required: false,
            description: "Optional phone number",
          },
        ],
        responses: [
          {
            code: 201,
            description: "Account created, returns AuthResponse with JWT",
          },
          { code: 400, description: "Validation error" },
          { code: 409, description: "Email already registered" },
        ],
      },
      {
        id: "auth-login",
        method: "POST",
        path: `${BASE}/auth/login`,
        summary: "Login and receive JWT tokens",
        description:
          "Authenticates user credentials and returns an access token + refresh token cookie. Rate-limited.",
        auth: "none",
        bodyFields: [
          {
            name: "email",
            in: "body",
            type: "string",
            required: true,
            description: "Registered email",
          },
          {
            name: "password",
            in: "body",
            type: "string",
            required: true,
            description: "Account password",
          },
        ],
        responses: [
          { code: 200, description: "Login successful, returns AuthResponse" },
          { code: 401, description: "Invalid credentials" },
        ],
      },
      {
        id: "auth-profile-get",
        method: "GET",
        path: `${BASE}/auth/profile`,
        summary: "Get current user profile",
        auth: "bearer",
        responses: [
          { code: 200, description: "Returns ProfileResponse" },
          { code: 401, description: "Unauthorized" },
        ],
      },
      {
        id: "auth-profile-put",
        method: "PUT",
        path: `${BASE}/auth/profile`,
        summary: "Update current user profile",
        auth: "bearer",
        bodyFields: [
          {
            name: "firstName",
            in: "body",
            type: "string",
            required: false,
            description: "New first name",
          },
          {
            name: "lastName",
            in: "body",
            type: "string",
            required: false,
            description: "New last name",
          },
          {
            name: "phoneNumber",
            in: "body",
            type: "string",
            required: false,
            description: "New phone number",
          },
        ],
        responses: [
          { code: 200, description: "Updated ProfileResponse" },
          { code: 401, description: "Unauthorized" },
        ],
      },
      {
        id: "auth-refresh",
        method: "POST",
        path: `${BASE}/auth/refresh`,
        summary: "Refresh access token using refresh cookie",
        auth: "none",
        responses: [
          { code: 200, description: "Returns new TokenResponse" },
          { code: 401, description: "Invalid or expired refresh token" },
        ],
      },
      {
        id: "auth-logout",
        method: "POST",
        path: `${BASE}/auth/logout`,
        summary: "Logout current session",
        auth: "bearer",
        responses: [
          { code: 204, description: "Session invalidated" },
          { code: 401, description: "Unauthorized" },
        ],
      },
      {
        id: "auth-logout-all",
        method: "POST",
        path: `${BASE}/auth/logout-all`,
        summary: "Logout all sessions",
        description:
          "Invalidates all active refresh tokens for the authenticated user.",
        auth: "bearer",
        responses: [
          { code: 204, description: "All sessions invalidated" },
          { code: 401, description: "Unauthorized" },
        ],
      },
    ],
  },

  // ── SEARCH ────────────────────────────────────────────────────────
  {
    id: "search",
    title: "Search",
    description:
      "Search and filter available hotels by city, dates, guests & more.",
    icon: "🔍",
    color: "#10b981",
    endpoints: [
      {
        id: "search-hotels",
        method: "GET",
        path: `${BASE}/search/hotels`,
        summary: "Search available hotels",
        description:
          "Full-text and faceted search with cursor-based pagination.",
        auth: "none",
        params: [
          {
            name: "city",
            in: "query",
            type: "string",
            required: false,
            description: "City name to search in",
          },
          {
            name: "checkIn",
            in: "query",
            type: "date",
            required: false,
            description: "Check-in date (YYYY-MM-DD)",
          },
          {
            name: "checkOut",
            in: "query",
            type: "date",
            required: false,
            description: "Check-out date (YYYY-MM-DD)",
          },
          {
            name: "adults",
            in: "query",
            type: "integer",
            required: false,
            description: "Number of adult guests",
          },
          {
            name: "children",
            in: "query",
            type: "integer",
            required: false,
            description: "Number of child guests",
          },
          {
            name: "numberOfRooms",
            in: "query",
            type: "integer",
            required: false,
            description: "Rooms required",
          },
          {
            name: "minPrice",
            in: "query",
            type: "decimal",
            required: false,
            description: "Min price per night",
          },
          {
            name: "maxPrice",
            in: "query",
            type: "decimal",
            required: false,
            description: "Max price per night",
          },
          {
            name: "minStarRating",
            in: "query",
            type: "integer",
            required: false,
            description: "Minimum star rating (1–5)",
          },
          {
            name: "amenities",
            in: "query",
            type: "string[]",
            required: false,
            description: "Comma-separated amenity codes",
          },
          {
            name: "sortBy",
            in: "query",
            type: "string",
            required: false,
            description: "Sort field (price, rating, etc.)",
          },
          {
            name: "cursor",
            in: "query",
            type: "string",
            required: false,
            description: "Pagination cursor",
          },
          {
            name: "limit",
            in: "query",
            type: "integer",
            required: false,
            description: "Page size (default: 20)",
          },
        ],
        responses: [
          { code: 200, description: "Paginated list of matching hotels" },
        ],
      },
    ],
  },

  // ── HOTELS ────────────────────────────────────────────────────────
  {
    id: "hotels",
    title: "Hotels",
    description: "Hotel-specific operations including guest reviews.",
    icon: "🏨",
    color: "#f59e0b",
    endpoints: [
      {
        id: "hotels-review",
        method: "POST",
        path: `${BASE}/hotels/{hotelId}/reviews`,
        summary: "Submit a review for a hotel",
        description:
          "Guests can submit one review per booking. Requires a completed booking.",
        auth: "bearer",
        params: [
          {
            name: "hotelId",
            in: "path",
            type: "guid",
            required: true,
            description: "Hotel identifier",
          },
        ],
        bodyFields: [
          {
            name: "bookingId",
            in: "body",
            type: "guid",
            required: true,
            description: "The completed booking ID",
          },
          {
            name: "rating",
            in: "body",
            type: "integer",
            required: true,
            description: "Rating 1–5",
          },
          {
            name: "title",
            in: "body",
            type: "string",
            required: true,
            description: "Review title",
          },
          {
            name: "comment",
            in: "body",
            type: "string",
            required: false,
            description: "Detailed review text",
          },
        ],
        responses: [
          { code: 201, description: "Review created (ReviewDto)" },
          { code: 400, description: "Validation error" },
          { code: 401, description: "Unauthorized" },
          { code: 404, description: "Hotel not found" },
          { code: 409, description: "Review already exists for this booking" },
        ],
      },
    ],
  },

  // ── CART ─────────────────────────────────────────────────────────
  {
    id: "cart",
    title: "Cart",
    description: "Manage the authenticated user's room cart before checkout.",
    icon: "🛒",
    color: "#8b5cf6",
    endpoints: [
      {
        id: "cart-get",
        method: "GET",
        path: `${BASE}/cart`,
        summary: "Get current user's cart",
        auth: "bearer",
        responses: [
          { code: 200, description: "Returns CartResponse with all items" },
          { code: 401, description: "Unauthorized" },
        ],
      },
      {
        id: "cart-add",
        method: "POST",
        path: `${BASE}/cart/items`,
        summary: "Add a room type to the cart",
        auth: "bearer",
        bodyFields: [
          {
            name: "hotelRoomTypeId",
            in: "body",
            type: "guid",
            required: true,
            description: "Room type to add",
          },
          {
            name: "checkIn",
            in: "body",
            type: "date",
            required: true,
            description: "Check-in date",
          },
          {
            name: "checkOut",
            in: "body",
            type: "date",
            required: true,
            description: "Check-out date",
          },
          {
            name: "quantity",
            in: "body",
            type: "integer",
            required: true,
            description: "Number of rooms",
          },
        ],
        responses: [
          { code: 201, description: "Item added (CartItemDto)" },
          { code: 401, description: "Unauthorized" },
          { code: 409, description: "Item already in cart" },
        ],
      },
      {
        id: "cart-update",
        method: "PUT",
        path: `${BASE}/cart/items/{itemId}`,
        summary: "Update quantity of a cart item",
        auth: "bearer",
        params: [
          {
            name: "itemId",
            in: "path",
            type: "guid",
            required: true,
            description: "Cart item ID",
          },
        ],
        bodyFields: [
          {
            name: "quantity",
            in: "body",
            type: "integer",
            required: true,
            description: "New quantity",
          },
        ],
        responses: [
          { code: 200, description: "Updated CartItemDto" },
          { code: 401, description: "Unauthorized" },
          { code: 404, description: "Item not found" },
        ],
      },
      {
        id: "cart-remove-item",
        method: "DELETE",
        path: `${BASE}/cart/items/{itemId}`,
        summary: "Remove a specific item from cart",
        auth: "bearer",
        params: [
          {
            name: "itemId",
            in: "path",
            type: "guid",
            required: true,
            description: "Cart item ID",
          },
        ],
        responses: [
          { code: 204, description: "Item removed" },
          { code: 401, description: "Unauthorized" },
          { code: 404, description: "Item not found" },
        ],
      },
      {
        id: "cart-clear",
        method: "DELETE",
        path: `${BASE}/cart`,
        summary: "Clear all items from cart",
        auth: "bearer",
        responses: [
          { code: 204, description: "Cart cleared" },
          { code: 401, description: "Unauthorized" },
        ],
      },
    ],
  },

  // ── CHECKOUT ──────────────────────────────────────────────────────
  {
    id: "checkout",
    title: "Checkout",
    description:
      "Two-step checkout: create a hold, then confirm & pay via Stripe.",
    icon: "💳",
    color: "#ec4899",
    endpoints: [
      {
        id: "checkout-hold",
        method: "POST",
        path: `${BASE}/checkout/hold`,
        summary: "Step 1 — Create checkout hold",
        description:
          "Locks room availability and returns pricing summary + expiry time. Client must proceed to create-booking before expiry.",
        auth: "bearer",
        bodyFields: [
          {
            name: "notes",
            in: "body",
            type: "string",
            required: false,
            description: "Optional booking notes",
          },
        ],
        responses: [
          {
            code: 200,
            description: "Returns CheckoutHoldResponse with pricing & expiry",
          },
          { code: 400, description: "Cart is empty or invalid" },
          { code: 401, description: "Unauthorized" },
          { code: 409, description: "Active hold already exists" },
        ],
      },
      {
        id: "checkout-booking",
        method: "POST",
        path: `${BASE}/checkout/booking`,
        summary: "Step 2 — Confirm booking and get payment URL",
        description:
          "Creates confirmed booking and returns a Stripe payment session URL. Requires valid, non-expired holds from Step 1.",
        auth: "bearer",
        bodyFields: [
          {
            name: "holdIds",
            in: "body",
            type: "guid[]",
            required: true,
            description: "Hold IDs from Step 1",
          },
          {
            name: "notes",
            in: "body",
            type: "string",
            required: false,
            description: "Optional booking notes",
          },
        ],
        responses: [
          {
            code: 201,
            description:
              "Booking created, returns CreateBookingResponse with Stripe URL",
          },
          { code: 400, description: "Invalid request" },
          { code: 401, description: "Unauthorized" },
          { code: 409, description: "Holds expired or conflict" },
          { code: 422, description: "Payment session creation failed" },
        ],
      },
    ],
  },

  // ── BOOKINGS ──────────────────────────────────────────────────────
  {
    id: "bookings",
    title: "Bookings",
    description: "View and manage user bookings, including cancellation.",
    icon: "📋",
    color: "#06b6d4",
    endpoints: [
      {
        id: "bookings-list",
        method: "GET",
        path: `${BASE}/bookings`,
        summary: "Get all bookings for current user",
        auth: "bearer",
        params: [
          {
            name: "status",
            in: "query",
            type: "string",
            required: false,
            description:
              "Filter by status (Pending, Confirmed, Cancelled, Completed)",
          },
          {
            name: "page",
            in: "query",
            type: "integer",
            required: false,
            description: "Page number (default: 1)",
          },
          {
            name: "pageSize",
            in: "query",
            type: "integer",
            required: false,
            description: "Items per page (default: 20)",
          },
        ],
        responses: [
          { code: 200, description: "Paginated list of BookingListItemDto" },
          { code: 401, description: "Unauthorized" },
        ],
      },
      {
        id: "bookings-get",
        method: "GET",
        path: `${BASE}/bookings/{id}`,
        summary: "Get booking details by ID",
        description: "Accessible by the booking owner or any Admin.",
        auth: "bearer",
        params: [
          {
            name: "id",
            in: "path",
            type: "guid",
            required: true,
            description: "Booking ID",
          },
        ],
        responses: [
          { code: 200, description: "Returns BookingDetailsResponse" },
          { code: 401, description: "Unauthorized" },
          { code: 403, description: "Forbidden — not the booking owner" },
          { code: 404, description: "Booking not found" },
        ],
      },
      {
        id: "bookings-cancel",
        method: "POST",
        path: `${BASE}/bookings/{id}/cancel`,
        summary: "Cancel a confirmed booking",
        description:
          "Free cancellation within the configured window; cancellation fee applies after the free window.",
        auth: "bearer",
        params: [
          {
            name: "id",
            in: "path",
            type: "guid",
            required: true,
            description: "Booking ID",
          },
        ],
        bodyFields: [
          {
            name: "reason",
            in: "body",
            type: "string",
            required: false,
            description: "Optional cancellation reason",
          },
        ],
        responses: [
          { code: 200, description: "Returns CancellationDetailsResponse" },
          { code: 401, description: "Unauthorized" },
          { code: 403, description: "Forbidden" },
          { code: 404, description: "Booking not found" },
          { code: 409, description: "Already cancelled or not cancellable" },
        ],
      },
    ],
  },

  // ── ADMIN ─────────────────────────────────────────────────────────
  {
    id: "admin",
    title: "Admin",
    description:
      "Admin-only CRUD operations for Cities, Hotels, Room Types, Rooms, and Services.",
    icon: "⚙️",
    color: "#e879f9",
    endpoints: [
      // Cities
      {
        id: "admin-cities-list",
        method: "GET",
        path: `${BASE}/admincities`,
        summary: "List cities (paginated)",
        auth: "admin",
        params: [
          {
            name: "search",
            in: "query",
            type: "string",
            required: false,
            description: "Filter by name",
          },
          {
            name: "page",
            in: "query",
            type: "integer",
            required: false,
            description: "Page number",
          },
          {
            name: "pageSize",
            in: "query",
            type: "integer",
            required: false,
            description: "Items per page",
          },
        ],
        responses: [
          { code: 200, description: "PaginatedAdminResponse<CityDto>" },
        ],
      },
      {
        id: "admin-cities-create",
        method: "POST",
        path: `${BASE}/admincities`,
        summary: "Create a city",
        auth: "admin",
        bodyFields: [
          {
            name: "name",
            in: "body",
            type: "string",
            required: true,
            description: "City name",
          },
          {
            name: "country",
            in: "body",
            type: "string",
            required: true,
            description: "Country name",
          },
          {
            name: "postOffice",
            in: "body",
            type: "string",
            required: false,
            description: "Post office / ZIP code",
          },
        ],
        responses: [
          { code: 201, description: "Created CityDto" },
          { code: 409, description: "City already exists" },
        ],
      },
      {
        id: "admin-cities-get",
        method: "GET",
        path: `${BASE}/admincities/{id}`,
        summary: "Get city by ID",
        auth: "admin",
        params: [
          {
            name: "id",
            in: "path",
            type: "guid",
            required: true,
            description: "City ID",
          },
        ],
        responses: [
          { code: 200, description: "CityDto" },
          { code: 404, description: "Not found" },
        ],
      },
      {
        id: "admin-cities-update",
        method: "PUT",
        path: `${BASE}/admincities/{id}`,
        summary: "Update a city",
        auth: "admin",
        params: [
          {
            name: "id",
            in: "path",
            type: "guid",
            required: true,
            description: "City ID",
          },
        ],
        bodyFields: [
          {
            name: "name",
            in: "body",
            type: "string",
            required: false,
            description: "New name",
          },
          {
            name: "country",
            in: "body",
            type: "string",
            required: false,
            description: "New country",
          },
          {
            name: "postOffice",
            in: "body",
            type: "string",
            required: false,
            description: "New post office",
          },
        ],
        responses: [
          { code: 200, description: "Updated CityDto" },
          { code: 404, description: "Not found" },
          { code: 409, description: "Name conflict" },
        ],
      },
      {
        id: "admin-cities-delete",
        method: "DELETE",
        path: `${BASE}/admincities/{id}`,
        summary: "Delete a city",
        auth: "admin",
        params: [
          {
            name: "id",
            in: "path",
            type: "guid",
            required: true,
            description: "City ID",
          },
        ],
        responses: [
          { code: 204, description: "Deleted" },
          { code: 404, description: "Not found" },
          { code: 409, description: "Has linked hotels" },
        ],
      },

      // Hotels
      {
        id: "admin-hotels-list",
        method: "GET",
        path: `${BASE}/adminhotels`,
        summary: "List hotels (paginated)",
        auth: "admin",
        params: [
          {
            name: "cityId",
            in: "query",
            type: "guid",
            required: false,
            description: "Filter by city",
          },
          {
            name: "search",
            in: "query",
            type: "string",
            required: false,
            description: "Text search",
          },
          {
            name: "page",
            in: "query",
            type: "integer",
            required: false,
            description: "Page number",
          },
          {
            name: "pageSize",
            in: "query",
            type: "integer",
            required: false,
            description: "Items per page",
          },
        ],
        responses: [
          { code: 200, description: "PaginatedAdminResponse<HotelDto>" },
        ],
      },
      {
        id: "admin-hotels-create",
        method: "POST",
        path: `${BASE}/adminhotels`,
        summary: "Create a hotel",
        auth: "admin",
        bodyFields: [
          {
            name: "cityId",
            in: "body",
            type: "guid",
            required: true,
            description: "City where hotel is located",
          },
          {
            name: "name",
            in: "body",
            type: "string",
            required: true,
            description: "Hotel name",
          },
          {
            name: "owner",
            in: "body",
            type: "string",
            required: true,
            description: "Owner name",
          },
          {
            name: "address",
            in: "body",
            type: "string",
            required: true,
            description: "Street address",
          },
          {
            name: "starRating",
            in: "body",
            type: "integer",
            required: true,
            description: "Star rating (1–5)",
          },
          {
            name: "description",
            in: "body",
            type: "string",
            required: false,
            description: "Hotel description",
          },
          {
            name: "latitude",
            in: "body",
            type: "decimal",
            required: false,
            description: "GPS latitude",
          },
          {
            name: "longitude",
            in: "body",
            type: "decimal",
            required: false,
            description: "GPS longitude",
          },
        ],
        responses: [
          { code: 201, description: "Created HotelDto" },
          { code: 409, description: "Hotel name conflict in city" },
        ],
      },
      {
        id: "admin-hotels-get",
        method: "GET",
        path: `${BASE}/adminhotels/{id}`,
        summary: "Get hotel by ID",
        auth: "admin",
        params: [
          {
            name: "id",
            in: "path",
            type: "guid",
            required: true,
            description: "Hotel ID",
          },
        ],
        responses: [
          { code: 200, description: "HotelDto" },
          { code: 404, description: "Not found" },
        ],
      },
      {
        id: "admin-hotels-update",
        method: "PUT",
        path: `${BASE}/adminhotels/{id}`,
        summary: "Update a hotel",
        auth: "admin",
        params: [
          {
            name: "id",
            in: "path",
            type: "guid",
            required: true,
            description: "Hotel ID",
          },
        ],
        bodyFields: [
          {
            name: "cityId",
            in: "body",
            type: "guid",
            required: false,
            description: "New city ID",
          },
          {
            name: "name",
            in: "body",
            type: "string",
            required: false,
            description: "Hotel name",
          },
          {
            name: "owner",
            in: "body",
            type: "string",
            required: false,
            description: "Owner name",
          },
          {
            name: "address",
            in: "body",
            type: "string",
            required: false,
            description: "Address",
          },
          {
            name: "starRating",
            in: "body",
            type: "integer",
            required: false,
            description: "Star rating",
          },
          {
            name: "description",
            in: "body",
            type: "string",
            required: false,
            description: "Description",
          },
          {
            name: "latitude",
            in: "body",
            type: "decimal",
            required: false,
            description: "Latitude",
          },
          {
            name: "longitude",
            in: "body",
            type: "decimal",
            required: false,
            description: "Longitude",
          },
        ],
        responses: [
          { code: 200, description: "Updated HotelDto" },
          { code: 404, description: "Not found" },
          { code: 409, description: "Conflict" },
        ],
      },
      {
        id: "admin-hotels-delete",
        method: "DELETE",
        path: `${BASE}/adminhotels/{id}`,
        summary: "Delete a hotel",
        auth: "admin",
        params: [
          {
            name: "id",
            in: "path",
            type: "guid",
            required: true,
            description: "Hotel ID",
          },
        ],
        responses: [
          { code: 204, description: "Deleted" },
          { code: 404, description: "Not found" },
          { code: 409, description: "Has active bookings" },
        ],
      },
      {
        id: "admin-hotels-images",
        method: "POST",
        path: `${BASE}/adminhotels/{id}/images`,
        summary: "Upload hotel image (multipart)",
        auth: "admin",
        params: [
          {
            name: "id",
            in: "path",
            type: "guid",
            required: true,
            description: "Hotel ID",
          },
        ],
        bodyFields: [
          {
            name: "image",
            in: "body",
            type: "file",
            required: true,
            description: "Image file (max 6MB, JPEG/PNG/WebP)",
          },
          {
            name: "caption",
            in: "body",
            type: "string",
            required: false,
            description: "Image caption",
          },
          {
            name: "sortOrder",
            in: "body",
            type: "integer",
            required: false,
            description: "Display order",
          },
        ],
        responses: [
          { code: 201, description: "Uploaded ImageDto" },
          { code: 400, description: "Invalid image format" },
          { code: 404, description: "Hotel not found" },
          { code: 413, description: "File too large (max 6MB)" },
          { code: 429, description: "Rate limit exceeded" },
        ],
      },

      // Room Types
      {
        id: "admin-roomtypes-list",
        method: "GET",
        path: `${BASE}/adminroomtypes`,
        summary: "List room types",
        auth: "admin",
        params: [
          {
            name: "search",
            in: "query",
            type: "string",
            required: false,
            description: "Filter by name",
          },
          {
            name: "page",
            in: "query",
            type: "integer",
            required: false,
            description: "Page number",
          },
          {
            name: "pageSize",
            in: "query",
            type: "integer",
            required: false,
            description: "Items per page",
          },
        ],
        responses: [
          { code: 200, description: "PaginatedAdminResponse<RoomTypeDto>" },
        ],
      },
      {
        id: "admin-roomtypes-create",
        method: "POST",
        path: `${BASE}/adminroomtypes`,
        summary: "Create a room type",
        auth: "admin",
        bodyFields: [
          {
            name: "name",
            in: "body",
            type: "string",
            required: true,
            description: "Room type name (e.g. Suite, Double)",
          },
          {
            name: "description",
            in: "body",
            type: "string",
            required: false,
            description: "Description",
          },
        ],
        responses: [
          { code: 201, description: "Created RoomTypeDto" },
          { code: 409, description: "Name already exists" },
        ],
      },
      {
        id: "admin-roomtypes-get",
        method: "GET",
        path: `${BASE}/adminroomtypes/{id}`,
        summary: "Get room type by ID",
        auth: "admin",
        params: [
          {
            name: "id",
            in: "path",
            type: "guid",
            required: true,
            description: "RoomType ID",
          },
        ],
        responses: [
          { code: 200, description: "RoomTypeDto" },
          { code: 404, description: "Not found" },
        ],
      },
      {
        id: "admin-roomtypes-update",
        method: "PUT",
        path: `${BASE}/adminroomtypes/{id}`,
        summary: "Update a room type",
        auth: "admin",
        params: [
          {
            name: "id",
            in: "path",
            type: "guid",
            required: true,
            description: "RoomType ID",
          },
        ],
        bodyFields: [
          {
            name: "name",
            in: "body",
            type: "string",
            required: false,
            description: "New name",
          },
          {
            name: "description",
            in: "body",
            type: "string",
            required: false,
            description: "New description",
          },
        ],
        responses: [
          { code: 200, description: "Updated RoomTypeDto" },
          { code: 404, description: "Not found" },
          { code: 409, description: "Conflict" },
        ],
      },
      {
        id: "admin-roomtypes-delete",
        method: "DELETE",
        path: `${BASE}/adminroomtypes/{id}`,
        summary: "Delete room type",
        auth: "admin",
        params: [
          {
            name: "id",
            in: "path",
            type: "guid",
            required: true,
            description: "RoomType ID",
          },
        ],
        responses: [
          { code: 204, description: "Deleted" },
          { code: 404, description: "Not found" },
          { code: 409, description: "In use by rooms" },
        ],
      },

      // Rooms — generic CRUD
      {
        id: "admin-rooms-list",
        method: "GET",
        path: `${BASE}/adminrooms`,
        summary: "List rooms",
        auth: "admin",
        params: [
          {
            name: "search",
            in: "query",
            type: "string",
            required: false,
            description: "Filter",
          },
          {
            name: "page",
            in: "query",
            type: "integer",
            required: false,
            description: "Page",
          },
          {
            name: "pageSize",
            in: "query",
            type: "integer",
            required: false,
            description: "Size",
          },
        ],
        responses: [{ code: 200, description: "Paginated rooms list" }],
      },
      {
        id: "admin-rooms-create",
        method: "POST",
        path: `${BASE}/adminrooms`,
        summary: "Create a room",
        auth: "admin",
        responses: [
          { code: 201, description: "Room created" },
          { code: 409, description: "Conflict" },
        ],
      },
      {
        id: "admin-rooms-update",
        method: "PUT",
        path: `${BASE}/adminrooms/{id}`,
        summary: "Update a room",
        auth: "admin",
        params: [
          {
            name: "id",
            in: "path",
            type: "guid",
            required: true,
            description: "Room ID",
          },
        ],
        responses: [
          { code: 200, description: "Updated" },
          { code: 404, description: "Not found" },
        ],
      },
      {
        id: "admin-rooms-delete",
        method: "DELETE",
        path: `${BASE}/adminrooms/{id}`,
        summary: "Delete a room",
        auth: "admin",
        params: [
          {
            name: "id",
            in: "path",
            type: "guid",
            required: true,
            description: "Room ID",
          },
        ],
        responses: [
          { code: 204, description: "Deleted" },
          { code: 404, description: "Not found" },
        ],
      },

      // Services
      {
        id: "admin-services-list",
        method: "GET",
        path: `${BASE}/adminservices`,
        summary: "List services",
        auth: "admin",
        responses: [{ code: 200, description: "Services list" }],
      },
      {
        id: "admin-services-create",
        method: "POST",
        path: `${BASE}/adminservices`,
        summary: "Create a service",
        auth: "admin",
        responses: [
          { code: 201, description: "Service created" },
          { code: 409, description: "Conflict" },
        ],
      },
      {
        id: "admin-services-update",
        method: "PUT",
        path: `${BASE}/adminservices/{id}`,
        summary: "Update a service",
        auth: "admin",
        params: [
          {
            name: "id",
            in: "path",
            type: "guid",
            required: true,
            description: "Service ID",
          },
        ],
        responses: [
          { code: 200, description: "Updated" },
          { code: 404, description: "Not found" },
        ],
      },
      {
        id: "admin-services-delete",
        method: "DELETE",
        path: `${BASE}/adminservices/{id}`,
        summary: "Delete a service",
        auth: "admin",
        params: [
          {
            name: "id",
            in: "path",
            type: "guid",
            required: true,
            description: "Service ID",
          },
        ],
        responses: [
          { code: 204, description: "Deleted" },
          { code: 404, description: "Not found" },
        ],
      },
    ],
  },
];
