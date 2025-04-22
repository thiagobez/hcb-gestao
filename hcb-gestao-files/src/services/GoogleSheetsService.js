import axios from 'axios';

// Configuração da API do Google Sheets
const API_KEY = 'YOUR_API_KEY'; // Será substituído pelo usuário
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Será substituído pelo usuário

// URLs base para a API do Google Sheets
const SHEETS_API_BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

/**
 * Classe para gerenciar a comunicação com o Google Sheets
 */
class GoogleSheetsService {
  constructor(spreadsheetId = SPREADSHEET_ID, apiKey = API_KEY) {
    this.spreadsheetId = spreadsheetId;
    this.apiKey = apiKey;
  }

  /**
   * Obtém os dados de uma planilha específica
   * @param {string} sheetName - Nome da planilha (ex: 'Imoveis')
   * @param {string} range - Range de células (ex: 'A2:Z100')
   * @returns {Promise} - Promise com os dados da planilha
   */
  async getSheetData(sheetName, range = '') {
    try {
      const fullRange = range ? `${sheetName}!${range}` : sheetName;
      const url = `${SHEETS_API_BASE_URL}/${this.spreadsheetId}/values/${fullRange}?key=${this.apiKey}`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter dados da planilha:', error);
      throw error;
    }
  }

  /**
   * Atualiza os dados de uma planilha específica
   * @param {string} sheetName - Nome da planilha (ex: 'Imoveis')
   * @param {string} range - Range de células (ex: 'A2:Z2')
   * @param {Array} values - Valores a serem atualizados
   * @returns {Promise} - Promise com o resultado da atualização
   */
  async updateSheetData(sheetName, range, values) {
    try {
      const fullRange = `${sheetName}!${range}`;
      const url = `${SHEETS_API_BASE_URL}/${this.spreadsheetId}/values/${fullRange}?valueInputOption=USER_ENTERED&key=${this.apiKey}`;
      
      const response = await axios.put(url, {
        range: fullRange,
        majorDimension: 'ROWS',
        values: values
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar dados da planilha:', error);
      throw error;
    }
  }

  /**
   * Adiciona uma nova linha a uma planilha específica
   * @param {string} sheetName - Nome da planilha (ex: 'Imoveis')
   * @param {Array} rowData - Dados da linha a ser adicionada
   * @returns {Promise} - Promise com o resultado da adição
   */
  async appendRow(sheetName, rowData) {
    try {
      const url = `${SHEETS_API_BASE_URL}/${this.spreadsheetId}/values/${sheetName}!A:Z:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&key=${this.apiKey}`;
      
      const response = await axios.post(url, {
        range: `${sheetName}!A:Z`,
        majorDimension: 'ROWS',
        values: [rowData]
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar linha na planilha:', error);
      throw error;
    }
  }

  /**
   * Exclui uma linha de uma planilha específica (marca como excluída)
   * @param {string} sheetName - Nome da planilha (ex: 'Imoveis')
   * @param {number} rowIndex - Índice da linha a ser excluída
   * @returns {Promise} - Promise com o resultado da exclusão
   */
  async deleteRow(sheetName, rowIndex) {
    // Na verdade, não podemos excluir linhas diretamente via API,
    // então marcamos a linha como excluída atualizando uma coluna específica
    try {
      const range = `${sheetName}!A${rowIndex}:A${rowIndex}`;
      const url = `${SHEETS_API_BASE_URL}/${this.spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED&key=${this.apiKey}`;
      
      const response = await axios.put(url, {
        range: range,
        majorDimension: 'ROWS',
        values: [['DELETED']] // Marca a primeira coluna como DELETED
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao marcar linha como excluída:', error);
      throw error;
    }
  }
}

export default GoogleSheetsService;
