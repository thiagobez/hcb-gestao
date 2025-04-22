import ImoveisService from './ImoveisService';
import ContratosService from './ContratosService';
import ProprietariosService from './ProprietariosService';
import TransacoesService from './TransacoesService';
import EmailsService from './EmailsService';

// Exporta todos os serviços em um único objeto
const services = {
  imoveis: new ImoveisService(),
  contratos: new ContratosService(),
  proprietarios: new ProprietariosService(),
  transacoes: new TransacoesService(),
  emails: new EmailsService()
};

export default services;
