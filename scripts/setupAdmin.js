const axios = require('axios');

const API_URL = 'https://beecommercewatchstore-production.up.railway.app/api';

async function setupAdminAndSeed() {
  console.log('🔐 Setting up admin account and seeding products...\n');

  const timestamp = Date.now();
  const adminEmail = `admin${timestamp}@test.com`;
  const adminPassword = 'Admin123!@#';
  const adminName = 'Test Admin';

  try {
    console.log('📝 Step 1: Registering admin account...');
    let authToken;
    
    try {
      const registerResponse = await axios.post(`${API_URL}/auth/register`, {
        email: adminEmail,
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User'
      });
      
      authToken = registerResponse.data.token;
      const userData = registerResponse.data.user;
      console.log('✅ Admin account created successfully!');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log(`   User Role: ${userData?.role || 'N/A'}`);
      console.log(`   Token: ${authToken}\n`);
      
      if (userData?.role !== 'admin') {
        console.log('⚠️  WARNING: User was created with role "${userData?.role}" instead of "admin"');
        console.log('   This user may not have permission to create products.\n');
      }
    } catch (error) {
      console.log(`❌ Registration failed: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      console.log('   Full error:', JSON.stringify(error.response?.data, null, 2));
      throw error;
    }

    console.log('📦 Step 2: Seeding 50 luxury watch products...\n');
    
    const { seedProducts } = require('./seedProductsData');
    const products = seedProducts();
    
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < products.length; i++) {
      const watch = products[i];
      try {
        await axios.post(`${API_URL}/watches`, watch, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
        successCount++;
        console.log(`✅ [${i + 1}/${products.length}] Created: ${watch.brand} ${watch.name}`);
      } catch (error) {
        errorCount++;
        console.error(`❌ [${i + 1}/${products.length}] Failed: ${watch.brand} ${watch.name}`);
        if (error.response) {
          console.error(`   Error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
        }
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Products created: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📦 Total: ${products.length}\n`);

    console.log('🎉 Setup completed!');
    console.log(`\n📝 Admin credentials for future login:`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    
  } catch (error) {
    console.error('\n💥 Setup failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

setupAdminAndSeed()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
