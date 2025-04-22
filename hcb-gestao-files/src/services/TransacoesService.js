import GoogleSheetsService from './GoogleSheetsService';

class TransacoesService {
  constructor() {
    this.sheetsService = new GoogleSheetsService();
    this.sheetName = 'Transacoes';
  }

  /**
   * Obtém todas as transações
   * @returns {Promise} - Promise com a lista de transações
   */
  async getTransacoes() {
    try {
      const response = await this.sheetsService.getSheetData(this.sheetName);
      
      if (!response.values || response.values.length <= 1) {
        return [];
      }
      
      const headers = response.values[0];
      const rows = response.values.slice(1);
      
      return rows.map(row => {
        const transacao = {};
        headers.forEach((header, index) => {
          transacao[header] = row[index] || '';
        });
        return transacao;
      }).filter(transacao => transacao.ID !== 'DELETED');
    } catch (error) {
      console.error('Erro ao obter transações:', error);
      throw error;
    }
  }

  /**
   * Obtém uma transação pelo ID
   * @param {string} id - ID da transação
   * @returns {Promise} - Promise com os dados da transação
   */
  async getTransacaoById(id) {
    try {
      const transacoes = await this.getTransacoes();
      return transacoes.find(transacao => transacao.ID === id);
    } catch (error) {
      console.error(`Erro ao obter transação com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtém transações por ID do imóvel
   * @param {string} imovelId - ID do imóvel
   * @returns {Promise} - Promise com a lista de transações do imóvel
   */
  async getTransacoesByImovelId(imovelId) {
    try {
      const transacoes = await this.getTransacoes();
      return transacoes.filter(transacao => transacao['ID do Imóvel'] === imovelId);
    } catch (error) {
      console.error(`Erro ao obter transações do imóvel com ID ${imovelId}:`, error);
      throw error;
    }
  }

  /**
   * Obtém transações por período
   * @param {string} dataInicio - Data de início (formato DD/MM/AAAA)
   * @param {string} dataFim - Data de fim (formato DD/MM/AAAA)
   * @returns {Promise} - Promise com a lista de transações do período
   */
  async getTransacoesByPeriodo(dataInicio, dataFim) {
    try {
      const transacoes = await this.getTransacoes();
      
      // Converter strings de data para objetos Date
      const parseData = (dataStr) => {
        const [dia, mes, ano] = dataStr.split('/').map(Number);
        return new Date(ano, mes - 1, dia);
      };
      
      const inicio = parseData(dataInicio);
      const fim = parseData(dataFim);
      
      return transacoes.filter(transacao => {
        if (!transacao.Data) return false;
        const dataTransacao = parseData(transacao.Data);
        return dataTransacao >= inicio && dataTransacao <= fim;
      });
    } catch (error) {
      console.error(`Erro ao obter transações do período ${dataInicio} a ${dataFim}:`, error);
      throw error;
    }
  }

  /**
   * Adiciona uma nova transação
   * @param {Object} transacao - Dados da transação a ser adicionada
   * @returns {Promise} - Promise com o resultado da adição
   */
  async addTransacao(transacao) {
    try {
      // Obter todas as transações para determinar o próximo ID
      const transacoes = await this.getTransacoes();
      const nextId = transacoes.length > 0 
        ? Math.max(...transacoes.map(t => parseInt(t.ID))) + 1 
        : 1;
      
      // Obter os cabeçalhos para garantir a ordem correta dos dados
      const response = await this.sheetsService.getSheetData(`${this.sheetName}!A1:Z1`);
      const headers = response.values[0];
      
      // Preparar os dados na ordem correta dos cabeçalhos
      const rowData = headers.map(header => {
        if (header === 'ID') {
          return nextId.toString();
        }
        return transacao[header] || '';
      });
      
      // Adicionar a nova linha
      return await this.sheetsService.appendRow(this.sheetName, rowData);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma transação existente
   * @param {string} id - ID da transação a ser atualizada
   * @param {Object} transacao - Novos dados da transação
   * @returns {Promise} - Promise com o resultado da atualização
   */
  async updateTransacao(id, transacao) {
    try {
      // Obter todas as transações para encontrar o índice da linha
      const response = await this.sheetsService.getSheetData(this.sheetName);
      
      if (!response.values || response.values.length <= 1) {
        throw new Error('Nenhum dado encontrado');
      }
      
      const headers = response.values[0];
      const rows = response.values.slice(1);
      
      // Encontrar o índice da linha com o ID correspondente
      const rowIndex = rows.findIndex(row => row[0] === id);
      
      if (rowIndex === -1) {
        throw new Error(`Transação com ID ${id} não encontrada`);
      }
      
      // Preparar os dados na ordem correta dos cabeçalhos
      const rowData = headers.map(header => {
        if (header === 'ID') {
          return id;
        }
        return transacao[header] !== undefined ? transacao[header] : rows[rowIndex][headers.indexOf(header)] || '';
      });
      
      // Atualizar a linha
      const actualRowIndex = rowIndex + 2; // +1 para o cabeçalho, +1 porque as linhas começam em 1
      return await this.sheetsService.updateSheetData(
        this.sheetName, 
        `A${actualRowIndex}:${String.fromCharCode(65 + headers.length - 1)}${actualRowIndex}`,
        [rowData]
      );
    } catch (error) {
      console.error(`Erro ao atualizar transação com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Exclui uma transação
   * @param {string} id - ID da transação a ser excluída
   * @returns {Promise} - Promise com o resultado da exclusão
   */
  async deleteTransacao(id) {
    try {
      // Obter todas as transações para encontrar o índice da linha
      const response = await this.sheetsService.getSheetData(this.sheetName);
      
      if (!response.values || response.values.length <= 1) {
        throw new Error('Nenhum dado encontrado');
      }
      
      const rows = response.values.slice(1);
      
      // Encontrar o índice da linha com o ID correspondente
      const rowIndex = rows.findIndex(row => row[0] === id);
      
      if (rowIndex === -1) {
        throw new Error(`Transação com ID ${id} não encontrada`);
      }
      
      // Marcar a linha como excluída
      const actualRowIndex = rowIndex + 2; // +1 para o cabeçalho, +1 porque as linhas começam em 1
      return await this.sheetsService.deleteRow(this.sheetName, actualRowIndex);
    } catch (error) {
      console.error(`Erro ao excluir transação com ID ${id}:`, error);
      throw error;
    }
  }
}

export default TransacoesService;
