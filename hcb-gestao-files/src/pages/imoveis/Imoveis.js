import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Button, TextField, MenuItem, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
}));

// Dados simulados para imóveis
const imoveisData = [
  { id: 1, codigo: 'IM001', endereco: 'Rua das Flores, 123', area: 120, percentual: 100, situacao: 'Locado', iptu: 1200, tcrs: 300, condominio: 500 },
  { id: 2, codigo: 'IM002', endereco: 'Av. Principal, 456', area: 85, percentual: 100, situacao: 'Desocupado', iptu: 950, tcrs: 250, condominio: 0 },
  { id: 3, codigo: 'IM003', endereco: 'Rua dos Lírios, 789', area: 150, percentual: 75, situacao: 'Locado', iptu: 1500, tcrs: 350, condominio: 700 },
  { id: 4, codigo: 'IM004', endereco: 'Av. Beira Mar, 1010', area: 200, percentual: 50, situacao: 'Em Obra', iptu: 2000, tcrs: 400, condominio: 1200 },
  { id: 5, codigo: 'IM005', endereco: 'Rua das Palmeiras, 234', area: 95, percentual: 100, situacao: 'Em Divulgação', iptu: 1000, tcrs: 280, condominio: 0 },
  { id: 6, codigo: 'IM006', endereco: 'Av. Central, 567', area: 110, percentual: 100, situacao: 'Locado', iptu: 1100, tcrs: 290, condominio: 450 },
  { id: 7, codigo: 'IM007', endereco: 'Rua das Acácias, 890', area: 130, percentual: 60, situacao: 'Locado', iptu: 1300, tcrs: 320, condominio: 600 },
  { id: 8, codigo: 'IM008', endereco: 'Av. das Rosas, 1234', area: 75, percentual: 100, situacao: 'Desocupado', iptu: 800, tcrs: 220, condominio: 380 },
  { id: 9, codigo: 'IM009', endereco: 'Rua dos Ipês, 5678', area: 140, percentual: 80, situacao: 'Locado', iptu: 1400, tcrs: 330, condominio: 650 },
  { id: 10, codigo: 'IM010', endereco: 'Av. dos Girassóis, 9012', area: 160, percentual: 100, situacao: 'Em Obra', iptu: 1600, tcrs: 360, condominio: 800 },
];

const situacaoOptions = [
  { value: 'Locado', label: 'Locado' },
  { value: 'Desocupado', label: 'Desocupado' },
  { value: 'Em Obra', label: 'Em Obra' },
  { value: 'Em Divulgação', label: 'Em Divulgação' },
];

const getSituacaoColor = (situacao) => {
  switch (situacao) {
    case 'Locado':
      return 'success';
    case 'Desocupado':
      return 'error';
    case 'Em Obra':
      return 'warning';
    case 'Em Divulgação':
      return 'info';
    default:
      return 'default';
  }
};

const Imoveis = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredImoveis, setFilteredImoveis] = useState(imoveisData);
  const [situacaoFilter, setSituacaoFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentImovel, setCurrentImovel] = useState({
    codigo: '',
    endereco: '',
    area: '',
    percentual: '',
    situacao: '',
    iptu: '',
    tcrs: '',
    condominio: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const filtered = imoveisData.filter((imovel) => {
      const matchesSearch = imovel.codigo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           imovel.endereco.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSituacao = situacaoFilter === '' || imovel.situacao === situacaoFilter;
      return matchesSearch && matchesSituacao;
    });
    setFilteredImoveis(filtered);
    setPage(0);
  }, [searchTerm, situacaoFilter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (imovel = null) => {
    if (imovel) {
      setCurrentImovel(imovel);
      setIsEditing(true);
    } else {
      setCurrentImovel({
        codigo: '',
        endereco: '',
        area: '',
        percentual: '',
        situacao: '',
        iptu: '',
        tcrs: '',
        condominio: '',
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
    setCurrentImovel({
      ...currentImovel,
      [name]: value,
    });
  };

  const handleSaveImovel = () => {
    // Aqui seria a lógica para salvar no Google Sheets
    console.log('Salvando imóvel:', currentImovel);
    handleCloseDialog();
    // Na implementação real, atualizaríamos os dados após salvar
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Gestão de Imóveis
      </Typography>
      
      {/* Filtros e Botão Adicionar */}
      <Grid container spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar por código ou endereço"
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
            label="Situação"
            value={situacaoFilter}
            onChange={(e) => setSituacaoFilter(e.target.value)}
            size="small"
          >
            <MenuItem value="">Todos</MenuItem>
            {situacaoOptions.map((option) => (
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
            Adicionar Imóvel
          </Button>
        </Grid>
      </Grid>
      
      {/* Tabela de Imóveis */}
      <Item>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de imóveis">
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Endereço</TableCell>
                <TableCell align="right">Área (m²)</TableCell>
                <TableCell align="right">% Propriedade</TableCell>
                <TableCell>Situação</TableCell>
                <TableCell align="right">IPTU (R$)</TableCell>
                <TableCell align="right">TCRS (R$)</TableCell>
                <TableCell align="right">Condomínio (R$)</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredImoveis
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((imovel) => (
                  <TableRow key={imovel.id}>
                    <TableCell>{imovel.codigo}</TableCell>
                    <TableCell>{imovel.endereco}</TableCell>
                    <TableCell align="right">{imovel.area}</TableCell>
                    <TableCell align="right">{imovel.percentual}%</TableCell>
                    <TableCell>
                      <Chip 
                        label={imovel.situacao} 
                        color={getSituacaoColor(imovel.situacao)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">R$ {imovel.iptu.toFixed(2)}</TableCell>
                    <TableCell align="right">R$ {imovel.tcrs.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      {imovel.condominio > 0 ? `R$ ${imovel.condominio.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleOpenDialog(imovel)}
                      >
                        <EditIcon fontSize="small" />
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
          count={filteredImoveis.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Item>
      
      {/* Dialog para Adicionar/Editar Imóvel */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Editar Imóvel' : 'Adicionar Novo Imóvel'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Código"
                name="codigo"
                value={currentImovel.codigo}
                onChange={handleInputChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Endereço"
                name="endereco"
                value={currentImovel.endereco}
                onChange={handleInputChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Área (m²)"
                name="area"
                type="number"
                value={currentImovel.area}
                onChange={handleInputChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="% de Propriedade"
                name="percentual"
                type="number"
                value={currentImovel.percentual}
                onChange={handleInputChange}
                variant="outlined"
                required
                InputProps={{
                  endAdornment: '%',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Situação"
                name="situacao"
                value={currentImovel.situacao}
                onChange={handleInputChange}
                variant="outlined"
                required
              >
                {situacaoOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="IPTU (R$)"
                name="iptu"
                type="number"
                value={currentImovel.iptu}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="TCRS (R$)"
                name="tcrs"
                type="number"
                value={currentImovel.tcrs}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Condomínio (R$)"
                name="condominio"
                type="number"
                value={currentImovel.condominio}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveImovel} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Imoveis;
