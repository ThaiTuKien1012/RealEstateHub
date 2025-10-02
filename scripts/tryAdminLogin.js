const axios = require('axios');

const API_URL = 'https://beecommercewatchstore-production.up.railway.app/api';

const commonAdminCredentials = [
  { email: 'admin@admin.com', password: 'admin123' },
  { email: 'admin@example.com', password: 'admin123' },
  { email: 'admin@test.com', password: 'admin' },
  { email: 'admin@watchshop.com', password: 'admin' },
  { email: 'admin@watchshop.com', password: 'admin123' },
  { email: 'admin@beecommerce.com', password: 'admin123' },
  { email: 'test@test.com', password: 'test123' },
];

async function tryLogins() {
  console.log('🔍 Trying common admin credentials...\n');

  for (const cred of commonAdminCredentials) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: cred.email,
        password: cred.password
      });

      if (response.data && response.data.token) {
        console.log(`✅ SUCCESS! Found valid credentials:`);
        console.log(`   Email: ${cred.email}`);
        console.log(`   Password: ${cred.password}`);
        console.log(`   Token: ${response.data.token}`);
        console.log(`   User:`, JSON.stringify(response.data.user, null, 2));
        
        if (response.data.user?.role === 'admin') {
          console.log(`\n🎉 This is an ADMIN account! You can use this to seed products.`);
          console.log(`\nTo seed products, run:`);
          console.log(`AUTH_TOKEN="${response.data.token}" npm run seed`);
        }
        
        return;
      }
    } catch (error) {
      console.log(`❌ ${cred.email} / ${cred.password} - Failed`);
    }
  }

  console.log(`\n😔 No valid admin credentials found.`);
  console.log(`\nYou need to either:`);
  console.log(`1. Contact the backend admin to create an admin account for you`);
  console.log(`2. Access Railway dashboard and run: railway run node scripts/createAdmin.js`);
  console.log(`3. Or ask for existing admin credentials`);
}

tryLogins().catch(console.error);
