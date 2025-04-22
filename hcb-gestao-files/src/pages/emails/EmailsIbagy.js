import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Chip, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DeleteIcon from '@mui/icons-material/Delete';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
}));

// Dados simulados para emails
const emailsData = [
  { id: 1, assunto: 'Extrato Mensal - Imóvel IM001', remetente: 'extratos@ibagy.com.br', data: '01/04/2025', tipo: 'Extrato', status: 'Processado' },
  { id: 2, assunto: 'Reajuste de Contrato - Imóvel IM003', remetente: 'contratos@ibagy.com.br', data: '03/04/2025', tipo: 'Reajuste', status: 'Processado' },
  { id: 3, assunto: 'Extrato Mensal - Imóvel IM006', remetente: 'extratos@ibagy.com.br', data: '01/04/2025', tipo: 'Extrato', status: 'Processado' },
  { id: 4, assunto: 'Novo Contrato - Imóvel IM008', remetente: 'contratos@ibagy.com.br', data: '10/04/2025', tipo: 'Contrato', status: 'Pendente' },
  { id: 5, assunto: 'Extrato Mensal - Imóvel IM007', remetente: 'extratos@ibagy.com.br', data: '01/04/2025', tipo: 'Extrato', status: 'Processado' },
  { id: 6, assunto: 'Manutenção Agendada - Imóvel IM004', remetente: 'manutencao@ibagy.com.br', data: '15/04/2025', tipo: 'Manutenção', status: 'Pendente' },
  { id: 7, assunto: 'Extrato Mensal - Imóvel IM009', remetente: 'extratos@ibagy.com.br', data: '01/04/2025', tipo: 'Extrato', status: 'Processado' },
  { id: 8, assunto: 'Vistoria Realizada - Imóvel IM005', remetente: 'vistorias@ibagy.com.br', data: '18/04/2025', tipo: 'Vistoria', status: 'Pendente' },
  { id: 9, assunto: 'Extrato Mensal - Imóvel IM003', remetente: 'extratos@ibagy.com.br', data: '01/04/2025', tipo: 'Extrato', status: 'Processado' },
  { id: 10, assunto: 'Renovação de Contrato - Imóvel IM007', remetente: 'contratos@ibagy.com.br', data: '20/04/2025', tipo: 'Contrato', status: 'Pendente' },
];

const tipoOptions = [
  { value: 'Extrato', label: 'Extrato' },
  { value: 'Contrato', label: 'Contrato' },
  { value: 'Reajuste', label: 'Reajuste' },
  { value: 'Manutenção', label: 'Manutenção' },
  { value: 'Vistoria', label: 'Vistoria' },
];

const statusOptions = [
  { value: 'Processado', label: 'Processado' },
  { value: 'Pendente', label: 'Pendente' },
];

const getTipoColor = (tipo) => {
  switch (tipo) {
    case 'Extrato':
      return 'primary';
    case 'Contrato':
      return 'success';
    case 'Reajuste':
      return 'warning';
    case 'Manutenção':
      return 'error';
    case 'Vistoria':
      return 'info';
    default:
      return 'default';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Processado':
      return 'success';
    case 'Pendente':
      return 'warning';
    default:
      return 'default';
  }
};

const EmailsIbagy = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredEmails, setFilteredEmails] = useState(emailsData);
  const [sincronizando, setSincronizando] = useState(false);

  useEffect(() => {
    const filtered = emailsData.filter((email) => {
      const matchesSearch = email.assunto.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           email.remetente.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTipo = tipoFilter === '' || email.tipo === tipoFilter;
      const matchesStatus = statusFilter === '' || email.status === statusFilter;
      return matchesSearch && matchesTipo && matchesStatus;
    });
    setFilteredEmails(filtered);
    setPage(0);
  }, [searchTerm, tipoFilter, statusFilter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSincronizar = () => {
    setSincronizando(true);
    // Simulação de sincronização
    setTimeout(() => {
      setSincronizando(false);
    }, 2000);
  };

  const handleProcessarEmail = (id) => {
    console.log('Processando email:', id);
    // Na implementação real, atualizaríamos o status do email
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Emails Ibagy
      </Typography>
      
      {/* Filtros e Botão Sincronizar */}
      <Grid container spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar por assunto ou remetente"
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
            label="Tipo"
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            size="small"
          >
            <MenuItem value="">Todos</MenuItem>
            {tipoOptions.map((option) => (
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
            startIcon={<RefreshIcon />}
            onClick={handleSincronizar}
            disabled={sincronizando}
          >
            {sincronizando ? 'Sincronizando...' : 'Sincronizar Emails'}
          </Button>
        </Grid>
      </Grid>
      
      {/* Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6" gutterBottom>Total de Emails</Typography>
            <Typography variant="h4">{emailsData.length}</Typography>
          </Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6" gutterBottom>Processados</Typography>
            <Typography variant="h4" color="success.main">
              {emailsData.filter(e => e.status === 'Processado').length}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6" gutterBottom>Pendentes</Typography>
            <Typography variant="h4" color="warning.main">
              {emailsData.filter(e => e.status === 'Pendente').length}
            </Typography>
          </Item>
        </Grid>
      </Grid>
      
      {/* Tabela de Emails */}
      <Item>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de emails">
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Assunto</TableCell>
                <TableCell>Remetente</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmails
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((email) => (
                  <TableRow key={email.id}>
                    <TableCell>{email.data}</TableCell>
                    <TableCell>{email.assunto}</TableCell>
                    <TableCell>{email.remetente}</TableCell>
                    <TableCell>
                      <Chip 
                        label={email.tipo} 
                        color={getTipoColor(email.tipo)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={email.status} 
                        color={getStatusColor(email.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {email.status === 'Pendente' && (
                        <IconButton 
                          size="small" 
                          color="success"
                          onClick={() => handleProcessarEmail(email.id)}
                        >
                          <MarkEmailReadIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton 
                        size="small" 
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEmails.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Item>
    </Box>
  );
};

export default EmailsIbagy;
