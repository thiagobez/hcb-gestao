import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Tabs, Tab, Button, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
}));

// Dados simulados para transações financeiras
const transacoesData = [
  { id: 1, data: '22/04/2025', imovelCodigo: 'IM001', descricao: 'Aluguel', categoria: 'Receita', valor: 2500.00, status: 'Conciliado' },
  { id: 2, data: '20/04/2025', imovelCodigo: 'IM003', descricao: 'Aluguel', categoria: 'Receita', valor: 3200.00, status: 'Conciliado' },
  { id: 3, data: '18/04/2025', imovelCodigo: 'IM001', descricao: 'IPTU', categoria: 'Despesa', valor: 1200.00, status: 'Pendente' },
  { id: 4, data: '15/04/2025', imovelCodigo: 'IM006', descricao: 'Aluguel', categoria: 'Receita', valor: 1800.00, status: 'Conciliado' },
  { id: 5, data: '12/04/2025', imovelCodigo: 'IM003', descricao: 'Condomínio', categoria: 'Despesa', valor: 700.00, status: 'Pendente' },
  { id: 6, data: '10/04/2025', imovelCodigo: 'IM007', descricao: 'Aluguel', categoria: 'Receita', valor: 2200.00, status: 'Conciliado' },
  { id: 7, data: '08/04/2025', imovelCodigo: 'IM009', descricao: 'Aluguel', categoria: 'Receita', valor: 2800.00, status: 'Conciliado' },
  { id: 8, data: '05/04/2025', imovelCodigo: 'IM007', descricao: 'TCRS', categoria: 'Despesa', valor: 320.00, status: 'Pendente' },
  { id: 9, data: '03/04/2025', imovelCodigo: 'IM009', descricao: 'Manutenção', categoria: 'Despesa', valor: 1500.00, status: 'Conciliado' },
  { id: 10, data: '01/04/2025', imovelCodigo: 'IM001', descricao: 'Seguro Incêndio', categoria: 'Despesa', valor: 450.00, status: 'Conciliado' },
];

const categoriaOptions = [
  { value: 'Receita', label: 'Receita' },
  { value: 'Despesa', label: 'Despesa' },
];

const statusOptions = [
  { value: 'Conciliado', label: 'Conciliado' },
  { value: 'Pendente', label: 'Pendente' },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Conciliado':
      return 'success';
    case 'Pendente':
      return 'warning';
    default:
      return 'default';
  }
};

const getCategoriaColor = (categoria) => {
  switch (categoria) {
    case 'Receita':
      return 'success';
    case 'Despesa':
      return 'error';
    default:
      return 'default';
  }
};

// Dados para o gráfico
const barData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      label: 'Receitas',
      data: [120000, 125000, 122000, 130000, 128000, 135000],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
    {
      label: 'Despesas',
      data: [70000, 72000, 68000, 75000, 73000, 78000],
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
    },
  ],
};

const Financeiro = () => {
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredTransacoes, setFilteredTransacoes] = useState(transacoesData);
  const [mesSelecionado, setMesSelecionado] = useState('Abril/2025');

  const meses = [
    'Janeiro/2025', 'Fevereiro/2025', 'Março/2025', 'Abril/2025', 
    'Maio/2025', 'Junho/2025', 'Julho/2025', 'Agosto/2025'
  ];

  React.useEffect(() => {
    const filtered = transacoesData.filter((transacao) => {
      const matchesSearch = transacao.imovelCodigo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           transacao.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategoria = categoriaFilter === '' || transacao.categoria === categoriaFilter;
      const matchesStatus = statusFilter === '' || transacao.status === statusFilter;
      return matchesSearch && matchesCategoria && matchesStatus;
    });
    setFilteredTransacoes(filtered);
    setPage(0);
  }, [searchTerm, categoriaFilter, statusFilter]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Cálculo de totais
  const totalReceitas = filteredTransacoes
    .filter(t => t.categoria === 'Receita')
    .reduce((sum, t) => sum + t.valor, 0);
  
  const totalDespesas = filteredTransacoes
    .filter(t => t.categoria === 'Despesa')
    .reduce((sum, t) => sum + t.valor, 0);
  
  const saldo = totalReceitas - totalDespesas;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Financeiro
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Relatórios Mensais" />
        <Tab label="Conciliação Bancária" />
      </Tabs>
      
      {tabValue === 0 && (
        <>
          {/* Seletor de Mês e Botão Exportar */}
          <Grid container spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                variant="outlined"
                label="Mês de Referência"
                value={mesSelecionado}
                onChange={(e) => setMesSelecionado(e.target.value)}
                size="small"
              >
                {meses.map((mes) => (
                  <MenuItem key={mes} value={mes}>
                    {mes}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<FileDownloadIcon />}
              >
                Exportar Relatório
              </Button>
            </Grid>
          </Grid>
          
          {/* Resumo Financeiro */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Item>
                <Typography variant="h6" gutterBottom>Receitas do Mês</Typography>
                <Typography variant="h4" color="success.main">R$ {totalReceitas.toFixed(2)}</Typography>
              </Item>
            </Grid>
            <Grid item xs={12} md={4}>
              <Item>
                <Typography variant="h6" gutterBottom>Despesas do Mês</Typography>
                <Typography variant="h4" color="error">R$ {totalDespesas.toFixed(2)}</Typography>
              </Item>
            </Grid>
            <Grid item xs={12} md={4}>
              <Item>
                <Typography variant="h6" gutterBottom>Saldo do Mês</Typography>
                <Typography variant="h4" color={saldo >= 0 ? "success.main" : "error"}>
                  R$ {saldo.toFixed(2)}
                </Typography>
              </Item>
            </Grid>
          </Grid>
          
          {/* Gráfico */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Item>
                <Typography variant="h6" gutterBottom>Receitas vs Despesas (6 meses)</Typography>
                <Box sx={{ height: 300 }}>
                  <Bar 
                    data={barData} 
                    options={{ 
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                          }
                        }
                      }
                    }} 
                  />
                </Box>
              </Item>
            </Grid>
          </Grid>
        </>
      )}
      
      {tabValue === 1 && (
        <>
          {/* Filtros para Conciliação */}
          <Grid container spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar por imóvel ou descrição"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                variant="outlined"
                label="Categoria"
                value={categoriaFilter}
                onChange={(e) => setCategoriaFilter(e.target.value)}
                size="small"
              >
                <MenuItem value="">Todas</MenuItem>
                {categoriaOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                variant="outlined"
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                size="small"
              >
                <MenuItem value="">Todos</MenuItem>
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
              >
                Importar Extrato
              </Button>
            </Grid>
          </Grid>
          
          {/* Tabela de Transações */}
          <Item>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="tabela de transações">
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Imóvel</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Categoria</TableCell>
                    <TableCell align="right">Valor (R$)</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransacoes
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((transacao) => (
                      <TableRow key={transacao.id}>
                        <TableCell>{transacao.data}</TableCell>
                        <TableCell>{transacao.imovelCodigo}</TableCell>
                        <TableCell>{transacao.descricao}</TableCell>
                        <TableCell>
                          <Chip 
                            label={transacao.categoria} 
                            color={getCategoriaColor(transacao.categoria)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          R$ {transacao.valor.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={transacao.status} 
                            color={getStatusColor(transacao.status)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredTransacoes.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Linhas por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </Item>
        </>
      )}
    </Box>
  );
};

export default Financeiro;
