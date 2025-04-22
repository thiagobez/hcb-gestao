import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Button, TextField, MenuItem, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
}));

// Dados simulados para contratos
const contratosData = [
  { id: 1, codigo: 'CT001', imovelCodigo: 'IM001', inquilino: 'João Silva', valor: 2500, dataInicio: '01/01/2024', dataTermino: '31/12/2025', indiceReajuste: 'IGPM', dataReajuste: '01/01/2025', status: 'Ativo' },
  { id: 2, codigo: 'CT002', imovelCodigo: 'IM003', inquilino: 'Maria Oliveira', valor: 3200, dataInicio: '15/03/2023', dataTermino: '14/03/2026', indiceReajuste: 'IPCA', dataReajuste: '15/03/2025', status: 'Ativo' },
  { id: 3, codigo: 'CT003', imovelCodigo: 'IM006', inquilino: 'Carlos Santos', valor: 1800, dataInicio: '10/05/2024', dataTermino: '09/05/2025', indiceReajuste: 'IGPM', dataReajuste: '10/05/2025', status: 'Ativo' },
  { id: 4, codigo: 'CT004', imovelCodigo: 'IM007', inquilino: 'Ana Pereira', valor: 2200, dataInicio: '01/02/2023', dataTermino: '31/01/2025', indiceReajuste: 'IPCA', dataReajuste: '01/02/2025', status: 'Em Renovação' },
  { id: 5, codigo: 'CT005', imovelCodigo: 'IM009', inquilino: 'Roberto Almeida', valor: 2800, dataInicio: '15/07/2022', dataTermino: '14/07/2024', indiceReajuste: 'IGPM', dataReajuste: '15/07/2024', status: 'A Vencer' },
];

const statusOptions = [
  { value: 'Ativo', label: 'Ativo' },
  { value: 'Em Renovação', label: 'Em Renovação' },
  { value: 'A Vencer', label: 'A Vencer' },
  { value: 'Encerrado', label: 'Encerrado' },
];

const indiceOptions = [
  { value: 'IGPM', label: 'IGP-M' },
  { value: 'IPCA', label: 'IPCA' },
  { value: 'INPC', label: 'INPC' },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Ativo':
      return 'success';
    case 'Em Renovação':
      return 'warning';
    case 'A Vencer':
      return 'info';
    case 'Encerrado':
      return 'error';
    default:
      return 'default';
  }
};

const Contratos = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContratos, setFilteredContratos] = useState(contratosData);
  const [statusFilter, setStatusFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentContrato, setCurrentContrato] = useState({
    codigo: '',
    imovelCodigo: '',
    inquilino: '',
    valor: '',
    dataInicio: '',
    dataTermino: '',
    indiceReajuste: '',
    dataReajuste: '',
    status: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const filtered = contratosData.filter((contrato) => {
      const matchesSearch = contrato.codigo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           contrato.inquilino.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contrato.imovelCodigo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === '' || contrato.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredContratos(filtered);
    setPage(0);
  }, [searchTerm, statusFilter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (contrato = null) => {
    if (contrato) {
      setCurrentContrato(contrato);
      setIsEditing(true);
    } else {
      setCurrentContrato({
        codigo: '',
        imovelCodigo: '',
        inquilino: '',
        valor: '',
        dataInicio: '',
        dataTermino: '',
        indiceReajuste: '',
        dataReajuste: '',
        status: '',
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentContrato({
      ...currentContrato,
      [name]: value,
    });
  };

  const handleSaveContrato = () => {
    // Aqui seria a lógica para salvar no Google Sheets
    console.log('Salvando contrato:', currentContrato);
    handleCloseDialog();
    // Na implementação real, atualizaríamos os dados após salvar
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Gestão de Contratos
      </Typography>
      
      {/* Filtros e Botão Adicionar */}
      <Grid container spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar por código, imóvel ou inquilino"
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
        <Grid item xs={12} sm={5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Adicionar Contrato
          </Button>
        </Grid>
      </Grid>
      
      {/* Tabela de Contratos */}
      <Item>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de contratos">
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Imóvel</TableCell>
                <TableCell>Inquilino</TableCell>
                <TableCell align="right">Valor (R$)</TableCell>
                <TableCell>Início</TableCell>
                <TableCell>Término</TableCell>
                <TableCell>Índice</TableCell>
                <TableCell>Próx. Reajuste</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContratos
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((contrato) => (
                  <TableRow key={contrato.id}>
                    <TableCell>{contrato.codigo}</TableCell>
                    <TableCell>{contrato.imovelCodigo}</TableCell>
                    <TableCell>{contrato.inquilino}</TableCell>
                    <TableCell align="right">R$ {contrato.valor.toFixed(2)}</TableCell>
                    <TableCell>{contrato.dataInicio}</TableCell>
                    <TableCell>{contrato.dataTermino}</TableCell>
                    <TableCell>{contrato.indiceReajuste}</TableCell>
                    <TableCell>{contrato.dataReajuste}</TableCell>
                    <TableCell>
                      <Chip 
                        label={contrato.status} 
                        color={getStatusColor(contrato.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleOpenDialog(contrato)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="info"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
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
          count={filteredContratos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Item>
      
      {/* Dialog para Adicionar/Editar Contrato */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Editar Contrato' : 'Adicionar Novo Contrato'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Código"
                name="codigo"
                value={currentContrato.codigo}
                onChange={handleInputChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Código do Imóvel"
                name="imovelCodigo"
                value={currentContrato.imovelCodigo}
                onChange={handleInputChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={currentContrato.status}
                onChange={handleInputChange}
                variant="outlined"
                required
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Inquilino"
                name="inquilino"
                value={currentContrato.inquilino}
                onChange={handleInputChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Valor do Aluguel (R$)"
                name="valor"
                type="number"
                value={currentContrato.valor}
                onChange={handleInputChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Data de Início"
                name="dataInicio"
                value={currentContrato.dataInicio}
                onChange={handleInputChange}
                variant="outlined"
                required
                placeholder="DD/MM/AAAA"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Data de Término"
                name="dataTermino"
                value={currentContrato.dataTermino}
                onChange={handleInputChange}
                variant="outlined"
                required
                placeholder="DD/MM/AAAA"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Índice de Reajuste"
                name="indiceReajuste"
                value={currentContrato.indiceReajuste}
                onChange={handleInputChange}
                variant="outlined"
                required
              >
                {indiceOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Data do Próximo Reajuste"
                name="dataReajuste"
                value={currentContrato.dataReajuste}
                onChange={handleInputChange}
                variant="outlined"
                required
                placeholder="DD/MM/AAAA"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveContrato} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Contratos;
