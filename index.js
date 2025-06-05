const app = require('./backEnd/app');

app.listen(3000, '0.0.0.0', () => {
  console.log('🚀 API rodando em http://0.0.0.0:3000');
});
