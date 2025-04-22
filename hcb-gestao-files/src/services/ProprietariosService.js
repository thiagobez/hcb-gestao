import GoogleSheetsService from './GoogleSheetsService';

class ProprietariosService {
  constructor() {
    this.sheetsService = new GoogleSheetsService();
    this.sheetName = 'Proprietarios';
  }

  /**
   * Obtém todos os proprietários
   * @returns {Promise} - Promise com a lista de proprietários
   */
  async getProprietarios() {
    try {
      const response = await this.sheetsService.getSheetData(this.sheetName);
      
      if (!response.values || response.values.length <= 1) {
        return [];
      }
      
      const headers = response.values[0];
      const rows = response.values.slice(1);
      
      return rows.map(row => {
        const proprietario = {};
        headers.forEach((header, index) => {
          proprietario[header] = row[index] || '';
        });
        return proprietario;
      }).filter(proprietario => proprietario.ID !== 'DELETED');
    } catch (error) {
      console.error('Erro ao obter proprietários:', error);
      throw error;
    }
  }

  /**
   * Obtém um proprietário pelo ID
   * @param {string} id - ID do proprietário
   * @returns {Promise} - Promise com os dados do proprietário
   */
  async getProprietarioById(id) {
    try {
      const proprietarios = await this.getProprietarios();
      return proprietarios.find(proprietario => proprietario.ID === id);
    } catch (error) {
      console.error(`Erro ao obter proprietário com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtém proprietários por ID do imóvel
   * @param {string} imovelId - ID do imóvel
   * @returns {Promise} - Promise com a lista de proprietários do imóvel
   */
  async getProprietariosByImovelId(imovelId) {
    try {
      const proprietarios = await this.getProprietarios();
      return proprietarios.filter(proprietario => proprietario['ID do Imóvel'] === imovelId);
    } catch (error) {
      console.error(`Erro ao obter proprietários do imóvel com ID ${imovelId}:`, error);
      throw error;
    }
  }

  /**
   * Adiciona um novo proprietário
   * @param {Object} proprietario - Dados do proprietário a ser adicionado
   * @returns {Promise} - Promise com o resultado da adição
   */
  async addProprietario(proprietario) {
    try {
      // Obter todos os proprietários para determinar o próximo ID
      const proprietarios = await this.getProprietarios();
      const nextId = proprietarios.length > 0 
        ? Math.max(...proprietarios.map(p => parseInt(p.ID))) + 1 
        : 1;
      
      // Obter os cabeçalhos para garantir a ordem correta dos dados
      const response = await this.sheetsService.getSheetData(`${this.sheetName}!A1:Z1`);
      const headers = response.values[0];
      
      // Preparar os dados na ordem correta dos cabeçalhos
      const rowData = headers.map(header => {
        if (header === 'ID') {
          return nextId.toString();
        }
        return proprietario[header] || '';
      });
      
      // Adicionar a nova linha
      return await this.sheetsService.appendRow(this.sheetName, rowData);
    } catch (error) {
      console.error('Erro ao adicionar proprietário:', error);
      throw error;
    }
  }

  /**
   * Atualiza um proprietário existente
   * @param {string} id - ID do proprietário a ser atualizado
   * @param {Object} proprietario - Novos dados do proprietário
   * @returns {Promise} - Promise com o resultado da atualização
   */
  async updateProprietario(id, proprietario) {
    try {
      // Obter todos os proprietários para encontrar o índice da linha
      const response = await this.sheetsService.getSheetData(this.sheetName);
      
      if (!response.values || response.values.length <= 1) {
        throw new Error('Nenhum dado encontrado');
      }
      
      const headers = response.values[0];
      const rows = response.values.slice(1);
      
      // Encontrar o índice da linha com o ID correspondente
      const rowIndex = rows.findIndex(row => row[0] === id);
      
      if (rowIndex === -1) {
        throw new Error(`Proprietário com ID ${id} não encontrado`);
      }
      
      // Preparar os dados na ordem correta dos cabeçalhos
      const rowData = headers.map(header => {
        if (header === 'ID') {
          return id;
        }
        return proprietario[header] !== undefined ? proprietario[header] : rows[rowIndex][headers.indexOf(header)] || '';
      });
      
      // Atualizar a linha
      const actualRowIndex = rowIndex + 2; // +1 para o cabeçalho, +1 porque as linhas começam em 1
      return await this.sheetsService.updateSheetData(
        this.sheetName, 
        `A${actualRowIndex}:${String.fromCharCode(65 + headers.length - 1)}${actualRowIndex}`,
        [rowData]
      );
    } catch (error) {
      console.error(`Erro ao atualizar proprietário com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Exclui um proprietário
   * @param {string} id - ID do proprietário a ser excluído
   * @returns {Promise} - Promise com o resultado da exclusão
   */
  async deleteProprietario(id) {
    try {
      // Obter todos os proprietários para encontrar o índice da linha
      const response = await this.sheetsService.getSheetData(this.sheetName);
      
      if (!response.values || response.values.length <= 1) {
        throw new Error('Nenhum dado encontrado');
      }
      
      const rows = response.values.slice(1);
      
      // Encontrar o índice da linha com o ID correspondente
      const rowIndex = rows.findIndex(row => row[0] === id);
      
      if (rowIndex === -1) {
        throw new Error(`Proprietário com ID ${id} não encontrado`);
      }
      
      // Marcar a linha como excluída
      const actualRowIndex = rowIndex + 2; // +1 para o cabeçalho, +1 porque as linhas começam em 1
      return await this.sheetsService.deleteRow(this.sheetName, actualRowIndex);
    } catch (error) {
      console.error(`Erro ao excluir proprietário com ID ${id}:`, error);
      throw error;
    }
  }
}

export default ProprietariosService;
