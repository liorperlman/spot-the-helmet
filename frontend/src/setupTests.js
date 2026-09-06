import '@testing-library/jest-dom';

// jsdom doesn't implement createObjectURL/revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = jest.fn();
