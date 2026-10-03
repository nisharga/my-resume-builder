import apiSlice from "./api-slice";

const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // === Get Vendors ===
    getVendors: builder.query({
      query: () => ({
        url: '/vendors/customer',
        method: 'GET',
      }),
      providesTags: ['vendors'],
      transformResponse: (response) => {
        const list = response?.data || response;
        if (!Array.isArray(list)) return { vendors: [], categories: [] };

        const vendors = list.map((item) => {
          const businessDetails = item.businessDetails;
          return {
            id: item.id,
            name: businessDetails?.businessName,
            vendor: {
              ...item,
              isStoreOpen: businessDetails?.isStoreOpen,
            },
            _raw: {
              images: [item.storePhoto],
              rating: { average: 0, totalReviews: item.rating },
              tags: [],
              vendor: item,
              isStoreOpen: true,
            },
          };
        });

        return { vendors, categories: [] };
      },
    }),

    // === Get Products ===
    getProductsList: builder.query({
      query: (vendorId) => `/products?vendorId=${vendorId}`,
      providesTags: (result, error, vendorId) => [{ type: 'products', id: vendorId }],
    }),

    // === Get Categories ===
    getProductCategories: builder.query({
      query: ({ limit = 20, page = 1 }: any) => ({
        url: '/categories/productCategory',
        params: { limit, page },
      }),
      providesTags: ['categories'],
      transformResponse: (result) => {
        const items = result?.data?.data || [];
        const meta = result?.data?.meta || {};

        const categories = items.map((item: any) => ({
          id: item._id,
          name: item.name,
          slug: item.slug,
          icon: item.icon,
          image: item.icon,
          isActive: item.isActive,
        }));

        return { meta, categories };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetVendorsQuery,
  useLazyGetVendorsQuery,
  useGetProductsListQuery,
  useLazyGetProductsListQuery,
  useGetProductCategoriesQuery,
  useLazyGetProductCategoriesQuery,
} = customerApi;

export default customerApi;