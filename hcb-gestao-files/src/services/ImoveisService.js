import GoogleSheetsService from './GoogleSheetsService';

class ImoveisService {
  constructor() {
    this.sheetsService = new GoogleSheetsService();
    this.sheetName = 'Imoveis';
  }

  /**
   * Obtém todos os imóveis
   * @returns {Promise} - Promise com a lista de imóveis
   */
  async getImoveis() {
    try {
      const response = await this.sheetsService.getSheetData(this.sheetName);
      
      if (!response.values || response.values.length <= 1) {
        return [];
      }
      
      const headers = response.values[0];
      const rows = response.values.slice(1);
      
      return rows.map(row => {
        const imovel = {};
        headers.forEach((header, index) => {
          imovel[header] = row[index] || '';
        });
        return imovel;
      }).filter(imovel => imovel.ID !== 'DELETED');
    } catch (error) {
      console.error('Erro ao obter imóveis:', error);
      throw error;
    }
  }

  /**
   * Obtém um imóvel pelo ID
   * @param {string} id - ID do imóvel
   * @returns {Promise} - Promise com os dados do imóvel
   */
  async getImovelById(id) {
    try {
      const imoveis = await this.getImoveis();
      return imoveis.find(imovel => imovel.ID === id);
    } catch (error) {
      console.error(`Erro ao obter imóvel com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Adiciona um novo imóvel
   * @param {Object} imovel - Dados do imóvel a ser adicionado
   * @returns {Promise} - Promise com o resultado da adição
   */
  async addImovel(imovel) {
    try {
      // Obter todos os imóveis para determinar o próximo ID
      const imoveis = await this.getImoveis();
      const nextId = imoveis.length > 0 
        ? Math.max(...imoveis.map(i => parseInt(i.ID))) + 1 
        : 1;
      
      // Obter os cabeçalhos para garantir a ordem correta dos dados
      const response = await this.sheetsService.getSheetData(`${this.sheetName}!A1:Z1`);
      const headers = response.values[0];
      
      // Preparar os dados na ordem correta dos cabeçalhos
      const rowData = headers.map(header => {
        if (header === 'ID') {
          return nextId.toString();
        }
        return imovel[header] || '';
      });
      
      // Adicionar a nova linha
      return await this.sheetsService.appendRow(this.sheetName, rowData);
    } catch (error) {
      console.error('Erro ao adicionar imóvel:', error);
      throw error;
    }
  }

  /**
   * Atualiza um imóvel existente
   * @param {string} id - ID do imóvel a ser atualizado
   * @param {Object} imovel - Novos dados do imóvel
   * @returns {Promise} - Promise com o resultado da atualização
   */
  async updateImovel(id, imovel) {
    try {
      // Obter todos os imóveis para encontrar o índice da linha
      const response = await this.sheetsService.getSheetData(this.sheetName);
      
      if (!response.values || response.values.length <= 1) {
        throw new Error('Nenhum dado encontrado');
      }
      
      const headers = response.values[0];
      const rows = response.values.slice(1);
      
      // Encontrar o índice da linha com o ID correspondente
      const rowIndex = rows.findIndex(row => row[0] === id);
      
      if (rowIndex === -1) {
        throw new Error(`Imóvel com ID ${id} não encontrado`);
      }
      
      // Preparar os dados na ordem correta dos cabeçalhos
      const rowData = headers.map(header => {
        if (header === 'ID') {
          return id;
        }
        return imovel[header] !== undefined ? imovel[header] : rows[rowIndex][headers.indexOf(header)] || '';
      });
      
      // Atualizar a linha
      const actualRowIndex = rowIndex + 2; // +1 para o cabeçalho, +1 porque as linhas começam em 1
      return await this.sheetsService.updateSheetData(
        this.sheetName, 
        `A${actualRowIndex}:${String.fromCharCode(65 + headers.length - 1)}${actualRowIndex}`,
        [rowData]
      );
    } catch (error) {
      console.error(`Erro ao atualizar imóvel com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Exclui um imóvel
   * @param {string} id - ID do imóvel a ser excluído
   * @returns {Promise} - Promise com o resultado da exclusão
   */
  async deleteImovel(id) {
    try {
      // Obter todos os imóveis para encontrar o índice da linha
      const response = await this.sheetsService.getSheetData(this.sheetName);
      
      if (!response.values || response.values.length <= 1) {
        throw new Error('Nenhum dado encontrado');
      }
      
      const rows = response.values.slice(1);
      
      // Encontrar o índice da linha com o ID correspondente
      const rowIndex = rows.findIndex(row => row[0] === id);
      
      if (rowIndex === -1) {
        throw new Error(`Imóvel com ID ${id} não encontrado`);
      }
      
      // Marcar a linha como excluída
      const actualRowIndex = rowIndex + 2; // +1 para o cabeçalho, +1 porque as linhas começam em 1
      return await this.sheetsService.deleteRow(this.sheetName, actualRowIndex);
    } catch (error) {
      console.error(`Erro ao excluir imóvel com ID ${id}:`, error);
      throw error;
    }
  }
}

export default ImoveisService;
