const db = require('../config/db');
const { format } = require('date-fns');
const { format: formatCsv } = require('@fast-csv/format');
// Importar pdfmake e as definições de fontes
// const pdfMake = require('pdfmake/build/pdfmake.js'); // Removido
// const vfs_fonts = require('pdfmake/build/vfs_fonts.js'); // Removido

// Atribuir as definições de fontes ao pdfMake
// Tentativa de correção para o erro 'Cannot read properties of undefined (reading 'vfs')'
// pdfMake.vfs = vfs_fonts.vfs; // Removido

// Configuração das fontes para o pdfmake
// Não precisamos mais criar uma nova instância de PdfPrinter com 'new'
// Já configuramos as fontes no objeto global pdfMake
// const printer = pdfMake; // Removido

// Clientes que mais compraram
exports.listarTopClientes = (req, res) => {
  const sql = `
    SELECT c.nome, COUNT(co.id) AS total_compras
    FROM clientes c
    JOIN compras co ON c.id = co.cliente_id
    GROUP BY c.id
    ORDER BY total_compras DESC
    LIMIT 5
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
};

// Produtos mais vendidos
exports.listarTopProdutos = (req, res) => {
  const sql = `
    SELECT p.nome, COUNT(co.id) AS total_vendido
    FROM produtos p
    JOIN compras co ON p.id = co.produto_id
    GROUP BY p.id
    ORDER BY total_vendido DESC
    LIMIT 5
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
};

// Exportar arquivos em CSV
exports.exportarComprasCsv = (req, res) => {
  const sql = `
    SELECT c.nome AS cliente, p.nome AS produto, co.valor, co.data_compra, co.forma_pagamento
    FROM compras co
    JOIN clientes c ON co.cliente_id = c.id
    JOIN produtos p ON co.produto_id = p.id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ erro: err });

    res.setHeader('Content-Disposition', 'attachment; filename="relatorio_compras.csv"');
    res.setHeader('Content-Type', 'text/csv');

    const csvStream = formatCsv({ headers: true });
    csvStream.pipe(res);

    results.forEach(row => {
      csvStream.write({
        Cliente: row.cliente,
        Produto: row.produto,
        Valor: row.valor,
        Data_Compra: format(new Date(row.data_compra), 'dd/MM/yyyy'),
        Forma_Pagamento: row.forma_pagamento
      });
    });

    csvStream.end();
  });
};

// Exportar relatórios em PDF
// exports.exportarComprasPdf = (req, res) => { // Removido
//     const sql = `
//       SELECT c.nome AS cliente, p.nome AS produto, co.valor, co.data_compra, co.forma_pagamento
//       FROM compras co
//       JOIN clientes c ON co.cliente_id = c.id
//       JOIN produtos p ON co.produto_id = p.id
//     `;
// 
//     db.query(sql, (err, results) => { // Removido
//       if (err) return res.status(500).json({ erro: err }); // Removido
// 
//       const documentDefinition = { // Removido
//           content: [ // Removido
//               { text: 'Relatório de Compras', style: 'header' }, // Removido
//               { text: '\n' }, // Adiciona uma linha em branco // Removido
//               { // Removido
//                   table: { // Removido
//                       headerRows: 1, // Removido
//                       widths: ['*', '*', 'auto', 'auto', '*'], // Larguras das colunas (auto ajusta ao conteúdo, * divide o espaço restante) // Removido
//                       body: [ // Removido
//                           // Cabeçalho da tabela // Removido
//                           [ { text: 'Cliente', style: 'tableHeader' }, { text: 'Produto', style: 'tableHeader' }, { text: 'Valor', style: 'tableHeader' }, { text: 'Data Compra', style: 'tableHeader' }, { text: 'Forma Pagamento', style: 'tableHeader' } ], // Removido
//                           // Dados das compras // Removido
//                           ...results.map(compra => [ // Removido
//                               compra.cliente, // Removido
//                               compra.produto, // Removido
//                               { text: `R$ ${parseFloat(compra.valor).toFixed(2)}`, alignment: 'right' }, // Removido
//                               format(new Date(compra.data_compra), 'dd/MM/yyyy'), // Removido
//                               compra.forma_pagamento // Removido
//                           ]) // Removido
//                       ] // Removido
//                   } // Removido
//               } // Removido
//           ], // Removido
//           styles: { // Removido
//               header: { // Removido
//                   fontSize: 18, // Removido
//                   bold: true // Removido
//               }, // Removido
//               tableHeader: { // Removido
//                   bold: true, // Removido
//                   fontSize: 12, // Removido
//                   color: 'black' // Removido
//               } // Removido
//           } // Removido
//       }; // Removido
// 
//       // Usar pdfMake.createPdf // Removido
//       const pdfDoc = pdfMake.createPdf(documentDefinition); // Removido
//       
//       res.setHeader('Content-Type', 'application/pdf'); // Removido
//       res.setHeader('Content-Disposition', 'attachment; filename="relatorio_compras.pdf"'); // Removido
//       
//       pdfDoc.pipe(res); // Removido
//       pdfDoc.end(); // Removido
//     }); // Removido
//   }; // Removido