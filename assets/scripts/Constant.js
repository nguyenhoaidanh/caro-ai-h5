window.config = {}
if (window.location.host.includes('localhost')) {
  window.config.api_domain = 'http://localhost:3000/api/users/'
}
else {
  window.config.api_domain = 'https://caro-ai-h5.firebaseapp.com/api/users/'
  console.log('product env')
}

