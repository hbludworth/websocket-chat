import axios from '@/axiosInstance';

async function testOpenRequest(): Promise<void> {
  await axios.get('/tests/open');
}

async function testAuthenticatedRequest(): Promise<void> {
  await axios.get('/tests/auth');
}

async function testAdminRequest(): Promise<void> {
  await axios.get('/tests/admin');
}

async function testNonExistentRequest(): Promise<void> {
  await axios.get('/tests/non_existent');
}

export default {
  testOpenRequest,
  testAuthenticatedRequest,
  testAdminRequest,
  testNonExistentRequest,
};
