import GoogleSheetsService from './GoogleSheetsService';

class ContratosService {
  constructor() {
    this.sheetsService = new GoogleSheetsService();
    this.sheetName = 'Contratos';
  }

  /**
   * Obtém todos os contratos
   * @returns {Promise} - Promise com a lista de contratos
   */
  async getContratos() {
    try {
      const response = await this.sheetsService.getSheetData(this.sheetName);
      
      if (!response.values || response.values.length <= 1) {
        return [];
      }
      
      const headers = response.values[0];
      const rows = response.values.slice(1);
      
      return rows.map(row => {
        const contrato = {};
        headers.forEach((header, index) => {
          contrato[header] = row[index] || '';
        });
        return contrato;
      }).filter(contrato => contrato.ID !== 'DELETED');
    } catch (error) {
      console.error('Erro ao obter contratos:', error);
      throw error;
    }
  }

  /**
   * Obtém um contrato pelo ID
   * @param {string} id - ID do contrato
   * @returns {Promise} - Promise com os dados do contrato
   */
  async getContratoById(id) {
    try {
      const contratos = await this.getContratos();
      return contratos.find(contrato => contrato.ID === id);
    } catch (error) {
      console.error(`Erro ao obter contrato com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtém contratos por ID do imóvel
   * @param {string} imovelId - ID do imóvel
   * @returns {Promise} - Promise com a lista de contratos do imóvel
   */
  async getContratosByImovelId(imovelId) {
    try {
      const contratos = await this.getContratos();
      return contratos.filter(contrato => contrato['ID do Imóvel'] === imovelId);
    } catch (error) {
      console.error(`Erro ao obter contratos do imóvel com ID ${imovelId}:`, error);
      throw error;
    }
  }

  /**
   * Adiciona um novo contrato
   * @param {Object} contrato - Dados do contrato a ser adicionado
   * @returns {Promise} - Promise com o resultado da adição
   */
  async addContrato(contrato) {
    try {
      // Obter todos os contratos para determinar o próximo ID
      const contratos = await this.getContratos();
      const nextId = contratos.length > 0 
        ? Math.max(...contratos.map(c => parseInt(c.ID))) + 1 
        : 1;
      
      // Obter os cabeçalhos para garantir a ordem correta dos dados
      const response = await this.sheetsService.getSheetData(`${this.sheetName}!A1:Z1`);
      const headers = response.values[0];
      
      // Preparar os dados na ordem correta dos cabeçalhos
      const rowData = headers.map(header => {
        if (header === 'ID') {
          return nextId.toString();
        }
        return contrato[header] || '';
      });
      
      // Adicionar a nova linha
      return await this.sheetsService.appendRow(this.sheetName, rowData);
    } catch (error) {
      console.error('Erro ao adicionar contrato:', error);
      throw error;
    }
  }

  /**
   * Atualiza um contrato existente
   * @param {string} id - ID do contrato a ser atualizado
   * @param {Object} contrato - Novos dados do contrato
   * @returns {Promise} - Promise com o resultado da atualização
   */
  async updateContrato(id, contrato) {
    try {
      // Obter todos os contratos para encontrar o índice da linha
      const response = await this.sheetsService.getSheetData(this.sheetName);
      
      if (!response.values || response.values.length <= 1) {
        throw new Error('Nenhum dado encontrado');
      }
      
      const headers = response.values[0];
      const rows = response.values.slice(1);
      
      // Encontrar o índice da linha com o ID correspondente
      const rowIndex = rows.findIndex(row => row[0] === id);
      
      if (rowIndex === -1) {
        throw new Error(`Contrato com ID ${id} não encontrado`);
      }
      
      // Preparar os dados na ordem correta dos cabeçalhos
      const rowData = headers.map(header => {
        if (header === 'ID') {
          return id;
        }
        return contrato[header] !== undefined ? contrato[header] : rows[rowIndex][headers.indexOf(header)] || '';
      });
      
      // Atualizar a linha
      const actualRowIndex = rowIndex + 2; // +1 para o cabeçalho, +1 porque as linhas começam em 1
      return await this.sheetsService.updateSheetData(
        this.sheetName, 
        `A${actualRowIndex}:${String.fromCharCode(65 + headers.length - 1)}${actualRowIndex}`,
        [rowData]
      );
    } catch (error) {
      console.error(`Erro ao atualizar contrato com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Exclui um contrato
   * @param {string} id - ID do contrato a ser excluído
   * @returns {Promise} - Promise com o resultado da exclusão
   */
  async deleteContrato(id) {
    try {
      // Obter todos os contratos para encontrar o índice da linha
      const response = await this.sheetsService.getSheetData(this.sheetName);
      
      if (!response.values || response.values.length <= 1) {
        throw new Error('Nenhum dado encontrado');
      }
      
      const rows = response.values.slice(1);
      
      // Encontrar o índice da linha com o ID correspondente
      const rowIndex = rows.findIndex(row => row[0] === id);
      
      if (rowIndex === -1) {
        throw new Error(`Contrato com ID ${id} não encontrado`);
      }
      
      // Marcar a linha como excluída
      const actualRowIndex = rowIndex + 2; // +1 para o cabeçalho, +1 porque as linhas começam em 1
      return await this.sheetsService.deleteRow(this.sheetName, actualRowIndex);
    } catch (error) {
      console.error(`Erro ao excluir contrato com ID ${id}:`, error);
      throw error;
    }
  }
}

export default ContratosService;
