import axios from 'axios';
import jwt from 'jsonwebtoken';

async function test() {
  const token = jwt.sign({ sub: 'test', email: 'test@test.com', role: 'SUPER_ADMIN' }, 'brelness_secret_change_me');
  try {
    const res = await axios.post('http://localhost:3001/api/shops/9badcc68-ac19-4c6e-9ff5-fedc28ccee1b/license/renew', 
      { type: 'Basic', days: 30 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(res.data);
  } catch (err) {
      console.error("ERROR STATUS:", err.response?.status);
      console.error("ERROR DATA:", err.response?.data);
  }
}
test();
