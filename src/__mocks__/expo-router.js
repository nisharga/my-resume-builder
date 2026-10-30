const { jest } = require("@jest/globals");

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn().mockReturnValue(false),
  prefetch: jest.fn(),
  setParams: jest.fn(),
};

module.exports = {
  useRouter: jest.fn().mockReturnValue(mockRouter),
  useLocalSearchParams: jest.fn().mockReturnValue({}),
  useGlobalSearchParams: jest.fn().mockReturnValue({}),
  usePathname: jest.fn().mockReturnValue("/"),
  useSegments: jest.fn().mockReturnValue([]),
  useFocusEffect: jest.fn((cb) => cb()),
  useNavigation: jest.fn().mockReturnValue({}),
  Link: ({ children }) => children,
  Redirect: () => null,
  Stack: { Screen: () => null },
  Tabs: { Screen: () => null },
  router: mockRouter,
};
