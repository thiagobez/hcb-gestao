import React from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
}));

const Dashboard = () => {
  // Dados simulados para os gráficos
  const pieData = {
    labels: ['Locados', 'Desocupados', 'Em Obra', 'Em Divulgação'],
    datasets: [
      {
        data: [65, 15, 10, 10],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

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

  // Dados simulados para alertas e pendências
  const alertas = [
    { id: 1, tipo: 'Contrato', descricao: 'Contrato #1234 vence em 30 dias' },
    { id: 2, tipo: 'Contrato', descricao: 'Contrato #5678 vence em 45 dias' },
    { id: 3, tipo: 'Reajuste', descricao: 'Reajuste do contrato #9012 em 15 dias' },
  ];

  const pendencias = [
    { id: 1, tipo: 'Email', descricao: '5 emails da Ibagy pendentes de processamento' },
    { id: 2, tipo: 'Financeiro', descricao: '12 transações pendentes de conciliação' },
  ];

  // Dados simulados para transações recentes
  const transacoes = [
    { id: 1, data: '22/04/2025', descricao: 'Aluguel - Imóvel #123', valor: 'R$ 2.500,00', tipo: 'receita' },
    { id: 2, data: '20/04/2025', descricao: 'IPTU - Imóvel #456', valor: 'R$ 850,00', tipo: 'despesa' },
    { id: 3, data: '18/04/2025', descricao: 'Condomínio - Imóvel #789', valor: 'R$ 650,00', tipo: 'despesa' },
    { id: 4, data: '15/04/2025', descricao: 'Aluguel - Imóvel #234', valor: 'R$ 3.200,00', tipo: 'receita' },
    { id: 5, data: '10/04/2025', descricao: 'Manutenção - Imóvel #567', valor: 'R$ 1.200,00', tipo: 'despesa' },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Resumo Financeiro */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6" gutterBottom>Receitas do Mês</Typography>
            <Typography variant="h4" color="primary">R$ 135.000,00</Typography>
            <Typography variant="body2" color="text.secondary">+5,4% em relação ao mês anterior</Typography>
          </Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6" gutterBottom>Despesas do Mês</Typography>
            <Typography variant="h4" color="error">R$ 78.000,00</Typography>
            <Typography variant="body2" color="text.secondary">+6,8% em relação ao mês anterior</Typography>
          </Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6" gutterBottom>Saldo do Mês</Typography>
            <Typography variant="h4" color="success.main">R$ 57.000,00</Typography>
            <Typography variant="body2" color="text.secondary">+3,6% em relação ao mês anterior</Typography>
          </Item>
        </Grid>
      </Grid>
      
      {/* Alertas e Pendências */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Item>
            <Typography variant="h6" gutterBottom>Alertas</Typography>
            <Divider sx={{ mb: 2 }} />
            {alertas.map((alerta) => (
              <Box key={alerta.id} sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="primary">{alerta.tipo}</Typography>
                <Typography variant="body2">{alerta.descricao}</Typography>
                <Divider sx={{ mt: 1 }} />
              </Box>
            ))}
          </Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Item>
            <Typography variant="h6" gutterBottom>Pendências</Typography>
            <Divider sx={{ mb: 2 }} />
            {pendencias.map((pendencia) => (
              <Box key={pendencia.id} sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="secondary">{pendencia.tipo}</Typography>
                <Typography variant="body2">{pendencia.descricao}</Typography>
                <Divider sx={{ mt: 1 }} />
              </Box>
            ))}
          </Item>
        </Grid>
      </Grid>
      
      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Item>
            <Typography variant="h6" gutterBottom>Situação dos Imóveis</Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Item>
        </Grid>
        <Grid item xs={12} md={6}>
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
      
      {/* Transações Recentes */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Item>
            <Typography variant="h6" gutterBottom>Transações Recentes</Typography>
            <Divider sx={{ mb: 2 }} />
            {transacoes.map((transacao) => (
              <Box key={transacao.id} sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2">{transacao.data}</Typography>
                  <Typography variant="body2">{transacao.descricao}</Typography>
                </Box>
                <Typography 
                  variant="subtitle1" 
                  color={transacao.tipo === 'receita' ? 'success.main' : 'error'}
                >
                  {transacao.tipo === 'receita' ? '+' : '-'} {transacao.valor}
                </Typography>
                <Divider sx={{ mt: 1 }} />
              </Box>
            ))}
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
