import GoogleSheetsService from './GoogleSheetsService';

class EmailsService {
  constructor() {
    this.sheetsService = new GoogleSheetsService();
    this.sheetName = 'EmailsProcessados';
  }

  /**
   * Obtém todos os emails processados
   * @returns {Promise} - Promise com a lista de emails
   */
  async getEmails() {
    try {
      const response = await this.sheetsService.getSheetData(this.sheetName);
      
      if (!response.values || response.values.length <= 1) {
        return [];
      }
      
      const headers = response.values[0];
      const rows = response.values.slice(1);
      
      return rows.map(row => {
        const email = {};
        headers.forEach((header, index) => {
          email[header] = row[index] || '';
        });
        return email;
      }).filter(email => email.ID !== 'DELETED');
    } catch (error) {
      console.error('Erro ao obter emails:', error);
      throw error;
    }
  }

  /**
   * Obtém um email pelo ID
   * @param {string} id - ID do email
   * @returns {Promise} - Promise com os dados do email
   */
  async getEmailById(id) {
    try {
      const emails = await this.getEmails();
      return emails.find(email => email.ID === id);
    } catch (error) {
      console.error(`Erro ao obter email com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtém emails por tipo
   * @param {string} tipo - Tipo do email (Extrato, Contrato, Reajuste, etc.)
   * @returns {Promise} - Promise com a lista de emails do tipo especificado
   */
  async getEmailsByTipo(tipo) {
    try {
      const emails = await this.getEmails();
      return emails.filter(email => email.Tipo === tipo);
    } catch (error) {
      console.error(`Erro ao obter emails do tipo ${tipo}:`, error);
      throw error;
    }
  }

  /**
   * Obtém emails por status
   * @param {string} status - Status do email (Processado, Pendente)
   * @returns {Promise} - Promise com a lista de emails com o status especificado
   */
  async getEmailsByStatus(status) {
    try {
      const emails = await this.getEmails();
      return emails.filter(email => email.Status === status);
    } catch (error) {
      console.error(`Erro ao obter emails com status ${status}:`, error);
      throw error;
    }
  }

  /**
   * Adiciona um novo email processado
   * @param {Object} email - Dados do email a ser adicionado
   * @returns {Promise} - Promise com o resultado da adição
   */
  async addEmail(email) {
    try {
      // Obter todos os emails para determinar o próximo ID
      const emails = await this.getEmails();
      const nextId = emails.length > 0 
        ? Math.max(...emails.map(e => parseInt(e.ID))) + 1 
        : 1;
      
      // Obter os cabeçalhos para garantir a ordem correta dos dados
      const response = await this.sheetsService.getSheetData(`${this.sheetName}!A1:Z1`);
      const headers = response.values[0];
      
      // Preparar os dados na ordem correta dos cabeçalhos
      const rowData = headers.map(header => {
        if (header === 'ID') {
          return nextId.toString();
        }
        return email[header] || '';
      });
      
      // Adicionar a nova linha
      return await this.sheetsService.appendRow(this.sheetName, rowData);
    } catch (error) {
      console.error('Erro ao adicionar email:', error);
      throw error;
    }
  }

  /**
   * Atualiza um email existente
   * @param {string} id - ID do email a ser atualizado
   * @param {Object} email - Novos dados do email
   * @returns {Promise} - Promise com o resultado da atualização
   */
  async updateEmail(id, email) {
    try {
      // Obter todos os emails para encontrar o índice da linha
      const response = await this.sheetsService.getSheetData(this.sheetName);
      
      if (!response.values || response.values.length <= 1) {
        throw new Error('Nenhum dado encontrado');
      }
      
      const headers = response.values[0];
      const rows = response.values.slice(1);
      
      // Encontrar o índice da linha com o ID correspondente
      const rowIndex = rows.findIndex(row => row[0] === id);
      
      if (rowIndex === -1) {
        throw new Error(`Email com ID ${id} não encontrado`);
      }
      
      // Preparar os dados na ordem correta dos cabeçalhos
      const rowData = headers.map(header => {
        if (header === 'ID') {
          return id;
        }
        return email[header] !== undefined ? email[header] : rows[rowIndex][headers.indexOf(header)] || '';
      });
      
      // Atualizar a linha
      const actualRowIndex = rowIndex + 2; // +1 para o cabeçalho, +1 porque as linhas começam em 1
      return await this.sheetsService.updateSheetData(
        this.sheetName, 
        `A${actualRowIndex}:${String.fromCharCode(65 + headers.length - 1)}${actualRowIndex}`,
        [rowData]
      );
    } catch (error) {
      console.error(`Erro ao atualizar email com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Exclui um email
   * @param {string} id - ID do email a ser excluído
   * @returns {Promise} - Promise com o resultado da exclusão
   */
  async deleteEmail(id) {
    try {
      // Obter todos os emails para encontrar o índice da linha
      const response = await this.sheetsService.getSheetData(this.sheetName);
      
      if (!response.values || response.values.length <= 1) {
        throw new Error('Nenhum dado encontrado');
      }
      
      const rows = response.values.slice(1);
      
      // Encontrar o índice da linha com o ID correspondente
      const rowIndex = rows.findIndex(row => row[0] === id);
      
      if (rowIndex === -1) {
        throw new Error(`Email com ID ${id} não encontrado`);
      }
      
      // Marcar a linha como excluída
      const actualRowIndex = rowIndex + 2; // +1 para o cabeçalho, +1 porque as linhas começam em 1
      return await this.sheetsService.deleteRow(this.sheetName, actualRowIndex);
    } catch (error) {
      console.error(`Erro ao excluir email com ID ${id}:`, error);
      throw error;
    }
  }
}

export default EmailsService;
