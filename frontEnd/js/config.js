// API URL
// const API_URL = 'http://localhost:3000/api';

// Define a URL da API usando a origem da página atual
// Isso garante que o frontend se comunique com o backend na mesma porta em que foi carregado
const API_URL = window.location.origin + '/api';

// Função para obter o token do localStorage
// ... existing code ... 