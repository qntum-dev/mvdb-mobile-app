#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 TMDB Proxy Deployment Script');
console.log('================================\n');

// Check if wrangler is installed
function checkWrangler() {
  try {
    execSync('wrangler --version', { stdio: 'ignore' });
    console.log('✅ Wrangler CLI is installed');
  } catch (error) {
    console.log('❌ Wrangler CLI not found. Installing...');
    execSync('npm install -g wrangler@latest', { stdio: 'inherit' });
  }
}

// Check if user is authenticated
function checkAuth() {
  try {
    execSync('wrangler whoami', { stdio: 'ignore' });
    console.log('✅ Authenticated with Cloudflare');
  } catch (error) {
    console.log('❌ Not authenticated. Please run: wrangler auth login');
    process.exit(1);
  }
}

// Check if API key is set
function checkApiKey() {
  try {
    execSync('wrangler secret list', { stdio: 'pipe' });
    const secrets = execSync('wrangler secret list', { encoding: 'utf8' });
    
    if (secrets.includes('TMDB_API_KEY')) {
      console.log('✅ TMDB_API_KEY secret is configured');
    } else {
      console.log('❌ TMDB_API_KEY secret not found');
      console.log('Please run: wrangler secret put TMDB_API_KEY');
      console.log('Then enter your TMDB API key when prompted');
      process.exit(1);
    }
  } catch (error) {
    console.log('⚠️  Could not check secrets. Continuing...');
  }
}

// Deploy the worker
function deploy() {
  console.log('🚀 Deploying to Cloudflare Workers...');
  try {
    execSync('wrangler deploy', { stdio: 'inherit' });
    console.log('\n✅ Deployment successful!');
    console.log('\n📋 Next steps:');
    console.log('1. Test your proxy at: https://your-worker.your-subdomain.workers.dev');
    console.log('2. Update your app to use the new proxy URL');
    console.log('3. Replace TMDB_CONFIG.BASE_URL in your React Native app');
  } catch (error) {
    console.log('\n❌ Deployment failed');
    console.log('Please check the error messages above');
    process.exit(1);
  }
}

// Main execution
async function main() {
  console.log('1. Checking prerequisites...');
  checkWrangler();
  checkAuth();
  
  console.log('\n2. Checking configuration...');
  checkApiKey();
  
  console.log('\n3. Deploying...');
  deploy();
  
  console.log('\n🎉 All done!');
  console.log('Your TMDB proxy is now live and ready to use!');
}

// Handle script arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: node deploy.js [options]

Options:
  --help, -h    Show this help message
  
Prerequisites:
  1. Cloudflare account
  2. TMDB API key
  3. Node.js and npm installed

Steps:
  1. Run: npm install
  2. Run: wrangler auth login
  3. Run: wrangler secret put TMDB_API_KEY
  4. Run: node deploy.js
`);
  process.exit(0);
}

main().catch(console.error);